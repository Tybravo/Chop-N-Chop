"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/api/admin.service";
import { Transaction } from "@/types/admin";
import { Loader2, CreditCard } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const data = await adminService.getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to load transactions", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
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
          Transactions
        </h1>
        <span className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#FC6B31] rounded-full text-sm font-medium border border-orange-100">
          <CreditCard className="w-4 h-4" />
          {transactions.length} Records
        </span>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-gray-400 font-medium bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 font-normal">Transaction ID</th>
                <th className="px-6 py-4 font-normal">Order ID</th>
                <th className="px-6 py-4 font-normal">Customer</th>
                <th className="px-6 py-4 font-normal text-right">Amount (₦)</th>
                <th className="px-6 py-4 font-normal">Method</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-gray-700 dark:text-gray-300 font-medium">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{txn.id}</td>
                  <td className="px-6 py-4 font-semibold text-[#FC6B31]">{txn.orderId}</td>
                  <td className="px-6 py-4">{txn.customerName}</td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                    {txn.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{txn.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      txn.status === 'SUCCESS' ? 'bg-green-50 text-green-600 border border-green-100' : 
                      txn.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                      'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(txn.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
