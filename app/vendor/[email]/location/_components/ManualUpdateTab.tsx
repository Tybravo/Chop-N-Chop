"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MousePointerClick,
  Loader2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  RefreshCw,
  Info,
} from "lucide-react";
import { vendorLocationService } from "@/services/vendor/location.service";
import { VendorHub, VendorZone, VendorCurrentLocation } from "@/types/vendor";

const selectCls =
  "w-full p-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white transition-all appearance-none pr-10 dark:[&>option]:bg-gray-900";

export default function ManualUpdateTab() {
  const [hubs, setHubs] = useState<VendorHub[]>([]);
  const [zones, setZones] = useState<VendorZone[]>([]);
  const [hubId, setHubId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [current, setCurrent] = useState<VendorCurrentLocation | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingZones, setLoadingZones] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /**
   * Load the vendor's current hub/zone (from profile) followed by the list of
   * all active hubs. If the vendor has a previously-selected hub, preselect it
   * and load its zones; if their saved hub is no longer in the active list (or
   * they have none yet), auto-select the FIRST hub in the list.
   */
  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError("");
    setInfo("");
    setMessage(null);
    try {
      const [saved, hubList] = await Promise.all([
        vendorLocationService.getMyLocation().catch(() => ({} as VendorCurrentLocation)),
        vendorLocationService.getHubs(),
      ]);
      setHubs(hubList);
      setCurrent(saved);

      if (hubList.length === 0) {
        setLoading(false);
        return;
      }

      // Try to keep the vendor's current hub; otherwise fall back to first.
      const targetHub = hubList.find((h) => h.id === saved.hubId) || hubList[0];
      setHubId(targetHub.id);

      try {
        setLoadingZones(true);
        const zoneList = await vendorLocationService.getZones(targetHub.id);
        setZones(zoneList);
        const targetZone =
          zoneList.find((z) => z.id === saved.zoneId) || zoneList.length > 0 ? zoneList[0] : null;
        setZoneId(targetZone?.id || "");

        if (saved.hubId && saved.hubId !== targetHub.id && targetHub === hubList[0] && !zoneList.some((z) => z.id === saved.zoneId)) {
          setInfo(
            "Your previously selected Hub is currently unavailable, so your saved zone could not be matched. The first available Hub and Zone have been selected — review and save to update."
          );
        } else if (!saved.hubId && !saved.zoneId) {
          setInfo(
            "You have not set a Hub and Zone yet. The first available Hub and Zone have been auto-selected for you — review and save."
          );
        }
      } finally {
        setLoadingZones(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load locations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const handleHubChange = async (hid: string) => {
    setHubId(hid);
    setZoneId("");
    setZones([]);
    setInfo("");
    if (!hid) return;
    setLoadingZones(true);
    try {
      const list = await vendorLocationService.getZones(hid);
      setZones(list);
      if (list.length > 0) setZoneId(list[0].id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load zones for this hub.");
    } finally {
      setLoadingZones(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hubId || !zoneId) {
      setMessage({ type: "error", text: "Please select both a Hub and a Zone to continue." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await vendorLocationService.updateLocation(hubId, zoneId);
      setMessage({ type: "success", text: res.message });
      const savedHub = hubs.find((h) => h.id === hubId);
      const savedZone = zones.find((z) => z.id === zoneId);
      setCurrent({ hubId, hubName: savedHub?.name, zoneId, zoneName: savedZone?.name });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update location." });
    } finally {
      setSaving(false);
    }
  };

  // ---- Loading skeleton ----
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-white dark:bg-[#26292C] rounded-xl p-6 h-40" />
        <div className="animate-pulse bg-white dark:bg-[#26292C] rounded-xl p-6 h-52" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/30 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1">{error}</div>
          <button
            onClick={loadInitial}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#FC6B31] hover:text-[#e55a20] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {message && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl text-sm ${
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

      {info && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 text-orange-800 dark:text-orange-300 border border-orange-100 dark:border-orange-800/30 text-sm">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          {info}
        </div>
      )}

      {/* Current location summary */}
      {current && (current.hubId || current.zoneId) && (
        <div className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
          <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">
            Current Assignment
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#FC6B31]" />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Hub</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {current.hubName || current.hubId || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <MousePointerClick className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Zone</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {current.zoneName || current.zoneId || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual selection form */}
      <form
        onSubmit={handleSave}
        className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-[#FC6B31]/30 dark:border-[#FC6B31]/30 p-6 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
            <MousePointerClick className="w-5 h-5 text-[#FC6B31]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Manual Update</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select the Hub and Zone your store operates from.
            </p>
          </div>
        </div>

        {hubs.length === 0 ? (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-3">
              <MapPin className="w-8 h-8 text-[#FC6B31]" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">No hubs available</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              There are no active hubs you can assign to right now. Please try again later.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Hub <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={hubId}
                  onChange={(e) => handleHubChange(e.target.value)}
                  className={selectCls}
                  required
                >
                  <option value="">Select a hub...</option>
                  {hubs.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                      {h.city ? ` — ${h.city}` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">
                Select only — values are read from the available hubs and cannot be typed.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Zone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className={selectCls}
                  disabled={!hubId || loadingZones}
                  required
                >
                  {loadingZones ? (
                    <option>Loading zones...</option>
                  ) : zones.length === 0 ? (
                    <option value="">No zones available for this hub</option>
                  ) : (
                    <>
                      <option value="">Select a zone...</option>
                      {zones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name}
                          {z.code ? ` (${z.code})` : ""}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              {loadingZones && (
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" /> Loading zones...
                </p>
              )}
              <p className="text-[10px] text-gray-400 dark:text-gray-500">
                Select only — zones belong to the chosen hub and cannot be typed.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving || !hubId || !zoneId || loadingZones}
              className="w-full min-h-[48px] px-8 py-3 bg-[#FC6B31] hover:bg-[#e55a20] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              {saving ? "Saving..." : "Update Location"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}