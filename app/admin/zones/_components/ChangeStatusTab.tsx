"use client";

import { useState, useEffect } from "react";
import { zoneService } from "@/services/admin/zone.service";
import { Zone } from "@/types/admin";
import { MapPin } from "lucide-react";

export default function ChangeStatusTab() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await zoneService.getZones();
      setZones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load zones");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (zone: Zone) => {
    // Only allow toggle between ACTIVE and INACTIVE
    // (If it's DRAFT, clicking toggle will activate it)
    const newStatus = zone.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    setUpdatingId(zone.id);
    try {
      await zoneService.changeZoneStatus(zone.id, newStatus);

      // Optimistic update — no local storage, only in-memory React state
      setZones((prev) =>
        prev.map((z) =>
          z.id === zone.id ? { ...z, status: newStatus } : z
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to change zone status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusBadge = (status: string) => {
    const s = (status || "UNKNOWN").toUpperCase();
    return (
      <span
        className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold ${
          s === "ACTIVE"
            ? "bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400"
            : s === "INACTIVE"
              ? "bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400"
              : "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
        }`}
      >
        {s}
      </span>
    );
  };

  const ToggleSwitch = ({ active, zoneId }: { active: boolean; zoneId: string }) => {
    const isUpdating = updatingId === zoneId;
    return (
      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label={`${active ? "Deactivate" : "Activate"} zone`}
        onClick={() => {
          const zone = zones.find((z) => z.id === zoneId);
          if (zone) handleToggle(zone);
        }}
        disabled={isUpdating}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FC6B31] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#26292C] ${
          active ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
        } ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="sr-only">
          {active ? "Zone is active. Click to deactivate." : "Zone is inactive. Click to activate."}
        </span>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            active ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
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

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/30 text-sm">
        <MapPin className="w-5 h-5 shrink-0" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {zones.length === 0 ? (
        <div className="bg-white dark:bg-[#26292C] rounded-xl border border-gray-100 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-[#FC6B31]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No zones found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            Add a zone from the &quot;Add Zone&quot; tab and it will appear here so you can control its status.
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
                    <th className="px-6 py-4 font-medium">Zone Name</th>
                    <th className="px-6 py-4 font-medium">Code</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {zones.map((zone, idx) => (
                    <tr key={zone.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 text-gray-400">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-gray-100 dark:border-gray-800">
                            <MapPin className="w-5 h-5 text-[#FC6B31]" />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">{zone.name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{zone.code || "N/A"}</td>
                      <td className="px-6 py-4 text-center">{statusBadge(zone.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <ToggleSwitch active={zone.status === "ACTIVE"} zoneId={zone.id} />
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
            {zones.map((zone, idx) => (
              <div
                key={zone.id}
                className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-[#FC6B31]/30 dark:border-[#FC6B31]/30 p-4 transition-all duration-300 hover:border-[#FC6B31] hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-gray-100 dark:border-gray-800 shrink-0">
                    <MapPin className="w-6 h-6 text-[#FC6B31]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      <span className="text-gray-400 text-sm mr-1">#{idx + 1}</span>
                      {zone.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{zone.code || "N/A"}</p>
                  </div>
                  {statusBadge(zone.status)}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {zone.status === "ACTIVE" ? "Zone is active" : "Zone is inactive"}
                  </p>
                  <ToggleSwitch active={zone.status === "ACTIVE"} zoneId={zone.id} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
