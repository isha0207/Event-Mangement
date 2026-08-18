/**
 * Main Navigation Bar Component - EM Event Management
 * Features official transparent EM logo, clean public links (Home, Events, Categories, Pricing, About, Contact, Login, Sign Up),
 * and strict separation of User and Admin portals.
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Calendar,
  Ticket,
  User,
  LogOut,
  Sparkles,
  Layers,
  DollarSign,
  Info,
  Mail,
  Menu,
  X,
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Calendar },
    { name: 'Events', path: '/events', icon: Ticket },
    { name: 'Categories', path: '/categories', icon: Layers },
    { name: 'Pricing', path: '/pricing', icon: DollarSign },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <header
      className="glass-panel"
      style={{
        borderRadius: 0,
        borderTop: 0,
        borderLeft: 0,
        borderRight: 0,
        position: 'sticky',
        top: 0,
        zIndex: 900,
        background: isAdminRoute ? 'rgba(18, 18, 22, 0.96)' : 'rgba(9, 9, 11, 0.94)',
        borderBottom: isAdminRoute ? '1px solid #d4af37' : '1px solid var(--border-glass)'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between'
        }}
      >
        {/* Brand Logo & Name */}
        <Link
          to={isAdminRoute ? '/admin' : '/'}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <img
            src="/em-event-management-logo.png"
            alt="EM Event Management Logo"
            style={{
              width: '60px',
              height: 'auto',
              maxHeight: '48px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.35))'
            }}
          />
          <div>
            <span
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                background: 'var(--gold-text)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px',
                display: 'block',
                lineHeight: 1.1
              }}
            >
              EM Event Management
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '0.62rem',
                color: '#fef08a',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 700,
                marginTop: '2px'
              }}
            >
              {isAdminRoute ? 'Executive Admin Portal' : 'Luxury Event Passes & Summits'}
            </span>
          </div>
        </Link>

        {/* Desktop Center Navigation Links */}
        {!isAdminRoute ? (
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    color: isActive ? '#fef08a' : '#a1a1aa',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'var(--transition)',
                    borderBottom: isActive ? '2px solid #d4af37' : '2px solid transparent',
                    paddingBottom: '2px'
                  }}
                >
                  <Icon size={16} color={isActive ? '#d4af37' : '#a1a1aa'} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        ) : (
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link
              to="/admin"
              style={{
                color: '#fef08a',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LayoutDashboard size={16} color="#d4af37" /> Admin Dashboard
            </Link>
            <Link
              to="/"
              style={{
                color: '#a1a1aa',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Calendar size={16} /> Live Public Site
            </Link>
          </nav>
        )}

        {/* Right Actions & Authentication */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 12px 4px 6px', borderRadius: '30px', border: '1px solid var(--border-glass)' }}
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #d4af37' }}
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fafafa' }}>{user.name}</span>
                <span className={`badge ${isAdmin ? 'badge-upcoming' : 'badge-category'}`} style={{ fontSize: '0.65rem' }}>
                  {user.role}
                </span>
              </Link>

              <button onClick={handleLogout} className="btn btn-danger btn-sm" title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'none',
              padding: '6px'
            }}
          >
            {mobileMenuOpen ? <X size={24} color="#d4af37" /> : <Menu size={24} color="#d4af37" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#121216',
            borderTop: '1px solid var(--border-glass)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          {!isAdminRoute ? (
            navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: location.pathname === link.path ? '#fef08a' : '#a1a1aa',
                    textDecoration: 'none',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <Icon size={18} color={location.pathname === link.path ? '#d4af37' : '#a1a1aa'} />
                  {link.name}
                </Link>
              );
            })
          ) : (
            <>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#fef08a', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <LayoutDashboard size={18} color="#d4af37" /> Admin Dashboard
              </Link>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#a1a1aa', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <Calendar size={18} /> View Public Website
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
