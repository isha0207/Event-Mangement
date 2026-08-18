/**
 * Seed Data Utility
 * Extended dataset with Weddings, Music Concerts, Comedy Specials, Galas, Tech, and Business Summits
 */

const initialCategories = [
  { name: 'Weddings & Galas', icon: '💍', description: 'Destination weddings, luxury bridal showcases, royal galas' },
  { name: 'Concerts & Music Tours', icon: '🎤', description: 'Live stadium concerts, acoustic unplugged, electronic festivals' },
  { name: 'Comedy & Live Shows', icon: '🎭', description: 'Standup comedy specials, theater plays, magic shows' },
  { name: 'Technology & AI', icon: '💻', description: 'Tech summits, AI workshops, developer conferences' },
  { name: 'Business & VC Summit', icon: '🚀', description: 'Entrepreneurship panels, venture capital, executive networking' },
  { name: 'Food & Culinary', icon: '🍷', description: 'Gourmet food festivals, wine tasting, chef masterclasses' },
  { name: 'Arts & High Fashion', icon: '🎨', description: 'Fashion week runways, art exhibitions, film festivals' },
  { name: 'Sports & E-Sports', icon: '⚽', description: 'Marathons, gaming championships, fitness expos' }
];

const initialEvents = [
  {
    _id: '65c123456789abcdef000001',
    title: 'Royal Palace Destination Wedding & Bridal Expo',
    description: 'Experience the ultimate luxury wedding showcase inside a majestic heritage palace. Features top celebrity wedding planners, royal bridal jewelry couture, gourmet tasting menus, and live classical sangeet performances.',
    category: 'Weddings & Galas',
    date: '2026-11-20',
    time: '04:00 PM',
    location: 'Umaid Bhawan Heritage Palace Grounds',
    city: 'Udaipur',
    price: 199,
    totalSeats: 300,
    bookedSeats: 140,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    organizer: { name: 'Royal Wedding Crafts', email: 'events@royalweddings.com' },
    speaker: { name: 'Manish Malhotra', title: 'Couture Fashion Designer' },
    featured: true,
    status: 'Upcoming'
  },
  {
    _id: '65c123456789abcdef000002',
    title: 'Acoustic Unplugged & World Music Stadium Concert',
    description: 'An unforgettable 4-hour live stadium tour featuring international platinum pop & rock artists, acoustic violin duets, immersive 360-degree laser stages, and fireworks.',
    category: 'Concerts & Music Tours',
    date: '2026-10-15',
    time: '06:30 PM',
    location: 'Wembley National Stadium',
    city: 'London',
    price: 150,
    totalSeats: 2000,
    bookedSeats: 1650,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    organizer: { name: 'Live Nation Global', email: 'tickets@livenation.com' },
    speaker: { name: 'The Echoes Band', title: 'Grammy Award Winning Artists' },
    featured: true,
    status: 'Upcoming'
  },
  {
    _id: '65c123456789abcdef000003',
    title: 'Laughter Riot - Live Arena Standup Comedy Special',
    description: 'Prepare for non-stop laughter with top international standup comedians performing their newest uncensored comedy specials live on stage.',
    category: 'Comedy & Live Shows',
    date: '2026-09-30',
    time: '07:00 PM',
    location: 'Madison Square Garden Theater',
    city: 'New York',
    price: 75,
    totalSeats: 800,
    bookedSeats: 520,
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&auto=format&fit=crop&q=80',
    organizer: { name: 'Comedy Central Club', email: 'shows@comedycentral.com' },
    speaker: { name: 'Kevin Hart & Friends', title: 'Headliner Comedians' },
    featured: true,
    status: 'Upcoming'
  },
  {
    _id: '65c123456789abcdef000004',
    title: 'Global Wine Tasting & Michelin Chef Gala',
    description: 'Sample over 100 rare vintage wines paired with 7-course tasting menus prepared live by 3-Star Michelin Master Chefs.',
    category: 'Food & Culinary',
    date: '2026-10-28',
    time: '05:00 PM',
    location: 'Grand Waterfront Ballroom',
    city: 'Paris',
    price: 299,
    totalSeats: 150,
    bookedSeats: 88,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
    organizer: { name: 'Gourmet Guild International', email: 'vip@gourmetguild.fr' },
    speaker: { name: 'Chef Jean-Luc Ramsay', title: '3-Star Michelin Chef' },
    featured: true,
    status: 'Upcoming'
  },
  {
    _id: '65c123456789abcdef000005',
    title: 'Global AI & Future Tech Summit 2026',
    description: 'Join 3,000+ AI pioneers, robotics experts, and tech visionaries. Features interactive keynotes, generative AI hackathons, and exclusive VIP networking lounges.',
    category: 'Technology & AI',
    date: '2026-09-15',
    time: '09:00 AM',
    location: 'Metropolitan Convention Center',
    city: 'New York',
    price: 249,
    totalSeats: 400,
    bookedSeats: 115,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    organizer: { name: 'Silicon Nexus Labs', email: 'events@siliconnexus.io' },
    speaker: { name: 'Dr. Elena Rostova', title: 'VP of AI Research at NeuralTech' },
    featured: false,
    status: 'Upcoming'
  },
  {
    _id: '65c123456789abcdef000006',
    title: 'Venture Capital & Founders Expo 2026',
    description: 'Connect directly with angel investors, VC partners, and fast-growing startup founders. Speed pitching sessions, term-sheet workshops, and VIP lounge access.',
    category: 'Business & VC Summit',
    date: '2026-09-28',
    time: '10:00 AM',
    location: 'Grand Hyatt Financial Center',
    city: 'San Francisco',
    price: 350,
    totalSeats: 250,
    bookedSeats: 180,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
    organizer: { name: 'Founders Alliance', email: 'hello@foundersalliance.org' },
    speaker: { name: 'Marcus Vance', title: 'General Partner at Apex Ventures' },
    featured: false,
    status: 'Upcoming'
  },
  {
    _id: '65c123456789abcdef000007',
    title: 'Haute Couture & Luxury Fashion Week',
    description: 'Exclusive runway presentation showcasing autumn/winter collections from world-renowned luxury designers.',
    category: 'Arts & High Fashion',
    date: '2026-11-12',
    time: '06:00 PM',
    location: 'Le Palais de la Mode',
    city: 'Paris',
    price: 499,
    totalSeats: 150,
    bookedSeats: 64,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    organizer: { name: 'Parisian Fashion Guild', email: 'vip@parisfashion.fr' },
    speaker: { name: 'Claire Dubois', title: 'Senior Fashion Director' },
    featured: false,
    status: 'Upcoming'
  },
  {
    _id: '65c123456789abcdef000008',
    title: 'International E-Sports Championship Finals',
    description: 'Witness 16 world-class teams battle live on stage in a high-stakes $2,000,000 tournament with 4K stadium screens.',
    category: 'Sports & E-Sports',
    date: '2026-10-25',
    time: '02:00 PM',
    location: 'Cyber Arena Dome',
    city: 'Seoul',
    price: 85,
    totalSeats: 1500,
    bookedSeats: 890,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    organizer: { name: 'Global Gaming League', email: 'tickets@ggl.com' },
    speaker: { name: 'Alex "Viper" Zhang', title: 'World Champion Gamer' },
    featured: false,
    status: 'Upcoming'
  }
];

const initialUsers = [
  {
    _id: '65c123456789abcdef000010',
    name: 'System Super Admin',
    email: 'admin@eventhub.com',
    password: 'adminpassword123',
    role: 'admin',
    phone: '+1 555-0199',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    _id: '65c123456789abcdef000011',
    name: 'John Doe',
    email: 'user@eventhub.com',
    password: 'userpassword123',
    role: 'user',
    phone: '+1 555-0144',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

module.exports = {
  initialCategories,
  initialEvents,
  initialUsers
};
