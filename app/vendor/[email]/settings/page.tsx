"use client";

import { useState } from "react";
import { Lock, Bell, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  
  const [pins, setPins] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailPayouts: true,
    smsOrders: false,
    pushAlerts: true
  });

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pins.new !== pins.confirm) {
      alert("PINs do not match");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setSuccess("PIN updated successfully.");
      setPins({ current: "", new: "", confirm: "" });
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }, 1000);
  };

  const handleNotifToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {success && (
        <div className="p-4 bg-green-50 text-green-600 rounded-lg text-sm font-medium">{success}</div>
      )}

      {/* PIN Settings */}
      <div className="admin-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#FC6B31]" /> Change PIN
        </h3>
        
        <form onSubmit={handlePinSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current PIN</label>
            <input type="password" required value={pins.current} onChange={e => setPins({...pins, current: e.target.value})} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New PIN</label>
            <input type="password" required value={pins.new} onChange={e => setPins({...pins, new: e.target.value})} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New PIN</label>
            <input type="password" required value={pins.confirm} onChange={e => setPins({...pins, confirm: e.target.value})} className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-900 text-sm" />
          </div>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-gray-900 text-white dark:bg-white dark:text-black rounded-lg font-medium hover:bg-[#FC6B31] dark:hover:bg-[#FC6B31] transition-colors flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update PIN"}
          </button>
        </form>
      </div>

      {/* Notification Settings */}
      <div className="admin-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#FC6B31]" /> Notification Preferences
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Email: New Orders</p>
              <p className="text-sm text-gray-500">Receive an email when a new order arrives.</p>
            </div>
            <button onClick={() => handleNotifToggle('emailOrders')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.emailOrders ? 'bg-[#FC6B31]' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.emailOrders ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Email: Payouts</p>
              <p className="text-sm text-gray-500">Receive an email when a payout is processed.</p>
            </div>
            <button onClick={() => handleNotifToggle('emailPayouts')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.emailPayouts ? 'bg-[#FC6B31]' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.emailPayouts ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">SMS: New Orders</p>
              <p className="text-sm text-gray-500">Receive an SMS when a new order arrives.</p>
            </div>
            <button onClick={() => handleNotifToggle('smsOrders')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.smsOrders ? 'bg-[#FC6B31]' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.smsOrders ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
