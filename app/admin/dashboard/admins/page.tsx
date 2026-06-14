"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { adminService } from "@/lib/api/admin.service";
import { AdminUser, InviteAdminPayload } from "@/types/admin";
import { Loader2, Plus, X, Mail, Phone, Building2, UserCog, Trash2, Users, ChevronDown } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useRouter } from "next/navigation";

function CustomStatusDropdown({
  status,
  onStatusChange,
  disabled,
  isUpdating
}: {
  status: string;
  onStatusChange: (newStatus: string) => void;
  disabled: boolean;
  isUpdating: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const getStatusStyles = (s: string) => {
    switch (s) {
      case 'ACTIVE': return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
      case 'PENDING_VERIFICATION': return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'SUSPENDED': return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStatusLabel = (s: string) => s.replace("_", " ");

  const options = ['ACTIVE', 'INACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED'];

  return (
    <div className="relative inline-flex" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border focus:outline-none focus:ring-2 focus:ring-[#FC6B31]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[160px] ${getStatusStyles(status)}`}
      >
        <span>{getStatusLabel(status)}</span>
        {isUpdating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 ml-auto" />
        ) : (
          <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ml-auto ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-full w-max bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(252,107,49,0.15)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="py-1">
            {options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => {
                    onStatusChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-orange-50 dark:hover:bg-gray-800 ${status === opt ? 'bg-orange-50/50 dark:bg-gray-800 text-[#FC6B31]' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  {getStatusLabel(opt)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAdminAuth();
  const router = useRouter();

  // Invite Admin Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState<InviteAdminPayload>({
    email: "",
    phone: "",
    assignedBrand: "",
    role: "",
  });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdmins();
      
      // Filter the live data so this specific page ONLY shows internal administrative staff.
      // Excludes VENDOR, RIDER, and CUSTOMER which belong on their own dedicated pages.
      const internalStaffRoles = ["SUPER_ADMIN", "ORG_ADMIN", "ADMIN", "SUB_ADMIN", "OFFICE_STAFF"];
      const filteredAdmins = data.filter(user => internalStaffRoles.includes(user.role));
      
      setAdmins(filteredAdmins);
    } catch (error) {
      console.error("Failed to load admins", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError("");
    setInviteSuccess("");

    if (!inviteForm.email || !inviteForm.phone || !inviteForm.assignedBrand || !inviteForm.role) {
      setInviteError("All fields are required.");
      return;
    }

    try {
      setInviteLoading(true);
      const res = await adminService.inviteAdmin(inviteForm);
      if (res.success || res) {
        setInviteSuccess(res.message || "Staff invited successfully. Invitation email is being sent.");
        setInviteForm({ email: "", phone: "", assignedBrand: "", role: "" });
        // Refresh the admins list after a successful invite
        fetchAdmins();
        // Modal stays open per user request, user will close it manually.
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setInviteError(error.message);
      } else {
        setInviteError("An unexpected error occurred.");
      }
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveAdmin = (id: string) => {
    setDeleteConfirmId(id);
  };

  const executeRemoveAdmin = async () => {
    if (!deleteConfirmId) return;
    
    try {
      setIsDeleting(deleteConfirmId);
      await adminService.removeAdmin(deleteConfirmId);
      // Optimistically update the list by removing the deleted admin
      setAdmins((prev) => prev.filter((admin) => admin.id !== deleteConfirmId));
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || "Failed to remove admin.");
      } else {
        alert("Failed to remove admin.");
      }
    } finally {
      setIsDeleting(null);
      setDeleteConfirmId(null);
    }
  };

  const handleStatusChange = async (id: string, currentStatus: string, newStatus: string) => {
    if (currentStatus === newStatus) return;
    
    try {
      setIsUpdatingStatus(id);
      await adminService.changeAdminStatus(id, newStatus);
      // Optimistically update the admin's status in the table
      setAdmins((prev) =>
        prev.map((admin) => (admin.id === id ? { ...admin, status: newStatus as AdminUser["status"] } : admin))
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || "Failed to update admin status.");
      } else {
        alert("Failed to update admin status.");
      }
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  useEffect(() => {
    if (user && user.role !== "SUPER_ADMIN") {
      router.replace("/admin/dashboard");
      return;
    }

    if (user?.role === "SUPER_ADMIN") {
      fetchAdmins();
    }
  }, [user, router, fetchAdmins]);

  if (loading && admins.length === 0) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#FC6B31]" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Admin Management
          </h1>
          <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-[#FC6B31] dark:text-[#fd8b5d] rounded-full text-sm font-medium border border-orange-200 dark:border-orange-800 shadow-[0_0_15px_rgba(252,107,49,0.3)] dark:shadow-[0_0_15px_rgba(252,107,49,0.2)] transition-shadow">
            <Users className="w-4 h-4" />
            All Admins
          </span>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 bg-[#FC6B31] hover:bg-[#e35014] text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Invite Admin
        </button>
      </div>

      <div className="admin-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-gray-400 font-medium bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 font-normal">Name</th>
                <th className="px-6 py-4 font-normal">Email</th>
                <th className="px-6 py-4 font-normal">Role</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Date Added</th>
                <th className="px-6 py-4 font-normal">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-gray-700 dark:text-white font-medium">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">{admin.name || "N/A"}</td>
                  <td className="px-6 py-4">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${admin.role === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                      {admin.role?.replace('_', ' ') || "UNKNOWN"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {admin.role === 'SUPER_ADMIN' ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${admin.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}>
                        {admin.status?.replace("_", " ") || "PENDING"}
                      </span>
                    ) : (
                      <CustomStatusDropdown 
                        status={admin.status || "PENDING_VERIFICATION"}
                        onStatusChange={(newStatus) => handleStatusChange(admin.id, admin.status, newStatus)}
                        disabled={isUpdatingStatus === admin.id}
                        isUpdating={isUpdatingStatus === admin.id}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-white">
                    {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleRemoveAdmin(admin.id)}
                      disabled={isDeleting === admin.id || admin.role === 'SUPER_ADMIN'}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting === admin.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Admin Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invite Admin</h2>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {inviteError && (
                <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  {inviteError}
                </div>
              )}
              {inviteSuccess && (
                <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg text-sm">
                  {inviteSuccess}
                </div>
              )}

              <form onSubmit={handleInviteSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={inviteForm.phone}
                      onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      placeholder="+234 800 000 0000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned Brand</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      value={inviteForm.assignedBrand}
                      onChange={(e) => setInviteForm({ ...inviteForm, assignedBrand: e.target.value as InviteAdminPayload["assignedBrand"] })}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm appearance-none"
                      required
                    >
                      <option value="" disabled>Select Brand</option>
                      <option value="CHOP_N_CHOP">Chop-N-Chop</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCog className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as InviteAdminPayload["role"] })}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#FC6B31] focus:border-[#FC6B31] bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm appearance-none"
                      required
                    >
                      <option value="" disabled>Select Role</option>
                      <option value="ADMIN">Admin</option>
                      <option value="STAFF">Staff</option>
                      <option value="VENDOR">Vendor</option>
                      <option value="RIDER">Rider</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#FC6B31] border border-transparent rounded-lg hover:bg-[#e35014] focus:ring-2 focus:ring-offset-2 focus:ring-[#FC6B31] transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[100px]"
                  >
                    {inviteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Invite"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all border border-gray-100 dark:border-gray-800 zoom-in-95">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Remove Admin</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
              Are you sure you want to remove this admin? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting !== null}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeRemoveAdmin}
                disabled={isDeleting !== null}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2"
              >
                {isDeleting !== null ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
