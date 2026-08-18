/**
 * Forgot Password Recovery Page - EM Event Management
 * Features official EM logo, OTP verification step, and password reset flow.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Mail, Key, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      showToast('Verification OTP sent to ' + email + ' (Use 123456)', 'info');
    }, 600);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (otp !== '123456' && otp.length < 4) {
      showToast('Invalid OTP. Use demo OTP code: 123456', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Password reset successfully! Please sign in with your new password.', 'success');
      navigate('/login');
    }, 600);
  };

  return (
    <div style={{ maxWidth: '440px', margin: '40px auto 60px' }}>
      <div className="glass-panel" style={{ padding: '36px', borderRadius: 'var(--radius-lg)' }}>
        
        {/* Header with EM Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img
            src="/em-event-management-logo.png"
            alt="EM Logo"
            style={{ width: '65px', height: 'auto', marginBottom: '12px' }}
          />
          <h2 style={{ fontSize: '1.6rem', color: '#fff', margin: 0 }}>Reset Account Password</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            {step === 1 ? 'Enter your registered email to receive an OTP passkey' : 'Enter 6-digit OTP code and choose your new password'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOTP}>
            <div className="form-group">
              <label className="form-label">Registered Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#d4af37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="user@em-events.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send Verification OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">6-Digit Verification OTP</label>
              <div style={{ position: 'relative' }}>
                <Key size={16} color="#d4af37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="e.g. 123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#fef08a', marginTop: '4px', display: 'block' }}>
                Demo Verification OTP code: 123456
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#d4af37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Updating Password...' : 'Confirm Reset Password'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem' }}>
          <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> Return to Attendee Login
          </Link>
        </div>

      </div>
    </div>
  );
}
