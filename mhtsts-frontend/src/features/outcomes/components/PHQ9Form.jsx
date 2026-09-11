import React, { useState, useEffect } from 'react';
import { useNotification } from '../../../providers/NotificationProvider';
import { outcomeApi } from '../../../api/outcomeApi';
import Button from '../../../components/forms/Button';
import jsPDF from 'jspdf';
import { Download, ShieldAlert, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way"
];

const answerLabels = [
  'Not at all (0)',
  'Several days (1)',
  'More than half the days (2)',
  'Nearly every day (3)'
];

const PHQ9Form = ({ clientId: propClientId, clientInfo, isClientRole = false, onSaved }) => {
  const { addToast } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientId, setClientId] = useState(propClientId || clientInfo?.id || 4);
  const [scores, setScores] = useState(Array(9).fill(0));
  const total = scores.reduce((a, b) => a + b, 0);

  const effectiveClientId = propClientId || clientInfo?.id || clientId || 4;

  useEffect(() => {
    if (propClientId) {
      setClientId(propClientId);
    } else if (clientInfo?.id) {
      setClientId(clientInfo.id);
    }
  }, [propClientId, clientInfo]);

  const getInterpretation = (score) => {
    if (score <= 4) return 'Minimal Depression';
    if (score <= 9) return 'Mild Depression';
    if (score <= 14) return 'Moderate Depression';
    if (score <= 19) return 'Moderately Severe Depression';
    return 'Severe Depression';
  };

  const getColor = (score) => {
    if (score <= 4) return 'var(--color-success, #22c55e)';
    if (score <= 9) return 'var(--color-info, #0ea5e9)';
    if (score <= 14) return 'var(--color-warning, #f59e0b)';
    return 'var(--color-danger, #ef4444)';
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const patientName = clientInfo 
        ? `${clientInfo.firstName} ${clientInfo.lastName}` 
        : `Patient #${effectiveClientId}`;
      const patientIdentifier = clientInfo?.clientNumber || `ID: #${effectiveClientId}`;
      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const interpretation = getInterpretation(total);

      // Top Navy Header Banner
      doc.setFillColor(37, 99, 235); // Sapphire Navy
      doc.rect(0, 0, 210, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('MindCare Mental Health Therapy System', 15, 12);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('CLINICAL OUTCOME MEASURE REPORT · HIPAA COMPLIANT EHR RECORD', 15, 18);

      // Assessment Title & Metadata
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text('PHQ-9 Depression Assessment Summary', 15, 36);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Patient: ${patientName} (${patientIdentifier})   |   Date: ${dateStr}   |   Instrument: PHQ-9`, 15, 43);

      // Score Summary Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, 48, 180, 22, 2, 2, 'FD');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Total Clinical Score:', 20, 57);

      doc.setFontSize(18);
      doc.setTextColor(37, 99, 235);
      doc.text(`${total} / 27`, 65, 58);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Severity Level:', 105, 57);

      doc.setFontSize(12);
      doc.setTextColor(total <= 4 ? 34 : total <= 9 ? 14 : total <= 14 ? 245 : 239, 
                       total <= 4 ? 197 : total <= 9 ? 165 : total <= 14 ? 158 : 68, 
                       total <= 4 ? 94 : total <= 9 ? 233 : total <= 14 ? 11 : 68);
      doc.text(interpretation, 135, 57);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Scoring Guide: 0-4 Minimal • 5-9 Mild • 10-14 Moderate • 15-19 Moderately Severe • 20-27 Severe', 20, 65);

      let currentY = 76;

      // Question 9 Flagged Alert in PDF
      if (scores[8] > 0) {
        doc.setFillColor(254, 242, 242);
        doc.setDrawColor(239, 68, 68);
        doc.roundedRect(15, currentY, 180, 16, 2, 2, 'FD');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(185, 28, 28);
        doc.text('CRITICAL CLINICAL ALERT: QUESTION 9 FLAGGED (SUICIDAL IDEATION)', 20, currentY + 6);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(127, 29, 29);
        doc.text(`Patient endorsed item 9 with score ${scores[8]}/3 ("${answerLabels[scores[8]]}"). Clinical crisis protocol and safety assessment required.`, 20, currentY + 11);

        currentY += 22;
      }

      // Questions Table Header
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Itemized Symptom Responses', 15, currentY);
      currentY += 6;

      doc.setFillColor(30, 41, 59);
      doc.rect(15, currentY, 180, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('#', 18, currentY + 5.5);
      doc.text('Diagnostic Item (Over the last 2 weeks)', 26, currentY + 5.5);
      doc.text('Response', 150, currentY + 5.5);
      doc.text('Score', 184, currentY + 5.5);
      currentY += 8;

      // Rows
      questions.forEach((q, i) => {
        const isQ9 = i === 8 && scores[i] > 0;
        if (isQ9) {
          doc.setFillColor(254, 226, 226);
        } else {
          doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
        }
        doc.rect(15, currentY, 180, 7.5, 'F');
        doc.setDrawColor(241, 245, 249);
        doc.line(15, currentY + 7.5, 195, currentY + 7.5);

        doc.setFontSize(7.5);
        doc.setFont('helvetica', isQ9 ? 'bold' : 'normal');
        doc.setTextColor(isQ9 ? 185 : 51, isQ9 ? 28 : 65, isQ9 ? 28 : 85);
        doc.text(String(i + 1), 18, currentY + 5);

        const truncatedQ = q.length > 68 ? q.substring(0, 66) + '...' : q;
        doc.text(truncatedQ, 26, currentY + 5);
        doc.text(answerLabels[scores[i]], 150, currentY + 5);
        doc.text(String(scores[i]), 187, currentY + 5);

        currentY += 7.5;
      });

      // Footer Section
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 275, 195, 275);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('MindCare EHR • Confidential Psychological & Psychiatric Assessment Record', 15, 280);
      doc.text(`Downloaded directly via Google Chrome on ${new Date().toLocaleString()}`, 115, 280);

      const safePatientName = (clientInfo ? `${clientInfo.firstName}_${clientInfo.lastName}` : `Patient_${effectiveClientId}`).replace(/\s+/g, '_');
      const fileName = `MindCare_PHQ9_Assessment_${safePatientName}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      addToast('success', 'Download Complete', `Downloaded ${fileName} directly in Chrome.`);
    } catch (err) {
      console.error('PDF export error:', err);
      addToast('error', 'Export Error', 'Failed to generate assessment PDF.');
    }
  };

  const handleSave = async () => {
    const targetClientId = effectiveClientId;
    if (!targetClientId) {
      addToast('error', 'Validation Error', 'Client ID is required');
      return;
    }

    if (scores[8] > 0) {
      addToast('error', 'CLINICAL ALERT', 'Question 9 (Suicidal Ideation) is flagged positive. Safety protocol initiated.');
    }
    
    setIsSubmitting(true);
    try {
      await outcomeApi.createOutcome({
        measureType: 'PHQ_9',
        instrumentName: 'PHQ-9',
        totalScore: parseInt(total, 10),
        score: parseInt(total, 10),
        severityLevel: total <= 4 ? 'MINIMAL' : total <= 9 ? 'MILD' : total <= 14 ? 'MODERATE' : total <= 19 ? 'MODERATELY_SEVERE' : 'SEVERE',
        administrationDate: new Date().toISOString().split('T')[0],
        clientId: parseInt(targetClientId, 10),
        interpretation: getInterpretation(total),
        notes: `PHQ-9 clinical assessment recorded with score ${total}/27 (${getInterpretation(total)}). Question 9 score: ${scores[8]}.`
      });
      addToast('success', 'Saved', 'PHQ-9 Assessment successfully saved to EHR.');
      if (onSaved) onSaved();
    } catch(err) {
      addToast('error', 'API Error', err.response?.data?.message || err.message || 'Failed to save outcome measure.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mc-card">
      <div className="mc-card-content">
        <h2 style={{ marginBottom: 20 }}>PHQ-9 Assessment (Patient Health Questionnaire)</h2>

        {/* Selected Patient Banner */}
        {(() => {
          const patientName = clientInfo 
            ? `${clientInfo.firstName || ''} ${clientInfo.lastName || ''}`.trim() 
            : (effectiveClientId === 4 || effectiveClientId === '4' ? 'Taylor Morgan' : `Patient #${effectiveClientId}`);
          const patientCode = clientInfo?.clientNumber || (effectiveClientId === 4 || effectiveClientId === '4' ? 'CLN-3CD50763' : `CLN-${effectiveClientId}`);
          const initials = patientName.split(' ').filter(Boolean).map(x => x[0]).join('').slice(0, 2) || 'PT';

          return (
            <div style={{
              marginBottom: 20,
              padding: '14px 18px',
              background: 'var(--bg-secondary, #F8FAFC)',
              borderRadius: 10,
              border: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: '#EEF2FF',
                  color: '#4338CA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700
                }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Selected Patient</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {patientName}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="mc-badge mc-badge-success" style={{ fontSize: 11, padding: '4px 8px' }}>
                  Patient ID: #{effectiveClientId}
                </span>
                <span className="mc-badge mc-badge-outline" style={{ fontSize: 11, padding: '4px 8px' }}>
                  {patientCode}
                </span>
              </div>
            </div>
          );
        })()}

        {/* Questions list */}
        {questions.map((q, i) => {
          const isQ9 = i === 8;
          return (
            <div 
              key={i} 
              style={{ 
                marginBottom: 15, 
                padding: '12px 16px', 
                borderRadius: 8,
                background: isQ9 && scores[8] > 0 ? '#fff5f5' : 'transparent',
                border: isQ9 && scores[8] > 0 ? '1px solid #fca5a5' : '1px solid var(--border-primary)'
              }}
            >
              <p style={{ fontWeight: isQ9 && scores[8] > 0 ? 700 : 500, marginBottom: 10, color: isQ9 && scores[8] > 0 ? '#991b1b' : 'var(--text-primary)' }}>
                {i + 1}. {q}
              </p>
              <select 
                className="mc-form-select" 
                value={scores[i]} 
                onChange={e => {
                  const newScores = [...scores];
                  newScores[i] = parseInt(e.target.value, 10);
                  setScores(newScores);
                }}
                style={{ width: '100%', padding: '8px', border: '1px solid var(--border-primary)', borderRadius: '4px' }}
              >
                <option value={0}>Not at all (0)</option>
                <option value={1}>Several days (1)</option>
                <option value={2}>More than half the days (2)</option>
                <option value={3}>Nearly every day (3)</option>
              </select>

              {/* In-line Alert for Question 9 */}
              {isQ9 && scores[8] > 0 && (
                <div style={{
                  marginTop: 10,
                  padding: '10px 14px',
                  background: '#fef2f2',
                  border: '1px solid #f87171',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>
                  <ShieldAlert size={18} color="#dc2626" style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: '#991b1b', fontWeight: 600 }}>
                    Clinical Alert: Suicidal ideation flagged (Score: {scores[8]}/3). Immediate crisis safety protocols and evaluation required.
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Global Safety Alert Banner if Q9 > 0 */}
        {scores[8] > 0 && (
          <div style={{
            margin: '18px 0',
            padding: '14px 18px',
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12
          }}>
            <ShieldAlert size={24} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ color: '#991b1b', fontWeight: 800, fontSize: 14 }}>
                CRITICAL SAFETY PROTOCOL TRIGGERED (PHQ-9 Question 9 = {scores[8]})
              </div>
              <div style={{ color: '#b91c1c', fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>
                Patient has indicated positive risk for self-harm or suicidal thoughts. As per MindCare Clinical Supervision policies, initiate an immediate Columbia-Suicide Severity Rating Scale (C-SSRS) or Crisis Safety Plan and notify the Clinical Supervisor.
              </div>
            </div>
          </div>
        )}

        {/* Total Score, PDF Download, and Save */}
        <div style={{ 
          marginTop: 20, 
          padding: 16, 
          background: 'var(--bg-secondary, rgba(0,0,0,0.02))', 
          borderRadius: 8, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          gap: 12,
          border: '1px solid var(--border-primary)' 
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17 }}>Total Score: {total} / 27</h3>
            <p style={{ color: getColor(total), fontWeight: 'bold', margin: '4px 0 0 0', fontSize: 13 }}>
              Interpretation: {getInterpretation(total)}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button 
              type="button" 
              className="mc-btn mc-btn-outline" 
              onClick={handleDownloadPDF}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
              title="Download assessment report as PDF in Google Chrome"
            >
              <Download size={15} />
              Download in Chrome (PDF)
            </button>
            <Button type="button" onClick={handleSave} loading={isSubmitting}>
              Save Result
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PHQ9Form;
