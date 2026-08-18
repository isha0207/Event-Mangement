/**
 * Event Card Component
 * Luxury Gold & Obsidian Black card design with live seat indicator & booking trigger
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Ticket, Tag, Sparkles } from 'lucide-react';

export default function EventCard({ event, onBookClick }) {
  const availableSeats = Math.max(0, event.totalSeats - (event.bookedSeats || 0));
  const isSoldOut = availableSeats === 0;

  return (
    <div className="glass-panel glass-panel-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Event Image Banner with Category Badge */}
      <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden' }}>
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />
        
        {/* Category Overlay Badge */}
        <span
          className="badge badge-category"
          style={{ position: 'absolute', top: '12px', left: '12px', backdropFilter: 'blur(8px)', background: 'rgba(9, 9, 11, 0.85)' }}
        >
          <Tag size={12} /> {event.category}
        </span>

        {/* Featured Tag */}
        {event.featured && (
          <span
            className="badge badge-upcoming"
            style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--gold-gradient)', color: '#09090b', fontWeight: 800 }}
          >
            <Sparkles size={12} /> Featured
          </span>
        )}
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Title */}
        <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: '#fff', marginBottom: '10px', lineHeight: 1.3 }}>
          {event.title}
        </h3>

        {/* Info Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={14} color="#d4af37" />
            <span>{event.date} • {event.time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} color="#f59e0b" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {event.location}, {event.city || 'NY'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={14} color="#10b981" />
            <span>{availableSeats} seats available of {event.totalSeats}</span>
          </div>
        </div>

        {/* Seat Availability Bar */}
        <div style={{ width: '100%', background: 'rgba(255,255,255,0.08)', height: '6px', borderRadius: '3px', marginBottom: '20px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${Math.min(100, Math.round(((event.bookedSeats || 0) / event.totalSeats) * 100))}%`,
              background: isSoldOut ? 'var(--danger)' : 'var(--gold-gradient)',
              height: '100%',
              borderRadius: '3px'
            }}
          />
        </div>

        {/* Card Footer: Price & CTA */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Ticket Price</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fef08a' }}>
              ${event.price}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to={`/events/${event._id || event.id}`} className="btn btn-secondary btn-sm">
              Details
            </Link>

            <button
              onClick={() => onBookClick && onBookClick(event)}
              className={`btn btn-sm ${isSoldOut ? 'btn-danger' : 'btn-primary'}`}
              disabled={isSoldOut}
            >
              <Ticket size={14} /> {isSoldOut ? 'Sold Out' : 'Book Ticket'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
