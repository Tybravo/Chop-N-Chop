"use client";

import { useState, useEffect, useRef } from "react";
import { useVendorAuth } from "@/context/VendorAuthContext";
import { vendorService } from "@/services/vendor/vendor.service";
import { VendorProfile } from "@/types/vendor";
import { Loader2, Upload, User, Store, Mail, MapPin, Phone, X, RefreshCw, AlertCircle, Camera, FileText, ChevronDown } from "lucide-react";
import { SafeAvatar } from "@/components/SafeAvatar";
import { ImageCropperModal } from "@/components/admin/categories/ImageCropperModal";

// Shared with the vendor application form so the vendor can pick from the
// same options when updating. `value` is what the backend stores (must stay
// exact-match with the application form), `label` is what is shown.
const BUSINESS_CATEGORY_OPTIONS = [
  { value: "Restaurant", label: "Restaurant" },
  { value: "Fast food", label: "Fast Food" },
  { value: "Private chef", label: "Private Chef" },
  { value: "Bakery", label: "Bakery / Cafe" },
  { value: "Beverages", label: "Beverages" },
];

const KITCHEN_LOCATION_OPTIONS = ["Lagos Mainland"];

export default function UpdateProfilePage() {
  const { user, updateUser } = useVendorAuth();
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  // Storefront picture upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [pictureError, setPictureError] = useState("");
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [pendingCropFile, setPendingCropFile] = useState<File | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const fetchProfile = async () => {
    setFetching(true);
    setError("");
    try {
      // GET /api/v1/vendors/me/profile — the authenticated vendor's own
      // profile is resolved from the Bearer token (no id argument needed).
      const data = await vendorService.getProfile();
      setProfile(data);
      if (data.id && user && data.id !== user.id) {
        updateUser({ id: data.id });
      }
    } catch (err) {
      console.error(err);
      // Surface the real backend error message so the cause is visible.
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load profile. Please try again."
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the update succeeds, scroll the success message into view so the
  // vendor can see it immediately (the update button is at the bottom of the
  // form, far below the message which renders at the top).
  useEffect(() => {
    if (successMsg && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [successMsg]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!profile) return;
    const { name, value } = e.target;

    // Contact Phone: digits only, max 11 figures — same rule as the
    // vendor application form.
    if (name === "contactPhone") {
      const sanitized = value.replace(/\D/g, "").slice(0, 11);
      setProfile({ ...profile, [name]: sanitized });
      return;
    }

    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    // Contact Phone must be exactly 11 digits — same rule as the application form.
    if (!/^\d{11}$/.test(profile.contactPhone || "")) {
      setError("Contact Phone must be exactly 11 digits (0-9).");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setError("");
    try {
      const result = await vendorService.updateProfile(profile);
      setSuccessMsg(result.message || "Profile updated successfully");
      updateUser({
        ownerName: profile.ownerName,
        businessName: profile.businessName,
        contactPhone: profile.contactPhone,
        businessAddress: profile.businessAddress,
        businessCategory: profile.businessCategory,
        businessDescription: profile.businessDescription,
      });
      // Re-fetch the fresh profile from the backend to re-sync the form.
      const fresh = await vendorService.getProfile();
      setProfile(fresh);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // File picked from the device -> open the resize/crop modal with a zoom slider
  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1536000) {
      setPictureError("Image must be smaller than 1500KB");
      return;
    }

    setPictureError("");
    setPendingCropFile(file);
    setIsCropperOpen(true);

    // Reset input so the same file can be chosen again later
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Cropper submitted -> upload immediately and mirror the admin profile
  // picture flow: optimistically update the UI with the returned URL,
  // sync the auth context so the header storefront updates right away.
  const handleCropComplete = async (croppedFile: File) => {
    setIsCropperOpen(false);
    setPendingCropFile(null);
    if (!profile) return;

    setIsUploadingPicture(true);
    setPictureError("");
    try {
      const uploadResponse = await vendorService.uploadProfilePicture(croppedFile);

      // Force Next.js Image to bypass browser cache with a timestamp query string
      const cacheBustedUrl = `${uploadResponse.url}?t=${Date.now()}`;

      const updated = { ...profile, logoUrl: cacheBustedUrl };
      setProfile(updated);
      updateUser({ logoUrl: cacheBustedUrl });

      // Re-fetch so the persisted storefront stays in sync with the backend
      try {
        const fresh = await vendorService.getProfile();
        if (fresh.logoUrl) {
          setProfile(fresh);
        }
      } catch {
        // Backend may be momentarily slow — keep the optimistic URL.
      }
    } catch (err) {
      console.error(err);
      setPictureError(
        err instanceof Error ? err.message : "Failed to upload storefront image. Please try again."
      );
    } finally {
      setIsUploadingPicture(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#FC6B31]" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800 dark:text-red-200">Failed to load profile</p>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchProfile}
          className="w-full sm:w-auto px-4 py-2.5 bg-[#FC6B31] text-white rounded-lg font-medium hover:bg-[#e35a2b] transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#FC6B31]" />
      </div>
    );
  }

  const storefrontUrl =
    profile.logoUrl && profile.logoUrl.trim() !== ""
      ? profile.logoUrl
      : user?.logoUrl || "";

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Update Profile</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Keep your business details and storefront image up to date.
      </p>

      {successMsg && (
        <div ref={successRef} className="cnc-message-rise p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium flex justify-between items-center">
          <span>{successMsg}</span>
          <button type="button" onClick={() => setSuccessMsg("")} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 focus:outline-none p-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="cnc-message-rise p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium flex justify-between items-center">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 focus:outline-none p-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ===== Storefront / Profile Picture ===== */}
      <section className="admin-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 mb-5 flex items-center gap-2">
          <Camera className="w-5 h-5 text-[#FC6B31]" />
          Storefront Image
        </h2>

        {pictureError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm flex justify-between items-center">
            <span>{pictureError}</span>
            <button type="button" onClick={() => setPictureError("")} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 focus:outline-none p-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Square storefront avatar with rounded corners */}
          <div className="relative w-28 h-28 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-gray-100 dark:border-gray-800 shadow-sm shrink-0 bg-gray-200 dark:bg-gray-800">
            {storefrontUrl ? (
              <SafeAvatar
                src={storefrontUrl}
                alt="Storefront"
                fill
                sizes="112px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <Store className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>

          <div className="w-full flex flex-col items-start gap-1.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePictureChange}
              accept="image/jpeg, image/png, image/gif"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPicture}
              className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUploadingPicture ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {isUploadingPicture ? "Uploading..." : "Change Storefront Image"}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              JPG, GIF or PNG. Max size of 1500KB. Square is recommended.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Business Details ===== */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="admin-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#FC6B31]" />
            Business Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Business Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Store className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="businessName"
                  value={profile.businessName}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Owner Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="ownerName"
                  value={profile.ownerName}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Business Category</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  name="businessCategory"
                  value={profile.businessCategory || ""}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm appearance-none"
                >
                  <option value="" disabled>Select Category...</option>
                  {!BUSINESS_CATEGORY_OPTIONS.some(
                    (option) => option.value === profile.businessCategory
                  ) &&
                    profile.businessCategory && (
                      <option value={profile.businessCategory}>
                        {profile.businessCategory}
                      </option>
                    )}
                  {BUSINESS_CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Kitchen Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  name="businessAddress"
                  value={profile.businessAddress || ""}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm appearance-none"
                >
                  <option value="" disabled>Select Location...</option>
                  {!KITCHEN_LOCATION_OPTIONS.includes(
                    profile.businessAddress || ""
                  ) &&
                    profile.businessAddress && (
                      <option value={profile.businessAddress}>
                        {profile.businessAddress}
                      </option>
                    )}
                  {KITCHEN_LOCATION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Contact Phone
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="contactPhone"
                  value={profile.contactPhone || ""}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{11}"
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="Enter your 11-digit contact phone"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Account Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={profile.phone || ""}
                  readOnly
                  disabled
                  placeholder="Account phone (non-editable)"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  disabled
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Business Description</label>
            <textarea
              name="businessDescription"
              value={profile.businessDescription || ""}
              onChange={handleChange}
              rows={4}
              placeholder="Tell customers what makes your kitchen special..."
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm resize-none"
            />
          </div>
        </div>

        {/* Update Profile button - bottom of the page */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-[#FC6B31] text-white rounded-lg font-medium hover:bg-[#e35014] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>

      {pendingCropFile && (
        <ImageCropperModal
          imageFile={pendingCropFile}
          isOpen={isCropperOpen}
          onClose={() => {
            setIsCropperOpen(false);
            setPendingCropFile(null);
          }}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}