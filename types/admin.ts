export type AdminRole = "SUPER_ADMIN" | "SUB_ADMIN";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  createdAt: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface OTPPayload {
  email: string;
  otp: string;
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
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: Order[];
  dispatchStatus: DispatchRider[];
  issues: Issue[];
  performance: PerformanceStats;
  recentAdmins: AdminUser[];
}
