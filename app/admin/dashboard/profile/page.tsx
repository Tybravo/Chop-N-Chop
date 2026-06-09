"use client";

import { useEffect, useState, useRef } from "react";
import { User, Shield, Camera, Upload, Loader2, Eye, EyeOff, X } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { adminService } from "@/lib/api/admin.service";
import { UserProfileResponse } from "@/types/admin";
import Image from "next/image";

export default function ProfilePage() {
  const { user, updateUser } = useAdminAuth();
  const [liveProfile, setLiveProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Submission State
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  // Picture Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [pictureError, setPictureError] = useState("");

  // Security Form State
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isUpdatingPin, setIsUpdatingPin] = useState(false);
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");

  // PIN Visibility States
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await adminService.getProfile();
        setLiveProfile(profile);
        
        // Initialize form state
        setFirstName(profile.firstName || "");
        setLastName(profile.lastName || "");
        setPhone(profile.phone || "");
      } catch (error) {
        console.error("Failed to load live profile", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#FC6B31]" />
      </div>
    );
  }

  // Helper to handle Google Avatar sizing per backend instructions
  let avatarUrl = "https://i.pravatar.cc/150?img=47"; // Default fallback
  if (liveProfile?.profilePictureUrl && liveProfile.profilePictureUrl.trim() !== "") {
    avatarUrl = liveProfile.profilePictureUrl;
  } else if (user?.avatarUrl && user.avatarUrl.trim() !== "") {
    avatarUrl = user.avatarUrl;
  }
  
  if (avatarUrl.includes("googleusercontent.com") && !avatarUrl.includes("=s")) {
    avatarUrl += "=s150-c";
  }

  // Debugging log to see exactly what the backend returns
  console.log("Live Profile Data:", liveProfile);

  // If liveProfile is loaded but missing firstName/lastName, we fallback to user.name
  // However, the form inputs will explicitly use the split firstName/lastName state.
  const email = liveProfile?.email || user?.email || "";
  const role = liveProfile?.role || user?.role || "";

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");
    setIsUpdating(true);

    try {
      const updatedProfile = await adminService.updateProfile({
        firstName,
        lastName,
        phone,
      });
      
      setLiveProfile(updatedProfile);
      setUpdateSuccess("Profile updated successfully!");
      
      // Clear success message after 20 seconds
      setTimeout(() => setUpdateSuccess(""), 20000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setUpdateError(error.message);
      } else {
        setUpdateError("An unexpected error occurred while updating.");
      }
      // Clear error message after 20 seconds
      setTimeout(() => setUpdateError(""), 20000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Add some client-side validation for size (e.g. 800KB = 819200 bytes)
    if (file.size > 819200) {
      setPictureError("Image must be smaller than 800KB");
      return;
    }

    setPictureError("");
    setIsUploadingPicture(true);

    try {
      const uploadResponse = await adminService.uploadProfilePicture(file);
      
      // Update the local state instantly using the returned Cloudinary URL
      // This prevents a delay/flicker while waiting for the full profile re-fetch
      setLiveProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          profilePictureUrl: uploadResponse.url
        };
      });

      // Force Next.js Image component to bypass browser cache by appending a timestamp query string
      const cacheBustedUrl = `${uploadResponse.url}?t=${new Date().getTime()}`;

      // Update the global auth context so the header avatar changes immediately
      // and persists across page reloads
      updateUser({ avatarUrl: cacheBustedUrl });
      
      // Re-fetch the profile to ensure everything is synced
      // If the backend GET /profile endpoint doesn't immediately reflect the new URL 
      // due to database caching, the optimistic update above handles the UI gracefully.
      const profile = await adminService.getProfile();
      
      // Only override if the backend actually returned a valid URL to prevent 
      // the image from flickering back to the old one if the backend is slow.
      if (profile.profilePictureUrl) {
        setLiveProfile(profile);
      }
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        setPictureError(error.message);
      } else {
        setPictureError("An unexpected error occurred while uploading picture.");
      }
      setTimeout(() => setPictureError(""), 20000);
    } finally {
      setIsUploadingPicture(false);
      // Reset input value so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    setPinSuccess("");

    if (!oldPin) {
      setPinError("Please enter your current PIN");
      return;
    }

    if (newPin !== confirmPin) {
      setPinError("New PINs do not match");
      return;
    }

    if (newPin.length < 4) {
      setPinError("New PIN must be at least 4 characters long");
      return;
    }

    setIsUpdatingPin(true);

    try {
      await adminService.changePin({ oldPin: oldPin, newPin: newPin });
      setPinSuccess("PIN updated successfully!");
      setOldPin("");
      setNewPin("");
      setConfirmPin("");
      
      // Clear success message after 20 seconds
      setTimeout(() => setPinSuccess(""), 20000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setPinError(error.message);
      } else {
        setPinError("An unexpected error occurred while updating PIN.");
      }
      setTimeout(() => setPinError(""), 20000);
    } finally {
      setIsUpdatingPin(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          My Profile
        </h1>
        <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100">
          <User className="w-4 h-4" />
          Profile
        </span>
      </div>

      <div className="admin-card p-8 shadow-sm max-w-3xl">
        
        {/* Upload Picture Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#FC6B31]" />
            Upload Picture
          </h2>

          {pictureError && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm flex justify-between items-center">
              <span>{pictureError}</span>
              <button type="button" onClick={() => setPictureError("")} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 focus:outline-none">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-800 shadow-sm">
              <Image
                src={avatarUrl}
                alt="Profile Picture"
                fill
                sizes="96px"
                className="object-cover"
                priority
                unoptimized
              />
            </div>
            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePictureChange} 
                accept="image/jpeg, image/png, image/gif" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPicture}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUploadingPicture ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploadingPicture ? "Uploading..." : "Change Picture"}
              </button>
              <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
            </div>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800 my-8" />

        {/* Manage Profile Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-[#FC6B31]" />
            Manage Profile
          </h2>
          
          {updateError && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm flex justify-between items-center">
              <span>{updateError}</span>
              <button type="button" onClick={() => setUpdateError("")} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 focus:outline-none">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {updateSuccess && (
            <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg text-sm flex justify-between items-center">
              <span>{updateSuccess}</span>
              <button type="button" onClick={() => setUpdateSuccess("")} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 focus:outline-none">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleUpdateProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={role.replace("_", " ")}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed font-semibold"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isUpdating}
              className="bg-[#FC6B31] hover:bg-[#e35014] text-white px-6 py-2.5 rounded-lg transition-colors font-medium mt-4 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUpdating ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </section>

        <hr className="border-gray-100 dark:border-gray-800 my-8" />

        {/* Security Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#FC6B31]" />
            Security
          </h2>

          {pinError && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm flex justify-between items-center">
              <span>{pinError}</span>
              <button type="button" onClick={() => setPinError("")} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 focus:outline-none">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {pinSuccess && (
            <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg text-sm flex justify-between items-center">
              <span>{pinSuccess}</span>
              <button type="button" onClick={() => setPinSuccess("")} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 focus:outline-none">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleUpdatePin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current PIN
              </label>
              <div className="relative">
                <input
                  type={showOldPin ? "text" : "password"}
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  readOnly={role === "SUPER_ADMIN" || isUpdatingPin}
                  className={`w-full md:w-1/2 px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] transition-colors tracking-widest ${
                    role === "SUPER_ADMIN" 
                      ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed" 
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  }`}
                  placeholder={role === "SUPER_ADMIN" ? "Super Admins cannot change PIN here" : "••••"}
                  maxLength={4}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPin(!showOldPin)}
                  disabled={role === "SUPER_ADMIN"}
                  className={`absolute inset-y-0 right-[50%] md:right-auto md:left-[calc(50%-2.5rem)] flex items-center px-3 focus:outline-none ${role === "SUPER_ADMIN" ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                >
                  {showOldPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New PIN
              </label>
              <div className="relative">
                <input
                  type={showNewPin ? "text" : "password"}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  readOnly={role === "SUPER_ADMIN" || isUpdatingPin}
                  className={`w-full md:w-1/2 px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] transition-colors tracking-widest ${
                    role === "SUPER_ADMIN" 
                      ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed" 
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  }`}
                  placeholder={role === "SUPER_ADMIN" ? "Super Admins cannot change PIN here" : "••••"}
                  maxLength={4}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPin(!showNewPin)}
                  disabled={role === "SUPER_ADMIN"}
                  className={`absolute inset-y-0 right-[50%] md:right-auto md:left-[calc(50%-2.5rem)] flex items-center px-3 focus:outline-none ${role === "SUPER_ADMIN" ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                >
                  {showNewPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New PIN
              </label>
              <div className="relative">
                <input
                  type={showConfirmPin ? "text" : "password"}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  readOnly={role === "SUPER_ADMIN" || isUpdatingPin}
                  className={`w-full md:w-1/2 px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] transition-colors tracking-widest ${
                    role === "SUPER_ADMIN" 
                      ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed" 
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  }`}
                  placeholder={role === "SUPER_ADMIN" ? "Super Admins cannot change PIN here" : "••••"}
                  maxLength={4}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                  disabled={role === "SUPER_ADMIN"}
                  className={`absolute inset-y-0 right-[50%] md:right-auto md:left-[calc(50%-2.5rem)] flex items-center px-3 focus:outline-none ${role === "SUPER_ADMIN" ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                >
                  {showConfirmPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <button 
              type="submit"
              disabled={role === "SUPER_ADMIN" || isUpdatingPin}
              className={`px-6 py-2.5 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                role === "SUPER_ADMIN" || isUpdatingPin
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-[#FC6B31] hover:bg-[#e35014] text-white"
              }`}
            >
              {isUpdatingPin && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUpdatingPin ? "Updating..." : "Update PIN"}
            </button>
            {role === "SUPER_ADMIN" && (
              <p className="text-sm text-amber-600 dark:text-amber-500 mt-2">
                * PIN management is restricted for Super Admin accounts.
              </p>
            )}
          </form>
        </section>

      </div>
    </>
  );
}
