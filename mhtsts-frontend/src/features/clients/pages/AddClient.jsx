import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { clientService } from '../../../features/clients/api/client.service';
import { useNotification } from '../../../providers/NotificationProvider';
import { toast } from '../../../utils/toast';
import { ArrowLeft } from 'lucide-react';
import Input from '../../../components/forms/Input';
import Select from '../../../components/forms/Select';
import Checkbox from '../../../components/forms/Checkbox';
import Textarea from '../../../components/forms/Textarea';
import Button from '../../../components/forms/Button';

const AddClient = () => {
  const navigate = useNavigate();
  let addToastSafe = () => {};
  try {
    const notif = useNotification();
    if (notif && notif.addToast) addToastSafe = notif.addToast;
  } catch (e) {
    // Notification provider fallback
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Prefer not to say',
    insuranceProvider: 'Self-Pay',
    emergencyContactName: '',
    emergencyContactPhone: '',
    presentingConcerns: '',
    isMinor: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (!/^[A-Za-z\s\-']+$/.test(formData.lastName)) newErrors.lastName = 'Last name must contain only letters, spaces, hyphens, or apostrophes';
    if (formData.firstName && !/^[A-Za-z\s\-']+$/.test(formData.firstName)) newErrors.firstName = 'First name must contain only letters, spaces, hyphens, or apostrophes';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
    if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = 'Emergency contact phone is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form.');
      try { addToastSafe('error', 'Validation Error', 'Please fix the errors in the form.'); } catch (_) {}
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newClient = await clientService.create(formData);
      toast.success(`Client ${formData.firstName} ${formData.lastName} registered successfully!`);
      try { addToastSafe('success', 'Success', 'Client added successfully'); } catch (_) {}
      if (newClient && newClient.id) {
        navigate(`/clients/${newClient.id}`);
      } else {
        navigate('/clients');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add client');
      try { addToastSafe('error', 'Error', error.message || 'Failed to add client'); } catch (_) {}
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mc-page-container" style={{ padding: '0 8px 24px 8px' }}>
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <Link to="/clients" className="mc-btn mc-btn-ghost mc-btn-sm" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={16} /> Back to Clients
        </Link>
      </div>

      <div className="mc-page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="mc-page-title" style={{ fontSize: 24, fontWeight: 800 }}>Add New Client</h1>
          <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            Complete the intake form to register a new patient
          </p>
        </div>
      </div>

      <div className="mc-card" style={{ borderRadius: 14, overflow: 'hidden' }}>
        <div className="mc-card-content" style={{ padding: 24 }}>
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border-primary)', fontSize: 16, fontWeight: 700 }}>
              Personal Information
            </h3>
            <div className="mc-grid-2" style={{ marginBottom: 'var(--space-6)' }}>
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} required />
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} required />
              <Input type="date" label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} error={errors.dateOfBirth} required />
              <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Non-binary', label: 'Non-binary' },
                { value: 'Prefer not to say', label: 'Prefer not to say' }
              ]} />
              <Checkbox label="Client is a minor (under 18)" name="isMinor" checked={formData.isMinor} onChange={handleChange} />
            </div>

            <h3 style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border-primary)', fontSize: 16, fontWeight: 700 }}>
              Contact Information
            </h3>
            <div className="mc-grid-2" style={{ marginBottom: 'var(--space-6)' }}>
              <Input type="tel" label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} required />
              <Input type="email" label="Email Address" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
              <Input label="Emergency Contact Name" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} error={errors.emergencyContactName} required />
              <Input type="tel" label="Emergency Contact Phone" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} error={errors.emergencyContactPhone} required />
            </div>

            <h3 style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border-primary)', fontSize: 16, fontWeight: 700 }}>
              Clinical Intake
            </h3>
            <div className="mc-grid-1" style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ maxWidth: '50%' }}>
                <Select label="Insurance Provider" name="insuranceProvider" value={formData.insuranceProvider} onChange={handleChange} options={[
                  { value: 'Self-Pay', label: 'Self-Pay' },
                  { value: 'Aetna', label: 'Aetna' },
                  { value: 'Blue Cross Blue Shield', label: 'Blue Cross Blue Shield' },
                  { value: 'Cigna', label: 'Cigna' },
                  { value: 'UnitedHealthcare', label: 'UnitedHealthcare' },
                  { value: 'Medicare/Medicaid', label: 'Medicare/Medicaid' }
                ]} />
              </div>
              <Textarea 
                label="Presenting Concerns"
                name="presentingConcerns" 
                rows="4" 
                placeholder="Briefly describe the reason for seeking therapy..."
                value={formData.presentingConcerns}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-primary)' }}>
              <Button type="button" variant="outline" onClick={() => navigate('/clients')} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting} loading={isSubmitting}>
                Save Client Record
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddClient;
