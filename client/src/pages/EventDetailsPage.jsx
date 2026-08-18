/**
 * Event Details Page View
 * Comprehensive detail view for a specific event with speaker bio, venue details & payment modal trigger
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Calendar, MapPin, Users, Ticket, ArrowLeft, UserCheck, Mail, Tag, ShieldCheck } from 'lucide-react';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/events/${id}`);
      setEvent(data);
      setLoading(false);
    } catch (err) {
      showToast('Error loading event details: ' + err.message, 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
        <p>Loading event information...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', margin: '40px auto', maxWidth: '600px' }}>
        <h2>Event Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '14px 0 24px' }}>The requested event may have been removed or does not exist.</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Home
        </Link>
      </div>
    );
  }

  const availableSeats = Math.max(0, event.totalSeats - (event.bookedSeats || 0));
  const isSoldOut = availableSeats === 0;

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Back button */}
      <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Events
      </Link>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '30px' }}>
        
        {/* Left Column: Banner & Full Description */}
        <div>
          <div className="glass-panel" style={{ overflow: 'hidden', padding: 0, marginBottom: '24px' }}>
            <img
              src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
              alt={event.title}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            />
            <div style={{ padding: '30px' }}>
              <span className="badge badge-category" style={{ marginBottom: '12px' }}>
                <Tag size={12} /> {event.category}
              </span>
              <h1 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '16px', lineHeight: 1.2 }}>{event.title}</h1>
              
              {/* Event Description */}
              <h4 style={{ color: '#38bdf8', marginBottom: '8px', fontSize: '1.05rem' }}>About This Event</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.98rem', whiteSpace: 'pre-line' }}>
                {event.description}
              </p>
            </div>
          </div>

          {/* Keynote Speaker Box */}
          {event.speaker && (
            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck color="#818cf8" size={20} /> Keynote Speaker
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.4rem' }}>
                  {event.speaker.name ? event.speaker.name.charAt(0) : 'S'}
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>{event.speaker.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{event.speaker.title}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Booking Card */}
        <div>
          <div className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
            <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block' }}>Ticket Price</span>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8' }}>${event.price}</span>
            </div>

            {/* Quick Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={18} color="#818cf8" />
                <div>
                  <strong style={{ display: 'block', color: '#fff' }}>Date & Time</strong>
                  <span style={{ color: 'var(--text-muted)' }}>{event.date} at {event.time}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={18} color="#38bdf8" />
                <div>
                  <strong style={{ display: 'block', color: '#fff' }}>Location</strong>
                  <span style={{ color: 'var(--text-muted)' }}>{event.location}, {event.city || 'NY'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={18} color="#34d399" />
                <div>
                  <strong style={{ display: 'block', color: '#fff' }}>Available Seats</strong>
                  <span style={{ color: availableSeats < 10 ? '#f87171' : 'var(--text-muted)' }}>
                    {availableSeats} seats left of {event.totalSeats} capacity
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#a855f7" />
                <div>
                  <strong style={{ display: 'block', color: '#fff' }}>Organizer</strong>
                  <span style={{ color: 'var(--text-muted)' }}>{event.organizer?.name || 'Tech Events Global'}</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  showToast('Please sign in to book tickets', 'info');
                  navigate('/login');
                } else {
                  setShowCheckoutModal(true);
                }
              }}
              className={`btn btn-lg ${isSoldOut ? 'btn-danger' : 'btn-primary'}`}
              style={{ width: '100%', marginBottom: '12px' }}
              disabled={isSoldOut}
            >
              <Ticket size={18} /> {isSoldOut ? 'Event Sold Out' : 'Reserve & Pay Ticket'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <ShieldCheck size={14} color="#10b981" /> Instant Email Confirmation & QR Pass
            </div>
          </div>
        </div>

      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <PaymentModal
          event={event}
          onClose={() => setShowCheckoutModal(false)}
          onSuccess={() => {
            fetchEventDetails();
          }}
        />
      )}

    </div>
  );
}
