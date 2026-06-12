"use client";

import { useState, useEffect } from "react";
import { vendorService } from "@/services/vendor/vendor.service";
import { payoutService } from "@/services/vendor/payout.service";
import { VendorDashboardStats, PayoutRecord } from "@/types/vendor";
import { Wallet, History, ArrowRight, Loader2 } from "lucide-react";

export default function PayoutPage() {
  const [stats, setStats] = useState<VendorDashboardStats | null>(null);
  const [history, setHistory] = useState<PayoutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, historyData] = await Promise.all([
        vendorService.getStats(),
        payoutService.getPayouts()
      ]);
      setStats(statsData);
      setHistory(historyData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    if (!stats || stats.availableBalance <= 0) return;
    setRequesting(true);
    try {
      const newPayout = await payoutService.requestPayout(stats.availableBalance);
      setHistory([newPayout, ...history]);
      // Optimistically update stats
      setStats({ ...stats, availableBalance: 0 });
    } catch (error) {
      console.error(error);
    } finally {
      setRequesting(false);
    }
  };

  if (loading || !stats) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FC6B31]"></div></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payouts</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="admin-card p-6 bg-[#FC6B31] text-white border-none">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/80 text-sm font-medium">Available Balance</p>
              <h3 className="text-3xl font-bold mt-2">₦{stats.availableBalance.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-xl"><Wallet className="w-6 h-6 text-white" /></div>
          </div>
          <button 
            onClick={handleRequestPayout}
            disabled={stats.availableBalance <= 0 || requesting}
            className="w-full mt-6 py-2.5 bg-white text-[#FC6B31] rounded-lg font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {requesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Request Payout <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>

        <div className="admin-card p-6 flex flex-col justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Earnings</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">₦{stats.totalEarnings.toLocaleString()}</h3>
        </div>

        <div className="admin-card p-6 flex flex-col justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Completed Orders Earnings</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">₦{stats.completedOrdersEarnings.toLocaleString()}</h3>
        </div>
      </div>

      {/* History */}
      <div className="admin-card p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <History className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payout History</h3>
        </div>

        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-gray-800 md:hidden">
          {history.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No payout history.</div>
          ) : (
            history.map(record => (
              <div key={record.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">₦{record.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-[10px] font-medium rounded-full ${
                    record.status === "COMPLETED" ? "bg-green-100 text-green-800" : 
                    record.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                  }`}>
                    {record.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{record.reference}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {history.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No payout history.</td></tr>
              ) : (
                history.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.reference}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">₦{record.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        record.status === "COMPLETED" ? "bg-green-100 text-green-800" : 
                        record.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
