"use client";

import { useState, useEffect } from "react";
import { hubService } from "@/services/admin/hub.service";
import { Hub, OpeningTime } from "@/types/admin";
import { NIGERIA_STATES, NIGERIA_COUNTRY, getStateCapital } from "@/lib/nigeria-locations";
import {
  Eye,
  Edit,
  Trash2,
  X,
  Loader2,
  Warehouse,
  AlertTriangle,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatTime(t: OpeningTime): string {
  if (!t) return "N/A";
  const { hour = 0, minute = 0, second = 0 } = t;
  return `${pad2(hour)}:${pad2(minute)}:${pad2(second)}`;
}

const HOURS = Array.from({ length: 24 }, (_, i) => pad2(i));
const MINUTES = Array.from({ length: 60 }, (_, i) => pad2(i));
const SECONDS = Array.from({ length: 60 }, (_, i) => pad2(i));

interface EditForm {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  openingHour: string;
  openingMinute: string;
  openingSecond: string;
  closingHour: string;
  closingMinute: string;
  closingSecond: string;
}

function timeToForm(t: OpeningTime): { hour: string; minute: string; second: string } {
  return {
    hour: pad2(t?.hour ?? 0),
    minute: pad2(t?.minute ?? 0),
    second: pad2(t?.second ?? 0),
  };
}

function toTimeString(form: { hour: string; minute: string; second: string }): string {
  return `${pad2(Number(form.hour) || 0)}:${pad2(Number(form.minute) || 0)}:${pad2(Number(form.second) || 0)}`;
}

export default function UpdateHubTab() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewHub, setViewHub] = useState<Hub | null>(null);

  const [editHub, setEditHub] = useState<Hub | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [editMessage, setEditMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Hub | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadHubs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await hubService.getHubs();
      setHubs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load hubs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHubs();
  }, []);

  // ---- View ----
  const handleView = async (hub: Hub) => {
    try {
      setViewHub(hub);
      const fresh = await hubService.getHubById(hub.id);
      setViewHub(fresh);
    } catch (err) {
      console.error(err);
      setViewHub(hub);
    }
  };

  // ---- Edit ----
  const handleEditClick = (hub: Hub) => {
    setEditMessage(null);
    setEditHub(hub);
    const open = timeToForm(hub.openingTime);
    const close = timeToForm(hub.closingTime);
    setEditForm({
      name: hub.name || "",
      address: hub.address || "",
      city: hub.city || "",
      state: hub.state || "",
      country: hub.country || NIGERIA_COUNTRY,
      openingHour: open.hour,
      openingMinute: open.minute,
      openingSecond: open.second,
      closingHour: close.hour,
      closingMinute: close.minute,
      closingSecond: close.second,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editHub || !editForm) return;
    setSaving(true);
    setEditMessage(null);
    try {
      const payload = {
        name: editForm.name,
        address: editForm.address,
        city: editForm.city,
        state: editForm.state,
        latitude: editHub.latitude || 0,
        longitude: editHub.longitude || 0,
        openingTime: toTimeString({
          hour: editForm.openingHour,
          minute: editForm.openingMinute,
          second: editForm.openingSecond,
        }),
        closingTime: toTimeString({
          hour: editForm.closingHour,
          minute: editForm.closingMinute,
          second: editForm.closingSecond,
        }),
      };

      await hubService.updateHub(editHub.id, payload);

      // Optimistic update — no local storage, only in-memory React state.
      // The API expects LocalTime strings, but the Hub state shape uses
      // OpeningTime objects, so convert back for the row we just updated.
      setHubs((prev) =>
        prev.map((h) =>
          h.id === editHub.id
            ? {
                ...h,
                name: payload.name,
                address: payload.address,
                city: payload.city,
                state: payload.state,
                latitude: payload.latitude,
                longitude: payload.longitude,
                country: editForm.country || h.country,
                openingTime: {
                  hour: Number(editForm.openingHour) || 0,
                  minute: Number(editForm.openingMinute) || 0,
                  second: Number(editForm.openingSecond) || 0,
                  nano: 0,
                },
                closingTime: {
                  hour: Number(editForm.closingHour) || 0,
                  minute: Number(editForm.closingMinute) || 0,
                  second: Number(editForm.closingSecond) || 0,
                  nano: 0,
                },
              }
            : h
        )
      );
      setEditHub(null);
      setEditForm(null);
    } catch (err) {
      setEditMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update hub.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ---- Delete ----
  const handleDeleteClick = (hub: Hub) => {
    if (hub.status !== "INACTIVE") {
      setDeleteTarget({ ...hub, _blocked: true } as Hub & { _blocked: boolean });
      return;
    }
    setDeleteTarget(hub);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await hubService.deleteHub(deleteTarget.id);
      setHubs((prev) => prev.filter((h) => h.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      setDeleteTarget(null);
      alert(err instanceof Error ? err.message : "Failed to delete hub.");
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
        {s || "INACTIVE"}
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

  const selectCls =
    "w-full p-2.5 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white dark:[&>option]:bg-gray-900";

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/30 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {hubs.length === 0 ? (
        <div className="bg-white dark:bg-[#26292C] rounded-xl border border-gray-100 dark:border-gray-800 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
            <Warehouse className="w-8 h-8 text-[#FC6B31]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No hubs found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            Add a hub from the &quot;Add Hub&quot; tab and it will appear here for updates and management.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Warehouse className="w-5 h-5 text-[#FC6B31]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{hubs.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Hubs</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {hubs.filter((h) => h.status === "ACTIVE").length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active Hubs</p>
            </div>
          </div>
        </div>
      )}

      {hubs.length > 0 && (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-[#FC6B31]/30 dark:border-[#FC6B31]/30 overflow-hidden transition-all duration-300 hover:border-[#FC6B31] hover:shadow-xl hover:-translate-y-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-black/50 border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 font-medium w-14">#</th>
                    <th className="px-6 py-4 font-medium">Hub Name</th>
                    <th className="px-6 py-4 font-medium">Address</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Manage Hub</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {hubs.map((hub, idx) => (
                    <tr key={hub.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 text-gray-400">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-gray-100 dark:border-gray-800">
                            <Warehouse className="w-5 h-5 text-[#FC6B31]" />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">{hub.name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-[280px] truncate" title={hub.address}>
                        {hub.address || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center">{statusBadge(hub.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(hub)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#FC6B31] border-b-4 border-[#c04f1d] shadow-md hover:bg-[#e55a20] hover:border-[#a84418] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150"
                            title="View hub details"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleEditClick(hub)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 border-b-4 border-blue-800 shadow-md hover:bg-blue-500 hover:border-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150"
                            title="Edit hub"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(hub)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                              hub.status === "INACTIVE"
                                ? "text-white bg-red-600 border-b-4 border-red-800 shadow-md hover:bg-red-500 hover:border-red-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm"
                                : "text-red-500/70 border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                            }`}
                            title={hub.status === "INACTIVE" ? "Delete hub" : "Deactivate hub to allow deletion"}
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
            {hubs.map((hub, idx) => (
              <div
                key={hub.id}
                className="bg-white dark:bg-[#26292C] rounded-xl shadow-sm border border-[#FC6B31]/30 dark:border-[#FC6B31]/30 p-4 transition-all duration-300 hover:border-[#FC6B31] hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-gray-100 dark:border-gray-800 shrink-0">
                    <Warehouse className="w-6 h-6 text-[#FC6B31]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      <span className="text-gray-400 text-sm mr-1">#{idx + 1}</span>
                      {hub.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{hub.address || "N/A"}</p>
                  </div>
                  {statusBadge(hub.status)}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {hub.city || ""}
                  {hub.city && hub.state ? ", " : ""}
                  {hub.state || ""}
                  {hub.city || hub.state ? " • " : ""}
                  {hub.country || ""}
                </p>

                <div className="flex flex-col gap-2 mt-3">
                  <button
                    onClick={() => handleView(hub)}
                    className="w-full flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#FC6B31] border-b-4 border-[#c04f1d] shadow-md hover:bg-[#e55a20] hover:border-[#a84418] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => handleEditClick(hub)}
                    className="w-full flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 border-b-4 border-blue-800 shadow-md hover:bg-blue-500 hover:border-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm transition-all duration-150"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(hub)}
                    className={`w-full flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                      hub.status === "INACTIVE"
                        ? "text-white bg-red-600 border-b-4 border-red-800 shadow-md hover:bg-red-500 hover:border-red-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 active:shadow-sm"
                        : "text-red-500 border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
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
      {viewHub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#26292C] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <Warehouse className="w-4 h-4 text-[#FC6B31]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hub Details</h3>
              </div>
              <button
                onClick={() => setViewHub(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{viewHub.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Status</p>
                  <div className="pt-0.5">{statusBadge(viewHub.status)}</div>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Address</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{viewHub.address || "N/A"}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">City</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{viewHub.city || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">State</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{viewHub.state || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Country</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{viewHub.country || "N/A"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Opening Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatTime(viewHub.openingTime)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Closing Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatTime(viewHub.closingTime)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editHub && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#26292C] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-[#26292C]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Hub</h3>
              <button
                onClick={() => setEditHub(null)}
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
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Hub Name</label>
                <input
                  required
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Address</label>
                <input
                  required
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC6B31] dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">State</label>
                  <select
                    required
                    value={editForm.state}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        state: e.target.value,
                        city: getStateCapital(e.target.value),
                      })
                    }
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
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">City</label>
                  <select
                    required
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className={selectCls}
                  >
                    <option value="">Select a city...</option>
                    {editForm.state ? (
                      <option value={getStateCapital(editForm.state)}>{getStateCapital(editForm.state)}</option>
                    ) : null}
                    {editForm.city && editForm.city !== getStateCapital(editForm.state) ? (
                      <option value={editForm.city}>{editForm.city}</option>
                    ) : null}
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-3">
                  Opening Time
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                      Hour
                    </label>
                    <select
                      value={editForm.openingHour}
                      onChange={(e) => setEditForm({ ...editForm, openingHour: e.target.value })}
                      className={selectCls}
                    >
                      {HOURS.map((h) => (
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
                      value={editForm.openingMinute}
                      onChange={(e) => setEditForm({ ...editForm, openingMinute: e.target.value })}
                      className={selectCls}
                    >
                      {MINUTES.map((m) => (
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
                      value={editForm.openingSecond}
                      onChange={(e) => setEditForm({ ...editForm, openingSecond: e.target.value })}
                      className={selectCls}
                    >
                      {SECONDS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-3">
                  Closing Time
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                      Hour
                    </label>
                    <select
                      value={editForm.closingHour}
                      onChange={(e) => setEditForm({ ...editForm, closingHour: e.target.value })}
                      className={selectCls}
                    >
                      {HOURS.map((h) => (
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
                      value={editForm.closingMinute}
                      onChange={(e) => setEditForm({ ...editForm, closingMinute: e.target.value })}
                      className={selectCls}
                    >
                      {MINUTES.map((m) => (
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
                      value={editForm.closingSecond}
                      onChange={(e) => setEditForm({ ...editForm, closingSecond: e.target.value })}
                      className={selectCls}
                    >
                      {SECONDS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditHub(null)}
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
            {(deleteTarget as Hub & { _blocked?: boolean })._blocked ? (
              <>
                <div className="w-14 h-14 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-7 h-7 text-yellow-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Cannot Delete Hub</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  &quot;{(deleteTarget as Hub & { _blocked?: boolean }).name}&quot; is currently{" "}
                  <span className="font-semibold text-green-600 dark:text-green-400">Active</span>. You need to{" "}
                  <span className="font-semibold text-[#FC6B31]">deactivate</span> the hub first before it can be
                  deleted.
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Hub?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Are you sure you want to permanently delete{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">{deleteTarget.name}</span>? This
                  action cannot be undone.
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