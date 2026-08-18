/**
 * Digital Ticket Pass & QR Modal - EM Event Management
 * Features official EM logo header, QR validation code, seat assignment, and PDF ticket download engine
 */

import React, { useRef } from 'react';
import { X, Download, QrCode, Calendar, MapPin, Ticket, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TicketModal({ booking, onClose }) {
  const ticketRef = useRef(null);

  if (!booking) return null;

  const event = booking.event || {};

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>EM Event Pass - ${event.title || 'Official Ticket'}</title>
          <style>
            body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background: #09090b; color: #ffffff; padding: 40px; }
            .ticket-container { max-width: 650px; margin: 0 auto; border: 2px solid #d4af37; border-radius: 16px; padding: 30px; background: #121216; }
            .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 20px; margin-bottom: 20px; }
            .logo-group { display: flex; align-items: center; gap: 14px; }
            .logo-img { width: 60px; height: auto; }
            .brand-name { font-size: 22px; font-weight: 800; color: #ffd700; }
            .brand-tag { font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px; }
            .badge { background: rgba(212,175,55,0.2); color: #fef08a; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; border: 1px solid #d4af37; }
            .event-title { font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 8px; }
            .event-meta { font-size: 14px; color: #d1d5db; margin-bottom: 20px; line-height: 1.6; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: rgba(255,255,255,0.03); padding: 16px; border-radius: 10px; margin-bottom: 20px; }
            .info-item { font-size: 13px; }
            .info-label { color: #a1a1aa; font-size: 11px; text-transform: uppercase; }
            .info-val { font-weight: 700; color: #ffffff; margin-top: 2px; }
            .qr-section { text-align: center; border-top: 1px dashed rgba(212,175,55,0.3); padding-top: 20px; margin-top: 20px; }
            .qr-img { width: 140px; height: 140px; background: #ffffff; padding: 10px; border-radius: 12px; }
            .code-text { font-family: monospace; font-size: 16px; color: #d4af37; font-weight: 700; margin-top: 10px; }
            .footer-note { font-size: 11px; color: #6b7280; text-align: center; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            <div class="header">
              <div class="logo-group">
                <img src="${window.location.origin}/em-event-management-logo.png" class="logo-img" alt="EM Logo" />
                <div>
                  <div class="brand-name">EM Event Management</div>
                  <div class="brand-tag">Official Digital Admission Ticket</div>
                </div>
              </div>
              <div class="badge">CONFIRMED PASS</div>
            </div>

            <div class="event-title">${event.title || 'Official VIP Event Pass'}</div>
            <div class="event-meta">
              📍 Location: ${event.location || 'Main Grand Ballroom'}<br/>
              📅 Date & Time: ${event.date || 'TBD'} at ${event.time || 'TBD'}
            </div>

            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Ticket Holder</div>
                <div class="info-val">${booking.user?.name || 'Verified Attendee'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Seat Assignment / Tier</div>
                <div class="info-val">${booking.seatTier || 'VIP Tier'} (${booking.selectedSeats?.join(', ') || 'General Seat'})</div>
              </div>
              <div class="info-item">
                <div class="info-label">Ticket Quantity</div>
                <div class="info-val">${booking.quantity || 1} Pass(es)</div>
              </div>
              <div class="info-item">
                <div class="info-label">Total Amount Paid</div>
                <div class="info-val">$${booking.totalPrice || event.price || 0} USD</div>
              </div>
            </div>

            <div class="qr-section">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.bookingCode || 'EM-PASS-999'}" class="qr-img" alt="QR Code" />
              <div class="code-text">PASS REF: ${booking.bookingCode || 'EM-PASS-999'}</div>
              <div style="font-size:12px; color:#a1a1aa; margin-top:4px;">Present this digital code at the event entrance scanner</div>
            </div>

            <div class="footer-note">
              © 2026 EM Event Management • Valid for single scan admission • Non-transferable without executive approval
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          border: '1px solid var(--primary)',
          boxShadow: '0 0 35px rgba(212, 175, 55, 0.25)',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Top EM Official Brand Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
            padding: '24px',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src="/em-event-management-logo.png"
              alt="EM Logo Header"
              style={{ width: '50px', height: 'auto', objectFit: 'contain' }}
            />
            <div>
              <span
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  background: 'var(--gold-text)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'block'
                }}
              >
                EM Event Management
              </span>
              <span style={{ fontSize: '0.68rem', color: '#fef08a', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                Digital Admission Ticket
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Main Ticket Body */}
        <div ref={ticketRef} style={{ padding: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span className="badge badge-confirmed" style={{ marginBottom: '8px' }}>
                <CheckCircle2 size={12} /> CONFIRMED PASS
              </span>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', margin: '4px 0 0' }}>{event.title || 'Event Pass'}</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>PASS REF</div>
              <div style={{ color: '#d4af37', fontWeight: 800, fontSize: '1.05rem', fontFamily: 'monospace' }}>
                {booking.bookingCode}
              </div>
            </div>
          </div>

          {/* Event Details Grid */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>DATE & TIME</span>
              <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{event.date} at {event.time}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>LOCATION</span>
              <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{event.location}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>SEAT TIER / NUMBERS</span>
              <strong style={{ color: '#fef08a', fontSize: '0.9rem' }}>{booking.seatTier || 'VIP Tier'} ({booking.selectedSeats?.join(', ') || 'General Admission'})</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>PASSES / TOTAL PAID</span>
              <strong style={{ color: '#10b981', fontSize: '0.9rem' }}>{booking.quantity} Pass(es) - ${booking.totalPrice}</strong>
            </div>
          </div>

          {/* QR Code Section */}
          <div style={{ textAlignment: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '14px', border: '1px dashed rgba(212,175,55,0.4)' }}>
            <div style={{ background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 0 20px rgba(212,175,55,0.3)' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.bookingCode}`}
                alt="QR Pass Code"
                style={{ width: '130px', height: '130px', display: 'block' }}
              />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#d4af37', fontWeight: 700, marginTop: '12px', letterSpacing: '1px' }}>
              SCAN FOR IMMEDIATE GATE ENTRY
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', textAlign: 'center' }}>
              Present this verified digital QR pass at turnstile scanner upon arrival
            </p>
          </div>

        </div>

        {/* Modal Action Buttons */}
        <div style={{ background: 'rgba(18, 18, 22, 0.95)', padding: '16px 24px', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>
          <button onClick={handleDownloadPDF} className="btn btn-primary btn-sm">
            <Download size={16} /> Download PDF Ticket
          </button>
        </div>

      </div>
    </div>
  );
}
