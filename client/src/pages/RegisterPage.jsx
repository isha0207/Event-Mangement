/**
 * Registration Page View - EM Event Management
 * Features official EM logo, registration fields, and OTP Verification modal step
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Phone, Lock, UserPlus, CheckCircle2, Key } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleInitialRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    // Trigger OTP modal verification step
    setShowOTPModal(true);
    showToast(`Verification OTP dispatched to ${formData.email} (Use code: 123456)`, 'info');
  };

  const handleVerifyOTPAndSubmit = async (e) => {
    e.preventDefault();
    if (otpCode !== '123456' && otpCode.length < 4) {
      showToast('Invalid OTP code. Please use demo OTP: 123456', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await register(formData.name, formData.email, formData.password, formData.phone);
      showToast('Account created & verified! Welcome to EM Event Management', 'success');
      setShowOTPModal(false);
      navigate('/dashboard');
    } catch (err) {
      setSubmitting(false);
      showToast('Registration failed: ' + err.message, 'error');
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '40px auto 60px' }}>
      <div className="glass-panel" style={{ padding: '36px', borderRadius: 'var(--radius-lg)' }}>
        
        {/* Header with EM Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img
            src="/em-event-management-logo.png"
            alt="EM Event Management Logo"
            style={{
              width: '75px',
              height: 'auto',
              objectFit: 'contain',
              marginBottom: '12px',
              filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.4))'
            }}
          />
          <h2 style={{ fontSize: '1.65rem', color: '#fff', margin: 0 }}>Create Your Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Register to book VIP passes and manage your digital QR tickets
          </p>
        </div>

        <form onSubmit={handleInitialRegister}>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#d4af37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#d4af37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} color="#d4af37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="tel"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="+1 (555) 019-2834"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#d4af37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#d4af37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '10px' }}>
            <UserPlus size={18} /> Create Account
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 600 }}>
            Login
          </Link>
        </div>

      </div>

      {/* OTP Email Verification Modal */}
      {showOTPModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px', padding: '28px', border: '1px solid #d4af37' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img src="/em-event-management-logo.png" alt="EM Logo" style={{ width: '50px', height: 'auto', marginBottom: '10px' }} />
              <h3 style={{ color: '#fff', fontSize: '1.3rem', margin: 0 }}>Email OTP Verification</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                We sent a 6-digit OTP code to <strong>{formData.email}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOTPAndSubmit}>
              <div className="form-group">
                <label className="form-label">Enter 6-Digit Verification Code</label>
                <div style={{ position: 'relative' }}>
                  <Key size={16} color="#d4af37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    placeholder="e.g. 123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#fef08a', marginTop: '4px', display: 'block' }}>
                  Demo Verification OTP code: 123456
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowOTPModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? 'Verifying...' : 'Verify & Complete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
