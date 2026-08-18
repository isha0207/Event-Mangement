/**
 * Event Filter Component
 * Search input field, category chips, and sort filters
 */

import React from 'react';
import { Search, Filter, Layers } from 'lucide-react';

export default function EventFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  sortBy,
  setSortBy
}) {
  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Search Input */}
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '42px' }}
            placeholder="Search events by title, description, speaker, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="#94a3b8" />
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Sort by:</span>
          <select className="form-select" style={{ width: 'auto', padding: '8px 14px' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-asc">Date (Upcoming First)</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
            <option value="popular">Popularity / Booked</option>
          </select>
        </div>

      </div>

      {/* Category Chips Bar */}
      <div style={{ marginTop: '16px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => setSelectedCategory('All')}
          className={`btn btn-sm ${selectedCategory === 'All' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: '20px' }}
        >
          <Layers size={14} /> All Categories
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat._id || cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px', whiteSpace: 'nowrap' }}
            >
              <span>{cat.icon || '🏷️'}</span> {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
