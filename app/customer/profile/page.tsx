"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { customerApiClient } from "@/lib/api/customerApiClient";
import { 
  MapPin, 
  Wallet, 
  Heart, 
  Headphones, 
  LogOut, 
  ChevronRight,
  ArrowLeft, 
  Truck, 
  Package,
  ShieldCheck,
  Car,
  Ticket,
  Settings,
  Edit3,
  X,
  Loader2,
  Camera
} from "lucide-react";
import DesktopProfileDashboard from "./desktop-profile";
import axios from "axios";

// --- API Types ---
export interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string;
  role: string;
  preferredHubId: string;
  marketingOptIn: boolean;
  profilePictureUrl?: string;
}

interface ApiActiveOrder {
  id: string;
  status: string;
  eta: string;
  zone: string;
  pickupCode?: string; 
}

const decodeJwtPayload = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (_error) {
    return null;
  }
};

export default function ProfilePage() {
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [liveAvatar, setLiveAvatar] = useState<string>("/avatar-placeholder.svg");
  const [isLoading, setIsLoading] = useState(true);
  
  // Active Order State
  const [activeOrder, setActiveOrder] = useState<ApiActiveOrder | null>(null);

  // Edit Profile States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    marketingOptIn: false
  });

  // Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPic, setIsUploadingPic] = useState(false);

  useEffect(() => {
    // 1. Instantly read picture from Cache first, then JWT
    const cachedAvatar = localStorage.getItem("chopnchop_avatar");
    if (cachedAvatar) {
      setLiveAvatar(cachedAvatar);
    } else {
      const token = localStorage.getItem("chopnchop_token");
      if (token) {
        const payload = decodeJwtPayload(token);
        const jwtPic = payload?.profilePictureUrl || payload?.picture || payload?.imageUrl;
        if (jwtPic) {
          setLiveAvatar(jwtPic);
        }
      }
    }

    // 2. Fetch the profile data and active order concurrently
    const fetchDashboardData = async () => {
      try {
        const [profileRes, orderRes] = await Promise.allSettled([
          customerApiClient.get("/api/v1/user/profile"),
          customerApiClient.get("/api/v1/orders/active") 
        ]);

        if (profileRes.status === "fulfilled" && profileRes.value.data) {
          setProfile(profileRes.value.data);
          
          // Pull from multiple possible backend keys and cache it immediately
          const pic = profileRes.value.data.profilePictureUrl || profileRes.value.data.profileImageUrl || profileRes.value.data.pictureUrl || profileRes.value.data.imageUrl;
          if (pic) {
            setLiveAvatar(pic);
            localStorage.setItem("chopnchop_avatar", pic);
          }
        }

        if (orderRes.status === "fulfilled" && orderRes.value.data) {
          setActiveOrder(orderRes.value.data);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- Profile Text Update ---
  const openEditModal = () => {
    if (profile) {
      setEditForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        marketingOptIn: profile.marketingOptIn || false,
      });
      setUpdateError("");
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError("");

    try {
      const payload = {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        phone: editForm.phone.trim(),
        preferredHubId: profile?.preferredHubId || "default", 
        marketingOptIn: editForm.marketingOptIn
      };

      const res = await customerApiClient.put("/api/v1/user/profile", payload);
      setProfile(res.data);
      setIsEditModalOpen(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setUpdateError(err.response.data?.message || err.response.data?.error || "Failed to update profile details.");
      } else {
        setUpdateError("Failed to update profile details.");
      }
    } finally {
      setIsUpdating(false);
    }
  };
  
// --- Profile Picture Update ---
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPic(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Use the same axios client for consistent auth/base URL
      const uploadRes = await customerApiClient.post("/api/v1/user/profile/picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update local state AND update the global LocalStorage cache instantly
      if (uploadRes.data?.url) {
        setLiveAvatar(uploadRes.data.url);
        localStorage.setItem("chopnchop_avatar", uploadRes.data.url);
      }
      
      // Also refetch full profile to keep in sync
      const profileRes = await customerApiClient.get("/api/v1/user/profile");
      setProfile(profileRes.data);
      
    } catch (error) {
      console.error("Failed to upload profile picture", error);
      alert("Failed to upload image. Please check your connection.");
    } finally {
      setIsUploadingPic(false);
      // Reset file input so same file can be re-uploaded if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const displayName = profile?.firstName || profile?.lastName 
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
    : "Chop-n-Chop User";

  return (
    <>
      {/* Desktop Profile - shown on md+ screens */}
      <div className="hidden md:block">
        <DesktopProfileDashboard 
          profile={profile} 
          isLoading={isLoading} 
          avatarUrl={liveAvatar}
          isUploadingPic={isUploadingPic}
          onUploadClick={() => fileInputRef.current?.click()}
        />
      </div>

      {/* Hidden File Input for both Mobile & Desktop */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleImageUpload}
      />

      {/* Mobile Profile - shown on small screens */}
      <div className="md:hidden">
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-32 pt-4 px-4 selection:bg-[#FC6B31] selection:text-white relative">
          <div className="max-w-md mx-auto space-y-6">
            
            {/* TOP HEADER */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => router.push("/customer/home")}
                className="w-11 h-11 rounded-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] transition-colors"
                aria-label="Go back to the previous page"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">Profile</h1>
              <div className="w-10 h-10" />
            </div>

            {/* DYNAMIC ACTIVE DROP STATUS WIDGET */}
            {activeOrder && activeOrder.status !== "DELIVERED" && (
              <button
                type="button"
                onClick={() => router.push(`/customer/tracking/${activeOrder.id}`)}
                className="w-full text-left bg-gradient-to-r from-[#FC6B31] to-orange-600 rounded-[24px] p-4 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden active:scale-95 transition-transform"
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                    Live Scheduled Drop
                  </span>
                  <Truck className="w-4 h-4 animate-bounce" />
                </div>
                <h3 className="text-sm font-bold capitalize">Status: {activeOrder.status.replace(/_/g, ' ')}</h3>
                <p className="text-[11px] text-orange-100 mt-0.5">
                  Arriving at {activeOrder.eta} • {activeOrder.zone}
                </p>
              </button>
            )}

            {/* CORE IDENTITY CARD */}
            <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-4 border border-gray-100 dark:border-zinc-800 flex items-start justify-between shadow-sm">
              <div className="flex items-center gap-4">
                
                {/* Avatar with Camera Badge */}
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FC6B31]/30 bg-orange-50 relative">
                    <img 
                      src={liveAvatar}
                      alt="Profile Avatar"
                      className="w-full h-full object-cover" 
                    />
                    {isUploadingPic && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPic}
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-sm transition-transform active:scale-95 disabled:opacity-50"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="pt-0.5">
                  {isLoading ? (
                    <div className="space-y-2 mt-1">
                      <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-base font-extrabold text-gray-900 dark:text-white capitalize truncate max-w-[170px]">
                        {profile ? displayName : "Guest User"}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[170px]">
                        {profile?.email || "Not logged in"}
                      </p>
                      {profile?.phone && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full mt-1">
                          <ShieldCheck className="w-3 h-3" /> Phone Verified
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {/* EDIT PROFILE TEXT BUTTON */}
              {profile && (
                <button 
                  onClick={openEditModal}
                  className="p-2.5 bg-gray-50 dark:bg-zinc-800 rounded-full text-gray-500 hover:text-[#FC6B31] transition-colors active:scale-95 mt-1"
                  aria-label="Edit Profile"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* BLOCK 1: THE ESSENTIALS */}
            <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-2 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-1">
              <button
                type="button"
                onClick={() => router.push("/customer/wallet")}
                className="min-h-12 w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-950/40 text-[#FC6B31] flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Wallet & Quick Pay</span>
                    <span className="text-[11px] text-gray-400">Balance: ₦24,500</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                type="button"
                onClick={() => router.push("/customer/drops")}
                className="min-h-12 w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Drops & Order History</span>
                    <span className="text-[11px] text-gray-400">Track drops and view past receipts</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                type="button"
                onClick={() => router.push("/customer/promos")}
                className="min-h-12 w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-pink-100 dark:bg-pink-950/40 text-pink-600 flex items-center justify-center">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Promos & Rewards</span>
                    <span className="text-[11px] text-gray-400">Active discounts & coupons</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* BLOCK 2: OPERATIONAL PREFERENCES */}
            <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-2 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-1">
              <button
                type="button"
                onClick={() => router.push("/customer/locations")}
                className="min-h-12 w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Saved Hubs & Locations</span>
                    <span className="text-[11px] text-gray-400">Office, Home & Drop zones</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                type="button"
                onClick={() => router.push("/customer/vehicles")}
                className="min-h-12 w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
                    <Car className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Drive-Thru Vehicles</span>
                    <span className="text-[11px] text-gray-400">Make, color & plate numbers</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                type="button"
                onClick={() => router.push("/customer/favorites")}
                className="min-h-12 w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-950/40 text-red-500 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Favorites & Quick Reorder</span>
                    <span className="text-[11px] text-gray-400">Saved meals and vendors</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* BLOCK 3: SETTINGS & SUPPORT */}
            <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-2 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-1">
              <button
                type="button"
                onClick={() => router.push("/customer/settings")}
                className="min-h-12 w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">App Settings & Preferences</span>
                    <span className="text-[11px] text-gray-400">Dark mode, notifications, security</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                type="button"
                onClick={() => window.open("https://wa.me/2348172028728", "_blank")}
                className="min-h-12 w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">Instant Support</span>
                    <span className="text-[11px] text-gray-400">WhatsApp Coordinator & FAQ</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* STANDALONE LOGOUT */}
            <div className="pt-2 pb-6">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("chopnchop_session");
                  localStorage.removeItem("chopnchop-session");
                  localStorage.removeItem("chopnchop_token");
                  localStorage.removeItem("chopnchop_avatar"); // Clear cache on logout
                  router.push("/customer/login");
                }}
                className="min-h-12 w-full flex items-center justify-center gap-2 py-4 rounded-[20px] text-[15px] font-extrabold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <LogOut className="w-5 h-5" /> Log Out
              </button>
            </div>

          </div>

          {/* EDIT PROFILE MODAL (Bottom Sheet) */}
          {isEditModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:px-4 animate-in fade-in duration-300">
              <div className="w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-[32px] sm:rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                
                {/* Header Area */}
                <div className="p-6 pt-5 border-b border-gray-100 dark:border-zinc-800 shrink-0 relative">
                  <div className="w-12 h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full mx-auto mb-5 sm:hidden" />
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">Edit Profile</h2>
                    <button 
                      onClick={() => setIsEditModalOpen(false)}
                      className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-full text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Form Area */}
                <div className="p-6 overflow-y-auto pb-safe">
                  <form onSubmit={handleUpdateProfile} className="space-y-5">
                    
                    {updateError && (
                      <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[13px] font-medium rounded-xl text-center">
                        {updateError}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">First Name</label>
                        <input
                          type="text"
                          required
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                          className="w-full px-4 py-3.5 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[14px] text-gray-900 dark:text-white outline-none focus:border-[#FC6B31] transition-colors"
                        />
                      </div>
                      
                      <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">Last Name</label>
                        <input
                          type="text"
                          required
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                          className="w-full px-4 py-3.5 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[14px] text-gray-900 dark:text-white outline-none focus:border-[#FC6B31] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[14px] text-gray-900 dark:text-white outline-none focus:border-[#FC6B31] transition-colors"
                      />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800/30 rounded-2xl border border-gray-100 dark:border-zinc-800/50">
                      <input
                        type="checkbox"
                        id="marketingOptIn"
                        checked={editForm.marketingOptIn}
                        onChange={(e) => setEditForm({...editForm, marketingOptIn: e.target.checked})}
                        className="w-5 h-5 accent-[#FC6B31] rounded flex-shrink-0 cursor-pointer"
                      />
                      <label htmlFor="marketingOptIn" className="text-[13px] font-medium text-gray-600 dark:text-gray-400 cursor-pointer">
                        Receive marketing updates, newsletters, and exclusive promos via email.
                      </label>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-[18px] bg-[#FC6B31] text-[15px] font-extrabold text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-colors disabled:opacity-70 active:scale-[0.98]"
                      >
                        {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}