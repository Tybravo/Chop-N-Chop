"use client";

import { useState } from "react";
import { MapPin, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { zoneService } from "@/services/admin/zone.service";

export default function AddZoneTab() {
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    baseDeliveryFee: "",
    estimatedDeliveryMinutes: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Create Zone (API creates in DRAFT mode) then patch to selected status
      const createdZone = await zoneService.createZone({
        name: form.name,
        code: form.code,
        description: form.description,
        baseDeliveryFee: Number(form.baseDeliveryFee),
        estimatedDeliveryMinutes: Number(form.estimatedDeliveryMinutes),
        hubId: "00000000-0000-0000-0000-000000000000",
        boundaryWkt: "POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))",
      });

      if (createdZone.id) {
        await zoneService.changeZoneStatus(createdZone.id, form.status);
      }

      setMessage({ type: "success", text: "Zone created successfully!" });
      setForm({
        name: "",
        code: "",
        description: "",
        baseDeliveryFee: "",
        estimatedDeliveryMinutes: "",
        status: "ACTIVE",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to create zone.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-[#FC6B31]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add New Zone</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Set up a delivery zone for vendors and riders.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {message && (
          <div
            className={`flex items-start gap-3 p-4 rounded-lg text-sm cnc-message-rise ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30"
                : "bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Zone Name</label>
            <input
              required
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              minLength={2}
              className="w-full p-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white placeholder-gray-400 transition-all"
              placeholder="e.g., Ikeja Mainland"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Zone Code</label>
            <input
              required
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              minLength={2}
              className="w-full p-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white placeholder-gray-400 transition-all"
              placeholder="e.g., IKJ-01"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            required
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white placeholder-gray-400 transition-all resize-none"
            placeholder="Describe the zone. Enhance the description by Landmark when inputting... e.g., Along Allen Avenue, close to the Ikeja City Mall landmark."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Base Delivery Fee (₦)</label>
            <input
              required
              type="number"
              name="baseDeliveryFee"
              value={form.baseDeliveryFee}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full p-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white placeholder-gray-400 transition-all"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Est. Delivery (Mins)</label>
            <input
              required
              type="number"
              name="estimatedDeliveryMinutes"
              value={form.estimatedDeliveryMinutes}
              onChange={handleChange}
              min="1"
              className="w-full p-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white placeholder-gray-400 transition-all"
              placeholder="e.g., 45"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white dark:[&>option]:bg-gray-900 transition-all"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto min-h-[44px] px-8 py-2.5 bg-[#FC6B31] hover:bg-[#e55a20] text-white font-medium rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating Zone..." : "Add Zone"}
          </button>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Zones are created as <span className="font-medium text-gray-600 dark:text-gray-300">Active</span> by default.
          </p>
        </div>
      </form>
    </div>
  );
}
