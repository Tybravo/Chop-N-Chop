"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Ticket, Check, Loader2, XCircle } from "lucide-react";
import { customerApiClient } from "@/lib/api/customerApiClient";
import axios from "axios";

type PromoStatus = "idle" | "applying" | "applied" | "error";

export default function PromosPage() {
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [status, setStatus] = useState<PromoStatus>("idle");
  const [message, setMessage] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);
  const promoInputRef = useRef<HTMLInputElement>(null);

  // Promo apply/remove requires an active cart ID; cart state is managed elsewhere in the app.
  const activeCartId = typeof window !== "undefined" ? localStorage.getItem("chopnchop_active_cart_id") : null;

  const applyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setStatus("error");
      setMessage("Enter a promo code before applying it.");
      return;
    }
    if (!activeCartId) {
      setStatus("error");
      setMessage("Add items to your cart first, then apply a promo code.");
      return;
    }
    setStatus("applying");
    setMessage("");
    try {
      await customerApiClient.post(`/api/v1/carts/${activeCartId}/promo`, { promoCode: code });
      setAppliedCode(code);
      setStatus("applied");
      setMessage(`Promo code ${code} applied to your cart.`);
    } catch (error) {
      setStatus("error");
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data?.message || error.response.data?.error || "That promo code is invalid or expired.");
      } else {
        setMessage("Unable to apply promo code right now.");
      }
    }
  };

  const removeCoupon = async () => {
    if (!activeCartId) return;
    setIsRemoving(true);
    try {
      await customerApiClient.delete(`/api/v1/carts/${activeCartId}/promo`);
      setAppliedCode(null);
      setStatus("idle");
      setMessage("");
      setPromoCode("");
    } catch {
      setMessage("Failed to remove promo code.");
      setStatus("error");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-[112px] pt-4 dark:bg-zinc-950 md:pb-16">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between pt-2">
        <button type="button" onClick={() => router.back()} aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="min-w-0 truncate px-2 text-lg font-extrabold text-gray-900 dark:text-white">Promos &amp; Rewards</h1>
        <div className="h-10 w-10" aria-hidden="true" />
      </header>

      <main className="mx-auto w-full max-w-3xl">
        <section aria-labelledby="add-promo-heading" className="mb-8 mt-6">
          <h2 id="add-promo-heading" className="sr-only">Add a promo code</h2>
          <form onSubmit={applyCode} noValidate>
            <label htmlFor="promo-code" className="mb-2 block text-[13px] font-bold text-gray-700 dark:text-gray-200">Have a promo code?</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input ref={promoInputRef} id="promo-code" type="text" autoComplete="off" maxLength={24} value={promoCode}
                onChange={(event) => { setPromoCode(event.target.value); if (status !== "applying") { setStatus("idle"); setMessage(""); } }}
                aria-invalid={status === "error"} aria-describedby={message ? "promo-message" : undefined}
                placeholder="Enter Promo Code"
                className="min-w-0 flex-1 rounded-[18px] border border-gray-200 bg-white px-5 py-4 text-[14px] font-bold text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-gray-500" />
              <button type="submit" disabled={status === "applying"}
                className="flex min-h-[58px] w-full items-center justify-center gap-2 rounded-[18px] bg-gray-900 px-6 py-4 text-[14px] font-bold text-white shadow-md transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900 sm:w-auto">
                {status === "applying" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Applying</>) : "Apply"}
              </button>
            </div>
          </form>
          {message && (
            <p id="promo-message" role={status === "error" ? "alert" : "status"}
              className={`mt-3 flex items-start gap-2 rounded-xl px-4 py-3 text-[13px] font-medium ${status === "error" ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300"}`}>
              {status === "error" ? <span className="mt-0.5 font-black">!</span> : <Check className="mt-0.5 h-4 w-4 shrink-0" />}
              <span>{message}</span>
            </p>
          )}
        </section>

        {appliedCode && (
          <div role="status" className="mb-6 flex items-start justify-between gap-3 rounded-[20px] border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
            <div className="flex items-start gap-3 min-w-0">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="min-w-0">
                <h3 className="text-[14px] font-extrabold text-emerald-800 dark:text-emerald-200">Promo applied</h3>
                <p className="mt-0.5 text-[13px] text-emerald-700 dark:text-emerald-300"><span className="font-bold">{appliedCode}</span> is applied to your cart.</p>
              </div>
            </div>
            <button onClick={removeCoupon} disabled={isRemoving} aria-label="Remove applied promo code"
              className="shrink-0 rounded-full p-2 text-emerald-600 transition-colors hover:bg-emerald-100 disabled:opacity-50 dark:text-emerald-400 dark:hover:bg-emerald-900/50">
              {isRemoving ? <Loader2 className="h-5 w-5 animate-spin" /> : <XCircle className="h-5 w-5" />}
            </button>
          </div>
        )}

        <section aria-labelledby="available-coupons-heading">
          <div className="mb-4 flex items-center justify-between gap-3 px-2">
            <h3 id="available-coupons-heading" className="text-[15px] font-extrabold text-gray-900 dark:text-white">Available Coupons</h3>
          </div>
          <div role="status" className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <Ticket className="mb-3 h-8 w-8 text-gray-300 dark:text-zinc-700" />
            <h4 className="text-[14px] font-bold text-gray-900 dark:text-white">No coupons available</h4>
            <p className="mt-1 text-[13px] text-gray-500">Rewards and promo offers will appear here when they&apos;re available. You can still apply a code above.</p>
            <button type="button" onClick={() => router.push("/customer/explore")}
              className="mt-4 rounded-full bg-gray-900 px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] dark:bg-white dark:text-zinc-900">
              Browse meals
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
