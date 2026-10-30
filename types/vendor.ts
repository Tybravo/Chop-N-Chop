export interface VendorProfile {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  /** Immutable account identity phone (from account.phone). Read-only. */
  phone: string;
  /** Editable vendor contact phone (from onboarding.contactPhone). */
  contactPhone?: string;
  businessAddress?: string;
  businessCategory?: string;
  businessDescription?: string;
  logoUrl?: string;
  vendorStatus: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  kycStatus: "NOT_SUBMITTED" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  kycCompleted: boolean;
  isStoreOnline: boolean;
  joinedAt: string;
}

export type VendorStatus = VendorProfile["vendorStatus"];
export type KycStatus = VendorProfile["kycStatus"];

export interface VendorStatusData {
  vendorStatus: VendorProfile["vendorStatus"];
  kycStatus: VendorProfile["kycStatus"];
  kycCompleted: boolean;
  isStoreOnline: boolean;
}

export interface PendingVendorApplication {
  vendorProfileId: string;
  businessName: string;
  email: string;
  contactPhone: string;
  hubId?: string;
  cacRegistrationNumber?: string;
  brand?: string;
  status: "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED" | "UNVERIFIED";
  kycStatus?: "NOT_SUBMITTED" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";
}

export interface MealComponent {
  id: string;
  ingredient: string;
  quantity: number;
  unit: string;
}

export interface Meal {
  id: string;
  vendorId: string;
  name: string;
  sku: string;
  price: number;
  description: string;
  components: MealComponent[];
  preparationTime: number; // in minutes
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
}

// ==========================================
// Vendor Catalog (Dishes) — backend model
// POST /api/v1/vendor/catalog/dishes
// ==========================================

/** Payload for creating a new dish (MVP) via the vendor catalog API. */
export interface CreateDishPayload {
  name: string;
  description: string;
  imageUrl: string;
  fixedPrice: number;
  vendorId: string;
  ingredientsList: string;
  preparationTime: string;
  servings: number;
  allergens: string[];
  tags: string[];
}

/**
 * Paginated response for GET /api/v1/vendor/catalog/dishes/
 * (Spring Page<T> shape — content/items + pagination metadata).
 */
export interface VendorDishPage {
  content: VendorDish[];
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/** Dish as returned by the backend after creation (and listing). */
export interface VendorDish {
  id: string;
  name: string;
  vendorId: string;
  description: string;
  imageUrl: string;
  fixedPrice: number;
  isSoldOut: boolean;
  vendorName: string;
  /** Remaining quantity/servings available for the current ordering window. */
  remainingQuantity: number;
  pickupWindow: string;
  ingredientsText: string;
  /** Stored as a plain-text line in the backend response. */
  preparationTime: string;
  servings: number;
  allergens: string[];
  tags: string[];
}

/** Vendor loan / order — unused legacy section */
export type OrderStatus = "PENDING" | "ACCEPTED" | "PREPARING" | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED" | "RETURNED";

export interface OrderItem {
  id: string;
  mealId: string;
  mealName: string;
  quantity: number;
  price: number;
}

export interface VendorOrder {
  id: string;
  vendorId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  deliverySlot: string;
  status: OrderStatus;
  createdAt: string;
}

export interface PayoutRecord {
  id: string;
  vendorId: string;
  amount: number;
  status: "COMPLETED" | "PENDING" | "FAILED";
  date: string;
  reference: string;
}

export interface KycRecord {
  id: string;
  vendorId: string;
  documentType: string;
  documentUrl: string;
  status: "VERIFIED" | "PENDING" | "REJECTED";
  submittedAt: string;
}

export interface SupportTicket {
  id: string;
  vendorId: string;
  subject: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
}

export interface VendorDashboardStats {
  totalOrders: number;
  acceptedOrders: number;
  dispatchedOrders: number;
  deliveredOrders: number;
  returnedOrders: number;
  totalEarnings: number;
  completedOrdersEarnings: number;
  availableBalance: number;
}

// ==========================================
// Vendor PIN Recovery (Forgot/Reset PIN)
// ==========================================
export interface InitiateVendorRecoveryPayload {
  email: string;
}

export interface VendorResetPinPayload {
  email: string;
  otp: string;
  newPin: string;
  confirmPin: string;
}

export interface ChangeVendorPinPayload {
  oldPin: string;
  newPin: string;
}

export interface VendorResetPinResponse {
  access_token?: string;
  refresh_token?: string;
  user_id?: string;
  message?: string;
  role?: string;
  status?: string;
  profilePictureUrl?: string;
  kycCompleted?: boolean;
  data?: {
    access_token?: string;
    refresh_token?: string;
    user_id?: string;
    role?: string;
    status?: string;
    profilePictureUrl?: string;
    kycCompleted?: boolean;
    message?: string;
    [key: string]: unknown;
  };
}