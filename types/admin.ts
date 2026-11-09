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
  pin: string;
}

export interface OTPPayload {
  email: string;
  otp: string;
}

export interface ChangePinPayload {
  oldPin: string;
  newPin: string;
}

export interface InitiateRecoveryPayload {
  email: string;
}

export interface ResetPinPayload {
  email: string;
  otp: string;
  newPin: string;
  confirmPin: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user_id: string;
  message: string;
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

export interface Zone {
  id: string;
  name: string;
  code: string;
  description: string;
  hubId: string;
  status: "DRAFT" | "ACTIVE" | "INACTIVE";
  baseDeliveryFee: number;
  estimatedDeliveryMinutes: number;
  boundary: Record<string, unknown>;
}

export interface CreateZonePayload {
  name: string;
  code: string;
  description: string;
  hubId: string;
  baseDeliveryFee: number;
  estimatedDeliveryMinutes: number;
  boundaryWkt: string;
}

export interface UpdateZonePayload {
  name: string;
  code: string;
  description: string;
  hubId: string;
  baseDeliveryFee: number;
  estimatedDeliveryMinutes: number;
  boundaryWkt: string;
}

export interface OpeningTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface Hub {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  status: "ACTIVE" | "INACTIVE";
  openingTime: OpeningTime;
  closingTime: OpeningTime;
}

export interface CreateHubPayload {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  /** Backend expects LocalTime as a "HH:mm:ss" string. */
  openingTime: string;
  closingTime: string;
}

export interface UpdateHubPayload {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  /** Backend expects LocalTime as a "HH:mm:ss" string. */
  openingTime: string;
  closingTime: string;
}

// ---------------------------------------------------------------------------
// Admin Drop Off Windows
// ---------------------------------------------------------------------------

export type DropWindowType = "BREAKFAST" | "LUNCH" | "DINNER" | "ALL_DAY";

export const DROP_WINDOW_TYPES: DropWindowType[] = [
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "ALL_DAY",
];

/** Date-only in "YYYY-MM-DD" (ISO), e.g. "2026-01-28". */
export interface ConfigureDropWindowRequest {
  date: string;
  /**
   * The delivery windows this period applies to.
   * Exactly the windows the admin selected via the chip selector.
   */
  windowTypes: DropWindowType[];
  /** Time From as 24-hour "HH:mm:ss" (converted from 12-hour AM/PM UI). */
  timeFrom: string;
  /** Time To as 24-hour "HH:mm:ss" (converted from 12-hour AM/PM UI). */
  timeTo: string;
}

export interface DropWindowResponse {
  id: string;
  date: string;
  windowType: DropWindowType;
  /** 24-hour "HH:mm:ss" from the backend. */
  timeFrom: string;
  /** 24-hour "HH:mm:ss" from the backend. */
  timeTo: string;
  status?: string;
}

