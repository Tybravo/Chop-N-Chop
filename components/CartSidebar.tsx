'use client';

import * as React from 'react';
import { useCartStore } from '@/store/cartStore';
import { useUiStore } from '@/store/uiStore';
import { Button } from './Button';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function CartSidebar() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();
  const { isCartOpen, closeCart } = useUiStore();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close cart when pressing Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [closeCart]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 z-50 bg-secondary/60 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-md transform bg-background shadow-2xl transition-transform duration-300 ease-in-out flex flex-col border-l border-secondary-light/20",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-secondary-light/20 p-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" />
            Your Cart ({getTotalItems()})
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-secondary-light/10 text-foreground/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-foreground/70 space-y-4">
              <ShoppingBag size={48} className="text-foreground/30" />
              <p>Your cart is empty.</p>
              <Button variant="outline" onClick={closeCart}>
                Browse Menu
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 border-b border-secondary-light/10 pb-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary-light/10">
                    {/* Placeholder image */}
                    <div className="w-full h-full bg-secondary-light/20" />
                  </div>
                  
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-foreground leading-tight">{item.name}</h3>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-foreground/40 hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-end justify-between mt-2">
                      <div className="flex items-center rounded-lg border border-secondary-light/25">
                        <button 
                          className="px-2 py-1 text-foreground/60 hover:text-foreground hover:bg-secondary-light/10 transition-colors rounded-l-lg"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium text-foreground border-x border-secondary-light/25 min-w-10 text-center">
                          {item.quantity}
                        </span>
                        <button 
                          className="px-2 py-1 text-foreground/60 hover:text-foreground hover:bg-secondary-light/10 transition-colors rounded-r-lg disabled:opacity-50"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-bold text-primary">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-secondary-light/20 p-4 bg-secondary-light/5">
            <div className="flex justify-between text-base font-medium text-foreground mb-4">
              <p>Subtotal</p>
              <p>₦{getTotalPrice().toLocaleString()}</p>
            </div>
            <p className="text-sm text-foreground/60 mb-4">
              Delivery fees and taxes calculated at checkout.
            </p>
            <Link href="/checkout" onClick={closeCart} className="block w-full">
              <Button className="w-full h-12 text-lg bg-secondary hover:bg-secondary-light text-secondary-foreground">
                Checkout Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
