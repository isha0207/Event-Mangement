/**
 * Footer Component - EM Event Management
 * Luxury footer with official EM logo, brand slogan, quick navigation, and platform specs
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#070a12', borderTop: '1px solid var(--border-glass)', padding: '50px 20px 28px', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '36px' }}>
        
        {/* Brand Section */}
        <div style={{ maxWidth: '380px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <img
              src="/em-event-management-logo.png"
              alt="EM Event Management Logo"
              style={{ width: '45px', height: 'auto', objectFit: 'contain' }}
            />
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, background: 'var(--gold-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block' }}>
                EM Event Management
              </span>
              <span style={{ fontSize: '0.7rem', color: '#fef08a', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                Plan • Organize • Execute • Celebrate
              </span>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
            Premier luxury event management, instant digital QR pass issuance, and high-capacity summit orchestration platform for global summits, galas, and concerts.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Platform Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <li><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link></li>
            <li><Link to="/events" style={{ color: 'inherit', textDecoration: 'none' }}>Explore Events</Link></li>
            <li><Link to="/categories" style={{ color: 'inherit', textDecoration: 'none' }}>Event Categories</Link></li>
            <li><Link to="/pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pass Tiers & Pricing</Link></li>
            <li><Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About EM Platform</Link></li>
            <li><Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Concierge Contact</Link></li>
          </ul>
        </div>

        {/* User Account Navigation */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>User Portal</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <li><Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Attendee Sign In</Link></li>
            <li><Link to="/register" style={{ color: 'inherit', textDecoration: 'none' }}>Create User Account</Link></li>
            <li><Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>My Dashboard & Passes</Link></li>
            <li><Link to="/forgot-password" style={{ color: 'inherit', textDecoration: 'none' }}>Password Recovery</Link></li>
          </ul>
        </div>

        {/* Concierge & Security */}
        <div style={{ maxWidth: '280px' }}>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Executive Support</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="#d4af37" />
              <span>concierge@em-events.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} color="#d4af37" />
              <span>+1 (800) 888-EM-PASS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="#10b981" />
              <span>256-Bit SSL Encrypted Ticketing</span>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div style={{ maxWidth: '1280px', margin: '36px auto 0', paddingTop: '20px', borderTop: '1px solid rgba(212, 175, 55, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
        <div>© 2026 EM Event Management. All Rights Reserved.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          Engineered for <span style={{ color: '#fef08a', fontWeight: 700 }}>Luxury Event Standards</span>
        </div>
      </div>
    </footer>
  );
}
