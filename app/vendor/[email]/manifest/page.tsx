"use client";

import { useState, useEffect } from "react";
import { vendorService, ManifestResponse, ManifestItem } from "@/services/vendor/vendor.service";
import { Calendar, ChevronLeft, ChevronRight, Download, RefreshCw, AlertCircle } from "lucide-react";

export default function ManifestPage() {
  const [manifest, setManifest] = useState<ManifestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [hubId, setHubId] = useState("");

  const fetchManifest = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await vendorService.getManifest(selectedDate, hubId || undefined);
      setManifest(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch manifest";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManifest();
  }, [selectedDate, hubId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTodayString = () => new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Production Manifest</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View aggregated production quotas for your orders
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 items-stretch sm:items-center">
          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={getTodayString()}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-[#FC6B31] focus:border-[#FC6B31]"
            />
          </div>

          <div className="relative w-full sm:w-48">
            <input
              type="text"
              placeholder="Hub ID (optional)"
              value={hubId}
              onChange={(e) => setHubId(e.target.value)}
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-[#FC6B31] focus:border-[#FC6B31]"
            />
          </div>

          <button
            onClick={fetchManifest}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FC6B31] text-white rounded-lg hover:bg-[#e35014] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800 dark:text-red-200">Failed to load manifest</p>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !manifest && (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FC6B31]"></div>
        </div>
      )}

      {/* Manifest Content */}
      {manifest && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="admin-card p-5">
              <p className="text-sm text-gray-500 dark:text-gray-400">Catalog Date</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {new Date(manifest.catalogDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <div className="admin-card p-5">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Dishes to Prepare</p>
              <p className="text-2xl font-bold text-[#FC6B31] mt-1">
                {manifest.totalDishesToPrepare.toLocaleString()}
              </p>
            </div>
            <div className="admin-card p-5">
              <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Revenue</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {formatCurrency(manifest.items.reduce((sum, item) => sum + item.expectedRevenue, 0))}
              </p>
            </div>
          </div>

          {/* Hub ID */}
          {manifest.hubId && (
            <div className="admin-card p-4 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Hub ID</p>
              <code className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {manifest.hubId}
              </code>
            </div>
          )}

          {/* Items Table */}
          <div className="admin-card overflow-hidden">
            {manifest.items.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No production items for this date.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Needed</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {manifest.items.map((item: ManifestItem) => (
                        <tr key={item.itemId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{item.itemName}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{item.itemId.slice(0, 8)}...</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                            {item.totalQuantityNeeded.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700 dark:text-gray-300">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(item.expectedRevenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals Footer */}
                <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">Total Items: {manifest.items.length}</span>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Total Qty: <span className="font-bold text-gray-900 dark:text-white">{manifest.totalDishesToPrepare.toLocaleString()}</span>
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-bold">
                      Total Revenue: {formatCurrency(manifest.items.reduce((sum, item) => sum + item.expectedRevenue, 0))}
                    </span>
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#FC6B31] border border-gray-300 dark:border-gray-700 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}