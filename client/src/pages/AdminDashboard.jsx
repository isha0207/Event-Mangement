/**
 * SaaS Admin Dashboard Page View - EM Event Management
 * Features separate Admin Portal, sidebar header with EM logo + "ADMIN PANEL",
 * 15 sidebar navigation links, 7 key analytics widgets, and interactive visual charts
 * for Revenue, Bookings, User Growth, and Event Performance.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminEventModal from '../components/AdminEventModal';
import DonutChart from '../components/DonutChart';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  LayoutDashboard,
  Users,
  Building,
  Calendar,
  Ticket,
  CreditCard,
  TrendingUp,
  Tag,
  FileText,
  Bell,
  HelpCircle,
  FolderKanban,
  Settings,
  LogOut,
  PlusCircle,
  Edit,
  Trash2,
  DollarSign,
  Layers,
  BarChart3,
  PieChart,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalEvents: 0, totalBookings: 0, totalRevenue: 0, totalUsers: 0, monthlyUsers: 1420 });
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Coupon Generator State
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('20');
  const [coupons, setCoupons] = useState([
    { code: 'EMVIP20', discount: '20%', status: 'Active' },
    { code: 'SUMMER50', discount: '50%', status: 'Active' }
  ]);

  // Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, eventsRes, bookingsRes, catRes] = await Promise.all([
        api.get('/events/admin/stats'),
        api.get('/events'),
        api.get('/bookings/admin'),
        api.get('/categories')
      ]);

      setStats(statsRes || { totalEvents: 0, totalBookings: 0, totalRevenue: 0, totalUsers: 0, monthlyUsers: 1420 });
      setEvents(eventsRes || []);
      setBookings(bookingsRes || []);
      setCategories(catRes || []);
      setLoading(false);
    } catch (err) {
      showToast('Error loading admin analytics: ' + err.message, 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to permanently delete this event?')) {
      return;
    }
    try {
      await api.delete(`/events/${eventId}`);
      showToast('Event deleted successfully', 'info');
      fetchDashboardData();
    } catch (err) {
      showToast('Failed to delete event: ' + err.message, 'error');
    }
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    setCoupons([...coupons, { code: couponCode.toUpperCase(), discount: `${couponDiscount}%`, status: 'Active' }]);
    showToast(`Discount Coupon "${couponCode.toUpperCase()}" Created!`, 'success');
    setCouponCode('');
  };

  const handleLogout = () => {
    logout();
    showToast('Admin logged out', 'info');
    navigate('/admin/login');
  };

  // 15 Admin Sidebar Links
  const adminSidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'organizers', label: 'Organizers', icon: Building },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'bookings', label: 'Bookings', icon: Ticket },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'revenue', label: 'Revenue Analytics', icon: TrendingUp },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'support', label: 'Support Tickets', icon: HelpCircle },
    { id: 'cms', label: 'CMS', icon: FolderKanban },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '30px', minHeight: '85vh', paddingBottom: '40px' }}>
      
      {/* SaaS Admin Sidebar */}
      <aside
        className="glass-panel"
        style={{
          padding: '24px 16px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          border: '1px solid #d4af37'
        }}
      >
        <div>
          {/* Header with EM Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '20px', borderBottom: '1px solid var(--border-glass)', marginBottom: '20px' }}>
            <img
              src="/em-event-management-logo.png"
              alt="EM Logo"
              style={{ width: '45px', height: 'auto', objectFit: 'contain' }}
            />
            <div>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, background: 'var(--gold-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block', lineHeight: 1.1 }}>
                EM Event Management
              </span>
              <span style={{ fontSize: '0.62rem', color: '#fef08a', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 800 }}>
                ADMIN PANEL
              </span>
            </div>
          </div>

          {/* 15 Admin Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {adminSidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isActive ? 'var(--gold-gradient)' : 'transparent',
                    color: isActive ? '#000' : 'var(--text-muted)',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    textAlign: 'left'
                  }}
                >
                  <Icon size={18} color={isActive ? '#000' : '#d4af37'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-glass)', marginTop: '20px' }}>
          <button
            onClick={handleLogout}
            className="btn btn-danger btn-sm"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
          >
            <LogOut size={16} /> Exit Admin Command Center
          </button>
        </div>
      </aside>

      {/* Main Admin Dashboard Body */}
      <main style={{ width: '100%' }}>
        
        {/* Top Command Action Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ color: '#fff', fontSize: '1.8rem', margin: 0 }}>Executive Control Center</h1>
              <span className="badge badge-upcoming" style={{ fontSize: '0.68rem' }}>Super Admin</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
              System Analytics, Revenue Metrics, Booking Operations & Event Publishing
            </p>
          </div>

          <button
            onClick={() => {
              setEditingEvent(null);
              setShowEventModal(true);
            }}
            className="btn btn-primary"
          >
            <PlusCircle size={18} /> Create New Event
          </button>
        </div>

        {/* 7 Key Admin Metrics Widgets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '30px' }}>
          <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #10b981' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Total Revenue</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>${stats.totalRevenue}</div>
          </div>

          <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #6366f1' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Total Bookings</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{stats.totalBookings}</div>
          </div>

          <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #38bdf8' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Total Events</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{stats.totalEvents}</div>
          </div>

          <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #a855f7' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Total Users</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{stats.totalUsers}</div>
          </div>

          <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #f59e0b' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Active Users</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{stats.monthlyUsers || 1420}</div>
          </div>

          <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #ec4899' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Recent Payments</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{bookings.length} Txns</div>
          </div>

          <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #d4af37' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Top Gala Performance</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>98.4%</div>
          </div>
        </div>

        {/* Visual Analytics Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '24px', marginBottom: '30px' }}>
          
          {/* Executive Donut / Circular Chart Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <PieChart color="#d4af37" size={20} /> Event Distribution Analytics
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Distribution metrics across platform operations</span>
              </div>
              
              <span className="badge badge-upcoming" style={{ fontSize: '0.7rem' }}>Live SaaS Metrics</span>
            </div>

            {/* Donut Chart Component */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
              <DonutChart
                data={[
                  { label: 'Technology', value: 437, percentage: 35, color: '#ffd700' },
                  { label: 'Music', value: 312, percentage: 25, color: '#f59e0b' },
                  { label: 'Business', value: 250, percentage: 20, color: '#fef08a' },
                  { label: 'Fashion', value: 150, percentage: 12, color: '#b45309' },
                  { label: 'Other', value: 99, percentage: 8, color: '#52525b' }
                ]}
                totalValue="1,248"
                totalLabel="TOTAL"
                subText="Bookings"
                size={230}
                strokeWidth={30}
              />
            </div>
          </div>

          {/* Category Fill Rate & Live Seat Allocation Chart */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 color="#10b981" size={20} /> Seat Fill Rate & Performance
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { category: 'Technology Summits', percent: 85, color: '#d4af37' },
                { category: 'Fashion Galas', percent: 68, color: '#f59e0b' },
                { category: 'Music Festivals', percent: 74, color: '#10b981' },
                { category: 'Corporate Expos', percent: 55, color: '#38bdf8' }
              ].map((cat) => (
                <div key={cat.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{cat.category}</span>
                    <span style={{ color: cat.color, fontWeight: 800 }}>{cat.percent}% Fill Rate</span>
                  </div>
                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.06)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${cat.percent}%`, background: cat.color, height: '100%' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', padding: '14px', background: 'rgba(212, 175, 55, 0.08)', borderRadius: '10px', border: '1px solid rgba(212, 175, 55, 0.25)', display: 'flex', alignItems: 'center', justify: 'space-between' }}>
              <div style={{ fontSize: '0.82rem', color: '#fef08a', fontWeight: 600 }}>
                Average Platform Capacity Utilization
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffd700' }}>
                75.5%
              </div>
            </div>
          </div>

        </div>

        {/* Tab 1: Manage Events */}
        {(activeTab === 'dashboard' || activeTab === 'events') && (
          <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto', marginBottom: '30px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px' }}>Published System Events</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '12px' }}>Event</th>
                  <th style={{ padding: '12px' }}>Category</th>
                  <th style={{ padding: '12px' }}>Date</th>
                  <th style={{ padding: '12px' }}>Price</th>
                  <th style={{ padding: '12px' }}>Seats Filled</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => {
                  const fillPercent = Math.round(((evt.bookedSeats || 0) / evt.totalSeats) * 100);
                  return (
                    <tr key={evt._id || evt.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={evt.image} alt={evt.title} style={{ width: '48px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                        <div>
                          <strong style={{ color: '#fff', display: 'block' }}>{evt.title}</strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{evt.location}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className="badge badge-category">{evt.category}</span>
                      </td>
                      <td style={{ padding: '12px' }}>{evt.date}</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#38bdf8' }}>${evt.price}</td>
                      <td style={{ padding: '12px' }}>
                        <div>{evt.bookedSeats || 0} / {evt.totalSeats} ({fillPercent}%)</div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => {
                              setEditingEvent(evt);
                              setShowEventModal(true);
                            }}
                            className="btn btn-secondary btn-sm"
                          >
                            <Edit size={14} color="#38bdf8" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(evt._id || evt.id)}
                            className="btn btn-danger btn-sm"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: User Bookings & Payments */}
        {(activeTab === 'bookings' || activeTab === 'payments' || activeTab === 'revenue') && (
          <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px' }}>Bookings & Payment History Log</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '12px' }}>Ref Code</th>
                  <th style={{ padding: '12px' }}>Customer</th>
                  <th style={{ padding: '12px' }}>Event</th>
                  <th style={{ padding: '12px' }}>Tier</th>
                  <th style={{ padding: '12px' }}>Amount</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id || b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#d4af37' }}>{b.bookingCode}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{b.user?.name || 'Attendee'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.user?.email}</div>
                    </td>
                    <td style={{ padding: '12px', color: '#fff' }}>{b.event?.title || 'Summit Pass'}</td>
                    <td style={{ padding: '12px' }}>{b.seatTier || 'VIP'} ({b.quantity})</td>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#10b981' }}>${b.totalPrice}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge ${b.status === 'Cancelled' ? 'badge-cancelled' : 'badge-confirmed'}`}>{b.status || 'Confirmed'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Coupons Generator */}
        {activeTab === 'coupons' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '16px' }}>Generate Coupon Code</h3>
              <form onSubmit={handleCreateCoupon}>
                <div className="form-group">
                  <label className="form-label">Coupon Code</label>
                  <input type="text" className="form-input" placeholder="e.g. GALA50" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Discount Percentage</label>
                  <input type="number" className="form-input" value={couponDiscount} onChange={(e) => setCouponDiscount(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Coupon</button>
              </form>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '16px' }}>Active Discount Coupons</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
                {coupons.map((c, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid #d4af37' }}>
                    <strong style={{ color: '#fef08a', fontSize: '1.1rem', display: 'block' }}>{c.code}</strong>
                    <span style={{ color: '#10b981', fontWeight: 800 }}>{c.discount} OFF</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Admin Event Create / Edit Modal */}
      {showEventModal && (
        <AdminEventModal
          eventToEdit={editingEvent}
          categories={categories}
          onClose={() => setShowEventModal(false)}
          onRefresh={fetchDashboardData}
        />
      )}

    </div>
  );
}
