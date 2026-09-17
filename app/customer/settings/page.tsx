"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Bell, 
  ShieldAlert, 
  Smartphone, 
  KeyRound, 
  ChevronRight 
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailDigests, setEmailDigests] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [biometrics, setBiometrics] = useState(false);

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
          <div className="w-10 h-10" /> {/* Spacer for centering */}
        </div>

        {/* APPEARANCE SECTION */}
        <section className="space-y-2">
          <h2 className="text-[13px] font-extrabold text-gray-500 uppercase tracking-wider px-2">Appearance</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-2 border border-gray-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3" id="settings-dark-mode-label">
                <div className="w-9 h-9 rounded-full bg-orange-50 dark:bg-zinc-800 flex items-center justify-center text-gray-800 dark:text-zinc-200">
                  {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#FC6B31]" />}
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-gray-900 dark:text-white block">Dark Mode</span>
                  <span className="text-[11px] text-gray-400">Adjust app appearance</span>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-labelledby="settings-dark-mode-label"
                aria-checked={theme === "dark"}
                onClick={toggleTheme}
                className="relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${theme === "dark" ? "translate-x-6 bg-[#FC6B31]" : "translate-x-0 bg-gray-400"}`} />
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
                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
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
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${smsAlerts ? "bg-[#FC6B31]" : "bg-gray-200 dark:bg-zinc-700"}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${smsAlerts ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
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
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${pushNotifications ? "bg-[#FC6B31]" : "bg-gray-200 dark:bg-zinc-700"}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${pushNotifications ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
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
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailDigests ? "bg-[#FC6B31]" : "bg-gray-200 dark:bg-zinc-700"}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${emailDigests ? "translate-x-5" : "translate-x-0"}`} />
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
                <div className="w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
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
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${biometrics ? "bg-[#FC6B31]" : "bg-gray-200 dark:bg-zinc-700"}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${biometrics ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-gray-900 dark:text-white block">Change Password</span>
                  <span className="text-[11px] text-gray-400">Update account access</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

          </div>
        </section>

      </div>
    </div>
  );
}