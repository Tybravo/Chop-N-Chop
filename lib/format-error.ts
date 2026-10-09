import axios, { AxiosError } from "axios";

export interface ApiErrorDetail {
  field?: string;
  message?: string;
  defaultMessage?: string;
  code?: string;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: ApiErrorDetail[] | Record<string, unknown>;
  timestamp?: string;
  status?: number;
  path?: string;
}

export function formatApiError(error: unknown, fallback = "An unexpected error occurred"): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const responseData = axiosError.response?.data;

    if (responseData) {
      if (responseData.message) {
        return responseData.message;
      }

      if (responseData.error) {
        return responseData.error;
      }

      if (Array.isArray(responseData.errors)) {
        const messages = responseData.errors
          .map((err) => err.message || err.defaultMessage || err.field)
          .filter(Boolean);
        if (messages.length > 0) {
          return messages.join(", ");
        }
      }

      if (responseData.errors && typeof responseData.errors === "object") {
        const messages = Object.values(responseData.errors)
          .flat()
          .filter(Boolean);
        if (messages.length > 0) {
          return Array.isArray(messages) ? messages.join(", ") : String(messages);
        }
      }
    }

    if (axiosError.message) {
      return axiosError.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
