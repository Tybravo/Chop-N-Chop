import { VendorProfile } from "@/types/vendor";
import { mockVendorProfile } from "@/lib/mock/vendor.mock";

interface LoginPayload {
  email: string;
  password?: string;
}

interface RegisterPayload {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  password?: string;
  businessAddress?: string;
  kitchenLocation?: string;
  businessCategory?: string;
  businessDescription?: string;
}

export const authService = {
  login: async (_payload: LoginPayload): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "OTP sent successfully" });
      }, 500);
    });
  },

  verifyOtp: async (email: string, otp: string): Promise<{ success: boolean; token: string; user: VendorProfile }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp === "123456") {
          resolve({ success: true, token: "mock_vendor_token", user: mockVendorProfile });
        } else {
          reject(new Error("Invalid OTP"));
        }
      }, 500);
    });
  },

  register: async (_payload: RegisterPayload): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Registration successful" });
      }, 500);
    });
  },

  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  }
};
