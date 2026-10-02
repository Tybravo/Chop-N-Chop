"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  AlertCircle,
} from "lucide-react";
import { walletService, type Wallet, type WalletLedgerEntry } from "@/services/customer/wallet.service";

type TransactionType = "debit" | "credit";
type WalletAction = "fund" | "withdraw";

interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  date: string;
  amount: string;
}

/** Ledger types that move money back into the available balance. */
const CREDIT_TYPES = [
  "DEPOSIT",
  "FUND",
  "TOPUP",
  "CREDIT",
  "REFUND",
  "REVERSAL",
  "RELEASE",
  "SETTLEMENT",
  "CASHBACK",
];

const toTransaction = (entry: WalletLedgerEntry, formatNaira: (value: number) => string): Transaction => {
  const type = (entry.type || "").toUpperCase();
  const isCredit = CREDIT_TYPES.some((token) => type.includes(token));
  const direction: TransactionType = isCredit ? "credit" : "debit";
  const signed = `${isCredit ? "+" : "-"}${formatNaira(Math.abs(entry.amount ?? 0))}`;

  return {
    id: entry.id,
    type: direction,
    title: entry.description?.trim() || type.replace(/_/g, " ").toLowerCase(),
    date: entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "—",
    amount: signed,
  };
};

export default function WalletPage() {
  const router = useRouter();
  
  // Resolve real auth state from the session written by the login/signup flow
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [action, setAction] = useState<WalletAction | null>(null);
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [verifiedAccount, setVerifiedAccount] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [pinStep, setPinStep] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const pinInputRef = useRef<HTMLInputElement>(null);
  const [actionError, setActionError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const amountInputRef = useRef<HTMLInputElement>(null);

  const formatNaira = useCallback((value: number) => {
    const fractionDigits = Number.isInteger(value) ? 0 : 2;
    return `₦${value.toLocaleString("en-NG", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })}`;
  }, []);

  const loadWallet = useCallback(async () => {
    setIsLoadingWallet(true);
    setWalletError("");
    try {
      const { wallet: loadedWallet, transactions: ledger } = await walletService.getWalletOverview();
      setWallet(loadedWallet);
      setBalance(loadedWallet?.availableBalance ?? 0);
      setTransactions(ledger.map((entry) => toTransaction(entry, formatNaira)));
    } catch (error) {
      console.error("Failed to load wallet", error);
      setWalletError(
        error instanceof Error ? error.message : "Could not load your wallet right now."
      );
    } finally {
      setIsLoadingWallet(false);
    }
  }, [formatNaira]);

  useEffect(() => {
    const checkAuth = () => {
      const session = localStorage.getItem("chopnchop_session");
      const token = localStorage.getItem("chopnchop_token");
      setIsAuthenticated(session === "active" && Boolean(token));
      setIsLoadingAuth(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadWallet();
  }, [isAuthenticated, loadWallet]);

  useEffect(() => {
    if (!action) return;

    const target = pinStep ? pinInputRef.current : amountInputRef.current;
    const focusTimer = window.setTimeout(() => target?.focus(), 0);
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && !isProcessing) setAction(null);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [action, isProcessing, pinStep]);

  const openAction = (nextAction: WalletAction) => {
    setAction(nextAction);
    setAmount("");
    setAccountNumber("");
    setBankCode("");
    setVerifiedAccount("");
    setActionError("");
    setStatusMessage("");
    setPinStep(false);
    setPin("");
    setPinError("");
  };

  const closeAction = () => {
    if (isProcessing) return;
    setAction(null);
    setActionError("");
    setStatusMessage("");
    setPinStep(false);
    setPin("");
    setPinError("");
  };

  const handleVerifyAccount = async () => {
    if (accountNumber.trim().length < 10 || !bankCode.trim()) {
      setActionError("Enter a 10-digit account number and a bank code.");
      return;
    }

    setActionError("");
    setIsVerifying(true);
    try {
      const accountName = await walletService.verifyBankAccount(
        accountNumber.trim(),
        bankCode.trim(),
      );
      setVerifiedAccount(accountName);
    } catch (error) {
      console.error("Failed to verify bank account", error);
      setActionError(
        error instanceof Error ? error.message : "Could not verify that account number."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!action || isProcessing || isVerifying) return;

    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setActionError("Enter an amount greater than zero.");
      return;
    }

    if (action === "fund") {
      setActionError("Funding is not available yet.");
      return;
    }

    if (value > balance) {
      setActionError("The amount is greater than your available balance.");
      return;
    }
    if (!verifiedAccount) {
      setActionError("Verify your destination account before requesting a payout.");
      return;
    }

    // Outgoing funds always require a fresh PIN authorisation before we queue the payout.
    setActionError("");
    setPin("");
    setPinError("");
    setPinStep(true);
  };

  const handleBackToDetails = () => {
    setPinStep(false);
    setPin("");
    setPinError("");
  };

  const handleConfirmWithdrawal = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isProcessing) return;

    const value = Number(amount);
    if (pin.length !== 4) {
      setPinError("Enter your 4-digit wallet PIN.");
      return;
    }

    setPinError("");
    setActionError("");
    setIsProcessing(true);
    try {
      const confirmation = await walletService.requestWithdrawal(value, pin);
      setAction(null);
      setPinStep(false);
      setPin("");
      setStatusMessage(
        confirmation?.trim() ||
          `${formatNaira(value)} withdrawal requested. It will be sent in the next payout batch.`
      );

      // The payout is queued server-side, so re-read the wallet and ledger for the
      // authoritative balance rather than guessing it client-side.
      await loadWallet();
    } catch (error) {
      console.error("Withdrawal request failed", error);
      const message =
        error instanceof Error ? error.message : "Could not submit the withdrawal request.";

      // A rejected PIN keeps the user on the PIN step so they can retry immediately.
      if (/pin/i.test(message)) {
        setPinError(message);
        setPin("");
      } else {
        setActionError(message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Avoid flashing the guest screen while the session is being resolved
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 pt-4 dark:bg-zinc-950 md:pb-16">
        <header className="mx-auto flex w-full max-w-3xl items-center justify-between pt-2">
          <div className="h-10 w-10" aria-hidden="true" />
          <h1 className="min-w-0 truncate px-2 text-lg font-extrabold text-gray-900 dark:text-white">Wallet</h1>
          <div className="h-10 w-10" aria-hidden="true" />
        </header>
        <div className="mx-auto mt-8 w-full max-w-3xl animate-pulse space-y-4">
          <div className="h-40 rounded-[28px] bg-gray-200 dark:bg-zinc-800" />
          <div className="h-64 rounded-[24px] bg-gray-200 dark:bg-zinc-800" />
        </div>
      </div>
    );
  }

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
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/customer/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FC6B31] px-6 py-3.5 text-sm font-extrabold text-white shadow-md shadow-orange-500/20 transition-colors hover:bg-orange-600"
              >
                <UserPlus className="h-4 w-4" /> Sign In
              </Link>
              <Link
                href="/customer/signup"
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 px-5 py-3.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300"
              >
                Create account
              </Link>
            </div>
          </div>
        ) : (
          // Authenticated State Screen
          <>
            <div className="relative mb-8 mt-6 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#FC6B31] to-orange-600 p-5 text-white shadow-lg shadow-orange-500/20 sm:p-6">
              <div className="pointer-events-none absolute -right-4 -bottom-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <span className="mb-1 block text-[13px] font-bold uppercase tracking-wider text-orange-100">Available Balance</span>
              <h2 className="mb-1 text-3xl font-black sm:text-4xl">
                {isLoadingWallet && !wallet ? "…" : formatNaira(balance)}
              </h2>
              {wallet && (
                <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-semibold text-orange-100">
                  <span>Escrow: {formatNaira(wallet.pendingEscrowBalance ?? 0)}</span>
                  <span>Withdrawn: {formatNaira(wallet.totalWithdrawn ?? 0)}</span>
                  <span className={wallet.kycCompleted ? "text-emerald-100" : "text-amber-100"}>
                    {wallet.kycCompleted ? "KYC verified" : "KYC pending"}
                  </span>
                </div>
              )}
              {!wallet && !isLoadingWallet && <div className="mb-5" />}
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
                  onClick={() => openAction("withdraw")}
                  disabled={isLoadingWallet || !wallet}
                  className="flex w-full flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-700/50 py-3.5 text-[14px] font-extrabold text-white backdrop-blur-sm transition-transform hover:bg-orange-700/70 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ArrowUpRight className="h-4 w-4" /> Withdraw
                </button>
              </div>
            </div>

            {walletError && (
              <div role="alert" className="mb-4 flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 p-4 text-[13px] font-medium text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="flex-1">{walletError}</span>
                <button
                  type="button"
                  onClick={loadWallet}
                  className="shrink-0 font-extrabold underline underline-offset-2"
                >
                  Retry
                </button>
              </div>
            )}

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
              {isLoadingWallet && transactions.length === 0 ? (
                <div className="space-y-3" aria-busy="true" aria-label="Loading transactions">
                  {[0, 1, 2].map((row) => (
                    <div key={row} className="flex animate-pulse items-center gap-4 rounded-[24px] border border-gray-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 dark:bg-zinc-800" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 rounded bg-gray-200 dark:bg-zinc-800" />
                        <div className="h-2.5 w-20 rounded bg-gray-200 dark:bg-zinc-800" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div role="status" className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
                  <ArrowDownLeft className="mb-3 h-8 w-8 text-gray-300 dark:text-zinc-700" />
                  <h4 className="text-[14px] font-bold text-gray-900 dark:text-white">No transactions yet</h4>
                  <p className="mt-1 text-[13px] text-gray-500">Your wallet activity will appear here.</p>
                  <button
                    type="button"
                    onClick={loadWallet}
                    className="mt-4 rounded-full bg-gray-900 px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-zinc-900"
                  >
                    Refresh
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
                  {pinStep ? "Confirm your PIN" : action === "fund" ? "Fund wallet" : "Withdraw from wallet"}
                </h2>
                <p className="mt-1 text-[13px] text-gray-500">
                  {pinStep
                    ? `${formatNaira(Number(amount) || 0)} to ${verifiedAccount || "your bank account"}`
                    : `Available balance: ${formatNaira(balance)}`}
                </p>
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

            {pinStep ? (
              <form onSubmit={handleConfirmWithdrawal} className="space-y-4" noValidate>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <label htmlFor="wallet-pin" className="mb-1.5 block text-[13px] font-bold text-gray-700 dark:text-gray-200">
                    4-digit wallet PIN
                  </label>
                  <input
                    ref={pinInputRef}
                    id="wallet-pin"
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={4}
                    value={pin}
                    onChange={(event) => {
                      setPin(event.target.value.replace(/\D/g, ""));
                      setPinError("");
                    }}
                    placeholder="••••"
                    aria-invalid={Boolean(pinError)}
                    className="w-full rounded-[18px] border border-gray-200 bg-white px-4 py-4 text-center text-[22px] font-black tracking-[0.5em] text-gray-900 outline-none transition-colors placeholder:text-gray-300 focus:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                  />
                  <p className="mt-2 text-[12px] font-medium text-gray-500">
                    Required to authorise money leaving your wallet.
                  </p>
                  {pinError && (
                    <p role="alert" className="mt-2 text-[12px] font-medium text-red-600 dark:text-red-400">
                      {pinError}
                    </p>
                  )}
                </div>

                {actionError && (
                  <p role="alert" className="text-[12px] font-medium text-red-600 dark:text-red-400">
                    {actionError}
                  </p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isProcessing || pin.length !== 4}
                    className="flex flex-1 items-center justify-center gap-2 rounded-[18px] bg-[#FC6B31] py-4 text-[14px] font-extrabold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      "Confirm withdrawal"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleBackToDetails}
                    disabled={isProcessing}
                    className="flex-1 rounded-[18px] border border-gray-200 bg-white py-4 text-[14px] font-extrabold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-300 dark:hover:bg-zinc-900"
                  >
                    Back
                  </button>
                </div>
              </form>
            ) : (
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

              {action === "withdraw" && (
                <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <p className="text-[12px] font-medium text-gray-500">
                    Confirm the destination account. We verify it before queueing your payout.
                  </p>
                  <div>
                    <label htmlFor="wallet-account-number" className="mb-1.5 block text-[13px] font-bold text-gray-700 dark:text-gray-200">
                      Account number
                    </label>
                    <input
                      id="wallet-account-number"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={10}
                      value={accountNumber}
                      onChange={(event) => {
                        setAccountNumber(event.target.value.replace(/\D/g, ""));
                        setVerifiedAccount("");
                        setActionError("");
                      }}
                      placeholder="10-digit account number"
                      className="w-full rounded-[18px] border border-gray-200 bg-white px-4 py-3.5 text-[15px] font-bold text-gray-900 outline-none transition-colors placeholder:font-medium placeholder:text-gray-400 focus:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="wallet-bank-code" className="mb-1.5 block text-[13px] font-bold text-gray-700 dark:text-gray-200">
                      Bank code
                    </label>
                    <input
                      id="wallet-bank-code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={bankCode}
                      onChange={(event) => {
                        setBankCode(event.target.value.replace(/\D/g, ""));
                        setVerifiedAccount("");
                        setActionError("");
                      }}
                      placeholder="e.g. 058"
                      className="w-full rounded-[18px] border border-gray-200 bg-white px-4 py-3.5 text-[15px] font-bold text-gray-900 outline-none transition-colors placeholder:font-medium placeholder:text-gray-400 focus:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyAccount}
                    disabled={isVerifying || isProcessing || accountNumber.trim().length < 10 || !bankCode.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-[18px] border border-gray-300 bg-white py-3 text-[13px] font-extrabold text-gray-800 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200 dark:hover:bg-zinc-800"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                      </>
                    ) : verifiedAccount ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Verified
                      </>
                    ) : (
                      "Verify account"
                    )}
                  </button>
                  {verifiedAccount && (
                    <p className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {verifiedAccount}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  isProcessing ||
                  isVerifying ||
                  !amount.trim() ||
                  (action === "withdraw" && !verifiedAccount)
                }
                className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#FC6B31] py-4 text-[14px] font-extrabold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : action === "fund" ? (
                  "Continue to fund"
                ) : (
                  "Continue"
                )}
              </button>
            </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}