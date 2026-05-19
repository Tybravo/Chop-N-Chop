"use client";

import { useState } from "react";
import { Settings, ChevronDown, ChevronUp } from "lucide-react";

type SettingItem = {
  id: string;
  label: string;
  description: string;
};

type SettingSection = {
  title: string;
  items: SettingItem[];
};

const settingsData: SettingSection[] = [
  {
    title: "1. Customer & Ordering Controls",
    items: [
      { id: "allowGuestCheckout", label: "Allow Guest Checkout", description: "Let customers order without creating an account." },
      { id: "systemWideOrdering", label: "System-Wide Ordering", description: "Pause all new incoming orders across the entire platform (useful during severe weather or system outages)." },
      { id: "scheduledOrders", label: "Scheduled Orders", description: "Allow customers to place orders for future delivery dates/times." },
      { id: "cashOnDelivery", label: "Cash on Delivery (COD)", description: "Permit customers to pay with cash upon receiving their food." },
      { id: "walletFunding", label: "Wallet/Wallet Funding", description: "Allow customers to fund and use an in-app digital wallet for purchases." },
    ]
  },
  {
    title: "2. Vendor (Restaurant/Store) Controls",
    items: [
      { id: "autoApproveVendors", label: "Auto-Approve New Vendors", description: "Bypass manual admin review and instantly activate new vendor registrations." },
      { id: "vendorSelfService", label: "Vendor Self-Service Payouts", description: "Allow vendors to initiate their own withdrawal requests from their earnings wallet." },
      { id: "dynamicSurge", label: "Dynamic Surge Pricing", description: "Automatically apply peak pricing to vendor menus during high-demand hours." },
      { id: "vendorCancellations", label: "Vendor-Initiated Cancellations", description: "Allow vendors to cancel accepted orders without requiring admin intervention." },
    ]
  },
  {
    title: "3. Dispatch Rider Controls",
    items: [
      { id: "autoAssignOrders", label: "Auto-Assign Orders", description: "System automatically assigns orders to the nearest available rider rather than waiting for manual dispatch." },
      { id: "riderCashLimit", label: "Rider Cash Collection Limit", description: "Restrict riders from accepting COD orders if they hold more than a specified amount of unremitted cash." },
      { id: "multiOrderBatching", label: "Multi-Order Batching", description: "Allow a single rider to pick up and deliver multiple orders on the same route simultaneously." },
      { id: "riderSelfRegistration", label: "Rider Self-Registration", description: "Allow new riders to sign up via the app (if disabled, only admins can create rider profiles)." },
    ]
  },
  {
    title: "4. Staff (Sub-Admin) & System Controls",
    items: [
      { id: "twoFactorAuth", label: "Two-Factor Authentication (2FA)", description: "Force all Sub-Admins to use OTP verification upon login." },
      { id: "actionAuditLogging", label: "Action Audit Logging", description: "Record every action (approvals, deletions, refunds) made by Sub-Admins for accountability." },
      { id: "automatedRefund", label: "Automated Refund Processing", description: "System automatically refunds customers to their wallet/card for canceled orders without Sub-Admin approval." },
      { id: "promoEmails", label: "Promotional & Marketing Emails", description: "Allow the system to send automated marketing blasts to opted-in users." },
    ]
  }
];

export default function SettingsPage() {
  // State for tracking which settings are enabled/disabled
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  // State for tracking which descriptions are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleToggle = (id: string) => {
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          System Settings
        </h1>
        <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100">
          <Settings className="w-4 h-4" />
          Global Controls
        </span>
      </div>

      <div className="space-y-8 max-w-4xl">
        {settingsData.map((section, idx) => (
          <div key={idx} className="admin-card p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.items.map(item => (
                <div 
                  key={item.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-colors"
                >
                  {/* Header row: Label + Toggle */}
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    onClick={() => handleExpand(item.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400 dark:text-gray-500">
                        {expanded[item.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 select-none">
                        {item.label}
                      </span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the accordion from toggling when clicking the switch
                        handleToggle(item.id);
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FC6B31] focus:ring-offset-2 ${
                        toggles[item.id] ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span className="sr-only">Toggle {item.label}</span>
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          toggles[item.id] ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  
                  {/* Expanded details */}
                  {expanded[item.id] && (
                    <div className="px-12 pb-4 pt-1 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/20">
                      {item.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
