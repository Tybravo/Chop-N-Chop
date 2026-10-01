"use client";

import { useEffect, useState } from "react";
import { dashboardService } from "@/services/admin/dashboard.service";
import { DispatchRider } from "@/types/admin";
import { Loader2, Bike } from "lucide-react";
import { SafeAvatar } from "@/components/SafeAvatar";

export default function RidersPage() {
  const [riders, setRiders] = useState<DispatchRider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRiders() {
      try {
        const data = await dashboardService.getRiders();
        setRiders(data);
      } catch (error) {
        console.error("Failed to load riders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRiders();
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
          Dispatch Riders
        </h1>
        <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100">
          <Bike className="w-4 h-4" />
          {riders.length} Active
        </span>
      </div>

      <div className="admin-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-gray-400 font-medium bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 font-normal">Rider</th>
                <th className="px-6 py-4 font-normal">Batch</th>
                <th className="px-6 py-4 font-normal">Location</th>
                <th className="px-6 py-4 font-normal">ETA/Delay</th>
                <th className="px-6 py-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-gray-700 dark:text-white font-medium">
              {riders.map((rider) => (
                <tr key={rider.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                      <SafeAvatar src={rider.avatarUrl} alt={rider.name} fill sizes="32px" className="object-cover" />
                    </div>
                    <span className="font-semibold">{rider.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-white">{rider.batch}</td>
                  <td className="px-6 py-4">{rider.location}</td>
                  <td className="px-6 py-4 font-semibold">{rider.eta ? rider.eta : <span className="text-red-500">{rider.delay}</span>}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase ${
                      rider.status === 'In Transit' ? 'bg-orange-50 text-orange-500 border border-orange-100' :
                      rider.status === 'Awaiting Pickup' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                      'bg-red-50 text-red-500 border border-red-100'
                    }`}>
                      {rider.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
