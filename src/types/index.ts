export interface PaginationMeta {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  pagination: PaginationMeta;
  data: T[];
}

export interface ApiSingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination: PaginationMeta;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  contact?: string;
  image?: string;
  verified: boolean;
  isVerified: boolean;
  createdAt: string;
  status: "active" | "delete";
}

export interface Influencer {
  _id: string;
  name: string;
  email: string;
  contact?: string;
  image?: string;
  discount: number;
  commission: number;
  verified: boolean;
  status: string;
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  thumbnail: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discount: number;
  amount: number;
  expiry: string;

  custom_code?: string;
  name?: string;
  max_use?: number;

  start_date?: string;
  end_date?: string;

  status: "active" | "puased" | "inactive";
  type?: "fixed" | "percentage";

  uses?: number;

  createdAt: string;
  updatedAt: string;
};

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  order: number;
  status: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  user: User;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface SupportMessage {
  _id: string;
  name: string;
  email: string;
  contact: string;
  subject: string;
  message: string;
  reply?: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
}

export interface Disclaimer {
  _id: string;
  type: 'terms' | 'privacy' | 'about' | 'work';
  content: string;
  updatedAt: string;
}

export interface Discount {
  _id: string;
  user_discount: number;
  description?: string;
  updatedAt: string;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

export interface NotificationResponse {
  unreadCount: number;
  data: Notification[];
}

export interface Notification {
  _id: string;
  title: string;
  receiver: string[];
  message: string;
  filePath: string;
  isRead: boolean;
  referenceId: string;
  readers: string[];
  createdAt: string;
  updatedAt: string;
};

export interface DashboardStats {
  totalUsers: number;
  totalInfluencers: number;
  totalRevenue: number;
  totalOrders: number;
  recentReviews: Review[];
  recentUsers: User[];
  recentSupport: SupportMessage[];
}

export type IDashboardStats = {
  totalUsers: number;
  totalInfuencer: number;
  totalRavinue: number;
  totalOrders: number;
};