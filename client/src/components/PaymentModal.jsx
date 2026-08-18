/**
 * Ticket Checkout & Seat Selection Modal - EM Event Management
 * Features interactive Seat Selection grid, multi-payment gateway tabs (Razorpay, Stripe, UPI, Card, Wallet),
 * and live price calculations.
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { X, Ticket, CreditCard, ShieldCheck, CheckCircle2, QrCode, Lock, Zap, Award } from 'lucide-react';

export default function PaymentModal({ event, onClose, onSuccess }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [seatTier, setSeatTier] = useState('VIP'); // Standard, VIP, Platinum
  const [selectedSeats, setSelectedSeats] = useState(['A-12']);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // razorpay | stripe | upi | card | wallet
  const [submitting, setSubmitting] = useState(false);

  // Seat layout mock grid
  const availableSeatGrid = [
    { id: 'A-10', tier: 'VIP', status: 'available' },
    { id: 'A-11', tier: 'VIP', status: 'booked' },
    { id: 'A-12', tier: 'VIP', status: 'selected' },
    { id: 'A-13', tier: 'VIP', status: 'available' },
    { id: 'B-01', tier: 'Platinum', status: 'available' },
    { id: 'B-02', tier: 'Platinum', status: 'available' },
    { id: 'C-05', tier: 'Standard', status: 'available' },
    { id: 'C-06', tier: 'Standard', status: 'available' },
  ];

  const getTierMultiplier = () => {
    if (seatTier === 'Platinum') return 1.5;
    if (seatTier === 'VIP') return 1.2;
    return 1.0;
  };

  const basePrice = event.price || 99;
  const unitPrice = Math.round(basePrice * getTierMultiplier());
  const totalPrice = unitPrice * quantity;

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      if (selectedSeats.length > 1) {
        setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
      }
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleConfirmCheckout = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        eventId: event._id || event.id,
        quantity,
        seatTier,
        selectedSeats,
        paymentMethod,
        totalPrice
      };

      const res = await api.post('/bookings', payload);
      showToast(`Pass Reserved! Booking Ref: ${res.bookingCode || 'EM-PASS'}`, 'success');
      setSubmitting(false);
      onSuccess();
      onClose();
    } catch (err) {
      setSubmitting(false);
      showToast('Checkout failed: ' + err.message, 'error');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '640px',
          border: '1px solid var(--border-glass-hover)',
          boxShadow: '0 0 40px rgba(212, 175, 55, 0.3)',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Header with EM Logo */}
        <div
          style={{
            background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/em-event-management-logo.png"
              alt="EM Logo"
              style={{ width: '45px', height: 'auto', objectFit: 'contain' }}
            />
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>Reserve Admission Pass</h3>
              <span style={{ fontSize: '0.78rem', color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                {event.title}
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

        {/* Modal Form */}
        <form onSubmit={handleConfirmCheckout} style={{ padding: '24px' }}>
          
          {/* Seat Tier Selection */}
          <div className="form-group">
            <label className="form-label" style={{ color: '#fff', fontWeight: 700 }}>1. Select Seat Tier</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { name: 'Standard', tag: 'General Pass', mult: '1.0x', price: basePrice },
                { name: 'VIP', tag: 'Preferred View', mult: '1.2x', price: Math.round(basePrice * 1.2) },
                { name: 'Platinum', tag: 'Front Row Gala', mult: '1.5x', price: Math.round(basePrice * 1.5) }
              ].map((tier) => (
                <div
                  key={tier.name}
                  onClick={() => setSeatTier(tier.name)}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: seatTier === tier.name ? '2px solid #d4af37' : '1px solid var(--border-glass)',
                    background: seatTier === tier.name ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ fontWeight: 800, color: seatTier === tier.name ? '#fef08a' : '#fff', fontSize: '0.95rem' }}>{tier.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{tier.tag}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>${tier.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Seat Availability Grid */}
          <div className="form-group">
            <label className="form-label" style={{ color: '#fff', fontWeight: 700 }}>2. Real-Time Seat Selection</label>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#d4af37', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                STAGE / MAIN PODIUM
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {availableSeatGrid.map((seat) => {
                  const isSelected = selectedSeats.includes(seat.id);
                  const isBooked = seat.status === 'booked';

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      disabled={isBooked}
                      onClick={() => handleSeatClick(seat.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: isSelected ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.1)',
                        background: isBooked ? 'rgba(239,68,68,0.2)' : isSelected ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.08)',
                        color: isBooked ? '#fca5a5' : isSelected ? '#000' : '#fff',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: isBooked ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {seat.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quantity Counter */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '10px' }}>
            <div>
              <span style={{ color: '#fff', fontWeight: 700, display: 'block', fontSize: '0.92rem' }}>Quantity of Passes</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Unit Price: ${unitPrice}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="btn btn-secondary btn-sm"
              >
                -
              </button>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fef08a' }}>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="btn btn-secondary btn-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Multi Payment Gateway Selector */}
          <div className="form-group">
            <label className="form-label" style={{ color: '#fff', fontWeight: 700 }}>3. Select Payment Gateway</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {[
                { id: 'razorpay', label: 'Razorpay' },
                { id: 'stripe', label: 'Stripe' },
                { id: 'upi', label: 'UPI' },
                { id: 'card', label: 'Card' },
                { id: 'wallet', label: 'EM Wallet' }
              ].map((gw) => (
                <button
                  key={gw.id}
                  type="button"
                  onClick={() => setPaymentMethod(gw.id)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: paymentMethod === gw.id ? '1px solid #d4af37' : '1px solid var(--border-glass)',
                    background: paymentMethod === gw.id ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.03)',
                    color: paymentMethod === gw.id ? '#fef08a' : 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  {gw.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>TOTAL AMOUNT DUE</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>${totalPrice} USD</span>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
              {submitting ? 'Processing Secure Gateway...' : 'Pay & Confirm Booking'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
