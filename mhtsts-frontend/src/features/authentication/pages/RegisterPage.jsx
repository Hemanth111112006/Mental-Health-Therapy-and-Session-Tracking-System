import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { useNotification } from '../../../providers/NotificationProvider';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import AuthLayout from '../../../layouts/AuthLayout';
import Input from '../../../components/forms/Input';
import Select from '../../../components/forms/Select';
import Checkbox from '../../../components/forms/Checkbox';
import Textarea from '../../../components/forms/Textarea';


const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Step 1
    accountType: '', // 'therapist' | 'client'
    // Step 2
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    password: '',
    confirmPassword: '',
    // Step 3 (Therapist)
    licenseType: '',
    licenseNumber: '',
    licenseState: '',
    specialties: [],
    supervisorName: '',
    // Step 3 (Client)
    emergencyContactName: '',
    emergencyContactPhone: '',
    insuranceProvider: '',
    insuranceMemberId: '',
    presentingConcern: '',
    // Consent
    hipaaConsent: false,
    treatmentConsent: false,
    telehealthConsent: false,
    termsAccepted: false,
  });

  const { register } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = (step) => {
    const errs = {};
    switch (step) {
      case 1:
        if (!formData.accountType) errs.accountType = 'Please select an account type';
        break;
      case 2:
        if (!formData.firstName) errs.firstName = 'First name is required';
        if (!formData.lastName) errs.lastName = 'Last name is required';
        if (!formData.email) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email format';
        if (!formData.phone) errs.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) errs.phone = 'Phone must be exactly 10 digits';
        if (!formData.password) errs.password = 'Password is required';
        else if (formData.password.length < 8) errs.password = 'Minimum 8 characters';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password))
          errs.password = 'Must include uppercase, lowercase, number, and special character';
        if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        break;
      case 3:
        if (formData.accountType === 'therapist') {
          if (!formData.licenseType) errs.licenseType = 'License type is required';
          if (!formData.licenseNumber) errs.licenseNumber = 'License number is required';
          if (!formData.licenseState) errs.licenseState = 'License state is required';
        } else {
          if (!formData.emergencyContactName) errs.emergencyContactName = 'Emergency contact name is required';
          if (!formData.emergencyContactPhone) errs.emergencyContactPhone = 'Emergency contact phone is required';
        }
        break;
      case 4:
        if (!formData.hipaaConsent) errs.hipaaConsent = formData.accountType === 'therapist' ? 'HIPAA BAA agreement is required' : 'HIPAA consent is required';
        if (!formData.treatmentConsent) errs.treatmentConsent = formData.accountType === 'therapist' ? 'Licensure & practice certification is required' : 'Treatment consent is required';
        if (!formData.termsAccepted) errs.termsAccepted = formData.accountType === 'therapist' ? 'Clinician terms must be accepted' : 'You must accept the terms';
        break;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep(prev => Math.min(prev + 1, 4));
  };
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    setIsLoading(true);
    try {
      await register(formData);
      addToast('success', 'Account Created!', 'Your account has been created. Please sign in.');
      navigate('/login');
    } catch {
      addToast('error', 'Registration Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Choose Account Type</h3>
            <p style={{ marginBottom: 'var(--space-6)' }}>Select whether you are a mental health practitioner or a client seeking therapy.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              {[
                { value: 'therapist', icon: <LocalHospitalOutlinedIcon style={{ fontSize: 32 }} />, title: 'Mental Health Practitioner', desc: 'Therapist, Psychiatrist, Psychologist, or Counselor' },
                { value: 'client', icon: <PersonOutlinedIcon style={{ fontSize: 32 }} />, title: 'Client', desc: 'Seeking therapy or already enrolled in treatment' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField('accountType', opt.value)}
                  style={{
                    padding: 'var(--space-6)', border: `2px solid ${formData.accountType === opt.value ? 'var(--color-primary)' : 'var(--border-primary)'}`,
                    borderRadius: 'var(--radius-lg)', background: formData.accountType === opt.value ? 'var(--color-primary-50)' : 'var(--bg-secondary)',
                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)'
                  }}
                >
                  <div style={{ color: formData.accountType === opt.value ? 'var(--color-primary)' : 'var(--text-tertiary)' }}>{opt.icon}</div>
                  <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)', fontSize: 'var(--font-size-lg)' }}>{opt.title}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
            {errors.accountType && <div style={{ fontSize: 10, color: "var(--color-danger)", marginTop: 2 }} style={{ marginTop: 'var(--space-3)' }}>{errors.accountType}</div>}
          </div>
        );
      case 2:
        return (
          <div>
            <h3 style={{ marginBottom: 'var(--space-6)' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#344054", marginBottom: 4 }}>First Name <span className="required">*</span></label>
                <Input icon={<PersonOutlinedIcon style={{ fontSize: 16 }} />} placeholder="First name" value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} error={errors.firstName} />
              </div>
              <Input label="Last Name " placeholder="Last name" value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} error={errors.lastName} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#344054", marginBottom: 4 }}>Email Address <span className="required">*</span></label>
              <Input icon={<EmailOutlinedIcon style={{ fontSize: 16 }} />} type="email" placeholder="you@example.com" value={formData.email} onChange={e => updateField('email', e.target.value)} error={errors.email} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#344054", marginBottom: 4 }}>Phone Number <span className="required">*</span></label>
              <Input icon={<PhoneOutlinedIcon style={{ fontSize: 16 }} />} placeholder="(555) 123-4567" value={formData.phone} onChange={e => updateField('phone', e.target.value)} error={errors.phone} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <Input label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={e => updateField('dateOfBirth', e.target.value)} />
              <div style={{ marginBottom: 16 }}><label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#344054", marginBottom: 4 }}>Gender</label><select className="mc-luxury-input" value={formData.gender} onChange={e => updateField('gender', e.target.value)}><option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Other">Other</option></select></div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#344054", marginBottom: 4 }}>Password <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <Input icon={<LockOutlinedIcon style={{ fontSize: 16 }} />} type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" value={formData.password} onChange={e => updateField('password', e.target.value)} error={errors.password} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-placeholder)', padding: 4, display: 'flex' }}>
                    {showPassword ? <VisibilityOffOutlinedIcon style={{ fontSize: 16 }} /> : <VisibilityOutlinedIcon style={{ fontSize: 16 }} />}
                  </button>
                </div>
                <div className="mc-form-helper">Must include uppercase, lowercase, number, and special character</div>
              </div></div>
            <Input type="password" label="Confirm Password" placeholder="Re-enter password" value={formData.confirmPassword} onChange={e => updateField('confirmPassword', e.target.value)} error={errors.confirmPassword} />
          </div>
        );
      case 3:
        return formData.accountType === 'therapist' ? (
          <div>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Professional Information</h3>
            <p style={{ marginBottom: 'var(--space-6)' }}>License verification is required before clinical account activation.</p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#344054", marginBottom: 4 }}>License Type <span className="required">*</span></label>
              <select className={`mc-luxury-input ${errors.licenseType ? 'error' : ''}`} value={formData.licenseType} onChange={e => updateField('licenseType', e.target.value)}>
                <option value="">Select license type</option>
                <option value="LCSW">LCSW – Licensed Clinical Social Worker</option>
                <option value="LMFT">LMFT – Licensed Marriage and Family Therapist</option>
                <option value="LPC">LPC – Licensed Professional Counselor</option>
                <option value="PsyD">PsyD – Doctor of Psychology</option>
                <option value="PhD">PhD – Doctor of Philosophy in Psychology</option>
                <option value="MD">MD – Psychiatrist</option>
                <option value="LPCC">LPCC – Licensed Professional Clinical Counselor</option>
                <option value="LMHC">LMHC – Licensed Mental Health Counselor</option>
              </select>
              {errors.licenseType && <div style={{ fontSize: 10, color: "var(--color-danger)", marginTop: 2 }}>{errors.licenseType}</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#344054", marginBottom: 4 }}>License Number <span className="required">*</span></label>
                <Input icon={<BadgeOutlinedIcon style={{ fontSize: 16 }} />} placeholder="e.g., LCSW-12345" value={formData.licenseNumber} onChange={e => updateField('licenseNumber', e.target.value)} error={errors.licenseNumber} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#344054", marginBottom: 4 }}>Licensing State <span className="required">*</span></label>
                <select className={`mc-luxury-input ${errors.licenseState ? 'error' : ''}`} value={formData.licenseState} onChange={e => updateField('licenseState', e.target.value)}>
                  <option value="">Select state</option>
                  {['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.licenseState && <div style={{ fontSize: 10, color: "var(--color-danger)", marginTop: 2 }}>{errors.licenseState}</div>}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#344054", marginBottom: 4 }}>Treatment Specialties</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {['CBT', 'DBT', 'EMDR', 'Psychodynamic', 'Humanistic', 'Family Systems', 'Trauma-Focused', 'Play Therapy', 'Art Therapy', 'Substance Use', 'Eating Disorders', 'Anxiety', 'Depression', 'PTSD', 'OCD', 'ADHD'].map(s => (
                  <button key={s} type="button"
                    onClick={() => {
                      const specs = formData.specialties.includes(s) ? formData.specialties.filter(x => x !== s) : [...formData.specialties, s];
                      updateField('specialties', specs);
                    }}
                    style={{
                      padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-sm)',
                      border: `1px solid ${formData.specialties.includes(s) ? 'var(--color-primary)' : 'var(--border-primary)'}`,
                      background: formData.specialties.includes(s) ? 'var(--color-primary-50)' : 'var(--bg-secondary)',
                      color: formData.specialties.includes(s) ? 'var(--color-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer', transition: 'all 0.15s ease'
                    }}
                  >{s}</button>
                ))}
              </div>
            </div>
            <Input label="Supervisor Name (if applicable)" placeholder="Supervisor's full name" value={formData.supervisorName} onChange={e => updateField('supervisorName', e.target.value)} />
          </div>
        ) : (
          <div>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Clinical Information</h3>
            <p style={{ marginBottom: 'var(--space-6)' }}>This information helps us match you with the right therapist.</p>
            <Input label="Emergency Contact Name " placeholder="Full name" value={formData.emergencyContactName} onChange={e => updateField('emergencyContactName', e.target.value)} error={errors.emergencyContactName} />
            <Input label="Emergency Contact Phone " placeholder="(555) 123-4567" value={formData.emergencyContactPhone} onChange={e => updateField('emergencyContactPhone', e.target.value)} error={errors.emergencyContactPhone} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ marginBottom: 16 }}><label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#344054", marginBottom: 4 }}>Insurance Provider</label><select className="mc-luxury-input" value={formData.insuranceProvider} onChange={e => updateField('insuranceProvider', e.target.value)}><option value="">Select provider</option>
                  <option value="Aetna">Aetna</option>
                  <option value="Blue Cross">Blue Cross Blue Shield</option>
                  <option value="Cigna">Cigna</option>
                  <option value="UnitedHealth">UnitedHealthcare</option>
                  <option value="Kaiser">Kaiser Permanente</option>
                  <option value="Self-Pay">Self-Pay</option>
                  <option value="Other">Other</option></select></div>
              <Input label="Insurance Member ID" placeholder="Member ID" value={formData.insuranceMemberId} onChange={e => updateField('insuranceMemberId', e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#344054", marginBottom: 4 }}>Primary Concern</label>
              <textarea className="mc-luxury-input" rows="3" placeholder="Briefly describe what brings you to therapy..." value={formData.presentingConcern} onChange={e => updateField('presentingConcern', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
          </div>
        );
      case 4: {
        const isTherapist = formData.accountType === 'therapist';
        const consentList = isTherapist
          ? [
              { field: 'hipaaConsent', label: 'HIPAA Business Associate & PHI Security Agreement', desc: 'I agree to strictly comply with HIPAA Privacy & Security Rules, maintain client confidentiality, and safeguard all Protected Health Information (PHI).', required: true },
              { field: 'treatmentConsent', label: 'Clinical Licensure & Scope of Practice Certification', desc: 'I certify that my healthcare license is active, valid, and in good standing, and I agree to practice strictly within my authorized clinical scope.', required: true },
              { field: 'telehealthConsent', label: 'Telehealth Clinical Provider Standards', desc: 'I agree to deliver telehealth clinical services in accordance with state licensing regulations, clinical documentation standards, and emergency escalation protocols.', required: false },
              { field: 'termsAccepted', label: 'Clinician Terms of Service & EHR Documentation Standards', desc: 'I agree to MindCare\'s Clinician Terms of Service, timely session documentation requirements, and electronic signature compliance.', required: true },
            ]
          : [
              { field: 'hipaaConsent', label: 'HIPAA Notice of Privacy Practices', desc: 'I acknowledge receipt and review of the HIPAA Notice of Privacy Practices for MindCare.', required: true },
              { field: 'treatmentConsent', label: 'Informed Consent for Outpatient Treatment', desc: 'I consent to outpatient mental health treatment and understand my rights as a client including the right to refuse or discontinue treatment at any time.', required: true },
              { field: 'telehealthConsent', label: 'Telehealth Client Agreement', desc: 'I consent to receiving mental health services via secure telehealth and understand its benefits, limitations, and emergency guidelines.', required: false },
              { field: 'termsAccepted', label: 'Patient Terms of Service & Privacy Policy', desc: 'I have read and agree to the MindCare Patient Terms of Service and Privacy Policy.', required: true },
            ];

        return (
          <div>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>
              {isTherapist ? 'Clinical Practitioner Agreements' : 'Consent & Agreement'}
            </h3>
            <p style={{ marginBottom: 'var(--space-6)' }}>
              {isTherapist
                ? 'Please review and accept the professional healthcare agreements and HIPAA compliance standards.'
                : 'Please review and accept the following consent documents.'}
            </p>
            {consentList.map(c => (
              <div key={c.field} style={{
                padding: 'var(--space-4)', border: `1px solid ${errors[c.field] ? 'var(--border-error)' : 'var(--border-primary)'}`,
                borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)',
                background: formData[c.field] ? 'var(--color-success-light)' : 'var(--bg-secondary)',
                transition: 'all 0.2s ease'
              }}>
                <label style={{ display: 'flex', gap: 'var(--space-3)', cursor: 'pointer', alignItems: 'flex-start' }}>
                  <input type="checkbox" checked={formData[c.field]} onChange={e => updateField(c.field, e.target.checked)}
                    style={{ marginTop: 4, accentColor: 'var(--color-success)', width: 18, height: 18, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)', marginBottom: 2 }}>
                      {c.label} {c.required && <span className="required">*</span>}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--line-height-normal)' }}>{c.desc}</div>
                  </div>
                  {formData[c.field] && <CheckCircleOutlinedIcon style={{ color: 'var(--color-success)', fontSize: 20, flexShrink: 0, marginTop: 2 }} />}
                </label>
                {errors[c.field] && <div style={{ fontSize: 10, color: "var(--color-danger)", marginTop: 'var(--space-2)', marginLeft: 30 }}>{errors[c.field]}</div>}
              </div>
            ))}
          </div>
        );
      }
      default:
        return null;
    }
  };

  const steps = [
    { number: 1, label: 'Account Type' },
    { number: 2, label: 'Personal Info' },
    { number: 3, label: formData.accountType === 'therapist' ? 'Licensure' : 'Intake Info' },
    { number: 4, label: 'Consent' },
  ];

  return (
    <AuthLayout>
      <div className="mc-luxury-card" style={{ maxWidth: 520, margin: 'auto', width: '100%' }}>
          <div className="mc-auth-form-header" style={{ marginBottom: 16 }}>
            <h2 style={{ fontWeight: 800, color: "#101828", fontSize: 18, letterSpacing: "-0.5px" }}>Create Account</h2>
            <p style={{ color: "#475467", fontSize: 12, marginTop: 4 }}>Step {currentStep} of 4</p>
          </div>

          {/* Step Indicator */}
          <div className="mc-steps">
            {steps.map((step, i) => (
              <div key={step.number} style={{ display: 'flex', alignItems: 'center' }}>
                <div className={`mc-step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
                  <div className="mc-step-number">
                    {currentStep > step.number ? <CheckCircleOutlinedIcon style={{ fontSize: 16 }} /> : step.number}
                  </div>
                  <span className="mc-step-label">{step.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`mc-step-connector ${currentStep > step.number ? 'completed' : ''}`} />}
              </div>
            ))}
          </div>

          <form className="mc-auth-form" onSubmit={handleSubmit}>
            <div style={{ animation: 'fadeIn 0.3s ease' }} key={currentStep}>
              {renderStepContent()}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-6)', gap: 'var(--space-3)' }}>
              {currentStep > 1 && (
                <button type="button" className="mc-luxury-btn-social" style={{ height: 42, padding: "0 16px" }} onClick={handleBack}>
                  <ArrowBackOutlinedIcon style={{ fontSize: 18 }} /> Back
                </button>
              )}
              <div style={{ marginLeft: 'auto' }}>
                {currentStep < 4 ? (
                  <button type="button" className="mc-luxury-btn-submit" onClick={handleNext}>
                    Next <ArrowForwardOutlinedIcon style={{ fontSize: 18 }} />
                  </button>
                ) : (
                  <button type="submit" className="mc-luxury-btn-submit" disabled={isLoading}>
                    {isLoading ? <><span className="mc-spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span> Creating...</> : 'Create Account'}
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="mc-auth-form-footer" style={{ marginTop: 12, fontSize: 11, color: "#667085", textAlign: "center" }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
    </AuthLayout>
  );
};

export default RegisterPage;
