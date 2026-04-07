'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu as MenuIcon } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useUiStore } from '@/store/uiStore';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const getTotalItems = useCartStore((state) => state.getTotalItems());
  const toggleCart = useUiStore((state) => state.toggleCart);

  // Avoid hydration mismatch by waiting for mount
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="cnc-navbar-shadow sticky top-0 z-40 w-full border-b border-secondary-light/20 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-foreground hover:text-primary transition-colors">
            <MenuIcon size={24} />
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">
              Chop<span className="text-primary">n</span>chop
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Daily Menu
          </Link>
          <Link href="/orders" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            My Orders
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <Button 
            variant="ghost" 
            className="relative p-2 text-foreground hover:text-primary hover:bg-primary/10"
            onClick={toggleCart}
            aria-label="Open cart"
          >
            <ShoppingCart size={24} />
            {mounted && getTotalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {getTotalItems}
              </span>
            )}
          </Button>
          
          <Link href="/checkout" className="hidden sm:block">
            <Button variant="primary" className="cnc-breath-btn bg-secondary hover:bg-secondary-light text-secondary-foreground border-2 border-primary">
              Checkout
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
