import { AdminUser, DashboardData, Order, DispatchRider, Issue, Customer, Vendor, Transaction } from "@/types/admin";

export const MOCK_ADMINS: AdminUser[] = [
  {
    id: "admin_01",
    name: "Super Admin",
    email: "super@chopnchop.com",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    createdAt: "2024-01-01T00:00:00Z",
    avatarUrl: "https://i.pravatar.cc/150?u=super",
  },
  {
    id: "admin_02",
    name: "Sub Admin",
    email: "sub@chopnchop.com",
    role: "SUB_ADMIN",
    status: "ACTIVE",
    createdAt: "2024-02-01T00:00:00Z",
    avatarUrl: "https://i.pravatar.cc/150?u=sub",
  },
];

const MOCK_RECENT_ORDERS: Order[] = [
  { id: "DD-1020", customer: "Lisa Wong", meal: "Jollof rice", qty: 1, payment: "Paid", batch: "Batch #3", destination: "Lekki Office", time: "10:45 AM" },
  { id: "DD-1021", customer: "Ahamed Bello", meal: "Veggie stir", qty: 2, payment: "Pending", batch: "Batch #4", destination: "Ikeja Hub", time: "11:45 AM" },
  { id: "DD-1022", customer: "Sarah Ade", meal: "Jollof rice", qty: 4, payment: "Pending", batch: "Batch #5", destination: "Yaba Tech", time: "12:15 PM" },
  { id: "DD-1023", customer: "John Smith", meal: "Spaghetti", qty: 1, payment: "Paid", batch: "Batch #6", destination: "VI Office", time: "15:15 PM" },
  { id: "DD-1024", customer: "Chinedu Eze", meal: "Yamarita", qty: 5, payment: "Paid", batch: "Batch #7", destination: "Gbagba Hub", time: "16:35 PM" },
  { id: "DD-1025", customer: "Minella Rose", meal: "Spaghetti", qty: 1, payment: "Paid", batch: "Batch #8", destination: "VI office", time: "17:50 PM" },
  { id: "DD-1026", customer: "Sarah Ade", meal: "Jollof rice", qty: 4, payment: "Pending", batch: "Batch #5", destination: "Yaba Tech", time: "12:15 PM" },
];

const MOCK_DISPATCH_STATUS: DispatchRider[] = [
  { id: "r1", name: "Peter", batch: "Batch #104", status: "In Transit", location: "Lekki Hub", eta: "12:30 PM", avatarUrl: "https://i.pravatar.cc/150?u=peter" },
  { id: "r2", name: "Tunde", batch: "Batch #105", status: "Awaiting Pickup", location: "Yaba", avatarUrl: "https://i.pravatar.cc/150?u=tunde" },
  { id: "r3", name: "Amaka", batch: "Batch #106", status: "Delayed", location: "VI Office", delay: "+6 min", avatarUrl: "https://i.pravatar.cc/150?u=amaka" },
  { id: "r4", name: "Osinachi", batch: "Batch #107", status: "Delayed", location: "Ikeja Hub", delay: "+8 min", avatarUrl: "https://i.pravatar.cc/150?u=osinachi" },
];

const MOCK_ISSUES: Issue[] = [
  { id: "i1", type: "success", title: "Batch #7 is marked ready for pickup", description: "Kitchen updated status to Lekki Office" },
  { id: "i2", type: "warning", title: "One Order Unassigned", description: "Batch assignment required" },
  { id: "i3", type: "warning", title: "Two Payments Pending", description: "Orders exceeding payment window" },
  { id: "i4", type: "error", title: "Rider Delayed to Ikeja", description: "Orders exceeding payment window" },
];

export const MOCK_DASHBOARD_DATA: DashboardData = {
  stats: {
    totalOrders: 128,
    ordersFromYesterday: 12,
    paidOrders: 118,
    pendingOrders: 13,
    activeBatches: 6,
    readyForPickup: 2,
    totalRevenue: 542000,
    revenueFromYesterday: 45000,
    activeVendors: 24,
    newVendors: 3,
    activeRiders: 45,
    newRiders: 5,
    totalCustomers: 1250,
    newCustomers: 28,
    pendingDeliveries: 18,
    delayedDeliveries: 5,
    rejectedDeliveries: 0,
    rejectedThisWeek: 0,
  },
  recentOrders: MOCK_RECENT_ORDERS,
  dispatchStatus: MOCK_DISPATCH_STATUS,
  issues: MOCK_ISSUES,
  performance: {
    completedBatches: 87,
    delayedBatches: 5,
    onTimeRate: 83,
    handoverSuccess: 92,
  },
  recentAdmins: MOCK_ADMINS,
};

export const MOCK_VALID_OTP = "123456";

export const MOCK_CUSTOMERS: Customer[] = [
  { id: "CUST-01", name: "Lisa Wong", email: "lisa.w@example.com", phone: "+2348012345678", totalOrders: 15, status: "ACTIVE", joinedAt: "2023-10-12" },
  { id: "CUST-02", name: "Ahamed Bello", email: "ahamed.b@example.com", phone: "+2348023456789", totalOrders: 4, status: "ACTIVE", joinedAt: "2024-01-05" },
  { id: "CUST-03", name: "Sarah Ade", email: "sarah.a@example.com", phone: "+2348034567890", totalOrders: 28, status: "ACTIVE", joinedAt: "2023-08-20" },
  { id: "CUST-04", name: "John Smith", email: "john.s@example.com", phone: "+2348045678901", totalOrders: 2, status: "INACTIVE", joinedAt: "2024-02-15" },
];

export const MOCK_VENDORS: Vendor[] = [
  { id: "VEND-01", businessName: "Mama Cass", ownerName: "Cassandra O.", email: "mama@cass.com", status: "APPROVED", rating: 4.8, joinedAt: "2023-05-10" },
  { id: "VEND-02", businessName: "The Place", ownerName: "Tunde B.", email: "info@theplace.com", status: "APPROVED", rating: 4.5, joinedAt: "2023-06-22" },
  { id: "VEND-03", businessName: "Spicy Bites", ownerName: "Chinedu E.", email: "hello@spicybites.com", status: "PENDING", rating: 0, joinedAt: "2024-03-01" },
  { id: "VEND-04", businessName: "Sweet Sensation", ownerName: "Amaka U.", email: "contact@sweetsensation.com", status: "REJECTED", rating: 3.2, joinedAt: "2023-11-18" },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "TXN-001", orderId: "DD-1020", customerName: "Lisa Wong", amount: 4500, status: "SUCCESS", date: "2024-03-10T10:45:00Z", paymentMethod: "Card" },
  { id: "TXN-002", orderId: "DD-1021", customerName: "Ahamed Bello", amount: 2000, status: "PENDING", date: "2024-03-10T11:45:00Z", paymentMethod: "Bank Transfer" },
  { id: "TXN-003", orderId: "DD-1022", customerName: "Sarah Ade", amount: 6500, status: "FAILED", date: "2024-03-10T12:15:00Z", paymentMethod: "Card" },
  { id: "TXN-004", orderId: "DD-1023", customerName: "John Smith", amount: 3200, status: "SUCCESS", date: "2024-03-10T15:15:00Z", paymentMethod: "Wallet" },
];
