/**
 * Dedicated Public Events Catalog Page - EM Event Management
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import EventFilter from '../components/EventFilter';
import PaymentModal from '../components/PaymentModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Ticket, Sparkles, Calendar } from 'lucide-react';

export default function EventsPage() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date-asc');

  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);

  const fetchEvents = async () => {
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
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchQuery, selectedCategory, sortBy]);

  const handleBookTicketClick = (event) => {
    if (!isAuthenticated) {
      showToast('Please sign in to book event tickets', 'info');
      navigate('/login');
      return;
    }
    setSelectedEventForBooking(event);
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      <div className="glass-panel" style={{ padding: '30px', borderRadius: 'var(--radius-lg)', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Ticket color="#d4af37" size={24} />
          <h1 style={{ color: '#fff', fontSize: '1.8rem', margin: 0 }}>Explore Scheduled Experiences</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Browse available tech summits, fashion galas, music festivals, and corporate leadership forums.
        </p>
      </div>

      <EventFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <Sparkles className="spin" size={32} color="#d4af37" style={{ marginBottom: '12px' }} />
          <p>Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="glass-panel" style={{ padding: '50px 20px', textAlign: 'center' }}>
          <Calendar size={44} color="#71717a" style={{ marginBottom: '12px' }} />
          <h3 style={{ color: '#fff', fontSize: '1.15rem' }}>No matching events found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Try clearing filters or search terms.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {events.map((evt) => (
            <EventCard key={evt._id || evt.id} event={evt} onBookClick={handleBookTicketClick} />
          ))}
        </div>
      )}

      {selectedEventForBooking && (
        <PaymentModal
          event={selectedEventForBooking}
          onClose={() => setSelectedEventForBooking(null)}
          onSuccess={fetchEvents}
        />
      )}

    </div>
  );
}
