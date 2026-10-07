import axios from "axios";
import { customerApiClient } from "@/lib/api/customerApiClient";

/**
 * Deliberately omits `walletPin`, which the backend currently returns on both
 * /wallet/me and every nested ledger entry. It is never rendered, logged or
 * persisted here - see the note in the summary about that upstream leak.
 */
export interface Wallet {
  id?: string;
  availableBalance: number;
  pendingEscrowBalance?: number;
  totalWithdrawn?: number;
  kycCompleted: boolean;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WalletLedgerEntry {
  id: string;
  type: string;
  amount: number;
  referenceId?: string;
  description?: string;
  createdAt: string;
}

const extractMessage = (payload: unknown, fallback: string): string => {
  if (payload && typeof payload === "object") {
    const message = (payload as Record<string, unknown>).message;
    if (typeof message === "string" && message.length > 0) return message;
  }
  return fallback;
};

/**
 * Every wallet endpoint answers with { success, message, data }. Unwrap the data,
 * but treat a 200 carrying success:false as a real failure so the UI surfaces the
 * backend's message instead of silently rendering an empty wallet.
 */
const unwrapOrThrow = <T,>(payload: unknown, fallback: string): T => {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const record = payload as Record<string, unknown>;
    if ("success" in record) {
      if (record.success === false) {
        throw new Error(extractMessage(record, fallback));
      }
      return record.data as T;
    }
  }
  return payload as T;
};

/**
 * Surfaces the backend's own wording for 400/401 responses
 * ("Invalid wallet PIN", "Insufficient available balance", ...) instead of a
 * generic axios message.
 */
const toApiError = (error: unknown, fallback: string): Error => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const message = extractMessage(data, "");
    if (message) return new Error(message);

    if (error.response?.status === 401) {
      return new Error("Your session expired. Please sign in again.");
    }
    if (error.response?.status === 400) {
      return new Error(fallback);
    }
  }
  if (error instanceof Error && error.message) return error;
  return new Error(fallback);
};

const getMyWallet = async (): Promise<Wallet> => {
  // The authenticated user is resolved from the Bearer token, never from the URL.
  const res = await customerApiClient.get("/api/v1/wallet/me");
  const wallet = unwrapOrThrow<Wallet | null>(res.data, "Could not load your wallet.");

  if (!wallet) {
    throw new Error("We could not load your wallet. Please try again.");
  }
  return wallet;
};

const getTransactions = async (): Promise<WalletLedgerEntry[]> => {
  const res = await customerApiClient.get("/api/v1/wallet/transactions");
  const data = unwrapOrThrow<WalletLedgerEntry[] | null>(res.data, "Could not load your transactions.");
  return Array.isArray(data) ? data : [];
};

export const walletService = {
  /** Available balance, escrow balance and KYC status for the signed-in customer. */
  getWallet: getMyWallet,

  /** Immutable ledger entries for the signed-in customer. */
  getTransactions,

  /** Convenience: wallet + ledger in one pass. */
  getWalletOverview: async (): Promise<{ wallet: Wallet; transactions: WalletLedgerEntry[] }> => {
    const [wallet, transactions] = await Promise.all([getMyWallet(), getTransactions()]);
    return { wallet, transactions };
  },

  /** Confirms a destination account belongs to the customer before withdrawing. */
  verifyBankAccount: async (accountNumber: string, bankCode: string): Promise<string> => {
    try {
      const res = await customerApiClient.get("/api/v1/wallet/verify-bank", {
        params: { accountNumber, bankCode },
      });
      const data = unwrapOrThrow<unknown>(res.data, "Account verified");
      return typeof data === "string" ? data : extractMessage(res.data, "Account verified");
    } catch (error) {
      throw toApiError(error, "We could not verify that account number.");
    }
  },

  /**
   * Queues a withdrawal into the bulk payout batch. The PIN is authorised by the
   * backend as part of this call, so it is never verified in a separate request.
   */
  requestWithdrawal: async (amount: number, pin: string): Promise<string> => {
    try {
      const res = await customerApiClient.post("/api/v1/wallet/withdraw", { amount, pin });
      const data = unwrapOrThrow<unknown>(res.data, "Withdrawal request submitted");
      if (typeof data === "string" && data.trim()) return data;
      return extractMessage(res.data, "Withdrawal request submitted");
    } catch (error) {
      throw toApiError(error, "Could not submit the withdrawal request.");
    }
  },
};