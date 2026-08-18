/**
 * SaaS Donut / Circular Pie Chart Component - EM Event Management
 * Features precise SVG arc rendering, interactive slice hover effects,
 * dynamic center metric totals, tooltips, and luxury black-and-gold styling.
 */

import React, { useState } from 'react';

export default function DonutChart({
  data = [
    { label: 'Technology', value: 437, percentage: 35, color: '#ffd700' },
    { label: 'Music', value: 312, percentage: 25, color: '#f59e0b' },
    { label: 'Business', value: 250, percentage: 20, color: '#fef08a' },
    { label: 'Fashion', value: 150, percentage: 12, color: '#b45309' },
    { label: 'Other', value: 99, percentage: 8, color: '#52525b' }
  ],
  totalValue = '1,248',
  totalLabel = 'TOTAL',
  subText = 'Bookings',
  size = 240,
  strokeWidth = 32
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, item: null });

  // Calculate total if not explicit
  const sumValues = data.reduce((acc, item) => acc + (item.value || 0), 0);
  const displayTotal = totalValue || sumValues.toLocaleString();

  // SVG dimensions
  const center = size / 2;
  const radius = (size - strokeWidth) / 2 - 8; // Leave room for hover expansion
  const innerRadius = radius - strokeWidth;

  // Convert slice angles to SVG path coordinates
  let currentAngle = -Math.PI / 2; // Start from top (12 o'clock)

  const slices = data.map((item, index) => {
    const percent = item.percentage || (sumValues > 0 ? (item.value / sumValues) * 100 : 0);
    const angleLength = (percent / 100) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angleLength;
    currentAngle = endAngle;

    // Outer & inner arc points
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const ix1 = center + innerRadius * Math.cos(startAngle);
    const iy1 = center + innerRadius * Math.sin(startAngle);
    const ix2 = center + innerRadius * Math.cos(endAngle);
    const iy2 = center + innerRadius * Math.sin(endAngle);

    const largeArc = angleLength > Math.PI ? 1 : 0;

    // SVG path string for annulus slice
    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
      'Z'
    ].join(' ');

    // Mid angle for hover offset displacement
    const midAngle = startAngle + angleLength / 2;
    const isHovered = hoveredIndex === index;
    const hoverOffset = isHovered ? 6 : 0;
    const dx = hoverOffset * Math.cos(midAngle);
    const dy = hoverOffset * Math.sin(midAngle);

    return {
      ...item,
      percentage: Math.round(percent),
      pathData,
      dx,
      dy,
      isHovered,
      index
    };
  });

  const handleMouseMove = (e, item) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
      item
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setTooltipPos((prev) => ({ ...prev, visible: false }));
  };

  const activeItem = hoveredIndex !== null ? slices[hoveredIndex] : null;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Chart Wrapper Container */}
      <div
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto'
        }}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ overflow: 'visible', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))' }}
        >
          <defs>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Donut Slices */}
          {slices.map((slice) => (
            <path
              key={slice.index}
              d={slice.pathData}
              fill={slice.color}
              stroke="#151515"
              strokeWidth="2.5"
              style={{
                transform: slice.isHovered
                  ? `translate(${slice.dx}px, ${slice.dy}px) scale(1.03)`
                  : 'translate(0px, 0px) scale(1)',
                transformOrigin: `${center}px ${center}px`,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                opacity: hoveredIndex !== null && !slice.isHovered ? 0.6 : 1,
                filter: slice.isHovered ? 'url(#goldGlow)' : 'none'
              }}
              onMouseEnter={() => setHoveredIndex(slice.index)}
              onMouseMove={(e) => handleMouseMove(e, slice)}
            />
          ))}
        </svg>

        {/* Center Text Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            textAlign: 'center',
            padding: '10px'
          }}
        >
          {activeItem ? (
            <>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: activeItem.color,
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                {activeItem.label}
              </span>
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.1,
                  margin: '2px 0'
                }}
              >
                {activeItem.percentage}%
              </span>
              <span style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 600 }}>
                {activeItem.value.toLocaleString()} {subText}
              </span>
            </>
          ) : (
            <>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#d4af37',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px'
                }}
              >
                {totalLabel}
              </span>
              <span
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 900,
                  background: 'linear-gradient(180deg, #ffffff 0%, #d4af37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1,
                  margin: '1px 0'
                }}
              >
                {displayTotal}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 700, letterSpacing: '0.5px' }}>
                {subText}
              </span>
            </>
          )}
        </div>

        {/* Interactive Floating Tooltip */}
        {tooltipPos.visible && tooltipPos.item && (
          <div
            style={{
              position: 'absolute',
              left: `${tooltipPos.x + 12}px`,
              top: `${tooltipPos.y - 32}px`,
              background: 'rgba(18, 18, 22, 0.95)',
              border: `1px solid ${tooltipPos.item.color}`,
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: 700,
              pointerEvents: 'none',
              boxShadow: '0 10px 20px rgba(0,0,0,0.8)',
              zIndex: 10,
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: tooltipPos.item.color
                }}
              />
              <span>{tooltipPos.item.label}:</span>
              <strong style={{ color: tooltipPos.item.color }}>
                {tooltipPos.item.percentage}% ({tooltipPos.item.value.toLocaleString()})
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Visible Legend Grid Below Donut Chart */}
      <div
        style={{
          width: '100%',
          marginTop: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px 16px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(212, 175, 55, 0.15)'
        }}
      >
        {slices.map((item) => (
          <div
            key={item.index}
            onMouseEnter={() => setHoveredIndex(item.index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              borderRadius: '6px',
              background: item.isHovered ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.02)',
              border: item.isHovered ? `1px solid ${item.color}` : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '3px',
                  background: item.color,
                  flexShrink: 0
                }}
              />
              <span
                style={{
                  fontSize: '0.82rem',
                  color: item.isHovered ? '#ffffff' : '#a1a1aa',
                  fontWeight: item.isHovered ? 700 : 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {item.label}
              </span>
            </div>

            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: item.color,
                marginLeft: '8px'
              }}
            >
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
