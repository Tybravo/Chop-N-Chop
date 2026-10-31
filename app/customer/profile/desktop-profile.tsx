"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { customerApiClient } from "@/lib/api/customerApiClient";
import {
  MapPin,
  Wallet,
  FileText,
  Download,
  Plus,
  ExternalLink,
  Car,
  Ticket,
  Settings,
  ShieldAlert,
  LogOut,
  ArrowLeft,
  Trash2,
  X,
} from "lucide-react";
import { UserProfile } from "./page";

interface SavedVehicle {
  id: string;
  label?: string;
  make: string;
  model?: string;
  color: string;
  plate: string;
  isPrimary: boolean;
  plateNumber?: string;
}

interface DesktopProfileProps {
  profile: UserProfile | null;
  isLoading: boolean;
  avatarUrl?: string;
}

export default function DesktopProfileDashboard({ profile, isLoading, avatarUrl }: DesktopProfileProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [vehicles, setVehicles] = useState<SavedVehicle[]>([]);
  const [fetchingVehicles, setFetchingVehicles] = useState(false);
  const [vehicleFormError, setVehicleFormError] = useState("");
  const [vehicleStatusMessage, setVehicleStatusMessage] = useState("");
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({ label: "", make: "", color: "", plate: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [pastOrders, setPastOrders] = useState<Record<string, unknown>[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      setFetchingVehicles(true);
      try {
        const res = await customerApiClient.get("/api/v1/user/vehicles");
        const data = res.data?.data || res.data || [];
        const mapped: SavedVehicle[] = (Array.isArray(data) ? data : []).map((v) => {
          const vehicle = v as Record<string, unknown>;
          return {
            id: vehicle.id as string,
            label: (vehicle.label as string) || (vehicle.model as string) || "",
            make: (vehicle.model as string) || (vehicle.make as string) || "",
            color: (vehicle.color as string) || "",
            plate: (vehicle.plateNumber as string) || (vehicle.plate as string) || "",
            plateNumber: vehicle.plateNumber as string | undefined,
            isPrimary: Boolean(vehicle.isDefault || vehicle.isPrimary),
          };
        });
        setVehicles(mapped);
      } catch (err) {
        console.error("Failed to fetch vehicles", err);
      } finally {
        setFetchingVehicles(false);
      }
    };
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setFetchingVehicles(true);
    try {
      const res = await customerApiClient.get("/api/v1/user/vehicles");
      const data = res.data?.data || res.data || [];
      const mapped: SavedVehicle[] = (Array.isArray(data) ? data : []).map((v) => {
        const vehicle = v as Record<string, unknown>;
        return {
          id: vehicle.id as string,
          label: (vehicle.label as string) || (vehicle.model as string) || "",
          make: (vehicle.model as string) || (vehicle.make as string) || "",
          color: (vehicle.color as string) || "",
          plate: (vehicle.plateNumber as string) || (vehicle.plate as string) || "",
          plateNumber: vehicle.plateNumber as string | undefined,
          isPrimary: Boolean(vehicle.isDefault || vehicle.isPrimary),
        };
      });
      setVehicles(mapped);
    } catch (err) {
      console.error("Failed to fetch vehicles", err);
    } finally {
      setFetchingVehicles(false);
    }
  };

  const fetchOrders = async () => {
    setFetchingOrders(true);
    try {
      const res = await customerApiClient.get("/api/v1/orders/mine", {
        params: { page: 0, size: 20 },
      });
      const orders = res.data?.content || res.data || [];
      setPastOrders(Array.isArray(orders) ? orders : []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      if (axios.isAxiosError(err)) {
        setOrdersError(err.response?.data?.message || err.response?.data?.error || "Failed to load orders");
      } else {
        setOrdersError("Failed to load orders");
      }
    } finally {
      setFetchingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const make = vehicleForm.make.trim();
    const plate = vehicleForm.plate.trim();
    if (!make || !plate) {
      setVehicleFormError("Vehicle make/model and plate number are required.");
      return;
    }
    setIsSaving(true);
    setVehicleFormError("");
    try {
      await customerApiClient.post("/api/v1/user/vehicles/add", {
        plateNumber: plate,
        model: make,
        color: vehicleForm.color.trim() || "",
        isDefault: !vehicles.some((v) => v.isPrimary),
      });
      await fetchVehicles();
      setShowVehicleDialog(false);
      setVehicleForm({ label: "", make: "", color: "", plate: "" });
      setVehicleStatusMessage("Saved vehicle successfully.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const backendMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          `Request failed with status ${err.response?.status || "Unknown"}`;
        setVehicleFormError(backendMsg);
      } else {
        setVehicleFormError("Failed to save vehicle");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      setIsSaving(true);
      await customerApiClient.delete(`/api/v1/user/vehicles/${id}`);
      await fetchVehicles();
      setVehicleStatusMessage("Vehicle removed.");
    } catch (err) {
      console.error("Failed to delete vehicle", err);
      setVehicleStatusMessage("Failed to remove vehicle.");
    } finally {
      setIsSaving(false);
    }
  };
  
  // FIX 1: Lazily initialize state to prevent synchronous setState warning on mount
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    // Use matchMedia to listen for dark mode changes without setState in effect
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (isDarkMode !== e.matches) {
        setIsDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      
      {/* Back Button + Header */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && window.history.length > 1) {
                router.back();
              } else {
                router.push('/customer/home');
              }
            }}
            className="w-11 h-11 rounded-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] transition-colors"
            aria-label="Go back to the previous page"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          {/* FIX 2: Replaced <img> with Next.js <Image> for performance. Added 'relative' to the parent div. */}
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#FC6B31]/20 shrink-0 shadow-sm bg-orange-50 relative">
            <Image 
              src={avatarUrl || "/avatar-placeholder.svg"} 
              alt="Profile Avatar" 
              fill
              unoptimized // Added since external Cloudinary URLs might not be configured in next.config.js yet
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {isLoading 
                ? "Loading Profile..." 
                : profile ? `Welcome back, ${profile.firstName}` : "Account & Ledger"
              }
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage security credentials, vehicle profiles, corporate invoices, and saved hubs.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {profile?.role === "CORPORATE" && (
             <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900">
               Corporate Account Active
             </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="space-y-1 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 h-fit shadow-sm">
          {[
            { id: "orders", label: "Detailed Order Ledger", icon: FileText },
            { id: "wallet", label: "Wallet & Transactions", icon: Wallet },
            { id: "promos", label: "Promos & Rewards", icon: Ticket },
            { id: "locations", label: "Hub Management", icon: MapPin },
            { id: "vehicles", label: "Drive-Thru Vehicles", icon: Car },
            { id: "settings", label: "App Settings & Security", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? "bg-[#FC6B31] text-white shadow-md shadow-orange-500/20" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 space-y-6">

          {activeTab === "orders" && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Order Ledger</h2>
                <button className="flex items-center gap-2 text-xs font-bold text-[#FC6B31] border border-[#FC6B31]/30 px-3.5 py-2 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors">
                  <Download className="w-4 h-4" /> Download All PDF Receipts
                </button>
              </div>

              {ordersError && (
                <p className="text-[12px] font-medium text-red-600 dark:text-red-400">{ordersError}</p>
              )}

              {fetchingOrders ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-[#FC6B31] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : pastOrders.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No orders yet. Place your first order to get started.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-400 font-semibold text-xs uppercase">
                      <tr>
                        <th className="p-4 rounded-l-xl">Order ID</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Items / Batch</th>
                        <th className="p-4">Total</th>
                        <th className="p-4 rounded-r-xl">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                      {pastOrders.map((ord) => {
                        const order = ord as Record<string, unknown>;
                        return (
                          <tr key={String(order.id ?? Math.random())} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30">
                            <td className="p-4 font-bold text-gray-900 dark:text-white">{String(order.id ?? "—")}</td>
                            <td className="p-4 text-gray-500">{new Date((order.createdAt || order.date || new Date()) as string | number | Date).toLocaleDateString()}</td>
                            <td className="p-4 text-gray-700 dark:text-gray-300 font-medium">
                              {Array.isArray(order.items)
                                ? (order.items as Array<Record<string, unknown>>).map((item) => String(item.name || "")).join(", ") || "—"
                                : "—"}
                            </td>
                            <td className="p-4 font-bold text-gray-900 dark:text-white">
                              {(() => {
                                const total = order.totalAmount ?? order.total ?? 0;
                                return `₦${Number(total).toLocaleString()}`;
                              })()}
                            </td>
                            <td className="p-4">
                              <button className="text-xs font-bold text-[#FC6B31] hover:underline flex items-center gap-1">
                                PDF <ExternalLink className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}


          {activeTab === "wallet" && (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Wallet Ledger</h2>
                  <p className="text-xs text-gray-500 mt-1">Current Balance: <span className="font-bold text-emerald-600">₦0</span></p>
                </div>
                <button className="bg-[#FC6B31] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:bg-orange-600 transition-colors">
                  Fund Wallet
                </button>
              </div>
              <div className="text-center py-10 text-gray-400 text-sm">No transactions yet.</div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Login & Security</h2>
                <p className="text-xs text-gray-500 mt-1">Manage your PIN and account security</p>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-800/40 p-6 rounded-2xl border border-gray-100 dark:border-zinc-700/50 space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Change Transaction PIN</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current PIN</label>
                    <input type="password" placeholder="••••" maxLength={4} pattern="\d*" inputMode="numeric" className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New PIN</label>
                    <input type="password" placeholder="••••" maxLength={4} pattern="\d*" inputMode="numeric" className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("chopnchop_session");
                      localStorage.removeItem("chopnchop-session");
                      localStorage.removeItem("chopnchop_token");
                      localStorage.removeItem("chopnchop_avatar");
                      router.push("/customer/login");
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold text-red-500 border border-red-100 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                  <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                    Save Security Changes
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
