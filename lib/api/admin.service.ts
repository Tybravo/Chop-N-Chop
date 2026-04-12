import { LoginPayload, OTPPayload, DashboardData, AdminUser } from "@/types/admin";
import { MOCK_ADMINS, MOCK_DASHBOARD_DATA, MOCK_VALID_OTP } from "@/lib/mock/admin.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const adminService = {
  /**
   * Simulates a login API call.
   * Resolves if the email and password are provided.
   */
  async login(payload: LoginPayload): Promise<{ success: boolean; message: string; role?: string }> {
    await delay(1000); // simulate network latency

    if (!payload.email || !payload.password) {
      throw new Error("Email and password are required.");
    }

    // Basic mock logic: find admin by email or assume SUPER_ADMIN if any other email
    const admin = MOCK_ADMINS.find((a) => a.email === payload.email);
    const role = admin?.role || "SUPER_ADMIN";

    return {
      success: true,
      message: "OTP sent to your email.",
      role,
    };
  },

  /**
   * Simulates an OTP verification API call.
   * Resolves if the OTP is correct (e.g., 123456).
   */
  async verifyOtp(payload: OTPPayload): Promise<{ success: boolean; token: string; user: AdminUser }> {
    await delay(1000);

    if (payload.otp !== MOCK_VALID_OTP) {
      throw new Error("Invalid OTP code.");
    }

    const admin = MOCK_ADMINS.find((a) => a.email === payload.email) || MOCK_ADMINS[0];

    return {
      success: true,
      token: "mock-jwt-token-123",
      user: admin,
    };
  },

  /**
   * Simulates fetching dashboard data.
   */
  async getDashboardData(): Promise<DashboardData> {
    await delay(800);
    return MOCK_DASHBOARD_DATA;
  },
};
