export interface VendorProfile {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessAddress?: string;
  businessCategory?: string;
  logoUrl?: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "UNVERIFIED";
  isOpen: boolean;
  joinedAt: string;
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
