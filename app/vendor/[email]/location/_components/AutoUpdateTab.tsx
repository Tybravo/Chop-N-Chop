"use client";

import { useState, useCallback } from "react";
import {
  LocateFixed,
  LocateOff,
  Loader2,
  MapPin,
  Navigation,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { vendorLocationService } from "@/services/vendor/location.service";
import { VendorHub, VendorZone } from "@/types/vendor";

type DetectionState =
  | "idle"
  | "requesting"
  | "locating"
  | "found"
  | "denied"
  | "unsupported"
  | "error";

interface DetectedMatch {
  zone: { id: string; name: string; code?: string };
  hub: VendorHub | null;
}

interface GeoPos {
  lat: number;
  lng: number;
  accuracy?: number;
}

const selectCls =
  "w-full p-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white transition-all dark:[&>option]:bg-gray-900";

export default function AutoUpdateTab() {
  const [detectState, setDetectState] = useState<DetectionState>("idle");
  const [geoPos, setGeoPos] = useState<GeoPos | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [detected, setDetected] = useState<DetectedMatch | null>(null);

  // After the zone is resolved, we load the real hub + zone options so the
  // vendor can review/confirm before saving.
  const [hubs, setHubs] = useState<VendorHub[]>([]);
  const [zones, setZones] = useState<VendorZone[]>([]);
  const [hubId, setHubId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /**
   * Ask the browser for the device's position. Defaults to high accuracy
   * with a generous timeout; when the user denies, we show an explicit
   * "turn your location on" prompt (matching the mobile native pattern).
   */
  const detectLocation = useCallback(() => {
    setMessage(null);
    setErrorMsg("");

    if (!("geolocation" in navigator)) {
      setDetectState("unsupported");
      return;
    }

    setDetectState("requesting");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setDetectState("locating");
        void resolveAndApply(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setDetectState("denied");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setDetectState("error");
          setErrorMsg("Your location is currently unavailable. Try again or use Manual Update.");
        } else {
          setDetectState("error");
          setErrorMsg("We could not detect your location. Try again or use Manual Update.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  /**
   * Resolve the GPS coordinate into a zone (POST /api/v1/zones/resolve),
   * then fetch the hub list + the zones of the resolved hub so the vendor
   * can confirm the assignment before saving.
   */
  const resolveAndApply = async (lat: number, lng: number) => {
    try {
      const resolved = await vendorLocationService.resolveZone(lat, lng);

      setLoadingOptions(true);
      try {
        const hubList = await vendorLocationService.getHubs();
        setHubs(hubList);
        const matchingHub = hubList.find((h) => h.id === resolved.hubId) || hubList[0] || null;
        setHubId(matchingHub?.id || "");
        setDetected({
          zone: {
            id: resolved.zoneId,
            name: resolved.zoneName,
            code: resolved.zoneCode,
          },
          hub: matchingHub,
        });

        if (matchingHub) {
          const zoneList = await vendorLocationService.getZones(matchingHub.id);
          setZones(zoneList);
          const matchingZone = zoneList.find((z) => z.id === resolved.zoneId) || zoneList[0] || null;
          setZoneId(matchingZone?.id || resolved.zoneId);
        } else {
          setZoneId(resolved.zoneId);
        }
      } finally {
        setLoadingOptions(false);
      }

      setDetectState("found");
    } catch (err) {
      setDetectState("error");
      setErrorMsg(err instanceof Error ? err.message : "Could not resolve your location to a delivery zone.");
    }
  };

  const handleHubChange = async (hid: string) => {
    setHubId(hid);
    setZoneId("");
    setZones([]);
    if (!hid) return;
    setLoadingOptions(true);
    try {
      const list = await vendorLocationService.getZones(hid);
      setZones(list);
      if (list.length > 0) setZoneId(list[0].id);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to load zones for this hub.");
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hubId || !zoneId) {
      setMessage({ type: "error", text: "Please select a Hub and Zone to continue." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await vendorLocationService.updateLocation(hubId, zoneId);
      setMessage({ type: "success", text: res.message });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update location." });
    } finally {
      setSaving(false);
    }
  };

  const coordsLabel = geoPos
    ? `${geoPos.lat.toFixed(5)}, ${geoPos.lng.toFixed(5)}`
    : null;

  return (
    <div className="space-y-6">
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

      {/* Detection card */}
      <div className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center shrink-0">
            <LocateFixed className="w-5 h-5 text-[#FC6B31]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Auto Detect Location</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Detect your device location and resolve it to the nearest Hub and Zone.
            </p>
          </div>
        </div>

        <div className="p-6 flex flex-col items-center text-center">
          {detectState === "idle" && (
            <>
              <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
                <Navigation className="w-10 h-10 text-[#FC6B31]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Turn on your location</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-5 max-w-md">
                We need your device location to automatically find the Hub and Zone your store operates from. Your
                location is only used to resolve a delivery zone.
              </p>
              <button
                onClick={detectLocation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-3 bg-[#FC6B31] text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:bg-[#e55a20] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
              >
                <LocateFixed className="w-5 h-5" />
                Turn On &amp; Detect Location
              </button>
            </>
          )}

          {detectState === "requesting" && (
            <div className="py-6 flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-[#FC6B31] animate-spin mb-4" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                Checking for location permission...
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                A prompt may appear — please allow access.
              </p>
            </div>
          )}

          {detectState === "locating" && (
            <div className="py-6 flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-[#FC6B31] animate-spin mb-4" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">Detecting your location...</p>
              {coordsLabel && (
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 font-mono">{coordsLabel}</p>
              )}
            </div>
          )}

          {detectState === "found" && (
            <>
              <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Location Detected</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-5 max-w-md">
                Your device was mapped to a delivery zone. Review the Hub and Zone below, then save to confirm.
              </p>
              {coordsLabel && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 font-mono bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-1.5">
                  {coordsLabel}
                </p>
              )}
            </>
          )}

          {(detectState === "denied" || detectState === "error" || detectState === "unsupported") && (
            <>
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                  detectState === "denied"
                    ? "bg-red-50 dark:bg-red-900/20"
                    : "bg-yellow-50 dark:bg-yellow-900/20"
                }`}
              >
                {detectState === "denied" ? (
                  <LocateOff className="w-10 h-10 text-red-500 dark:text-red-400" />
                ) : (
                  <MapPin className="w-10 h-10 text-yellow-500" />
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {detectState === "denied"
                  ? "Location is turned off"
                  : detectState === "unsupported"
                    ? "Location not supported"
                    : "Location could not be detected"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-5 max-w-md">
                {detectState === "denied" ? (
                  <>
                    Please turn on location for this site in your browser or device settings, then try again. You can
                    also use{" "}
                    <span className="font-semibold text-[#FC6B31]">Manual Update</span> to select your Hub and Zone.
                  </>
                ) : (
                  errorMsg ||
                  "We could not determine your location. Please try again or use Manual Update."
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={detectLocation}
                  className="flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 bg-[#FC6B31] text-white font-semibold rounded-xl hover:bg-[#e55a20] transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                {detectState === "denied" && (
                  <button
                    onClick={() => {
                      if ("geolocation" in navigator) navigator.geolocation.getCurrentPosition(() => {});
                    }}
                    className="flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Open Permission
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Review / confirm card — visible after a successful detection */}
      {detectState === "found" && (
        <form
          onSubmit={handleSave}
          className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-[#FC6B31]/30 dark:border-[#FC6B31]/30 p-6 space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#FC6B31]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Confirm Hub &amp; Zone</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Detected zone: <span className="font-semibold text-[#FC6B31]">{detected?.zone.name}</span>
                {detected?.zone.code ? ` (${detected.zone.code})` : ""}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hub</label>
            {detected?.hub ? (
              <div className="relative">
                <select
                  value={hubId}
                  onChange={(e) => handleHubChange(e.target.value)}
                  className={`${selectCls} appearance-none pr-10`}
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
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Your detected zone is attached to the selected hub. Pick the closest hub, then confirm the zone.
                {loadingOptions && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Zone</label>
            <div className="relative">
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className={`${selectCls} appearance-none pr-10`}
                disabled={!hubId || loadingOptions}
              >
                {loadingOptions ? (
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
            {loadingOptions && (
              <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" /> Loading zones...
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving || !hubId || !zoneId || loadingOptions}
            className="w-full min-h-[48px] px-8 py-3 bg-[#FC6B31] hover:bg-[#e55a20] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Location"}
          </button>
        </form>
      )}
    </div>
  );
}