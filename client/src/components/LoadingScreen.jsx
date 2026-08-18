/**
 * Loading / Splash Screen Component
 * Displays centered official EM Event Management logo with luxury soft gold glow & fade animation
 */

import React from 'react';

export default function LoadingScreen({ text = "Loading EM Event Management..." }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#09090b',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Glowing aura behind logo */}
        <div
          style={{
            position: 'absolute',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, rgba(245, 158, 11, 0.15) 50%, transparent 70%)',
            filter: 'blur(20px)',
            animation: 'pulseGlow 2s infinite ease-in-out'
          }}
        />

        {/* EM Event Management Logo */}
        <img
          src="/em-event-management-logo.png"
          alt="EM Event Management"
          style={{
            width: '110px',
            height: 'auto',
            objectFit: 'contain',
            position: 'relative',
            zIndex: 2,
            animation: 'logoFadeIn 1.5s ease-in-out'
          }}
        />

        <div
          style={{
            marginTop: '20px',
            fontSize: '1.25rem',
            fontWeight: 800,
            background: 'var(--gold-text)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px'
          }}
        >
          EM Event Management
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px', letterSpacing: '0.5px' }}>
          {text}
        </p>
      </div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.9; }
        }
        @keyframes logoFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
