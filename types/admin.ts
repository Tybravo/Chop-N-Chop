export type AdminRole = "SUPER_ADMIN" | "ORG_ADMIN" | "ADMIN" | "SUB_ADMIN" | "OFFICE_STAFF" | "RIDER" | "CUSTOMER" | "VENDOR";

export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  preferredHubId: string;
  marketingOptIn: boolean;
  profilePictureUrl?: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  preferredHubId?: string;
  marketingOptIn?: boolean;
}

export interface AdminUser {
  id: string;
  name?: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  createdAt: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
  brand?: string;
}

export interface LoginPayload {
  emailOrUsername: string;
  password: string;
}

export interface OTPPayload {
  email: string;
  otp: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user_id: string;
  role: string;
  status: string;
  profilePictureUrl?: string;
}

export interface InviteAdminPayload {
  email: string;
  phone: string;
  assignedBrand: "CHOP_N_CHOP" | "DRIVE_THRU_AFIA" | "";
  role: "ADMIN" | "STAFF" | "VENDOR" | "RIDER" | "";
}

export interface InviteAdminResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface Order {
  id: string;
  customer: string;
  meal: string;
  qty: number;
  payment: 'Paid' | 'Pending';
  batch: string;
  destination: string;
  time: string;
}

export interface DispatchRider {
  id: string;
  name: string;
  batch: string;
  status: 'In Transit' | 'Awaiting Pickup' | 'Delayed';
  location: string;
  eta?: string;
  delay?: string;
  avatarUrl: string;
}

export interface Issue {
  id: string;
  type: 'success' | 'warning' | 'error';
  title: string;
  description: string;
}

export interface PerformanceStats {
  completedBatches: number;
  delayedBatches: number;
  onTimeRate: number;
  handoverSuccess: number;
}

export interface DashboardStats {
  totalOrders: number;
  ordersFromYesterday: number;
  paidOrders: number;
  pendingOrders: number;
  activeBatches: number;
  readyForPickup: number;
  totalRevenue: number;
  revenueFromYesterday: number;
  activeVendors: number;
  newVendors: number;
  activeRiders: number;
  newRiders: number;
  totalCustomers: number;
  newCustomers: number;
  pendingDeliveries: number;
  delayedDeliveries: number;
  rejectedDeliveries: number;
  rejectedThisWeek: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: Order[];
  dispatchStatus: DispatchRider[];
  issues: Issue[];
  performance: PerformanceStats;
  recentAdmins: AdminUser[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  status: "ACTIVE" | "INACTIVE";
  joinedAt: string;
}

export interface Vendor {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  rating: number;
  joinedAt: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
  date: string;
  paymentMethod: string;
}

