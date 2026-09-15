'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/Button';
import { InputField } from '@/components/InputField';
import { SlotSelector } from '@/components/SlotSelector';
import { ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const MOCK_SLOTS = [
  { id: '1', timeRange: '11:00 AM - 12:00 PM', isAvailable: false },
  { id: '2', timeRange: '12:00 PM - 1:00 PM', isAvailable: true, surgeMultiplier: 1.2 },
  { id: '3', timeRange: '1:00 PM - 2:00 PM', isAvailable: true },
  { id: '4', timeRange: '2:00 PM - 3:00 PM', isAvailable: true },
];

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(?:\+234|0)[789][01]\d{8}$/, 'Must be a valid Nigerian phone number'),
  address: z.string().min(10, 'Full delivery address is required'),
  deliverySlot: z.string().min(1, 'Please select a delivery slot'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const selectedSlot = watch('deliverySlot');
  const subtotal = getTotalPrice();

  const activeSlot = MOCK_SLOTS.find(s => s.id === selectedSlot);
  const surgeFee = activeSlot?.surgeMultiplier ? subtotal * (activeSlot.surgeMultiplier - 1) : 0;
  const deliveryFee = 1000;
  const total = subtotal + surgeFee + deliveryFee;

  React.useEffect(() => {
    if (items.length === 0) {
      router.push('/customer/cart');
    }
  }, [items, router]);

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      router.push('/customer/orders');
    }, 2000);
  };

  if (items.length === 0) return null;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <Link href="/customer/cart" className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
        <ArrowLeft size={16} className="mr-2" />
        Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Checkout</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Delivery Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  placeholder="John Doe"
                  {...register('fullName')}
                  error={errors.fullName?.message}
                />
                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <InputField
                  label="Phone Number"
                  placeholder="+2348012345678"
                  {...register('phone')}
                  error={errors.phone?.message}
                />
                <div className="md:col-span-2">
                  <InputField
                    label="Delivery Address"
                    placeholder="123 Admiralty Way, Lekki Phase 1"
                    {...register('address')}
                    error={errors.address?.message}
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Select Delivery Slot
              </h2>
              <SlotSelector
                slots={MOCK_SLOTS}
                selectedSlotId={selectedSlot}
                onChange={(id) => setValue('deliverySlot', id, { shouldValidate: true })}
              />
              {errors.deliverySlot && (
                <p className="text-xs font-medium text-red-500 mt-2">{errors.deliverySlot.message}</p>
              )}
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                Payment Method
              </h2>
              <div className="border-2 border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/20 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="text-orange-500" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Pay with Card / Bank Transfer</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Secured by Paystack</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-background ring-2 ring-orange-500" />
              </div>
            </section>

            <Button
              type="submit"
              className="w-full h-14 text-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl"
              isLoading={isProcessing}
            >
              {isProcessing ? 'Processing Payment...' : `Pay ₦${total.toLocaleString()}`}
            </Button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ShoppingBag size={20} className="text-orange-500" />
              Order Summary
            </h2>

            <ul className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-500">{item.quantity}x</span>
                    <span className="text-gray-900 dark:text-white font-medium">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 space-y-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              {surgeFee > 0 && (
                <div className="flex justify-between text-sm text-red-600 font-medium">
                  <span>Surge Fee</span>
                  <span>+₦{surgeFee.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Delivery Fee</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>

              <div className="border-t border-gray-100 dark:border-zinc-800 pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-black text-orange-500">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}