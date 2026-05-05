"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/api/admin.service";
import { AdminUser } from "@/types/admin";
import { Loader2, Plus, Shield } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useRouter } from "next/navigation";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "SUPER_ADMIN") {
      router.replace("/admin/dashboard");
      return;
    }

    async function fetchAdmins() {
      try {
        const data = await adminService.getAdmins();
        setAdmins(data);
      } catch (error) {
        console.error("Failed to load admins", error);
      } finally {
        setLoading(false);
      }
    }
    if (user?.role === "SUPER_ADMIN") {
      fetchAdmins();
    }
  }, [user, router]);

  if (loading || !user || user.role !== "SUPER_ADMIN") {
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
          <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100">
            <Shield className="w-4 h-4" />
            Super Admin Only
          </span>
        </div>
        <button className="flex items-center gap-2 bg-[#FC6B31] hover:bg-[#e35014] text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm">
          <Plus className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-gray-400 font-medium bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 font-normal">Name</th>
                <th className="px-6 py-4 font-normal">Email</th>
                <th className="px-6 py-4 font-normal">Role</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-gray-700 dark:text-gray-300 font-medium">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">{admin.name}</td>
                  <td className="px-6 py-4">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${admin.role === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                      {admin.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${admin.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(admin.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
