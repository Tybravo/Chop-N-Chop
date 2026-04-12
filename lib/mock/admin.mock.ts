import { AdminUser, DashboardData, Order, DispatchRider, Issue } from "@/types/admin";

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
