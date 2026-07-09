import { adminApiClient } from "@/lib/axios";
import { LoginPayload, OTPPayload, InitiateRecoveryPayload, ResetPinPayload, LoginResponse } from "@/types/admin";
import axios from "axios";

export const authService = {
  async login(payload: LoginPayload): Promise<{ message: string }> {
    try {
      const response = await adminApiClient.post("/api/v1/admin/auth/login-init", {
        emailOrUsername: payload.emailOrUsername,
        pin: payload.pin,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Login failed. Please check your credentials.");
      }
      throw new Error("An unexpected error occurred during login.");
    }
  },

  async resendOtp(email: string): Promise<string> {
    try {
      const response = await adminApiClient.post("/api/v1/admin/auth/resend", { email });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMsg = errorData?.message || errorData?.error || `Failed to resend OTP (${error.response.status}).`;
        throw new Error(errorMsg);
      }
      throw new Error("An unexpected error occurred while resending OTP.");
    }
  },

  async verifyOtp(payload: OTPPayload): Promise<LoginResponse> {
    try {
      const response = await adminApiClient.post<LoginResponse>("/api/v1/admin/auth/login-verify", {
        email: payload.email,
        otp: payload.otp,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Invalid OTP code.");
      }
      throw new Error("An unexpected error occurred verifying OTP.");
    }
  },

  async logout(): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await adminApiClient.post("/api/v1/auth/logout");
      return response.data;
    } catch (error: unknown) {
      console.error("Backend logout failed:", error);
      return { success: false, message: "Backend logout failed" };
    }
  },

  async initiateRecovery(payload: InitiateRecoveryPayload): Promise<string> {
    try {
      const response = await adminApiClient.post("/api/v1/auth/recovery/initiate", payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMsg = errorData?.message || errorData?.error || `Failed to initiate recovery (${error.response.status}).`;
        throw new Error(errorMsg);
      }
      throw new Error("An unexpected error occurred while initiating recovery.");
    }
  },

  async resetPin(payload: ResetPinPayload): Promise<LoginResponse> {
    try {
      const response = await adminApiClient.post<LoginResponse>("/api/v1/auth/recovery/reset", payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMsg = errorData?.message || errorData?.error || `Failed to reset PIN (${error.response.status}).`;
        throw new Error(errorMsg);
      }
      throw new Error("An unexpected error occurred while resetting PIN.");
    }
  }
};