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

export interface PricingRules {
  _id: string;
  margin_price: number;
  tax_percent: number;
  name: string;
  type: 'country' | 'region' | 'global';
  createdAt?: string;
  updatedAt?: string;
}

export type PricingRulePayload = {
  margin_price: number;
  name: string;
  type: 'country' | 'region' | 'global';
  tax_percent?: number;
};

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

export interface Banner {
  _id: string;
  text: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ImageBanner {
  _id: string;
  thumbnail: string;
  title: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Newsletter {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  contact?: string;
}

export interface OrderSim {
  id: number;
  created_at: string;
  iccid: string;
  lpa: string;
  matching_id: string;
  qrcode: string;
  qrcode_url: string;
  apn_type: string;
  apn_value: string | null;
  is_roaming: boolean;
  direct_apple_installation_url?: string;
  apn?: {
    ios: { apn_type: string; apn_value: string | null };
    android: { apn_type: string; apn_value: string | null };
  };
}

export interface OrderSupportedCountry {
  country_code: string;
  title: string;
  image?: { width: number; height: number; url: string };
}

export interface OrderOperatorInfo {
  country_code: string;
  name: string;
  image?: string;
}

export interface Order {
  _id: string;
  orderId?: string;
  packageId: string;
  package_name: string;
  id: number;
  code: string;
  type: string;
  country: string;
  quantity: number;
  user: string | OrderUser;
  validity: number;
  data: string;
  text?: string | null;
  voice?: string | null;
  price: number;
  net_price: number;
  startDate: string;
  endDate?: string;
  status: string;
  manual_installation?: string;
  qr_installation?: string;
  installation_guides?: string;
  sims: OrderSim[];
  supported_countries: OrderSupportedCountry[];
  oparator_info?: OrderOperatorInfo;
  system_commission?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderRealTimeUses {
  remaining: number;
  total: number;
  expired_at: string;
  is_unlimited: boolean;
  status: string;
  remaining_voice: number;
  remaining_text: number;
  total_voice: number;
  total_text: number;
}

export interface OrderGuidelineSteps {
  [key: string]: string;
}

export interface OrderInstallationGuide {
  steps: OrderGuidelineSteps;
  qr_code_data?: string;
  qr_code_url?: string;
  smdp_address_and_activation_code?: string;
  smdp_address?: string;
  activation_code?: string;
}

export interface OrderNetworkSetup {
  steps: OrderGuidelineSteps;
  apn_type: string;
  apn_value: string | null;
  is_roaming: boolean;
}

export interface OrderPlatformGuideline {
  model: string | null;
  version: string | null;
  direct_apple_installation_url?: string;
  installation_via_qr_code: OrderInstallationGuide;
  installation_manual: OrderInstallationGuide;
  network_setup: OrderNetworkSetup;
}

export interface OrderGuidelines {
  language: string;
  ios: OrderPlatformGuideline[];
  android: OrderPlatformGuideline[];
}

export interface OrderDetails {
  order: Order;
  realTimeUses?: OrderRealTimeUses;
  guidelines?: OrderGuidelines;
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  image: string;
  status: 'active' | 'inactive' | 'delete';
  verified: boolean;
  age: number | null;
  date_of_birth: string | null;
  gender: string | null;
  country: string;
  cover: string;
  contact: string;
  discount: number;
  commission: number;
  ref_referral_code: string | null;
  refferal_code: string;
  createdAt: string;
  updatedAt: string;
}