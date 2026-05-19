"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/api/admin.service";
import { Vendor } from "@/types/admin";
import { Loader2, Store } from "lucide-react";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendors() {
      try {
        const data = await adminService.getVendors();
        setVendors(data);
      } catch (error) {
        console.error("Failed to load vendors", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVendors();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#FC6B31]" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Vendors
        </h1>
        <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100">
          <Store className="w-4 h-4" />
          {vendors.length} Total
        </span>
      </div>

      <div className="admin-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-gray-400 font-medium bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 font-normal">Business Name</th>
                <th className="px-6 py-4 font-normal">Owner</th>
                <th className="px-6 py-4 font-normal">Email</th>
                <th className="px-6 py-4 font-normal text-center">Rating</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-gray-700 dark:text-white font-medium">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-semibold">{vendor.businessName}</td>
                  <td className="px-6 py-4">{vendor.ownerName}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-white">{vendor.email}</td>
                  <td className="px-6 py-4 text-center text-yellow-500">★ {vendor.rating.toFixed(1)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      vendor.status === 'APPROVED' ? 'bg-green-50 text-green-600 border border-green-100' : 
                      vendor.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                      'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-white">{new Date(vendor.joinedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
