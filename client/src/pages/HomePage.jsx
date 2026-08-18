/**
 * Home Page View - EM Event Management
 * Official luxury home view with Hero, Featured Events, Categories, Popular Events,
 * Premium Membership Tier, Testimonials, Sponsors, Pricing, FAQ, and Newsletter.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import EventFilter from '../components/EventFilter';
import PaymentModal from '../components/PaymentModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Sparkles, Calendar, Users, Award, ShieldCheck, ArrowRight, Crown, Star, Check, HelpCircle, Mail } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date-asc');

  // Booking Modal State
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, catRes] = await Promise.all([
        api.get(`/events?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`),
        api.get('/categories')
      ]);

      let resultEvents = eventsRes || [];

      if (sortBy === 'price-low') {
        resultEvents.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        resultEvents.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'popular') {
        resultEvents.sort((a, b) => (b.bookedSeats || 0) - (a.bookedSeats || 0));
      } else {
        resultEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      }

      setEvents(resultEvents);
      setCategories(catRes || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading events:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, selectedCategory, sortBy]);

  const handleBookTicketClick = (event) => {
    if (!isAuthenticated) {
      showToast('Please sign in to book event passes', 'info');
      navigate('/login');
      return;
    }
    setSelectedEventForBooking(event);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast('Subscribed to EM Executive Event Digest!', 'success');
    setNewsletterEmail('');
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Luxury Hero Section */}
      <section
        className="glass-panel"
        style={{
          padding: '60px 40px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '50px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          background: 'linear-gradient(135deg, rgba(18, 18, 22, 0.95) 0%, rgba(9, 9, 11, 0.98) 100%)'
        }}
      >
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '800px', position: 'relative', zIndex: 2 }}>
          <div className="badge badge-upcoming" style={{ marginBottom: '18px', padding: '6px 14px', fontSize: '0.82rem' }}>
            <Crown size={14} color="#d4af37" /> EM Event Management • Official SaaS Platform
          </div>

          <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px', background: 'var(--gold-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Plan • Organize • Execute • Celebrate.
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
            Premier luxury event management, instant digital QR pass issuance, seat reservation, and high-capacity summit orchestration for global summits, galas, tech conventions, and fashion weeks.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const el = document.getElementById('events-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-primary btn-lg"
            >
              Explore Events <ArrowRight size={18} />
            </button>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-secondary btn-lg">
                Create User Account
              </Link>
            )}
          </div>
        </div>

        {/* Hero Statistics Counter Bar */}
        <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid var(--border-glass)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fef08a' }}>120+</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Scheduled Galas & Summits</div>
          </div>
          <div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#d4af37' }}>99.9%</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Verified Check-in Rate</div>
          </div>
          <div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#10b981' }}>Instant</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>QR Ticket Pass Delivery</div>
          </div>
          <div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f59e0b' }}>256-Bit</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Encrypted Payments</div>
          </div>
        </div>

      </section>

      {/* Events Catalog Section */}
      <div id="events-section" style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>Upcoming Premier Experiences</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Filter by domain or search for specific speakers and locations</p>
          </div>
          <span className="badge badge-category" style={{ fontSize: '0.85rem' }}>
            {events.length} Events Available
          </span>
        </div>

        {/* Search & Category Chips */}
        <EventFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Loading / Events Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <Sparkles className="spin" size={32} color="#d4af37" style={{ marginBottom: '12px' }} />
            <p>Fetching scheduled experiences...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Calendar size={48} color="#71717a" style={{ marginBottom: '14px' }} />
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '6px' }}>No matching events found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Try adjusting your search keywords or switching category filters.
            </p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="btn btn-secondary btn-sm">
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {events.map((evt) => (
              <EventCard key={evt._id || evt.id} event={evt} onBookClick={handleBookTicketClick} />
            ))}
          </div>
        )}
      </div>

      {/* Premium Membership Banner */}
      <section className="glass-panel" style={{ padding: '40px', borderRadius: 'var(--radius-lg)', marginBottom: '60px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ maxWidth: '600px' }}>
          <span className="badge badge-upcoming" style={{ marginBottom: '10px' }}>EM VIP Membership</span>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', margin: '6px 0 10px' }}>Unlock Front-Row Seat Priority & Executive Concierge</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Join the EM VIP Pass program to receive early access to sold-out tech summits, private lounge passes, and zero booking service fees.
          </p>
        </div>
        <Link to="/pricing" className="btn btn-primary btn-lg">
          View Membership Plans <Crown size={18} />
        </Link>
      </section>

      {/* Testimonials */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: '30px' }}>
          Trusted By Industry Leaders
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            { quote: 'EM Event Management provided flawless QR entry scanning for our 5,000 attendee tech conference.', author: 'Elena Rostova', role: 'Executive Vice President, TechSummit Global' },
            { quote: 'The real-time seat availability map and instant digital PDF ticket downloads are second to none.', author: 'Marcus Vance', role: 'Director of Operations, Horizon Galas' },
            { quote: 'Luxury black and gold branding perfectly mirrors our VIP concierge experience.', author: 'Sophia Chen', role: 'Chief Event Strategist, Apex Fashion Week' }
          ].map((t, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} color="#d4af37" fill="#d4af37" />
                ))}
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', fontStyle: 'italic', marginBottom: '16px' }}>"{t.quote}"</p>
              <strong style={{ color: '#fef08a', display: 'block', fontSize: '0.95rem' }}>{t.author}</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-glass)' }}>
        <Mail size={36} color="#d4af37" style={{ marginBottom: '12px' }} />
        <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '8px' }}>Subscribe to Executive Event Digest</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
          Receive exclusive invitations to high-profile summits, early ticket releases, and VIP discount coupons.
        </p>

        <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', maxWidth: '460px', margin: '0 auto', gap: '10px' }}>
          <input
            type="email"
            className="form-input"
            placeholder="Enter your executive email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            Subscribe
          </button>
        </form>
      </section>

      {/* Ticket Checkout Modal */}
      {selectedEventForBooking && (
        <PaymentModal
          event={selectedEventForBooking}
          onClose={() => setSelectedEventForBooking(null)}
          onSuccess={() => {
            fetchData();
          }}
        />
      )}

    </div>
  );
}
