/**
 * About Page View - EM Event Management
 */

import React from 'react';
import { ShieldCheck, Award, Users, Crown, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ paddingBottom: '40px' }}>
      <div className="glass-panel" style={{ padding: '50px 40px', borderRadius: 'var(--radius-lg)', marginBottom: '40px', textAlign: 'center' }}>
        <img
          src="/em-event-management-logo.png"
          alt="EM Logo"
          style={{ width: '90px', height: 'auto', marginBottom: '16px' }}
        />
        <h1 style={{ color: '#fff', fontSize: '2.5rem', margin: 0, background: 'var(--gold-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          About EM Event Management
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '10px', maxWidth: '700px', margin: '10px auto 0', lineHeight: 1.6 }}>
          EM Event Management is the premier luxury SaaS platform for orchestrating high-capacity summits, VIP galas, fashion weeks, and executive conferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '28px' }}>
          <Crown color="#d4af37" size={32} style={{ marginBottom: '14px' }} />
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>Luxury Standards</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Every touchpoint is designed for elegance—from glassmorphism interfaces and obsidian dark aesthetic to VIP seating maps and priority passes.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '28px' }}>
          <Sparkles color="#d4af37" size={32} style={{ marginBottom: '14px' }} />
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>Instant QR Ticketing</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Instant digital ticket generation with encrypted QR validation codes, digital wallet support, and downloadable printable PDF passes.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '28px' }}>
          <ShieldCheck color="#10b981" size={32} style={{ marginBottom: '14px' }} />
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>Enterprise Security</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            JWT authentication, role-based user/admin authorization, and 256-bit SSL encrypted transaction logging stored safely in MongoDB.
          </p>
        </div>
      </div>
    </div>
  );
}
