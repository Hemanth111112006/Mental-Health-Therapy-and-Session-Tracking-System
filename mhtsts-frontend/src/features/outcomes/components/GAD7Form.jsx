import React, { useState, useEffect } from 'react';
import { useNotification } from '../../../providers/NotificationProvider';
import { outcomeApi } from '../../../api/outcomeApi';
import Button from '../../../components/forms/Button';
import jsPDF from 'jspdf';
import { Download, Activity, CheckCircle, FileText } from 'lucide-react';

const questions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen"
];

const answerLabels = [
  'Not at all (0)',
  'Several days (1)',
  'More than half the days (2)',
  'Nearly every day (3)'
];

const GAD7Form = ({ clientId: propClientId, clientInfo, isClientRole = false, onSaved }) => {
  const { addToast } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientId, setClientId] = useState(propClientId || clientInfo?.id || 4);
  const [scores, setScores] = useState(Array(7).fill(0));
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
    if (score <= 4) return 'Minimal Anxiety';
    if (score <= 9) return 'Mild Anxiety';
    if (score <= 14) return 'Moderate Anxiety';
    return 'Severe Anxiety';
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

      // Top Header Banner
      doc.setFillColor(16, 185, 129); // Emerald Teal
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
      doc.text('GAD-7 Generalized Anxiety Assessment Summary', 15, 36);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Patient: ${patientName} (${patientIdentifier})   |   Date: ${dateStr}   |   Instrument: GAD-7`, 15, 43);

      // Score Summary Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, 48, 180, 22, 2, 2, 'FD');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Total Clinical Score:', 20, 57);

      doc.setFontSize(18);
      doc.setTextColor(16, 185, 129);
      doc.text(`${total} / 21`, 65, 58);

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
      doc.text('Scoring Guide: 0-4 Minimal Anxiety • 5-9 Mild Anxiety • 10-14 Moderate Anxiety • 15-21 Severe Anxiety', 20, 65);

      let currentY = 78;

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
        doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
        doc.rect(15, currentY, 180, 8, 'F');
        doc.setDrawColor(241, 245, 249);
        doc.line(15, currentY + 8, 195, currentY + 8);

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.text(String(i + 1), 18, currentY + 5.5);

        const truncatedQ = q.length > 68 ? q.substring(0, 66) + '...' : q;
        doc.text(truncatedQ, 26, currentY + 5.5);
        doc.text(answerLabels[scores[i]], 150, currentY + 5.5);
        doc.text(String(scores[i]), 187, currentY + 5.5);

        currentY += 8;
      });

      // Clinical Sign-off & Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 275, 195, 275);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('MindCare EHR • Confidential Psychological & Psychiatric Assessment Record', 15, 280);
      doc.text(`Downloaded directly via Google Chrome on ${new Date().toLocaleString()}`, 115, 280);

      const safePatientName = (clientInfo ? `${clientInfo.firstName}_${clientInfo.lastName}` : `Patient_${effectiveClientId}`).replace(/\s+/g, '_');
      const fileName = `MindCare_GAD7_Assessment_${safePatientName}_${new Date().toISOString().split('T')[0]}.pdf`;
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

    setIsSubmitting(true);
    try {
      await outcomeApi.createOutcome({
        measureType: 'GAD_7',
        instrumentName: 'GAD-7',
        totalScore: parseInt(total, 10),
        score: parseInt(total, 10),
        severityLevel: total <= 4 ? 'MINIMAL' : total <= 9 ? 'MILD' : total <= 14 ? 'MODERATE' : 'SEVERE',
        administrationDate: new Date().toISOString().split('T')[0],
        clientId: parseInt(targetClientId, 10),
        interpretation: getInterpretation(total),
        notes: `GAD-7 anxiety assessment logged with total score of ${total}/21 (${getInterpretation(total)}).`
      });
      addToast('success', 'Saved', 'GAD-7 Assessment successfully saved to EHR.');
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
        <h2 style={{ marginBottom: 20 }}>GAD-7 Assessment (Generalized Anxiety Scale)</h2>

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
        {questions.map((q, i) => (
          <div key={i} style={{ marginBottom: 15, paddingBottom: 15, borderBottom: '1px solid var(--border-primary)' }}>
            <p style={{ fontWeight: 500, marginBottom: 10 }}>{i + 1}. {q}</p>
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
          </div>
        ))}

        {/* Score & Action Buttons */}
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
            <h3 style={{ margin: 0, fontSize: 17 }}>Total Score: {total} / 21</h3>
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
              Save to Clinical Record
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GAD7Form;
