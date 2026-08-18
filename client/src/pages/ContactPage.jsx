/**
 * Contact / Concierge Page View - EM Event Management
 */

import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      showToast('Concierge inquiry dispatched successfully! Our executive team will respond within 2 hours.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 600);
  };

  return (
    <div style={{ paddingBottom: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '36px', borderRadius: 'var(--radius-lg)', marginBottom: '36px' }}>
        <h1 style={{ color: '#fff', fontSize: '2rem', margin: 0, background: 'var(--gold-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Executive Concierge Contact
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
          Inquire about VIP summit ticketing, venue orchestration, enterprise organizer licenses, or general support.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '30px' }}>
        
        {/* Info Box */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Global Headquarters</h3>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <MapPin color="#d4af37" size={20} style={{ marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#fff', display: 'block', fontSize: '0.92rem' }}>EM Plaza & Towers</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>777 Executive Boulevard, Suite 500, New York, NY 10022</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <Mail color="#d4af37" size={20} />
            <div>
              <strong style={{ color: '#fff', display: 'block', fontSize: '0.92rem' }}>Executive Email</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>concierge@em-events.com</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <Phone color="#d4af37" size={20} />
            <div>
              <strong style={{ color: '#fff', display: 'block', fontSize: '0.92rem' }}>Direct Concierge Hotline</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>+1 (800) 888-EM-PASS</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '18px' }}>Dispatch Message</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message Details</label>
              <textarea
                className="form-textarea"
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Dispatching Message...' : 'Send Inquiry'} <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
