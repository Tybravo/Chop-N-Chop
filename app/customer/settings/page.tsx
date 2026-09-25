"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import { customerApiClient } from "@/lib/api/customerApiClient";
import axios from "axios";
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Bell, 
  ShieldAlert, 
  Smartphone, 
  KeyRound, 
  ChevronRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  Loader2
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  
  // Hydration safety guard
  const [isMounted, setIsMounted] = useState(false);

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailDigests, setEmailDigests] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [biometrics, setBiometrics] = useState(false);

  // --- Change PIN Modal States ---
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isDark = isMounted && theme === "dark";

  // --- Handlers ---
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

    setIsLoading(true);
    try {
await customerApiClient.put("/api/v1/auth/change-pin", {
        oldPin: currentPin,
        newPin: newPin
      });

      setPinSuccess(true);
      setTimeout(() => {
        setPinSuccess(false);
        setIsPinModalOpen(false);
        setCurrentPin("");
        setNewPin("");
        setConfirmPin("");
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setPinError(err.response.data?.message || err.response.data?.error || "Failed to update PIN. Please check your current PIN.");
      } else {
        setPinError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNumericInput = (val: string, setter: (val: string) => void) => {
    setter(val.replace(/\D/g, "").slice(0, 4));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-32 pt-4 px-4 sm:px-6 lg:px-8 selection:bg-[#FC6B31] selection:text-white">
      <div className="max-w-md sm:max-w-xl lg:max-w-2xl mx-auto space-y-6">
        
        {/* TOP HEADER */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => router.push("/customer/profile")}
            aria-label="Go back to profile"
            className="w-11 h-11 rounded-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">Settings</h1>
          <div className="w-10 h-10" />
        </div>

        {/* APPEARANCE SECTION */}
        <section className="space-y-2">
          <h2 className="text-[13px] font-extrabold text-gray-500 uppercase tracking-wider px-2">Appearance</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-2 border border-gray-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3" id="settings-dark-mode-label">
                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-zinc-800 flex items-center justify-center text-gray-800 dark:text-zinc-200">
                  {isMounted ? (
                    isDark ? (
                      <Moon className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <Sun className="w-5 h-5 text-[#FC6B31]" />
                    )
                  ) : (
                    <div className="w-5 h-5" />
                  )}
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-gray-900 dark:text-white block">Dark Mode</span>
                  <span className="text-[11px] text-gray-400">
                    Currently: <strong className="text-gray-700 dark:text-gray-200 capitalize">{isMounted ? theme : "Loading..."}</strong>
                  </span>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-labelledby="settings-dark-mode-label"
                aria-checked={isDark}
                onClick={toggleTheme}
                className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] shadow-inner ${
                  isDark 
                    ? "bg-zinc-900 border-indigo-500" 
                    : "bg-orange-100 border-[#FC6B31]"
                }`}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                <span className="absolute left-2 text-[10px] font-extrabold text-[#FC6B31]">☀️</span>
                <span className="absolute right-2 text-[10px] font-extrabold text-indigo-400">🌙</span>
                <span className={`pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
                  isDark ? "translate-x-8 bg-indigo-600" : "translate-x-1 bg-[#FC6B31]"
                }`} />
              </button>
            </div>
          </div>
        </section>

        {/* NOTIFICATIONS SECTION */}
        <section className="space-y-2">
          <h2 className="text-[13px] font-extrabold text-gray-500 uppercase tracking-wider px-2">Notifications</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-2 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-1">
            
            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-gray-900 dark:text-white block">SMS Alerts</span>
                  <span className="text-[11px] text-gray-400">Dispatch & arrival texts</span>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={smsAlerts}
                onClick={() => setSmsAlerts(!smsAlerts)}
                className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-300 ease-in-out focus:outline-none shadow-inner ${
                  smsAlerts ? "bg-[#FC6B31]/20 border-[#FC6B31]" : "bg-gray-200 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
                }`}
              >
                <span className={`absolute left-2 text-[9px] font-extrabold text-[#FC6B31] ${smsAlerts ? "opacity-100" : "opacity-0"}`}>ON</span>
                <span className={`absolute right-2 text-[9px] font-extrabold text-gray-400 ${!smsAlerts ? "opacity-100" : "opacity-0"}`}>OFF</span>
                <span className={`pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
                  smsAlerts ? "translate-x-8 bg-[#FC6B31]" : "translate-x-1 bg-gray-400"
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-gray-900 dark:text-white block">Push Notifications</span>
                  <span className="text-[11px] text-gray-400">In-app alerts & updates</span>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={pushNotifications}
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-300 ease-in-out focus:outline-none shadow-inner ${
                  pushNotifications ? "bg-[#FC6B31]/20 border-[#FC6B31]" : "bg-gray-200 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
                }`}
              >
                <span className={`absolute left-2 text-[9px] font-extrabold text-[#FC6B31] ${pushNotifications ? "opacity-100" : "opacity-0"}`}>ON</span>
                <span className={`absolute right-2 text-[9px] font-extrabold text-gray-400 ${!pushNotifications ? "opacity-100" : "opacity-0"}`}>OFF</span>
                <span className={`pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
                  pushNotifications ? "translate-x-8 bg-[#FC6B31]" : "translate-x-1 bg-gray-400"
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-gray-900 dark:text-white block">Email Digests</span>
                  <span className="text-[11px] text-gray-400">Weekly summary emails</span>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={emailDigests}
                onClick={() => setEmailDigests(!emailDigests)}
                className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-300 ease-in-out focus:outline-none shadow-inner ${
                  emailDigests ? "bg-[#FC6B31]/20 border-[#FC6B31]" : "bg-gray-200 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
                }`}
              >
                <span className={`absolute left-2 text-[9px] font-extrabold text-[#FC6B31] ${emailDigests ? "opacity-100" : "opacity-0"}`}>ON</span>
                <span className={`absolute right-2 text-[9px] font-extrabold text-gray-400 ${!emailDigests ? "opacity-100" : "opacity-0"}`}>OFF</span>
                <span className={`pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
                  emailDigests ? "translate-x-8 bg-[#FC6B31]" : "translate-x-1 bg-gray-400"
                }`} />
              </button>
            </div>

          </div>
        </section>

        {/* SECURITY SECTION */}
        <section className="space-y-2">
          <h2 className="text-[13px] font-extrabold text-gray-500 uppercase tracking-wider px-2">Security</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-2 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-1">
            
            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-600 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-gray-900 dark:text-white block">Biometric Login</span>
                  <span className="text-[11px] text-gray-400">FaceID / Fingerprint</span>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={biometrics}
                onClick={() => setBiometrics(!biometrics)}
                className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-300 ease-in-out focus:outline-none shadow-inner ${
                  biometrics ? "bg-[#FC6B31]/20 border-[#FC6B31]" : "bg-gray-200 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
                }`}
              >
                <span className={`absolute left-2 text-[9px] font-extrabold text-[#FC6B31] ${biometrics ? "opacity-100" : "opacity-0"}`}>ON</span>
                <span className={`absolute right-2 text-[9px] font-extrabold text-gray-400 ${!biometrics ? "opacity-100" : "opacity-0"}`}>OFF</span>
                <span className={`pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
                  biometrics ? "translate-x-8 bg-[#FC6B31]" : "translate-x-1 bg-gray-400"
                }`} />
              </button>
            </div>

            {/* Change PIN Button Trigger */}
            <button 
              onClick={() => setIsPinModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-zinc-800 text-[#FC6B31] flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-gray-900 dark:text-white block">Change Security PIN</span>
                  <span className="text-[11px] text-gray-400">Update account access PIN</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

          </div>
        </section>

      </div>

      {/* CHANGE PIN MODAL */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[32px] p-6 shadow-2xl border border-orange-100 dark:border-zinc-800 space-y-5 relative">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900/40 text-[#FC6B31] flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Change Security PIN</h3>
              </div>
              <button 
                onClick={() => setIsPinModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pinSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-gray-900 dark:text-white">PIN Updated!</h4>
                <p className="text-xs text-gray-500">Your security PIN has been successfully updated.</p>
              </div>
            ) : (
              <form onSubmit={handleChangePinSubmit} className="space-y-4" autoComplete="off">
                
                {pinError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium text-center">
                    {pinError}
                  </div>
                )}

                {/* Current PIN */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Current PIN</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showCurrentPin ? "text" : "password"}
                      name="current-pin-disable-autofill"
                      autoComplete="new-password"
                      inputMode="numeric" pattern="\d{4}" maxLength={4}
                      required
                      placeholder="••••"
                      value={currentPin}
                      onChange={(e) => handleNumericInput(e.target.value, setCurrentPin)}
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-mono tracking-widest text-gray-900 dark:text-white outline-none focus:border-[#FC6B31]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPin(!showCurrentPin)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New PIN */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">New PIN</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showNewPin ? "text" : "password"}
                      name="new-pin-disable-autofill"
                      autoComplete="new-password"
                      inputMode="numeric" pattern="\d{4}" maxLength={4}
                      required
                      placeholder="••••"
                      value={newPin}
                      onChange={(e) => handleNumericInput(e.target.value, setNewPin)}
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-mono tracking-widest text-gray-900 dark:text-white outline-none focus:border-[#FC6B31]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPin(!showNewPin)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New PIN */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Confirm New PIN</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPin ? "text" : "password"}
                      name="confirm-pin-disable-autofill"
                      autoComplete="new-password"
                      inputMode="numeric" pattern="\d{4}" maxLength={4}
                      required
                      placeholder="••••"
                      value={confirmPin}
                      onChange={(e) => handleNumericInput(e.target.value, setConfirmPin)}
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-mono tracking-widest text-gray-900 dark:text-white outline-none focus:border-[#FC6B31]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPin(!showConfirmPin)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPinModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-2xl border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FC6B31] text-xs font-extrabold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update PIN"}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}