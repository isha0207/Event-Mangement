/**
 * Admin Event Modal Component
 * Modal form for creating new events or updating existing events in Admin Panel
 */

import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { X, Calendar, PlusCircle, Edit3 } from 'lucide-react';

export default function AdminEventModal({ eventToEdit, categories, onClose, onRefresh }) {
  const { showToast } = useToast();
  const isEditing = !!eventToEdit;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology & AI',
    date: '2026-09-20',
    time: '10:00 AM',
    location: '',
    city: 'New York',
    price: 99,
    totalSeats: 150,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    speakerName: '',
    speakerTitle: '',
    organizerName: 'Tech Events Global',
    organizerEmail: 'organizer@eventhub.com',
    featured: false
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title || '',
        description: eventToEdit.description || '',
        category: eventToEdit.category || 'Technology & AI',
        date: eventToEdit.date || '2026-09-20',
        time: eventToEdit.time || '10:00 AM',
        location: eventToEdit.location || '',
        city: eventToEdit.city || 'New York',
        price: eventToEdit.price || 0,
        totalSeats: eventToEdit.totalSeats || 100,
        image: eventToEdit.image || '',
        speakerName: eventToEdit.speaker?.name || '',
        speakerTitle: eventToEdit.speaker?.title || '',
        organizerName: eventToEdit.organizer?.name || 'Tech Events Global',
        organizerEmail: eventToEdit.organizer?.email || 'organizer@eventhub.com',
        featured: eventToEdit.featured || false
      });
    }
  }, [eventToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      city: formData.city,
      price: Number(formData.price),
      totalSeats: Number(formData.totalSeats),
      image: formData.image,
      featured: formData.featured,
      speaker: {
        name: formData.speakerName || 'Keynote Speaker',
        title: formData.speakerTitle || 'Guest Speaker'
      },
      organizer: {
        name: formData.organizerName,
        email: formData.organizerEmail
      }
    };

    try {
      if (isEditing) {
        await api.put(`/events/${eventToEdit._id || eventToEdit.id}`, payload);
        showToast('Event updated successfully', 'success');
      } else {
        await api.post('/events', payload);
        showToast('Event published successfully', 'success');
      }

      setSubmitting(false);
      onRefresh();
      onClose();
    } catch (err) {
      setSubmitting(false);
      showToast('Operation failed: ' + err.message, 'error');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '680px', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isEditing ? <Edit3 color="#38bdf8" size={20} /> : <PlusCircle color="#10b981" size={20} />}
            {isEditing ? 'Edit Event Details' : 'Create & Publish New Event'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Event Title *</label>
            <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required placeholder="e.g. AI & Robotics World Summit 2026" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                {categories.map((c) => (
                  <option key={c._id || c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price per Ticket ($)</label>
              <input type="number" name="price" className="form-input" value={formData.price} onChange={handleChange} min={0} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Date (YYYY-MM-DD)</label>
              <input type="date" name="date" className="form-input" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input type="text" name="time" className="form-input" value={formData.time} onChange={handleChange} required placeholder="09:00 AM" />
            </div>
            <div className="form-group">
              <label className="form-label">Total Seats Capacity</label>
              <input type="number" name="totalSeats" className="form-input" value={formData.totalSeats} onChange={handleChange} min={1} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Venue / Location Name</label>
              <input type="text" name="location" className="form-input" value={formData.location} onChange={handleChange} required placeholder="Grand Convention Center" />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" name="city" className="form-input" value={formData.city} onChange={handleChange} required placeholder="New York" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Banner Image URL</label>
            <input type="url" name="image" className="form-input" value={formData.image} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Description & Overview</label>
            <textarea name="description" className="form-textarea" rows={3} value={formData.description} onChange={handleChange} required placeholder="Provide comprehensive details about the event agendas..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Keynote Speaker Name</label>
              <input type="text" name="speakerName" className="form-input" value={formData.speakerName} onChange={handleChange} placeholder="Dr. Sarah Connor" />
            </div>
            <div className="form-group">
              <label className="form-label">Speaker Role / Title</label>
              <input type="text" name="speakerTitle" className="form-input" value={formData.speakerTitle} onChange={handleChange} placeholder="Head of AI Research" />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0 20px' }}>
            <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
            <label htmlFor="featured" style={{ color: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>Highlight as Featured Event on Homepage</label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving Event...' : isEditing ? 'Save Changes' : 'Create Event'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
