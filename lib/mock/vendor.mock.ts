import { 
  VendorProfile, 
  Meal, 
  VendorOrder, 
  PayoutRecord, 
  KycRecord, 
  SupportTicket, 
  VendorDashboardStats 
} from "@/types/vendor";

export const mockVendorProfile: VendorProfile = {
  id: "vendor_1",
  businessName: "Chop N Chop Kitchen",
  ownerName: "John Doe",
  email: "vendor@chopnchop.com",
  phone: "+2348000000000",
  businessAddress: "123 Food Street, Lagos",
  businessCategory: "Restaurant",
  status: "APPROVED",
  isOpen: true,
  joinedAt: "2023-01-01T00:00:00Z",
};

export const mockVendorStats: VendorDashboardStats = {
  totalOrders: 150,
  acceptedOrders: 140,
  dispatchedOrders: 130,
  deliveredOrders: 125,
  returnedOrders: 5,
  totalEarnings: 500000,
  completedOrdersEarnings: 450000,
  availableBalance: 50000,
};

export const mockMeals: Meal[] = [
  {
    id: "meal_1",
    vendorId: "vendor_1",
    name: "Jollof Rice & Chicken",
    sku: "JRC-001",
    price: 3500,
    description: "Spicy Nigerian Jollof Rice with grilled chicken",
    preparationTime: 30,
    category: "Main Course",
    isAvailable: true,
    components: [
      { id: "comp_1", ingredient: "Rice", quantity: 2, unit: "cups" },
      { id: "comp_2", ingredient: "Chicken", quantity: 1, unit: "piece" },
    ],
  },
  {
    id: "meal_2",
    vendorId: "vendor_1",
    name: "Pounded Yam & Egusi",
    sku: "PYE-002",
    price: 4000,
    description: "Hot pounded yam with rich egusi soup",
    preparationTime: 45,
    category: "Main Course",
    isAvailable: true,
    components: [
      { id: "comp_3", ingredient: "Yam", quantity: 1, unit: "tuber" },
      { id: "comp_4", ingredient: "Egusi", quantity: 1, unit: "cup" },
    ],
  },
];

export const mockOrders: VendorOrder[] = [
  {
    id: "ord_1",
    vendorId: "vendor_1",
    customerName: "Alice Smith",
    items: [
      { id: "item_1", mealId: "meal_1", mealName: "Jollof Rice & Chicken", quantity: 2, price: 3500 }
    ],
    totalAmount: 7000,
    deliverySlot: "12:00 PM - 1:00 PM",
    status: "PENDING",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ord_2",
    vendorId: "vendor_1",
    customerName: "Bob Johnson",
    items: [
      { id: "item_2", mealId: "meal_2", mealName: "Pounded Yam & Egusi", quantity: 1, price: 4000 }
    ],
    totalAmount: 4000,
    deliverySlot: "1:00 PM - 2:00 PM",
    status: "PREPARING",
    createdAt: new Date().toISOString(),
  },
];

export const mockPayouts: PayoutRecord[] = [
  {
    id: "pay_1",
    vendorId: "vendor_1",
    amount: 100000,
    status: "COMPLETED",
    date: "2023-10-01T10:00:00Z",
    reference: "REF-12345",
  },
  {
    id: "pay_2",
    vendorId: "vendor_1",
    amount: 50000,
    status: "PENDING",
    date: "2023-10-15T10:00:00Z",
    reference: "REF-67890",
  },
];

export const mockKycRecords: KycRecord[] = [
  {
    id: "kyc_1",
    vendorId: "vendor_1",
    documentType: "Business License",
    documentUrl: "https://example.com/license.pdf",
    status: "VERIFIED",
    submittedAt: "2023-01-02T10:00:00Z",
  },
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: "ticket_1",
    vendorId: "vendor_1",
    subject: "Payment Delay",
    message: "I haven't received my last payout.",
    status: "RESOLVED",
    createdAt: "2023-09-01T10:00:00Z",
  },
];
