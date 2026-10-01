import axios from "axios";

export const customerApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://afia-a2le.onrender.com",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-App-Brand": "CHOP_N_CHOP", // Automatically applied to EVERY request
  },
});

customerApiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("chopnchop_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});