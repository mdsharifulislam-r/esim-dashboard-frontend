import type {
  User,
  Influencer,
  Blog,
  Coupon,
  Review,
  SupportMessage,
  Faq,
  Notification,
  Discount,
  Disclaimer,
  AuthUser,
} from '@/types';

const today = new Date();
const daysAgo = (days: number) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const demoUsers: User[] = [
  {
    _id: 'user-1',
    name: 'Ava Carter',
    email: 'ava.carter@example.com',
    contact: '+1 415 555 0198',
    image: 'https://i.primage.cc/150?img=32',
    verified: false,
    isVerified: true,
    createdAt: daysAgo(3),
    status: 'active',
  },
  {
    _id: 'user-2',
    name: 'Noah Kim',
    email: 'noah.kim@example.com',
    contact: '+44 20 7946 0958',
    image: 'https://i.primage.cc/150?img=47',
    verified: false,
    isVerified: false,
    createdAt: daysAgo(7),
    status: 'active',
  },
  {
    _id: 'user-3',
    name: 'Mia Thompson',
    email: 'mia.thompson@example.com',
    contact: '+61 2 9374 4000',
    image: 'https://i.primage.cc/150?img=12',
    verified: true,
    isVerified: true,
    createdAt: daysAgo(15),
    status: 'delete',
  },
  {
    _id: 'user-4',
    name: 'Liam Patel',
    email: 'liam.patel@example.com',
    contact: '+49 30 901820',
    image: 'https://i.primage.cc/150?img=7',
    verified: false,
    isVerified: true,
    createdAt: daysAgo(1),
    status: 'active',
  },
];

export const demoInfluencers: Influencer[] = [
  {
    _id: 'influencer-1',
    name: 'Sofia Green',
    email: 'sofia.green@example.com',
    contact: '+1 305 555 0143',
    image: 'https://i.primage.cc/150?img=65',
    discount: 15,
    commission: 12,
    verified: false,
    status: 'active',
    createdAt: daysAgo(10),
  },
  {
    _id: 'influencer-2',
    name: 'Ethan Hall',
    email: 'ethan.hall@example.com',
    contact: '+33 1 42 68 53 00',
    image: 'https://i.primage.cc/150?img=5',
    discount: 20,
    commission: 10,
    verified: false,
    status: 'active',
    createdAt: daysAgo(18),
  },
  {
    _id: 'influencer-3',
    name: 'Chloe Rivera',
    email: 'chloe.rivera@example.com',
    contact: '+34 91 123 4567',
    image: 'https://i.primage.cc/150?img=22',
    discount: 12,
    commission: 8,
    verified: true,
    status: 'blocked',
    createdAt: daysAgo(28),
  },
];

export const demoBlogs: Blog[] = [
  {
    _id: 'blog-1',
    title: 'How to activate your eSIM in 5 minutes',
    thumbnail: 'https://via.placeholder.com/100x70?text=ESIM',
    content: '<p>Learn the easiest way to activate your eSIM while travelling abroad.</p>',
    status: 'published',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(4),
  },
  {
    _id: 'blog-2',
    title: 'Top 10 destinations with the best data plans',
    thumbnail: 'https://via.placeholder.com/100x70?text=Travel',
    content: '<p>Discover the best eSIM plans for Europe, Asia and the Americas.</p>',
    status: 'draft',
    createdAt: daysAgo(12),
    updatedAt: daysAgo(12),
  },
  {
    _id: 'blog-3',
    title: 'Avoid roaming charges with a local eSIM',
    thumbnail: 'https://via.placeholder.com/100x70?text=Roaming',
    content: '<p>See how an eSIM can help you stay connected without expensive roaming fees.</p>',
    status: 'published',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(19),
  },
];



export const demoReviews: Review[] = [
  {
    _id: 'review-1',
    user: demoUsers[0],
    rating: 5,
    comment: 'Fast activation and excellent coverage everywhere I travelled.',
    status: 'approved',
    createdAt: daysAgo(2),
  },
  {
    _id: 'review-2',
    user: demoUsers[1],
    rating: 4,
    comment: 'Great service, but the onboarding instructions could be clearer.',
    status: 'pending',
    createdAt: daysAgo(8),
  },
  {
    _id: 'review-3',
    user: demoUsers[2],
    rating: 3,
    comment: 'Good value, though connection dropped once in Spain.',
    status: 'approved',
    createdAt: daysAgo(15),
  },
];

export const demoSupportMessages: any[] = [
  {
    _id: 'support-1',
    user: demoUsers[0],
    subject: 'Unable to activate my eSIM',
    message: 'The QR code scan did not work. I need help activating my plan before tomorrow.',
    reply: 'Please try restarting your contact and scanning again. If it still fails, we will resend a new QR code.',
    status: 'open',
    createdAt: daysAgo(2),
  },
  {
    _id: 'support-2',
    user: demoUsers[1],
    subject: 'Request refund for unused data',
    message: 'I purchased the wrong plan by mistake and would like a refund.',
    reply: 'Refund request received. We will review your order and follow up within 24 hours.',
    status: 'in-progress',
    createdAt: daysAgo(9),
  },
  {
    _id: 'support-3',
    user: demoUsers[3],
    subject: 'Coverage issue in Berlin',
    message: 'My eSIM stopped working after I landed in Berlin. Can you check the plan?',
    status: 'resolved',
    createdAt: daysAgo(20),
  },
];

export const demoFaqs: Faq[] = [
  {
    _id: 'faq-1',
    question: 'How do I activate an eSIM?',
    answer: 'Scan the provided QR code in your contact settings and follow the activation steps. Make sure your device supports eSIM.',
    order: 1,
    status: 'active',
    createdAt: daysAgo(12),
  },
  {
    _id: 'faq-2',
    question: 'Can I use the eSIM in multiple countries?',
    answer: 'Yes. Many of our plans support multiple destinations with global coverage options.',
    order: 2,
    status: 'active',
    createdAt: daysAgo(16),
  },
  {
    _id: 'faq-3',
    question: 'What is the refund policy?',
    answer: 'Refunds are processed within 7 business days for unused plans and subject to our terms.',
    order: 3,
    status: 'active',
    createdAt: daysAgo(30),
  },
];



export const demoDiscount: Discount = {
  _id: 'discount-1',
  user_discount: 15,
  description: 'Limited time offer for new users across all global plans.',
  updatedAt: daysAgo(1),
};

export const demoDisclaimer: Record<string, Disclaimer> = {
  terms: {
    _id: 'terms-1',
    type: 'terms',
    content: '<h2>Terms & Conditions</h2><p>Use of this platform is subject to our terms and conditions.</p>',
    updatedAt: daysAgo(2),
  },
  privacy: {
    _id: 'privacy-1',
    type: 'privacy',
    content: '<h2>Privacy Policy</h2><p>Your data is handled securely and responsibly.</p>',
    updatedAt: daysAgo(2),
  },
  about: {
    _id: 'about-1',
    type: 'about',
    content: '<h2>About Us</h2><p>We provide seamless eSIM experiences for travelers worldwide.</p>',
    updatedAt: daysAgo(2),
  },
  work: {
    _id: 'work-1',
    type: 'work',
    content: '<h2>How It Works</h2><p>Select a plan, activate your eSIM instantly, and enjoy global connectivity.</p>',
    updatedAt: daysAgo(2),
  },
};

export const demoAuthUser: AuthUser = {
  _id: 'admin-1',
  name: 'Admin User',
  email: 'admin@example.com',
  image: 'https://i.primage.cc/150?img=3',
  role: 'Super Admin',
};

export const demoDashboardStats = [
  { label: 'Total Users', value: '12,847', icon: 'UserOutlined', color: '#009A54', bg: '#e6f7ef', change: '+12%' },
  { label: 'Influencers', value: '284', icon: 'TeamOutlined', color: '#6366f1', bg: '#eef2ff', change: '+8%' },
  { label: 'Total Revenue', value: '$94,230', icon: 'DollarOutlined', color: '#f59e0b', bg: '#fffbeb', change: '+23%' },
  { label: 'Total Orders', value: '38,492', icon: 'ShoppingOutlined', color: '#ef4444', bg: '#fef2f2', change: '+5%' },
] as const;

export const demoDashboardReviews = demoReviews;
export const demoDashboardUsers = demoUsers;
export const demoDashboardSupport = demoSupportMessages;
