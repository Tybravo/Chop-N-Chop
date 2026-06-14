import { adminApiClient } from "@/lib/axios";
import { UserProfileResponse, UpdateProfilePayload, ChangePinPayload } from "@/types/admin";
import axios from "axios";

export const profileService = {
  async getProfile(): Promise<UserProfileResponse> {
    try {
      const response = await adminApiClient.get<UserProfileResponse>("/api/v1/user/profile");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMsg = errorData?.message || errorData?.error || `Failed to fetch profile (${error.response.status}).`;
        throw new Error(errorMsg);
      }
      throw new Error("An unexpected error occurred while fetching profile.");
    }
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfileResponse> {
    try {
      const response = await adminApiClient.put<UserProfileResponse>("/api/v1/user/profile", payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMsg = errorData?.message || errorData?.error || `Failed to update profile (${error.response.status}).`;
        throw new Error(errorMsg);
      }
      throw new Error("An unexpected error occurred while updating profile.");
    }
  },

  async uploadProfilePicture(file: File): Promise<{ url: string; message: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await adminApiClient.post("/api/v1/user/profile/picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMsg = errorData?.message || errorData?.error || `Failed to upload picture (${error.response.status}).`;
        throw new Error(errorMsg);
      }
      throw new Error("An unexpected error occurred while uploading the picture.");
    }
  },

  async changePin(payload: ChangePinPayload): Promise<{ message: string }> {
    try {
      const response = await adminApiClient.put("/api/v1/admin/profile/pin", payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMsg = errorData?.message || errorData?.error || `Failed to change PIN (${error.response.status}).`;
        throw new Error(errorMsg);
      }
      throw new Error("An unexpected error occurred while changing PIN.");
    }
  }
};