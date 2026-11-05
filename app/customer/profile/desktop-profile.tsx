"use client";

import { useState, useEffect } from "react";
import { SafeAvatar } from "@/components/SafeAvatar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { customerApiClient } from "@/lib/api/customerApiClient";
import {
  MapPin,
  Wallet,
  FileText,
  Download,
  ExternalLink,
  Car,
  Ticket,
  Settings,
  LogOut,
  ArrowLeft,
  Camera,
  Loader2,
  Edit3,
  Moon,
  Sun,
  Bell,
  ShieldAlert,
  Smartphone,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  ChevronRight,
  Plus,
  Trash2,
  Heart,
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
  isUploadingPic?: boolean;
  onUploadClick?: () => void;
  onOpenEdit?: () => void;
}

export default function DesktopProfileDashboard({ profile, isLoading, avatarUrl, isUploadingPic, onUploadClick, onOpenEdit }: DesktopProfileProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [vehicles, setVehicles] = useState<SavedVehicle[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fetchingVehicles, setFetchingVehicles] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [vehicleFormError, setVehicleFormError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [vehicleStatusMessage, setVehicleStatusMessage] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({ label: "", make: "", color: "", plate: "" });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSaving, setIsSaving] = useState(false);

  // Settings (match mobile)
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailDigests, setEmailDigests] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [biometrics, setBiometrics] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState(false);

  const [pastOrders, setPastOrders] = useState<Record<string, unknown>[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  // Hubs / Promos / Favorites (live)
  const [hubs, setHubs] = useState<Record<string, unknown>[]>([]);
  const [fetchingHubs, setFetchingHubs] = useState(false);
  const [hubsError, setHubsError] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "applying" | "applied" | "error">("idle");
  const [promoMsg, setPromoMsg] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [favorites, setFavorites] = useState<Record<string, unknown>[]>([]);
  const [fetchingFavorites, setFetchingFavorites] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ plateNumber: "", model: "", color: "" });
  const [submittingVehicle, setSubmittingVehicle] = useState(false);
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);

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
    const token = typeof window !== "undefined" ? localStorage.getItem("chopnchop_token") : null;
    if (!token) {
      try {
        const guestOrders = JSON.parse(localStorage.getItem("chopnchop_guest_orders") || "[]");
        setPastOrders(Array.isArray(guestOrders) ? guestOrders : []);
      } catch {
        setPastOrders([]);
      }
      setOrdersError("");
      return;
    }
    setFetchingOrders(true);
    setOrdersError("");
    try {
      const res = await customerApiClient.get("/api/v1/orders/mine", {
        params: { page: 0, size: 20 },
      });
      const orders = res.data?.content || res.data || [];
      setPastOrders(Array.isArray(orders) ? orders : []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
        try {
          const guestOrders = JSON.parse(localStorage.getItem("chopnchop_guest_orders") || "[]");
          setPastOrders(Array.isArray(guestOrders) ? guestOrders : []);
        } catch {
          setPastOrders([]);
        }
        setOrdersError("");
      } else if (axios.isAxiosError(err)) {
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
    const model = newVehicle.model.trim();
    const plate = newVehicle.plateNumber.trim();
    if (!model || !plate) {
      setVehicleFormError("Model and plate number are required.");
      return;
    }
    setSubmittingVehicle(true);
    setVehicleFormError("");
    setVehicleStatusMessage("");
    try {
      await customerApiClient.post("/api/v1/user/vehicles/add", {
        plateNumber: plate,
        model,
        color: newVehicle.color.trim() || "",
        isDefault: !vehicles.some((v) => v.isPrimary),
      });
      await fetchVehicles();
      setNewVehicle({ plateNumber: "", model: "", color: "" });
      setVehicleStatusMessage("Vehicle saved.");
    } catch (err) {
      setVehicleFormError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.response?.data?.error || "Failed to save vehicle."
          : "Failed to save vehicle."
      );
    } finally {
      setSubmittingVehicle(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteVehicle = async (id: string) => {
    setDeletingVehicleId(id);
    setVehicleStatusMessage("");
    try {
      await customerApiClient.delete(`/api/v1/user/vehicles/${id}`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      setVehicleStatusMessage("Vehicle removed.");
    } catch (err) {
      console.error("Failed to delete vehicle", err);
      setVehicleStatusMessage("Failed to remove vehicle.");
      fetchVehicles().catch(() => {});
    } finally {
      setDeletingVehicleId(null);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const handleNumericInput = (val: string, setter: (val: string) => void) => {
    setter(val.replace(/\D/g, "").slice(0, 4));
  };

  const handleChangePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    if (currentPin.length !== 4 || newPin.length !== 4) {
      setPinError("All PINs must be exactly 4 digits long.");
      return;
    }
    if (newPin !== confirmPin) {
      setPinError("New PINs do not match.");
      return;
    }
    if (currentPin === newPin) {
      setPinError("New PIN must be different from your current PIN.");
      return;
    }
    setIsPinLoading(true);
    try {
      await customerApiClient.put("/api/v1/auth/change-pin", { oldPin: currentPin, newPin });
      setPinSuccess(true);
      setTimeout(() => {
        setPinSuccess(false);
        setIsPinModalOpen(false);
        setCurrentPin(""); setNewPin(""); setConfirmPin("");
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setPinError(err.response.data?.message || err.response.data?.error || "Failed to update PIN. Please check your current PIN.");
      } else {
        setPinError("Network error. Please try again.");
      }
    } finally {
      setIsPinLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "locations") return;
    (async () => {
      setFetchingHubs(true); setHubsError("");
      try {
        const res = await customerApiClient.get("/api/v1/hubs/active");
        const data = res.data?.data || res.data || [];
        setHubs(Array.isArray(data) ? data : []);
      } catch { setHubs([]); setHubsError("Unable to load hubs right now."); }
      finally { setFetchingHubs(false); }
    })();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "favorites") return;
    (async () => {
      setFetchingFavorites(true);
      try {
        const token = localStorage.getItem("chopnchop_token");
        if (!token) { setFavorites([]); return; }
        const res = await customerApiClient.get("/api/v1/orders/mine", { params: { page: 0, size: 20 } });
        const orders = res.data?.content || res.data || [];
        const seen = new Set<string>(); const meals: Record<string, unknown>[] = [];
        (Array.isArray(orders) ? orders : []).forEach((o: any) => (Array.isArray(o.items) ? o.items : []).forEach((it: any) => {
          const id = String(it.productId || it.dishId || it.id || it.name || "");
          if (!id || seen.has(id)) return; seen.add(id);
          meals.push({ id, name: it.name || "Meal", vendor: it.vendorName || "Vendor", price: it.unitPrice || it.totalPrice || 0 });
        }));
        setFavorites(meals.slice(0, 12));
      } catch { setFavorites([]); }
      finally { setFetchingFavorites(false); }
    })();
  }, [activeTab]);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) { setPromoStatus("error"); setPromoMsg("Enter a promo code."); return; }
    const cartId = typeof window !== "undefined" ? localStorage.getItem("chopnchop_active_cart_id") : null;
    if (!cartId) { setPromoStatus("error"); setPromoMsg("Add items to your cart first, then apply a promo code."); return; }
    setPromoStatus("applying"); setPromoMsg("");
    try {
      await customerApiClient.post(`/api/v1/carts/${cartId}/promo`, { promoCode: code });
      setAppliedPromo(code); setPromoStatus("applied"); setPromoMsg(`Promo code ${code} applied.`);
    } catch (err) {
      setPromoStatus("error");
      setPromoMsg(axios.isAxiosError(err) ? (err.response?.data?.message || "Invalid or expired promo code.") : "Unable to apply promo.");
    }
  };

  const handleRemovePromo = async () => {
    const cartId = typeof window !== "undefined" ? localStorage.getItem("chopnchop_active_cart_id") : null;
    if (!cartId) return;
    try { await customerApiClient.delete(`/api/v1/carts/${cartId}/promo`); } catch {}
    setAppliedPromo(""); setPromoStatus("idle"); setPromoMsg(""); setPromoCode("");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      
      {/* Back Button + Header */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => router.push('/customer/home')}
            className="w-11 h-11 rounded-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] transition-colors"
            aria-label="Go back to the previous page"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#FC6B31]/20 shrink-0 shadow-sm bg-orange-50 relative">
              <SafeAvatar 
                src={avatarUrl || "/avatar-placeholder.svg"} 
                alt="Profile Avatar" 
                fill
                className="object-cover"
              />
              {isUploadingPic && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>
            {onUploadClick && (
              <button
                type="button"
                onClick={onUploadClick}
                disabled={isUploadingPic}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-sm transition-transform active:scale-95 disabled:opacity-50"
                aria-label="Upload profile picture"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {isLoading 
                ? "Loading Profile..." 
                : profile ? `Welcome back, ${profile.firstName || profile.lastName || "User"}` : "Guest User"
              }
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your orders, wallet, hubs, vehicles, and account settings.
            </p>
            {!profile && !isLoading && (
              <button
                type="button"
                onClick={() => router.push("/customer/login")}
                className="mt-2 text-[12px] font-bold text-[#FC6B31] hover:underline"
              >
                Log in or create an account
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {profile && onOpenEdit && (
            <button
              type="button"
              onClick={onOpenEdit}
              className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-colors"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="space-y-1 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 h-fit shadow-sm">
          {[
            { id: "orders", label: "Order History", icon: FileText },
            { id: "wallet", label: "Wallet & Transactions", icon: Wallet },
            { id: "promos", label: "Promos & Rewards", icon: Ticket },
            { id: "locations", label: "Hub Management", icon: MapPin },
            { id: "vehicles", label: "Drive-Thru Vehicles", icon: Car },
            { id: "favorites", label: "Favorites & Quick Reorder", icon: Heart },
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
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Order History</h2>
              </div>

              {ordersError && (
                <p className="text-[12px] font-medium text-red-600 dark:text-red-400">{ordersError}</p>
              )}

              {fetchingOrders ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-[#FC6B31] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : pastOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No orders yet. Place your first order to get started.</p>
                  {!profile && (
                    <button
                      type="button"
                      onClick={() => router.push("/customer/login")}
                      className="bg-[#FC6B31] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-colors"
                    >
                      Log in to view all orders
                    </button>
                  )}
                </div>
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

          {activeTab === "promos" && (
            <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Promos & Rewards</h2>
                <p className="text-xs text-gray-500 mt-1">Apply a promo code to your active cart</p>
              </div>
              <form onSubmit={handleApplyPromo} className="flex flex-col sm:flex-row gap-3">
                <input value={promoCode} onChange={(e) => { setPromoCode(e.target.value); if (promoStatus !== "applying") { setPromoStatus("idle"); setPromoMsg(""); } }}
                  placeholder="Enter promo code" maxLength={24}
                  className="min-w-0 flex-1 rounded-[18px] border border-gray-200 bg-white px-5 py-3.5 text-[14px] font-bold text-gray-900 outline-none focus:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white" />
                <button type="submit" disabled={promoStatus === "applying"}
                  className="flex items-center justify-center gap-2 rounded-[18px] bg-gray-900 px-6 py-3.5 text-[14px] font-bold text-white disabled:opacity-60 dark:bg-white dark:text-zinc-900">
                  {promoStatus === "applying" ? <><Loader2 className="h-4 w-4 animate-spin" /> Applying</> : "Apply"}
                </button>
              </form>
              {promoMsg && (
                <p className={`rounded-xl px-4 py-3 text-[13px] font-medium ${promoStatus === "error" ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300"}`}>{promoMsg}</p>
              )}
              {appliedPromo ? (
                <div className="flex items-center justify-between gap-3 rounded-[20px] border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                  <div><h3 className="text-[14px] font-extrabold text-emerald-800 dark:text-emerald-200">Promo applied</h3><p className="text-[13px] text-emerald-700 dark:text-emerald-300"><span className="font-bold">{appliedPromo}</span> is applied to your cart.</p></div>
                  <button type="button" onClick={handleRemovePromo} className="text-[12px] font-bold text-emerald-700 hover:underline dark:text-emerald-300">Remove</button>
                </div>
              ) : (
                <div role="status" className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-200 p-10 text-center dark:border-zinc-800">
                  <Ticket className="mb-3 h-8 w-8 text-gray-300 dark:text-zinc-700" />
                  <h4 className="text-[14px] font-bold text-gray-900 dark:text-white">No coupons available</h4>
                  <p className="mt-1 text-[13px] text-gray-500">Rewards and promo offers will appear here when they&apos;re available. You can still apply a code above.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "locations" && (
            <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Saved Hubs & Locations</h2>
                <p className="text-xs text-gray-500 mt-1">Active pickup hubs</p>
              </div>
              {fetchingHubs ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#FC6B31]" /></div>
              ) : hubsError ? (
                <div role="status" className="rounded-[24px] border border-dashed border-gray-200 p-10 text-center dark:border-zinc-800">
                  <MapPin className="mx-auto mb-3 h-8 w-8 text-gray-300 dark:text-zinc-700" />
                  <p className="text-[13px] text-gray-500">{hubsError}</p>
                </div>
              ) : hubs.length === 0 ? (
                <div role="status" className="rounded-[24px] border border-dashed border-gray-200 p-10 text-center dark:border-zinc-800">
                  <MapPin className="mx-auto mb-3 h-8 w-8 text-gray-300 dark:text-zinc-700" />
                  <h4 className="text-[14px] font-bold text-gray-900 dark:text-white">No active hubs</h4>
                  <p className="mt-1 text-[13px] text-gray-500">Available pickup hubs will appear here when they&apos;re live.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {hubs.map((hub: any) => (
                    <div key={String(hub.id)} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FC6B31]/10 text-[#FC6B31]"><MapPin className="h-5 w-5" /></div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-[14px] font-bold text-gray-900 dark:text-white">{hub.name || "Hub"}</h4>
                          {hub.status && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-600 dark:bg-emerald-950/30">{hub.status}</span>}
                        </div>
                        <p className="mt-0.5 text-[13px] text-gray-500">{[hub.address, hub.city, hub.state].filter(Boolean).join(", ") || "Address unavailable"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "vehicles" && (
            <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Drive-Thru Vehicles</h2>
                <p className="text-xs text-gray-500 mt-1">Saved vehicles help staff identify you during pickup.</p>
              </div>
              <form onSubmit={handleAddVehicle} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input required value={newVehicle.model} onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })} placeholder="Model (e.g. Camry)"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#FC6B31] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
                <input required value={newVehicle.plateNumber} onChange={(e) => setNewVehicle({ ...newVehicle, plateNumber: e.target.value })} placeholder="Plate number"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#FC6B31] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
                <input value={newVehicle.color} onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })} placeholder="Color"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#FC6B31] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
                <button type="submit" disabled={submittingVehicle}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#FC6B31] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
                  {submittingVehicle ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add
                </button>
              </form>
              {vehicleFormError && <p className="text-[12px] font-medium text-red-600">{vehicleFormError}</p>}
              {vehicleStatusMessage && <p className="text-[12px] font-medium text-emerald-600">{vehicleStatusMessage}</p>}
              {fetchingVehicles ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-[#FC6B31]" /></div>
              ) : vehicles.length === 0 ? (
                <div role="status" className="rounded-[24px] border border-dashed border-gray-200 p-10 text-center dark:border-zinc-800">
                  <Car className="mx-auto mb-3 h-8 w-8 text-gray-300 dark:text-zinc-700" />
                  <h4 className="text-[14px] font-bold text-gray-900 dark:text-white">No saved vehicles</h4>
                  <p className="mt-1 text-[13px] text-gray-500">Add a vehicle to make pickup identification faster.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vehicles.map((v) => (
                    <div key={v.id} className={`flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-opacity dark:border-zinc-800 dark:bg-zinc-800/30 ${deletingVehicleId === v.id ? "opacity-50" : ""}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"><Car className="h-5 w-5" /></div>
                        <div className="min-w-0">
                          <h4 className="text-[14px] font-bold text-gray-900 dark:text-white truncate">{v.model || v.make || "Vehicle"}</h4>
                          <p className="text-[12px] text-gray-500">{[v.color, v.plateNumber || v.plate].filter(Boolean).join(" • ")}</p>
                        </div>
                      </div>
                      <button type="button" disabled={deletingVehicleId === v.id} onClick={() => handleDeleteVehicle(v.id)} className="shrink-0 rounded-full p-2 text-red-500 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/20" aria-label="Remove vehicle">
                        {deletingVehicleId === v.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Favorites & Quick Reorder</h2>
                <p className="text-xs text-gray-500 mt-1">Based on your recent orders</p>
              </div>
              {fetchingFavorites ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#FC6B31]" /></div>
              ) : favorites.length === 0 ? (
                <div role="status" className="rounded-[24px] border border-dashed border-gray-200 p-10 text-center dark:border-zinc-800">
                  <Heart className="mx-auto mb-3 h-8 w-8 text-gray-300 dark:text-zinc-700" />
                  <h4 className="text-[14px] font-bold text-gray-900 dark:text-white">No favorites or quick reorders yet</h4>
                  <p className="mt-1 text-[13px] text-gray-500">Meals from your past orders will appear here for quick reordering.</p>
                  <button type="button" onClick={() => router.push("/customer/explore")} className="mt-4 rounded-full bg-[#FC6B31] px-4 py-2.5 text-[13px] font-bold text-white">Browse meals</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favorites.map((m: any) => (
                    <button key={String(m.id)} type="button" onClick={() => router.push(String(m.id).includes("-") ? `/customer/meals/${m.id}` : "/customer/explore")}
                      className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-left hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-800/30">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/20"><Heart className="h-4 w-4" /></div>
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-bold text-gray-900 dark:text-white truncate">{m.name}</h4>
                        <p className="text-[12px] text-gray-500 truncate">{m.vendor} • ₦{Number(m.price || 0).toLocaleString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Appearance</h2>
                  <p className="text-xs text-gray-500 mt-1">Theme and display preferences</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-zinc-800 flex items-center justify-center">
                      {isDarkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-[#FC6B31]" />}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white block">Dark Mode</span>
                      <span className="text-[11px] text-gray-400">Currently: <strong className="capitalize">{isDarkMode ? "dark" : "light"}</strong></span>
                    </div>
                  </div>
                  <button type="button" role="switch" aria-checked={isDarkMode} onClick={toggleDarkMode}
                    className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-300 shadow-inner ${isDarkMode ? "bg-zinc-900 border-indigo-500" : "bg-orange-100 border-[#FC6B31]"}`}>
                    <span className="absolute left-2 text-[10px]">☀️</span><span className="absolute right-2 text-[10px]">🌙</span>
                    <span className={`pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-300 ${isDarkMode ? "translate-x-8" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Notifications</h2>
                  <p className="text-xs text-gray-500 mt-1">Manage alerts and updates</p>
                </div>
                {[
                  { label: "SMS Alerts", sub: "Dispatch & arrival texts", icon: Bell, iconCls: "bg-blue-50 dark:bg-blue-950/30 text-blue-600", val: smsAlerts, set: setSmsAlerts },
                  { label: "Push Notifications", sub: "In-app alerts & updates", icon: Smartphone, iconCls: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600", val: pushNotifications, set: setPushNotifications },
                  { label: "Email Digests", sub: "Weekly summary emails", icon: Mail, iconCls: "bg-purple-50 dark:bg-purple-950/30 text-purple-600", val: emailDigests, set: setEmailDigests },
                ].map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-700/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${row.iconCls}`}><Icon className="w-5 h-5" /></div>
                        <div><span className="text-sm font-bold text-gray-900 dark:text-white block">{row.label}</span><span className="text-[11px] text-gray-400">{row.sub}</span></div>
                      </div>
                      <button type="button" role="switch" aria-checked={row.val} onClick={() => row.set(!row.val)}
                        className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-300 shadow-inner ${row.val ? "bg-[#FC6B31]/20 border-[#FC6B31]" : "bg-gray-200 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"}`}>
                        <span className={`absolute left-2 text-[9px] font-extrabold text-[#FC6B31] ${row.val ? "opacity-100" : "opacity-0"}`}>ON</span>
                        <span className={`absolute right-2 text-[9px] font-extrabold text-gray-400 ${!row.val ? "opacity-100" : "opacity-0"}`}>OFF</span>
                        <span className={`pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-300 ${row.val ? "translate-x-8" : "translate-x-1"}`} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[28px] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Security</h2>
                  <p className="text-xs text-gray-500 mt-1">Manage your PIN and account security</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-600 flex items-center justify-center"><ShieldAlert className="w-5 h-5" /></div>
                    <div><span className="text-sm font-bold text-gray-900 dark:text-white block">Biometric Login</span><span className="text-[11px] text-gray-400">FaceID / Fingerprint</span></div>
                  </div>
                  <button type="button" role="switch" aria-checked={biometrics} onClick={() => setBiometrics(!biometrics)}
                    className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-300 shadow-inner ${biometrics ? "bg-[#FC6B31]/20 border-[#FC6B31]" : "bg-gray-200 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"}`}>
                    <span className={`absolute left-2 text-[9px] font-extrabold text-[#FC6B31] ${biometrics ? "opacity-100" : "opacity-0"}`}>ON</span>
                    <span className={`absolute right-2 text-[9px] font-extrabold text-gray-400 ${!biometrics ? "opacity-100" : "opacity-0"}`}>OFF</span>
                    <span className={`pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-300 ${biometrics ? "translate-x-8" : "translate-x-1"}`} />
                  </button>
                </div>
                <button type="button" onClick={() => setIsPinModalOpen(true)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-700/50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-zinc-800 text-[#FC6B31] flex items-center justify-center"><KeyRound className="w-5 h-5" /></div>
                    <div className="text-left"><span className="text-sm font-bold text-gray-900 dark:text-white block">Change Security PIN</span><span className="text-[11px] text-gray-400">Update account access PIN</span></div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <div className="pt-2">
                  <button type="button" onClick={() => { localStorage.removeItem("chopnchop_session"); localStorage.removeItem("chopnchop-session"); localStorage.removeItem("chopnchop_token"); localStorage.removeItem("chopnchop_avatar"); router.push("/customer/login"); }}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold text-red-500 border border-red-100 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {isPinModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[32px] p-6 shadow-2xl border border-orange-100 dark:border-zinc-800 space-y-5 relative">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900/40 text-[#FC6B31] flex items-center justify-center"><KeyRound className="w-5 h-5" /></div>
                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Change Security PIN</h3>
                  </div>
                  <button onClick={() => setIsPinModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="w-5 h-5" /></button>
                </div>
                {pinSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">PIN Updated!</h4>
                    <p className="text-xs text-gray-500">Your security PIN has been successfully updated.</p>
                  </div>
                ) : (
                  <form onSubmit={handleChangePinSubmit} className="space-y-4" autoComplete="off">
                    {pinError && <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium text-center">{pinError}</div>}
                    {[
                      { label: "Current PIN", val: currentPin, set: setCurrentPin, show: showCurrentPin, setShow: setShowCurrentPin, name: "dp-cur-pin" },
                      { label: "New PIN", val: newPin, set: setNewPin, show: showNewPin, setShow: setShowNewPin, name: "dp-new-pin" },
                      { label: "Confirm New PIN", val: confirmPin, set: setConfirmPin, show: showConfirmPin, setShow: setShowConfirmPin, name: "dp-cfm-pin" },
                    ].map((f) => (
                      <div key={f.label} className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">{f.label}</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400"><Lock className="w-4 h-4" /></div>
                          <input type={f.show ? "text" : "password"} name={f.name} autoComplete="new-password" inputMode="numeric" pattern="\\d{4}" maxLength={4} required placeholder="••••" value={f.val}
                            onChange={(e) => handleNumericInput(e.target.value, f.set)}
                            className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-mono tracking-widest text-gray-900 dark:text-white outline-none focus:border-[#FC6B31]" />
                          <button type="button" onClick={() => f.setShow(!f.show)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600">{f.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 flex items-center gap-3">
                      <button type="button" onClick={() => setIsPinModalOpen(false)} className="flex-1 py-3 px-4 rounded-2xl border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
                      <button type="submit" disabled={isPinLoading} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FC6B31] text-xs font-extrabold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors disabled:opacity-70">
                        {isPinLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update PIN"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
