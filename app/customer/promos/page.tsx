"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Ticket, Check, Loader2, XCircle } from "lucide-react";
import { customerApiClient } from "@/lib/api/customerApiClient";
import axios from "axios";

interface Coupon {
  id: string;
  title: string;
  description: string;
  code: string;
}

type PromoStatus = "idle" | "applying" | "applied" | "error";

const availableCoupons: Coupon[] = [
  {
    id: "first-drops",
    title: "10% Off First Drops",
    description: "Valid on any pre-ordered scheduled drop. Maximum discount ₦2,000.",
    code: "FIRST10",
  },
];

export default function PromosPage() {
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);
  const [status, setStatus] = useState<PromoStatus>("idle");
  const [message, setMessage] = useState("");
  const [applyingCouponId, setApplyingCouponId] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const promoInputRef = useRef<HTMLInputElement>(null);

  // In production, retrieve the active cart ID from your cart state/context
  const activeCartId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; 

  const applyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = promoCode.trim().toUpperCase();
    
    if (!code) {
      setStatus("error");
      setMessage("Enter a promo code before applying it.");
      return;
    }

    // Check if it's already applied locally
    const matchedCoupon = availableCoupons.find((c) => c.code === code);
    if (matchedCoupon && appliedCoupons.includes(matchedCoupon.id)) {
      setStatus("applied");
      setMessage(`${matchedCoupon.title} is already ready for your next order.`);
      return;
    }

    setStatus("applying");
    setMessage("");

    try {
      await customerApiClient.post(`/api/v1/carts/${activeCartId}/promo`, {
        promoCode: code
      });

      // If the code matches one of our known coupons, track its ID
      if (matchedCoupon) {
        setAppliedCoupons((current) => [...current, matchedCoupon.id]);
        setMessage(`${matchedCoupon.title} is ready for your next order.`);
      } else {
        setMessage(`Promo code ${code} successfully applied.`);
      }
      setStatus("applied");
    } catch (error) {
      setStatus("error");
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data?.message || error.response.data?.error || "That promo code is invalid or expired.");
      } else {
        setMessage("Network error. Please check your connection and try again.");
      }
    }
  };

  const applyCoupon = async (coupon: Coupon) => {
    if (appliedCoupons.includes(coupon.id) || applyingCouponId) return;

    setApplyingCouponId(coupon.id);
    setStatus("applying");
    setMessage("");

    try {
      await customerApiClient.post(`/api/v1/carts/${activeCartId}/promo`, {
        promoCode: coupon.code
      });

      setAppliedCoupons((current) => [...current, coupon.id]);
      setStatus("applied");
      setMessage(`${coupon.title} is ready for your next order.`);
    } catch (error) {
      setStatus("error");
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data?.message || error.response.data?.error || "Failed to apply this coupon.");
      } else {
        setMessage("Network error. Please try again.");
      }
    } finally {
      setApplyingCouponId(null);
    }
  };

  const removeCoupon = async (couponId: string) => {
    setIsRemoving(true);
    try {
      await customerApiClient.delete(`/api/v1/carts/${activeCartId}/promo`);

      setAppliedCoupons((current) => current.filter(id => id !== couponId));
      setStatus("idle");
      setMessage("");
      setPromoCode("");
    } catch (error) {
      console.error("Failed to remove promo:", error);
    } finally {
      setIsRemoving(false);
    }
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
        <h1 className="min-w-0 truncate px-2 text-lg font-extrabold text-gray-900 dark:text-white">Promos &amp; Rewards</h1>
        <div className="h-10 w-10" aria-hidden="true" />
      </header>

      <main className="mx-auto w-full max-w-3xl">
        <section aria-labelledby="add-promo-heading" className="mb-8 mt-6">
          <h2 id="add-promo-heading" className="sr-only">Add a promo code</h2>
          <form onSubmit={applyCode} noValidate>
            <label htmlFor="promo-code" className="mb-2 block text-[13px] font-bold text-gray-700 dark:text-gray-200">
              Have a promo code?
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                ref={promoInputRef}
                id="promo-code"
                type="text"
                autoComplete="off"
                maxLength={24}
                value={promoCode}
                onChange={(event) => {
                  setPromoCode(event.target.value);
                  if (status !== "applying") {
                    setStatus("idle");
                    setMessage("");
                  }
                }}
                aria-invalid={status === "error"}
                aria-describedby={message ? "promo-message" : undefined}
                placeholder="Enter Promo Code"
                className="min-w-0 flex-1 rounded-[18px] border border-gray-200 bg-white px-5 py-4 text-[14px] font-bold text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-gray-500"
              />
              <button
                type="submit"
                disabled={status === "applying"}
                className="flex min-h-[58px] w-full items-center justify-center gap-2 rounded-[18px] bg-gray-900 px-6 py-4 text-[14px] font-bold text-white shadow-md transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 sm:w-auto"
              >
                {status === "applying" && !applyingCouponId ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Applying
                  </>
                ) : (
                  "Apply"
                )}
              </button>
            </div>
          </form>
          {message && (
            <p
              id="promo-message"
              role={status === "error" ? "alert" : "status"}
              className={`mt-3 flex items-start gap-2 rounded-xl px-4 py-3 text-[13px] font-medium ${
                status === "error"
                  ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-300"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300"
              }`}
            >
              {status === "error" ? (
                <span className="mt-0.5 font-black">!</span>
              ) : (
                <Check className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span>{message}</span>
            </p>
          )}
        </section>

        {appliedCoupons.length > 0 && (
          <div role="status" className="mb-6 flex items-start justify-between gap-3 rounded-[20px] border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
            <div className="flex items-start gap-3 min-w-0">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="min-w-0">
                <h3 className="text-[14px] font-extrabold text-emerald-800 dark:text-emerald-200">Promo selected</h3>
                <p className="mt-0.5 text-[13px] text-emerald-700 dark:text-emerald-300">
                  {availableCoupons
                    .filter((coupon) => appliedCoupons.includes(coupon.id))
                    .map((coupon) => coupon.title)
                    .join(", ")}{" "}
                  will be available at checkout.
                </p>
              </div>
            </div>
            <button 
              onClick={() => removeCoupon(appliedCoupons[0])}
              disabled={isRemoving}
              className="shrink-0 p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-full transition-colors disabled:opacity-50"
              aria-label="Remove applied promo code"
            >
              {isRemoving ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
            </button>
          </div>
        )}

        <section aria-labelledby="available-coupons-heading">
          <div className="mb-4 flex items-center justify-between gap-3 px-2">
            <h3 id="available-coupons-heading" className="text-[15px] font-extrabold text-gray-900 dark:text-white">
              Available Coupons
            </h3>
            <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-gray-500 dark:bg-zinc-900 dark:text-gray-400">
              {availableCoupons.length} active
            </span>
          </div>

          {availableCoupons.length === 0 ? (
            <div role="status" className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <Ticket className="mb-3 h-8 w-8 text-gray-300 dark:text-zinc-700" />
              <h4 className="text-[14px] font-bold text-gray-900 dark:text-white">No coupons available</h4>
              <p className="mt-1 text-[13px] text-gray-500">New rewards will appear here when they are available.</p>
              <button
                type="button"
                onClick={() => router.push("/customer/explore")}
                className="mt-4 rounded-full bg-gray-900 px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] dark:bg-white dark:text-zinc-900"
              >
                Browse meals
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {availableCoupons.map((coupon) => {
                const isApplied = appliedCoupons.includes(coupon.id);
                const isApplying = applyingCouponId === coupon.id;
                return (
                  <article
                    key={coupon.id}
                    className="relative overflow-hidden rounded-[24px] border-2 border-pink-100 bg-white p-5 shadow-sm dark:border-pink-900/30 dark:bg-zinc-900 sm:p-6"
                  >
                    <div className="pointer-events-none absolute -right-6 -top-6 text-pink-500/10">
                      <Ticket className="h-32 w-32" />
                    </div>
                    <div className="relative">
                      <span className="mb-3 inline-block rounded-lg bg-pink-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-pink-600 dark:bg-pink-950/50">
                        Active
                      </span>
                      <h4 className="mb-1 max-w-[calc(100%-1rem)] text-[18px] font-black leading-tight text-gray-900 dark:text-white">
                        {coupon.title}
                      </h4>
                      <p className="mb-4 max-w-[calc(100%-1rem)] pr-10 text-[13px] text-gray-500 dark:text-gray-400">
                        {coupon.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => applyCoupon(coupon)}
                        disabled={isApplied || isApplying}
                        aria-label={`${isApplied ? "Already applied" : "Apply"} ${coupon.title}`}
                        className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-[14px] font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 disabled:cursor-not-allowed disabled:opacity-60 ${
                          isApplied
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300"
                            : "border-pink-100 bg-pink-50 text-pink-600 hover:bg-pink-100 dark:border-pink-900/50 dark:bg-pink-950/20"
                        }`}
                      >
                        {isApplying ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Applying...
                          </>
                        ) : isApplied ? (
                          <>
                            <Check className="h-4 w-4" /> Applied for next order
                          </>
                        ) : (
                          "Apply to Next Order"
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}