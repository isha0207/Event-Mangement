/**
 * Categories Page View - EM Event Management
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Layers, ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div className="glass-panel" style={{ padding: '30px', borderRadius: 'var(--radius-lg)', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Layers color="#d4af37" size={24} />
          <h1 style={{ color: '#fff', fontSize: '1.8rem', margin: 0 }}>Event Domains & Categories</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Explore curated categories spanning Technology Summits, Fashion Galas, Corporate Expos, and Music Festivals.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
        {categories.map((cat) => (
          <div
            key={cat._id || cat.name}
            className="glass-panel glass-panel-hover"
            style={{ padding: '24px', cursor: 'pointer' }}
            onClick={() => navigate(`/events?category=${encodeURIComponent(cat.name)}`)}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{cat.icon || '🏷️'}</div>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '6px' }}>{cat.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              {cat.description || 'Premier curated events and summits'}
            </p>
            <div style={{ color: '#d4af37', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Explore Domain <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
