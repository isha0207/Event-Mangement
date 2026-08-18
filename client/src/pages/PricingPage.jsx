/**
 * Pricing & VIP Membership Tiers - EM Event Management
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Check, ShieldCheck, Zap } from 'lucide-react';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Standard Attendee',
      price: '$0',
      period: 'per user account',
      desc: 'Perfect for discovering public galas and booking individual event passes.',
      features: [
        'Browse all public events & summits',
        'Instant digital QR pass generation',
        'PDF ticket downloads',
        'Standard customer support'
      ],
      buttonText: 'Get Started Free',
      isPopular: false
    },
    {
      name: 'VIP Pass Tier',
      price: '$49',
      period: 'per month',
      desc: 'Designed for frequent summit attendees seeking priority seating & zero booking fees.',
      features: [
        'All Standard Attendee features',
        'Priority seat selection map access',
        'Zero ticket booking transaction fees',
        'Early access 48-hr presale window',
        '24/7 Concierge hotline access'
      ],
      buttonText: 'Join VIP Pass Tier',
      isPopular: true
    },
    {
      name: 'Organizer Pro',
      price: '$199',
      period: 'per month',
      desc: 'Complete SaaS event management suite for publishing galas and managing bookings.',
      features: [
        'Unlimited event publishing',
        'Dedicated admin control dashboard',
        'Real-time seat availability manager',
        'Custom coupon code generator',
        'Revenue analytics & export reports'
      ],
      buttonText: 'Contact Sales',
      isPopular: false
    }
  ];

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div className="glass-panel" style={{ padding: '36px', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '40px' }}>
        <Crown color="#d4af37" size={36} style={{ marginBottom: '10px' }} />
        <h1 style={{ color: '#fff', fontSize: '2.2rem', margin: 0, background: 'var(--gold-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Pass Tiers & Membership Pricing
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0' }}>
          Transparent pricing structure for attendees, VIP passholders, and enterprise event organizers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {tiers.map((t) => (
          <div
            key={t.name}
            className="glass-panel"
            style={{
              padding: '32px',
              borderRadius: 'var(--radius-lg)',
              position: 'relative',
              border: t.isPopular ? '2px solid #d4af37' : '1px solid var(--border-glass)',
              boxShadow: t.isPopular ? '0 0 30px rgba(212, 175, 55, 0.25)' : 'none'
            }}
          >
            {t.isPopular && (
              <div style={{ position: 'absolute', top: '-14px', right: '24px', background: 'var(--gold-gradient)', color: '#000', padding: '4px 14px', borderRadius: '20px', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Most Popular
              </div>
            )}

            <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '6px' }}>{t.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>{t.desc}</p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fef08a' }}>{t.price}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t.period}</span>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
              {t.features.map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Check size={16} color="#10b981" /> {feat}
                </li>
              ))}
            </ul>

            <Link
              to="/register"
              className={`btn ${t.isPopular ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: '100%', padding: '12px' }}
            >
              {t.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
