"use client";

import { useState } from "react";
import { Warehouse, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { hubService } from "@/services/admin/hub.service";
import { NIGERIA_STATES, NIGERIA_COUNTRY, getStateCapital, getStateCities } from "@/lib/nigeria-locations";
import {
  HOURS_12,
  MINUTES_60,
  SECONDS_60,
  PERIODS,
  twelveTo24String,
} from "@/lib/hub-time";

const HOUR_RANGE = (
  <span className="text-[10px] text-gray-400 dark:text-gray-500">01–12</span>
);

type Period = (typeof PERIODS)[number];

export default function AddHubTab() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: NIGERIA_COUNTRY,
    openingHour: "12",
    openingMinute: "00",
    openingSecond: "00",
    openingPeriod: "AM" as Period,
    closingHour: "12",
    closingMinute: "00",
    closingSecond: "00",
    closingPeriod: "AM" as Period,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const cities = form.state ? getStateCities(form.state) : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value;
    if (e.target.name === "state") {
      // Auto-fill the city with the selected state's capital, keep country as Nigeria
      setForm((prev) => ({
        ...prev,
        state: value,
        city: getStateCapital(value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [e.target.name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await hubService.createHub({
        name: form.name,
        address: form.address,
        city: form.city,
        state: form.state,
        country: form.country || NIGERIA_COUNTRY,
        latitude: 0,
        longitude: 0,
        openingTime: twelveTo24String({
          hour: form.openingHour,
          minute: form.openingMinute,
          second: form.openingSecond,
          period: form.openingPeriod,
        }),
        closingTime: twelveTo24String({
          hour: form.closingHour,
          minute: form.closingMinute,
          second: form.closingSecond,
          period: form.closingPeriod,
        }),
      });

      setMessage({ type: "success", text: "Hub created successfully!" });
      setForm({
        name: "",
        address: "",
        city: "",
        state: "",
        country: NIGERIA_COUNTRY,
        openingHour: "12",
        openingMinute: "00",
        openingSecond: "00",
        openingPeriod: "AM",
        closingHour: "12",
        closingMinute: "00",
        closingSecond: "00",
        closingPeriod: "AM",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to create hub.",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectCls =
    "w-full p-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white transition-all dark:[&>option]:bg-gray-900";

  return (
    <div className="admin-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center shrink-0">
          <Warehouse className="w-5 h-5 text-[#FC6B31]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add New Hub</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Register a physical location for platforms.
          </p>
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

        {/* Name + Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hub Name</label>
            <input
              required
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              minLength={2}
              className="w-full p-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white placeholder-gray-400 transition-all"
              placeholder="e.g., Ikeja Hub"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <input
              required
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              minLength={3}
              className="w-full p-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white placeholder-gray-400 transition-all"
              placeholder="e.g., 14 Allen Avenue, Ikeja GRA"
            />
          </div>
        </div>

        {/* State + City + Country */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
            <select
              required
              name="state"
              value={form.state}
              onChange={handleChange}
              className={selectCls}
            >
              <option value="">Select a state...</option>
              {NIGERIA_STATES.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
            <select
              required
              name="city"
              value={form.city}
              onChange={handleChange}
              className={selectCls}
            >
              <option value="">Select a city...</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Cities in the selected state, with the capital listed first.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
            <select
              required
              name="country"
              value={form.country}
              onChange={handleChange}
              className={selectCls}
              disabled
            >
              <option value={NIGERIA_COUNTRY}>{NIGERIA_COUNTRY}</option>
            </select>
          </div>
        </div>

        {/* Opening Time */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-3">
            Opening Time
          </label>
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Hour {HOUR_RANGE}
              </label>
              <select
                name="openingHour"
                value={form.openingHour}
                onChange={handleChange}
                className={selectCls}
              >
                {HOURS_12.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Minute
              </label>
              <select
                name="openingMinute"
                value={form.openingMinute}
                onChange={handleChange}
                className={selectCls}
              >
                {MINUTES_60.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Second
              </label>
              <select
                name="openingSecond"
                value={form.openingSecond}
                onChange={handleChange}
                className={selectCls}
              >
                {SECONDS_60.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Period
              </label>
              <select
                name="openingPeriod"
                value={form.openingPeriod}
                onChange={handleChange}
                className={selectCls}
              >
                {PERIODS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Closing Time */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-3">
            Closing Time
          </label>
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Hour {HOUR_RANGE}
              </label>
              <select
                name="closingHour"
                value={form.closingHour}
                onChange={handleChange}
                className={selectCls}
              >
                {HOURS_12.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Minute
              </label>
              <select
                name="closingMinute"
                value={form.closingMinute}
                onChange={handleChange}
                className={selectCls}
              >
                {MINUTES_60.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Second
              </label>
              <select
                name="closingSecond"
                value={form.closingSecond}
                onChange={handleChange}
                className={selectCls}
              >
                {SECONDS_60.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Period
              </label>
              <select
                name="closingPeriod"
                value={form.closingPeriod}
                onChange={handleChange}
                className={selectCls}
              >
                {PERIODS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto min-h-[44px] px-8 py-2.5 bg-[#FC6B31] hover:bg-[#e55a20] text-white font-medium rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating Hub..." : "Add Hub"}
          </button>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Hubs are created as <span className="font-medium text-gray-600 dark:text-gray-300">Active</span> by default.
          </p>
        </div>
      </form>
    </div>
  );
}