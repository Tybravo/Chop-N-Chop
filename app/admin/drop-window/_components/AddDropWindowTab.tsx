"use client";

import { useState } from "react";
import { Clock3, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { dropWindowService } from "@/services/admin/dropWindow.service";
import { DROP_WINDOW_TYPES, DropWindowType } from "@/types/admin";
import {
  HOURS_12,
  MINUTES_60,
  PERIODS,
  twelveTo24String,
} from "@/lib/hub-time";

const WINDOW_LABELS: Record<DropWindowType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  ALL_DAY: "All Day",
};

type Period = (typeof PERIODS)[number];
type DateRange = "today" | "tomorrow" | "custom";

const HOUR_RANGE = (
  <span className="text-[10px] text-gray-400 dark:text-gray-500">01–12</span>
);

const selectCls =
  "w-full p-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white transition-all dark:[&>option]:bg-gray-900";

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function AddDropWindowTab() {
  const [selectedWindows, setSelectedWindows] = useState<DropWindowType[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>("today");
  const [customDate, setCustomDate] = useState<string>("");
  const [fromHour, setFromHour] = useState("09");
  const [fromMinute, setFromMinute] = useState("00");
  const [fromPeriod, setFromPeriod] = useState<Period>("AM");
  const [toHour, setToHour] = useState("05");
  const [toMinute, setToMinute] = useState("00");
  const [toPeriod, setToPeriod] = useState<Period>("PM");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const toggleWindow = (w: DropWindowType) => {
    setMessage(null);
    setSelectedWindows((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]
    );
  };

  const handleClearAll = () => {
    setMessage(null);
    setSelectedWindows([]);
  };

  const resolveDate = (): string => {
    if (dateRange === "custom") return customDate || toDateString(new Date());
    const d = new Date();
    if (dateRange === "tomorrow") {
      d.setDate(d.getDate() + 1);
    }
    return toDateString(d);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (selectedWindows.length === 0) {
      setMessage({
        type: "error",
        text: "Please select at least one delivery window (Breakfast, Lunch, Dinner, or All Day).",
      });
      return;
    }

    const timeFrom = twelveTo24String({ hour: fromHour, minute: fromMinute, second: "00", period: fromPeriod });
    const timeTo = twelveTo24String({ hour: toHour, minute: toMinute, second: "00", period: toPeriod });

    setLoading(true);
    try {
      await dropWindowService.configureWindow({
        date: resolveDate(),
        windowTypes: selectedWindows,
        timeFrom,
        timeTo,
      });
      setMessage({
        type: "success",
        text: `Drop Off Window configured for ${selectedWindows
          .map((w) => WINDOW_LABELS[w])
          .join(", ")} (${timeFrom} – ${timeTo}).`,
      });
      setSelectedWindows([]);
      setFromHour("09");
      setFromMinute("00");
      setFromPeriod("AM");
      setToHour("05");
      setToMinute("00");
      setToPeriod("PM");
      setCustomDate("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to configure drop window.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center shrink-0">
          <Clock3 className="w-5 h-5 text-[#FC6B31]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Drop Off</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose delivery windows and the time period they apply to.
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

        {/* Drop Off Window */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              Drop Off Window
              <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
                (select one or more)
              </span>
            </h3>
            {selectedWindows.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-medium text-[#FC6B31] hover:text-[#e55a20] transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            {DROP_WINDOW_TYPES.map((w) => {
              const active = selectedWindows.includes(w);
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => toggleWindow(w)}
                  aria-pressed={active}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold min-h-[44px] transition-all duration-150 border-2 cursor-pointer ${
                    active
                      ? "bg-[#FC6B31] text-white border-[#FC6B31] shadow-md scale-[1.02]"
                      : "bg-white dark:bg-[#26292C] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#FC6B31]/50 hover:text-[#FC6B31] dark:hover:text-[#FC6B31]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      active ? "bg-white" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                  {WINDOW_LABELS[w]}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            The time period below will be applied to all selected windows.
          </p>
        </div>

        {/* Active Date */}
        <div className="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Active Date
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {(
              [
                { key: "today", label: "Today" },
                { key: "tomorrow", label: "Tomorrow" },
                { key: "custom", label: "Custom" },
              ] as { key: DateRange; label: string }[]
            ).map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => {
                  setDateRange(o.key);
                  setMessage(null);
                }}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium min-h-[44px] transition-all border-2 ${
                  dateRange === o.key
                    ? "bg-[#FC6B31] text-white border-[#FC6B31] shadow-md"
                    : "bg-white dark:bg-[#26292C] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#FC6B31]/50"
                }`}
              >
                {o.label}
              </button>
            ))}
            {dateRange === "custom" && (
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className={selectCls}
                style={{ width: "auto" }}
              />
            )}
          </div>
        </div>

        {/* Drop Off Time Period */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Drop Off Time Period
          </h3>

          {/* Time From */}
          <div className="mb-5">
            <label className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 block mb-2">
              Time From
            </label>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  Hour {HOUR_RANGE}
                </label>
                <select
                  value={fromHour}
                  onChange={(e) => setFromHour(e.target.value)}
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
                  value={fromMinute}
                  onChange={(e) => setFromMinute(e.target.value)}
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
                  Period
                </label>
                <select
                  value={fromPeriod}
                  onChange={(e) => setFromPeriod(e.target.value as Period)}
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

          {/* Time To */}
          <div>
            <label className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 block mb-2">
              Time To
            </label>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  Hour {HOUR_RANGE}
                </label>
                <select
                  value={toHour}
                  onChange={(e) => setToHour(e.target.value)}
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
                  value={toMinute}
                  onChange={(e) => setToMinute(e.target.value)}
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
                  Period
                </label>
                <select
                  value={toPeriod}
                  onChange={(e) => setToPeriod(e.target.value as Period)}
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
        </div>

        {/* Summary preview */}
        {selectedWindows.length > 0 && (
          <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 text-sm">
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1 flex items-center gap-2">
              <Clock3 className="w-4 h-4 text-[#FC6B31]" />
              Summary
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">{selectedWindows.map((w) => WINDOW_LABELS[w]).join(", ")}</span>{" "}
              · {twelveTo24String({ hour: fromHour, minute: fromMinute, second: "00", period: fromPeriod })} –{" "}
              {twelveTo24String({ hour: toHour, minute: toMinute, second: "00", period: toPeriod })} ·{" "}
              {resolveDate()}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto min-h-[44px] px-8 py-2.5 bg-[#FC6B31] hover:bg-[#e55a20] text-white font-medium rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Configuring..." : "Configure Drop Off Window"}
          </button>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Times are converted to 24-hour format before sending to the backend.
          </p>
        </div>
      </form>
    </div>
  );
}