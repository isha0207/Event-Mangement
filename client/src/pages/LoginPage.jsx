/**
 * User Login Page View - EM Event Management
 * Features official EM logo header, email/password credentials authentication,
 * and 1-click attendee demo entry.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('user@eventhub.com');
  const [password, setPassword] = useState('userpassword123');
  const [submitting, setSubmitting] = useState(false);

  const { login, loginAsDemoUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await login(email, password);
      showToast('Welcome back, ' + (res.user?.name || 'User') + '!', 'success');
      if (res.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setSubmitting(false);
      showToast('Login failed: ' + err.message, 'error');
    }
  };

  const handleDemoUserClick = async () => {
    try {
      await loginAsDemoUser();
      showToast('Logged in as Standard User (John Doe)', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast('Demo User login error: ' + err.message, 'error');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '40px auto 60px' }}>
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
          <h2 style={{ fontSize: '1.65rem', color: '#fff', margin: 0 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Sign in to your EM Event Management account
          </p>
        </div>

        {/* 1-Click Fast Attendee Entry */}
        <button
          type="button"
          onClick={handleDemoUserClick}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginBottom: '24px' }}
        >
          <Sparkles size={18} /> 1-Click Fast Attendee Entry
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 20px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
          <span style={{ padding: '0 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>OR Sign in with Email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: '#d4af37', textDecoration: 'none', fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </div>
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
            {submitting ? 'Authenticating...' : 'Sign In'} <LogIn size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 600 }}>
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}
