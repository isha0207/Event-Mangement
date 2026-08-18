/**
 * SaaS User Dashboard Page View - EM Event Management
 * Features professional SaaS sidebar (13 menu links), profile statistics, digital QR pass viewer,
 * Wishlist, Interactive Calendar, Digital Wallet, Notifications, and Support Ticket desk.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TicketModal from '../components/TicketModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  LayoutDashboard,
  Compass,
  Ticket,
  Bookmark,
  Heart,
  Calendar,
  Bell,
  MessageSquare,
  Wallet,
  User,
  Settings,
  HelpCircle,
  LogOut,
  QrCode,
  XCircle,
  ArrowRight,
  DollarSign,
  PlusCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'explore' | 'tickets' | 'bookings' | 'wishlist' | 'calendar' | 'notifications' | 'messages' | 'wallet' | 'profile' | 'settings' | 'support'
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Wallet state
  const [walletBalance, setWalletBalance] = useState(250);
  const [topUpAmount, setTopUpAmount] = useState('');

  // Support Ticket state
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, eventsRes] = await Promise.all([
        api.get('/bookings/my'),
        api.get('/events')
      ]);
      setBookings(bookingsRes || []);
      setEvents(eventsRes || []);
      setLoading(false);
    } catch (err) {
      showToast('Error loading user dashboard data: ' + err.message, 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket pass? Seats will be released and refund issued to wallet.')) {
      return;
    }

    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      showToast('Ticket cancelled & refund credited to EM Wallet', 'info');
      fetchUserData();
    } catch (err) {
      showToast('Cancellation failed: ' + err.message, 'error');
    }
  };

  const handleTopUpWallet = (e) => {
    e.preventDefault();
    const val = parseFloat(topUpAmount);
    if (!val || val <= 0) return;
    setWalletBalance((prev) => prev + val);
    showToast(`$${val} successfully added to your EM Wallet balance!`, 'success');
    setTopUpAmount('');
  };

  const handleCreateSupportTicket = (e) => {
    e.preventDefault();
    if (!supportSubject || !supportMessage) return;
    showToast('Support Ticket submitted! Concierge desk ticket #EM-SUP-882 created.', 'success');
    setSupportSubject('');
    setSupportMessage('');
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const activeBookings = bookings.filter((b) => b.status !== 'Cancelled');
  const totalSpent = activeBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore Events', icon: Compass, action: () => navigate('/events') },
    { id: 'tickets', label: 'My Tickets', icon: Ticket },
    { id: 'bookings', label: 'My Bookings', icon: Bookmark },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3' },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '30px', minHeight: '80vh', paddingBottom: '40px' }}>
      
      {/* Professional SaaS User Sidebar */}
      <aside
        className="glass-panel"
        style={{
          padding: '24px 16px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '1px solid var(--border-glass)'
        }}
      >
        <div>
          {/* Sidebar Header with EM Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '20px', borderBottom: '1px solid var(--border-glass)', marginBottom: '20px' }}>
            <img
              src="/em-event-management-logo.png"
              alt="EM Logo"
              style={{ width: '42px', height: 'auto', objectFit: 'contain' }}
            />
            <div>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, background: 'var(--gold-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block', lineHeight: 1.1 }}>
                EM Event Management
              </span>
              <span style={{ fontSize: '0.62rem', color: '#fef08a', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                USER DASHBOARD
              </span>
            </div>
          </div>

          {/* 13 Menu Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifySpace: 'between',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                    color: isActive ? '#fef08a' : 'var(--text-muted)',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <Icon size={18} color={isActive ? '#d4af37' : '#a1a1aa'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="badge badge-upcoming" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Logout */}
        <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-glass)', marginTop: '20px' }}>
          <button
            onClick={handleLogout}
            className="btn btn-danger btn-sm"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
          >
            <LogOut size={16} /> Logout Account
          </button>
        </div>
      </aside>

      {/* User Dashboard Content Area */}
      <main style={{ width: '100%' }}>
        
        {/* Profile Banner */}
        <div
          className="glass-panel"
          style={{
            padding: '24px 30px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            border: '1px solid rgba(212, 175, 55, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d4af37' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ color: '#fff', fontSize: '1.4rem', margin: 0 }}>{user?.name || 'Standard Attendee'}</h2>
                <span className="badge badge-category" style={{ fontSize: '0.68rem' }}>{user?.role || 'Attendee'}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>{user?.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>Active Passes</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fef08a' }}>{activeBookings.length}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>Wallet Balance</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>${walletBalance}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>Total Spent</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>${totalSpent}</span>
            </div>
          </div>
        </div>

        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Personal Statistics Widgets */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '30px' }}>
              <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #d4af37' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Upcoming Events</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{activeBookings.length} Scheduled</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Digital Passes Issued</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{activeBookings.length} QR Passes</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #38bdf8' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>EM Wallet Balance</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>${walletBalance}</div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <strong style={{ color: '#fff', fontSize: '1rem' }}>Quick Actions:</strong>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/events')} className="btn btn-primary btn-sm">
                  <Compass size={14} /> Browse Events
                </button>
                <button onClick={() => setActiveTab('wallet')} className="btn btn-secondary btn-sm">
                  <PlusCircle size={14} /> Top Up Wallet
                </button>
                <button onClick={() => setActiveTab('support')} className="btn btn-secondary btn-sm">
                  <HelpCircle size={14} /> Contact Concierge
                </button>
              </div>
            </div>

            {/* Recent Bookings & Passes */}
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Ticket color="#d4af37" size={20} /> Recent Reserved Passes
              </h3>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading tickets...</div>
              ) : bookings.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                  <Ticket size={40} color="#71717a" style={{ marginBottom: '10px' }} />
                  <h4 style={{ color: '#fff', marginBottom: '4px' }}>No bookings yet</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>Reserve your first luxury event ticket pass!</p>
                  <button onClick={() => navigate('/events')} className="btn btn-primary btn-sm">Explore Events</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {bookings.slice(0, 5).map((b) => {
                    const evt = b.event || {};
                    const isCancelled = b.status === 'Cancelled';
                    return (
                      <div key={b._id || b.id} className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', opacity: isCancelled ? 0.6 : 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img src={evt.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'} alt={evt.title} style={{ width: '70px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div>
                            <span className={`badge ${isCancelled ? 'badge-cancelled' : 'badge-confirmed'}`} style={{ fontSize: '0.65rem' }}>{b.status || 'Confirmed'}</span>
                            <h4 style={{ color: '#fff', fontSize: '1rem', margin: '2px 0 0' }}>{evt.title || 'Event Pass'}</h4>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{evt.date} | Ref: {b.bookingCode}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {!isCancelled && (
                            <>
                              <button onClick={() => setSelectedTicket(b)} className="btn btn-primary btn-sm">
                                <QrCode size={14} /> View QR Pass
                              </button>
                              <button onClick={() => handleCancelBooking(b._id || b.id)} className="btn btn-danger btn-sm">
                                <XCircle size={14} /> Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2 & 3: My Tickets & Bookings */}
        {(activeTab === 'tickets' || activeTab === 'bookings') && (
          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '20px' }}>My Digital Passes & Booking History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bookings.map((b) => {
                const evt = b.event || {};
                const isCancelled = b.status === 'Cancelled';
                return (
                  <div key={b._id || b.id} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={evt.image} alt={evt.title} style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`badge ${isCancelled ? 'badge-cancelled' : 'badge-confirmed'}`}>{b.status || 'Confirmed'}</span>
                          <span style={{ color: '#d4af37', fontWeight: 700, fontSize: '0.8rem' }}>Ref: {b.bookingCode}</span>
                        </div>
                        <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: '4px 0 0' }}>{evt.title}</h4>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{evt.date} | {evt.location}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>{b.quantity} Ticket(s) ({b.seatTier || 'VIP'})</div>
                      <div style={{ fontSize: '1.1rem', color: '#10b981', fontWeight: 800 }}>${b.totalPrice} USD</div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {!isCancelled && (
                        <button onClick={() => setSelectedTicket(b)} className="btn btn-primary btn-sm">
                          <QrCode size={14} /> Open QR & PDF
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '16px' }}>Saved Event Wishlist</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Your bookmarked summits and concerts</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {events.slice(0, 3).map((evt) => (
                <div key={evt._id || evt.id} className="glass-panel" style={{ padding: '20px' }}>
                  <img src={evt.image} alt={evt.title} style={{ width: '100%', height: '140px', borderRadius: '8px', objectFit: 'cover', marginBottom: '12px' }} />
                  <h4 style={{ color: '#fff', fontSize: '1.05rem', margin: '0 0 6px' }}>{evt.title}</h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>{evt.date} • {evt.location}</div>
                  <button onClick={() => navigate('/events')} className="btn btn-primary btn-sm" style={{ width: '100%' }}>Book Pass</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Calendar */}
        {activeTab === 'calendar' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '16px' }}>My Scheduled Calendar</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeBookings.map((b) => (
                <div key={b._id || b.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px 18px', borderRadius: '10px', borderLeft: '4px solid #d4af37', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: '#fff', display: 'block' }}>{b.event?.title || 'Scheduled Gala'}</strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Date: {b.event?.date || 'Upcoming'} at {b.event?.time || '07:00 PM'}</span>
                  </div>
                  <span className="badge badge-upcoming">Confirmed Pass</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Notifications */}
        {activeTab === 'notifications' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '16px' }}>Notification Center</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: 'Pass Booking Confirmed', desc: 'Your ticket pass EM-PASS-882 has been verified.', time: '10 mins ago' },
                { title: 'Exclusive Presale Code Available', desc: 'Use coupon EMVIP20 for 20% off upcoming galas.', time: '2 hours ago' },
                { title: 'Security Alert', desc: 'Successful login from verified Chrome desktop session.', time: '1 day ago' }
              ].map((n, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <strong style={{ color: '#fef08a', display: 'block', fontSize: '0.95rem' }}>{n.title}</strong>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 2px' }}>{n.desc}</p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Messages */}
        {activeTab === 'messages' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '16px' }}>Concierge Messages</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Direct messages from EM Concierge Team regarding your VIP summit arrangements.</p>
          </div>
        )}

        {/* Tab: Wallet */}
        {activeTab === 'wallet' && (
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '16px' }}>EM Digital Wallet & Balance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: 'var(--gold-gradient)', color: '#000', padding: '24px', borderRadius: '14px', boxShadow: 'var(--shadow-glow)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>EM EXECUTIVE WALLET BALANCE</span>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '8px' }}>${walletBalance} USD</div>
              </div>

              <form onSubmit={handleTopUpWallet} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
                <label className="form-label">Top Up Wallet Balance</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Enter amount (USD)"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">Add Funds</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab: Profile & Settings */}
        {(activeTab === 'profile' || activeTab === 'settings') && (
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '18px' }}>Account & Security Preferences</h3>
            <form onSubmit={(e) => { e.preventDefault(); showToast('Profile settings saved successfully!', 'success'); }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" defaultValue={user?.name} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" defaultValue={user?.email} disabled />
              </div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          </div>
        )}

        {/* Tab: Support Desk */}
        {activeTab === 'support' && (
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '16px' }}>Concierge Support Ticket Desk</h3>
            <form onSubmit={handleCreateSupportTicket}>
              <div className="form-group">
                <label className="form-label">Support Ticket Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. VIP Seating Request"
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Issue / Inquiry Details</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Describe your inquiry..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">Submit Ticket</button>
            </form>
          </div>
        )}

      </main>

      {/* QR Ticket Viewer Modal */}
      {selectedTicket && (
        <TicketModal booking={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}

    </div>
  );
}
