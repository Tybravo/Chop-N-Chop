"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  X,
  Lock,
  UserPlus,
} from "lucide-react";

type TransactionType = "debit" | "credit";
type WalletAction = "fund" | "transfer";

interface Transaction {
  id: number;
  type: TransactionType;
  title: string;
  date: string;
  amount: string;
}

const initialTransactions: Transaction[] = [
  { id: 1, type: "debit", title: "Order #ORD-9281", date: "Today, 1:30 PM", amount: "-₦11,000" },
  { id: 2, type: "credit", title: "Wallet Fund (Bank)", date: "Sep 15, 9:00 AM", amount: "+₦20,000" },
  { id: 3, type: "debit", title: "Order #ORD-9104", date: "Sep 14, 2:15 PM", amount: "-₦3,500" },
];

export default function WalletPage() {
  const router = useRouter();
  
  // Toggle authentication state for previewing the guest view vs wallet view
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [balance, setBalance] = useState(24500);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [action, setAction] = useState<WalletAction | null>(null);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [actionError, setActionError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const amountInputRef = useRef<HTMLInputElement>(null);
  const processingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (processingTimerRef.current) clearTimeout(processingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!action) return;

    const focusTimer = window.setTimeout(() => amountInputRef.current?.focus(), 0);
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && !isProcessing) setAction(null);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [action, isProcessing]);

  const openAction = (nextAction: WalletAction) => {
    setAction(nextAction);
    setAmount("");
    setRecipient("");
    setActionError("");
    setStatusMessage("");
  };

  const closeAction = () => {
    if (isProcessing) return;
    setAction(null);
    setActionError("");
    setStatusMessage("");
  };

  const formatNaira = (value: number) => {
    const fractionDigits = Number.isInteger(value) ? 0 : 2;
    return `₦${value.toLocaleString("en-NG", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })}`;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!action || isProcessing) return;

    const value = Number(amount);
    const selectedAction = action;
    if (!Number.isFinite(value) || value <= 0) {
      setActionError("Enter an amount greater than zero.");
      return;
    }
    if (selectedAction === "transfer" && value > balance) {
      setActionError("The amount is greater than your available balance.");
      return;
    }
    if (selectedAction === "transfer" && recipient.trim().length < 3) {
      setActionError("Enter a valid recipient name or wallet ID.");
      return;
    }

    setActionError("");
    setIsProcessing(true);
    processingTimerRef.current = window.setTimeout(() => {
      const transaction: Transaction = {
        id: Date.now(),
        type: selectedAction === "fund" ? "credit" : "debit",
        title: selectedAction === "fund" ? "Wallet Fund" : `Transfer to ${recipient.trim()}`,
        date: "Just now",
        amount: `${selectedAction === "fund" ? "+" : "-"}${formatNaira(value)}`,
      };

      setBalance((currentBalance) =>
        selectedAction === "fund" ? currentBalance + value : currentBalance - value,
      );
      setTransactions((currentTransactions) => [transaction, ...currentTransactions]);
      setAction(null);
      setIsProcessing(false);
      setStatusMessage(
        selectedAction === "fund"
          ? `₦${value.toLocaleString("en-NG")} added to your wallet.`
          : `₦${value.toLocaleString("en-NG")} transferred successfully.`,
      );
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-[112px] pt-4 dark:bg-zinc-950 md:pb-16">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="min-w-0 truncate px-2 text-lg font-extrabold text-gray-900 dark:text-white">Wallet</h1>
        <div className="h-10 w-10" aria-hidden="true" />
      </header>

      <main className="mx-auto w-full max-w-3xl">
        {!isAuthenticated ? (
          // Guest State Screen
          <div className="mt-8 rounded-[32px] border border-orange-100 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-[#FC6B31] dark:bg-zinc-800">
              <Lock className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Unlock Your Chop Wallet</h2>
              <p className="mx-auto max-w-md text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Sign in or create an account to manage your balance, claim welcome bonuses, and track rewards effortlessly.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/customer/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FC6B31] px-6 py-3.5 text-sm font-extrabold text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-colors"
              >
                <UserPlus className="h-4 w-4" /> Sign In
              </Link>
              <button
                type="button"
                onClick={() => setIsAuthenticated(true)}
                className="rounded-full border border-gray-200 bg-gray-50 px-5 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300"
              >
                Simulate Login
              </button>
            </div>
          </div>
        ) : (
          // Authenticated State Screen
          <>
            <div className="relative mb-8 mt-6 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#FC6B31] to-orange-600 p-5 text-white shadow-lg shadow-orange-500/20 sm:p-6">
              <div className="pointer-events-none absolute -right-4 -bottom-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <span className="mb-1 block text-[13px] font-bold uppercase tracking-wider text-orange-100">Available Balance</span>
              <h2 className="mb-6 text-3xl font-black sm:text-4xl">{formatNaira(balance)}</h2>
              <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:gap-3">
                <button
                  type="button"
                  onClick={() => openAction("fund")}
                  className="flex w-full flex-1 items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-[14px] font-extrabold text-[#FC6B31] shadow-sm transition-transform hover:bg-orange-50 active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4" /> Fund
                </button>
                <button
                  type="button"
                  onClick={() => openAction("transfer")}
                  className="flex w-full flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-700/50 py-3.5 text-[14px] font-extrabold text-white backdrop-blur-sm transition-transform hover:bg-orange-700/70 active:scale-[0.98]"
                >
                  <ArrowUpRight className="h-4 w-4" /> Transfer
                </button>
              </div>
            </div>

            {statusMessage && (
              <div role="status" className="mb-4 flex items-start gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-[13px] font-medium text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            <section aria-labelledby="recent-transactions-heading">
              <h3 id="recent-transactions-heading" className="mb-4 px-2 text-[15px] font-extrabold text-gray-900 dark:text-white">
                Recent Transactions
              </h3>
              {transactions.length === 0 ? (
                <div role="status" className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
                  <ArrowDownLeft className="mb-3 h-8 w-8 text-gray-300 dark:text-zinc-700" />
                  <h4 className="text-[14px] font-bold text-gray-900 dark:text-white">No transactions yet</h4>
                  <p className="mt-1 text-[13px] text-gray-500">Fund your wallet to start building your history.</p>
                  <button
                    type="button"
                    onClick={() => openAction("fund")}
                    className="mt-4 rounded-full bg-gray-900 px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-zinc-900"
                  >
                    Fund wallet
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm dark:divide-zinc-800/50 dark:border-zinc-800 dark:bg-zinc-900">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                      <div className="min-w-0 flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            transaction.type === "credit"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30"
                              : "bg-red-50 text-red-500 dark:bg-red-950/30"
                          }`}
                        >
                          {transaction.type === "credit" ? (
                            <ArrowDownLeft className="h-5 w-5" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-[14px] font-bold text-gray-900 dark:text-white">{transaction.title}</h4>
                          <p className="text-[12px] text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span
                          className={`text-[14px] font-extrabold ${
                            transaction.type === "credit" ? "text-emerald-600" : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {transaction.amount}
                        </span>
                        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-bold text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" /> Success
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Wallet Action Modal */}
      {action && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeAction();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-action-title"
            className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl dark:bg-zinc-950 sm:rounded-[28px]"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="wallet-action-title" className="text-[18px] font-extrabold text-gray-900 dark:text-white">
                  {action === "fund" ? "Fund wallet" : "Transfer from wallet"}
                </h2>
                <p className="mt-1 text-[13px] text-gray-500">Available balance: {formatNaira(balance)}</p>
              </div>
              <button
                type="button"
                onClick={closeAction}
                disabled={isProcessing}
                aria-label="Close wallet action"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="wallet-amount" className="mb-1.5 block text-[13px] font-bold text-gray-700 dark:text-gray-200">
                  Amount
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-extrabold text-gray-500">
                    ₦
                  </span>
                  <input
                    ref={amountInputRef}
                    id="wallet-amount"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value);
                      setActionError("");
                    }}
                    placeholder="0.00"
                    className="w-full rounded-[18px] border border-gray-200 bg-white py-4 pl-9 pr-4 text-[15px] font-bold text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
                {actionError && (
                  <p role="alert" className="mt-2 text-[12px] font-medium text-red-600 dark:text-red-400">
                    {actionError}
                  </p>
                )}
              </div>

              {action === "transfer" && (
                <div>
                  <label htmlFor="wallet-recipient" className="mb-1.5 block text-[13px] font-bold text-gray-700 dark:text-gray-200">
                    Recipient
                  </label>
                  <input
                    id="wallet-recipient"
                    type="text"
                    autoComplete="off"
                    value={recipient}
                    onChange={(event) => {
                      setRecipient(event.target.value);
                      setActionError("");
                    }}
                    placeholder="Name or wallet ID"
                    className="w-full rounded-[18px] border border-gray-200 bg-white px-4 py-4 text-[15px] font-bold text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing || !amount.trim() || (action === "transfer" && recipient.trim().length < 3)}
                className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#FC6B31] py-4 text-[14px] font-extrabold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : action === "fund" ? (
                  "Continue to fund"
                ) : (
                  "Review transfer"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}