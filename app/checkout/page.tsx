'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/Button';
import { InputField } from '@/components/InputField';
import { SlotSelector } from '@/components/SlotSelector';
import { ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';

// Mock Delivery Slots
const MOCK_SLOTS = [
  { id: '1', timeRange: '11:00 AM - 12:00 PM', isAvailable: false },
  { id: '2', timeRange: '12:00 PM - 1:00 PM', isAvailable: true, surgeMultiplier: 1.2 },
  { id: '3', timeRange: '1:00 PM - 2:00 PM', isAvailable: true },
  { id: '4', timeRange: '2:00 PM - 3:00 PM', isAvailable: true },
];

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(?:\+234|0)[789][01]\d{8}$/, 'Must be a valid Nigerian phone number (e.g. +2348012345678 or 08012345678)'),
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
  
  // Calculate surge pricing
  const activeSlot = MOCK_SLOTS.find(s => s.id === selectedSlot);
  const surgeFee = activeSlot?.surgeMultiplier ? subtotal * (activeSlot.surgeMultiplier - 1) : 0;
  const deliveryFee = 1000;
  const total = subtotal + surgeFee + deliveryFee;

  // Redirect if cart is empty
  React.useEffect(() => {
    if (items.length === 0) {
      router.push('/');
    }
  }, [items, router]);

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsProcessing(true);
    console.log('Order submitted:', data);
    
    // Simulate API call and payment processing
    setTimeout(() => {
      clearCart();
      router.push('/order/success');
    }, 2000);
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-secondary-light/5 min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-foreground/60 hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Menu
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="flex-1 bg-background p-6 md:p-8 rounded-2xl shadow-sm border border-secondary-light/20">
            <h1 className="text-2xl font-black text-foreground mb-8">Checkout</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Delivery Details */}
              <section>
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center">
                  <span className="bg-secondary text-secondary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">1</span>
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

              {/* Delivery Slot */}
              <section>
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center">
                  <span className="bg-secondary text-secondary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">2</span>
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

              {/* Payment Method */}
              <section>
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center">
                  <span className="bg-secondary text-secondary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2">3</span>
                  Payment Method
                </h2>
                <div className="border-2 border-primary bg-primary/10 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Pay with Card / Bank Transfer</p>
                      <p className="text-sm text-foreground/65">Secured by Paystack</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-primary border-2 border-background ring-2 ring-primary" />
                </div>
              </section>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg bg-secondary hover:bg-secondary-light text-secondary-foreground" 
                isLoading={isProcessing}
              >
                {isProcessing ? 'Processing Payment...' : `Pay ₦${total.toLocaleString()}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-100">
            <div className="bg-background p-6 rounded-2xl shadow-sm border border-secondary-light/20 sticky top-24">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                Order Summary
              </h2>
              
              <ul className="space-y-4 mb-6 max-h-75 overflow-y-auto pr-2">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <div className="flex gap-2">
                      <span className="font-semibold text-foreground/60">{item.quantity}x</span>
                      <span className="text-foreground font-medium">{item.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-secondary-light/20 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-foreground/70">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                {surgeFee > 0 && (
                  <div className="flex justify-between text-sm text-red-600 font-medium">
                    <span>Surge Fee</span>
                    <span>+₦{surgeFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-foreground/70">
                  <span>Delivery Fee</span>
                  <span>₦{deliveryFee.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-secondary-light/20 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-2xl font-black text-primary">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
