"use client";

import { useState, useEffect } from "react";
import { zoneService } from "@/services/admin/zone.service";
import { Zone } from "@/types/admin";
import { Eye, Edit, Trash2, X, Loader2, MapPin, AlertTriangle, Save, CheckCircle2, AlertCircle } from "lucide-react";

export default function UpdateZoneTab() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewZone, setViewZone] = useState<Zone | null>(null);

  const [editZone, setEditZone] = useState<Zone | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    code: "",
    description: "",
    baseDeliveryFee: "",
    estimatedDeliveryMinutes: "",
  });
  const [saving, setSaving] = useState(false);
  const [editMessage, setEditMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Zone | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  useEffect(() => {
    loadZones();
  }, []);

  // ---- View ----
  const handleView = async (zone: Zone) => {
    try {
      setViewZone(zone);
      const fresh = await zoneService.getZoneById(zone.id);
      setViewZone(fresh);
    } catch (err) {
      console.error(err);
      setViewZone(zone);
    }
  };

  const handleCloseView = () => setViewZone(null);

  // ---- Edit ----
  const handleEditClick = (zone: Zone) => {
    setEditMessage(null);
    setEditZone(zone);
    setEditForm({
      name: zone.name || "",
      code: zone.code || "",
      description: zone.description || "",
      baseDeliveryFee: zone.baseDeliveryFee?.toString() || "0",
      estimatedDeliveryMinutes: zone.estimatedDeliveryMinutes?.toString() || "0",
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editZone) return;
    setSaving(true);
    setEditMessage(null);
    try {
      const payload = {
        name: editForm.name,
        code: editForm.code,
        description: editForm.description,
        baseDeliveryFee: Number(editForm.baseDeliveryFee),
        estimatedDeliveryMinutes: Number(editForm.estimatedDeliveryMinutes),
        hubId: editZone.hubId || "00000000-0000-0000-0000-000000000000",
        boundaryWkt: "POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))",
      };

      await zoneService.updateZone(editZone.id, payload);

      // Optimistic update — no local storage, only in-memory React state
      setZones((prev) => prev.map((z) => (z.id === editZone.id ? { ...z, ...payload } : z)));
      setEditZone(null);
    } catch (err) {
      setEditMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update zone.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ---- Delete ----
  const handleDeleteClick = (zone: Zone) => {
    if (zone.status !== "INACTIVE") {
      setDeleteTarget({ ...zone, _blocked: true } as Zone & { _blocked: boolean });
      return;
    }
    setDeleteTarget(zone);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await zoneService.deleteZone(deleteTarget.id);
      setZones((prev) => prev.filter((z) => z.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      setDeleteTarget(null);
      alert(err instanceof Error ? err.message : "Failed to delete zone.");
    } finally {
      setDeleting(false);
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
        {status || "DRAFT"}
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

      {zones.length === 0 ? (
        <div className="bg-white dark:bg-[#26292C] rounded-xl border border-gray-100 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-[#FC6B31]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No zones found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            Add a zone from the &quot;Add Zone&quot; tab and it will appear here for updates and management.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#FC6B31]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{zones.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Zones</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {zones.filter((z) => z.status === "ACTIVE").length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active Zones</p>
            </div>
          </div>
        </div>
      )}

      {zones.length > 0 && (
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
                    <th className="px-6 py-4 font-medium">Description</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Manage Zone</th>
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
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[240px] truncate" title={zone.description}>
                        {zone.description || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center">{statusBadge(zone.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(zone)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#FC6B31] border-b-4 border-[#c04f1d] shadow-md hover:bg-[#e55a20] hover:border-[#a84418] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150"
                            title="View zone details"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleEditClick(zone)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 border-b-4 border-blue-800 shadow-md hover:bg-blue-500 hover:border-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150"
                            title="Edit zone"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(zone)}
                            disabled={zone.status !== "INACTIVE"}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              zone.status === "INACTIVE"
                                ? "text-white bg-red-600 border-b-4 border-red-800 shadow-md hover:bg-red-500 hover:border-red-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm"
                                : "text-gray-300 cursor-not-allowed"
                            }`}
                            title={zone.status === "INACTIVE" ? "Delete zone" : "Zone must be inactive to delete"}
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

                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{zone.description || "N/A"}</p>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleView(zone)}
                    className="w-full flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#FC6B31] border-b-4 border-[#c04f1d] shadow-md hover:bg-[#e55a20] hover:border-[#a84418] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => handleEditClick(zone)}
                    className="w-full flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 border-b-4 border-blue-800 shadow-md hover:bg-blue-500 hover:border-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(zone)}
                    disabled={zone.status !== "INACTIVE"}
                    className={`w-full flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                      zone.status === "INACTIVE"
                        ? "text-white bg-red-600 border-b-4 border-red-800 shadow-md hover:bg-red-500 hover:border-red-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm"
                        : "text-gray-300 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* VIEW MODAL */}
      {viewZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#26292C] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#FC6B31]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Zone Details</h3>
              </div>
              <button
                onClick={handleCloseView}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{viewZone.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Code</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{viewZone.code || "N/A"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{viewZone.description || "N/A"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Status</p>
                  <div className="pt-0.5">{statusBadge(viewZone.status)}</div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Base Delivery Fee</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {viewZone.baseDeliveryFee !== undefined && viewZone.baseDeliveryFee !== null
                      ? `₦${Number(viewZone.baseDeliveryFee).toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Est. Delivery Minutes</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{viewZone.estimatedDeliveryMinutes ?? "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Hub ID</p>
                  <p className="font-semibold text-gray-900 dark:text-white break-all">{viewZone.hubId || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#26292C] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Zone</h3>
              <button
                onClick={() => setEditZone(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              {editMessage && (
                <div
                  className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                    editMessage.type === "error"
                      ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  }`}
                >
                  {editMessage.type === "error" ? (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  {editMessage.text}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    required
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Code</label>
                  <input
                    required
                    type="text"
                    value={editForm.code}
                    onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  required
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Base Delivery Fee</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={editForm.baseDeliveryFee}
                    onChange={(e) => setEditForm({ ...editForm, baseDeliveryFee: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Est. Delivery Minutes</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={editForm.estimatedDeliveryMinutes}
                    onChange={(e) => setEditForm({ ...editForm, estimatedDeliveryMinutes: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditZone(null)}
                  className="flex-1 min-h-[44px] py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 min-h-[44px] py-2.5 bg-[#FC6B31] text-white rounded-lg hover:bg-[#e55a20] disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#26292C] rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden p-6 text-center">
            {(deleteTarget as Zone & { _blocked?: boolean })._blocked ? (
              <>
                <div className="w-14 h-14 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-7 h-7 text-yellow-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Cannot Delete Zone</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  &quot;{(deleteTarget as Zone & { _blocked?: boolean }).name || "This zone"}&quot; must be{" "}
                  <span className="font-semibold text-red-500">Inactive</span> before it can be deleted.
                  Change its status first.
                </p>
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="w-full min-h-[44px] py-2.5 bg-[#FC6B31] text-white rounded-lg hover:bg-[#e55a20] transition-colors font-medium"
                >
                  Got it
                </button>
              </>
            ) : (
              <>
                <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Zone?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Are you sure you want to permanently delete{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">{deleteTarget.name}</span>? This action
                  cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 min-h-[44px] py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={deleting}
                    className="flex-1 min-h-[44px] py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
