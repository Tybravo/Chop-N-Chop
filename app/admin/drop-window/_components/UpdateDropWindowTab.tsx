"use client";

import { useState, useEffect } from "react";
import { Clock3, CheckCircle2, AlertCircle, Eye, Edit, Trash2, X } from "lucide-react";
import { dropWindowService } from "@/services/admin/dropWindow.service";
import { DropWindowResponse, DropWindowType } from "@/types/admin";
import { formatTime12 } from "@/lib/hub-time";

const WINDOW_LABELS: Record<DropWindowType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  ALL_DAY: "All Day",
};

function windowLabel(w?: DropWindowType): string {
  return w ? WINDOW_LABELS[w] || w : "N/A";
}

export default function UpdateDropWindowTab() {
  const [windows, setWindows] = useState<DropWindowResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewWindow, setViewWindow] = useState<DropWindowResponse | null>(null);

  const loadWindows = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dropWindowService.getDropWindows();
      setWindows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load drop windows.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWindows();
  }, []);

  const statusBadge = (status?: string) => {
    const s = (status || "N/A").toUpperCase();
    const palette =
      s === "OPEN" || s === "SCHEDULED"
        ? "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400"
        : s === "CLOSED" || s === "COMPLETED" || s === "SOLD_OUT"
          ? "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
          : "bg-orange-50 text-[#FC6B31] border-orange-100 dark:bg-orange-900/20 dark:border-orange-800/30";
    return (
      <span
        className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold border ${palette}`}
      >
        {s}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse bg-white dark:bg-[#26292C] rounded-xl p-4 h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/30 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Not-yet-available note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 text-orange-800 dark:text-orange-300 border border-orange-100 dark:border-orange-800/30 text-sm">
        <Clock3 className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-0.5">List endpoint pending</p>
          <p>
            The backend list endpoint for existing drop windows is not deployed yet. As soon as it is available, add a
            GET endpoint to <code className="text-xs bg-orange-100 dark:bg-orange-900/30 px-1 py-0.5 rounded">dropWindow.service.ts</code> and configured windows will appear here.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
            <Clock3 className="w-5 h-5 text-[#FC6B31]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{windows.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Windows</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {windows.filter((w) => w.status === "OPEN" || w.status === "SCHEDULED").length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active Windows</p>
          </div>
        </div>
      </div>

      {windows.length === 0 ? (
        <div className="bg-white dark:bg-[#26292C] rounded-xl border border-gray-100 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
            <Clock3 className="w-8 h-8 text-[#FC6B31]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No drop windows found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            Configure a drop window from the &quot;Add Drop Off&quot; tab and it will appear here for updates.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-[#FC6B31]/30 dark:border-[#FC6B31]/30 overflow-hidden transition-all duration-300 hover:border-[#FC6B31] hover:shadow-xl hover:-translate-y-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-black/50 border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 font-medium w-14">#</th>
                    <th className="px-6 py-4 font-medium">Window</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Time From</th>
                    <th className="px-6 py-4 font-medium">Time To</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {windows.map((w, idx) => (
                    <tr key={w.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 text-gray-400">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-gray-100 dark:border-gray-800">
                            <Clock3 className="w-5 h-5 text-[#FC6B31]" />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {windowLabel(w.windowType)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{w.date || "N/A"}</td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{formatTime12(w.timeFrom)}</td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{formatTime12(w.timeTo)}</td>
                      <td className="px-6 py-4 text-center">{statusBadge(w.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewWindow(w)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#FC6B31] border-b-4 border-[#c04f1d] shadow-md hover:bg-[#e55a20] hover:border-[#a84418] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150"
                            title="View window details"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => {}}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 border-b-4 border-blue-800 shadow-md hover:bg-blue-500 hover:border-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150"
                            title="Edit window (coming soon)"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {}}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 border-b-4 border-red-800 shadow-md hover:bg-red-500 hover:border-red-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150"
                            title="Delete window (coming soon)"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4">
            {windows.map((w, idx) => (
              <div
                key={w.id}
                className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-[#FC6B31]/30 dark:border-[#FC6B31]/30 p-4 transition-all duration-300 hover:border-[#FC6B31] hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-gray-100 dark:border-gray-800 shrink-0">
                    <Clock3 className="w-6 h-6 text-[#FC6B31]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      <span className="text-gray-400 text-sm mr-1">#{idx + 1}</span>
                      {windowLabel(w.windowType)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{w.date || "N/A"}</p>
                  </div>
                  {statusBadge(w.status)}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {formatTime12(w.timeFrom)} – {formatTime12(w.timeTo)}
                </p>

                <div className="flex flex-col gap-2 mt-3">
                  <button
                    onClick={() => setViewWindow(w)}
                    className="w-full flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#FC6B31] border-b-4 border-[#c04f1d] shadow-md hover:bg-[#e55a20] hover:border-[#a84418] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* VIEW MODAL */}
      {viewWindow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#26292C] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <Clock3 className="w-4 h-4 text-[#FC6B31]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Drop Window Details</h3>
              </div>
              <button
                onClick={() => setViewWindow(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Window</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{windowLabel(viewWindow.windowType)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Status</p>
                  <div className="pt-0.5">{statusBadge(viewWindow.status)}</div>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Date</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{viewWindow.date || "N/A"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Time From</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatTime12(viewWindow.timeFrom)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Time To</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatTime12(viewWindow.timeTo)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}