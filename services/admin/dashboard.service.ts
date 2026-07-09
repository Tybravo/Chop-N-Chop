import { DashboardData, Customer, Vendor, Transaction, Order, DispatchRider } from "@/types/admin";
import { MOCK_DASHBOARD_DATA, MOCK_CUSTOMERS, MOCK_VENDORS, MOCK_TRANSACTIONS } from "@/lib/mock/admin.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    await delay(800);
    return MOCK_DASHBOARD_DATA;
  },

  async getCustomers(): Promise<Customer[]> {
    await delay(500);
    return MOCK_CUSTOMERS;
  },

  async getVendors(): Promise<Vendor[]> {
    await delay(500);
    return MOCK_VENDORS;
  },

  async getOrders(): Promise<Order[]> {
    await delay(500);
    return MOCK_DASHBOARD_DATA.recentOrders;
  },

  async getRiders(): Promise<DispatchRider[]> {
    await delay(500);
    return MOCK_DASHBOARD_DATA.dispatchStatus;
  },

  async getTransactions(): Promise<Transaction[]> {
    await delay(500);
    return MOCK_TRANSACTIONS;
  }
};