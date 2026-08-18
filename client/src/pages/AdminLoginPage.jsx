/**
 * Admin Login Page View - EM Event Management
 * Dedicated Admin Command Center authentication portal at /admin/login
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldAlert, Lock, Mail, LogIn, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@eventhub.com');
  const [password, setPassword] = useState('adminpassword123');
  const [submitting, setSubmitting] = useState(false);

  const { login, loginAsDemoAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.user?.role !== 'admin') {
        showToast('Access denied: Account does not have Admin privileges', 'error');
        setSubmitting(false);
        return;
      }
      showToast('Admin Command Center Access Granted', 'success');
      navigate('/admin');
    } catch (err) {
      setSubmitting(false);
      showToast('Admin authentication failed: ' + err.message, 'error');
    }
  };

  const handleOneClickAdmin = async () => {
    try {
      await loginAsDemoAdmin();
      showToast('Welcome Super Admin! Opening Admin Control Panel...', 'success');
      navigate('/admin');
    } catch (err) {
      showToast('Admin demo login failed: ' + err.message, 'error');
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '40px auto 60px' }}>
      <div className="glass-panel" style={{ padding: '36px', borderRadius: 'var(--radius-lg)', border: '1px solid #d4af37', boxShadow: 'var(--shadow-glow)' }}>
        
        {/* Header with EM Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img
            src="/em-event-management-logo.png"
            alt="EM Event Management Logo"
            style={{
              width: '80px',
              height: 'auto',
              objectFit: 'contain',
              marginBottom: '12px',
              filter: 'drop-shadow(0 0 12px rgba(212, 175, 55, 0.5))'
            }}
          />
          <h2 style={{ fontSize: '1.65rem', color: '#fff', margin: 0, background: 'var(--gold-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            EM Event Management
          </h2>
          <div style={{ fontSize: '0.78rem', color: '#fef08a', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 800, marginTop: '2px' }}>
            ADMIN PANEL ACCESS
          </div>
        </div>

        {/* 1-Click Fast Admin Entry */}
        <button
          type="button"
          onClick={handleOneClickAdmin}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginBottom: '24px', fontSize: '0.98rem' }}
        >
          <Sparkles size={18} /> 1-Click Instant Admin Entry
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 20px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
          <span style={{ padding: '0 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>OR Enter Admin Passkey</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
        </div>

        {/* Admin Login Form */}
        <form onSubmit={handleAdminSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#d4af37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Security Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#d4af37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-secondary btn-lg" style={{ width: '100%', marginTop: '10px' }} disabled={submitting}>
            {submitting ? 'Verifying Credentials...' : 'Authenticate & Open Control Panel'} <LogIn size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Standard User?{' '}
          <Link to="/login" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 600 }}>
            Go to Attendee Login
          </Link>
        </div>

      </div>
    </div>
  );
}
