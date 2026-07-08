'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu as MenuIcon } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useUiStore } from '@/store/uiStore';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const getTotalItems = useCartStore((state) => state.getTotalItems());
  const toggleCart = useUiStore((state) => state.toggleCart);
  const pathname = usePathname();

  // Avoid hydration mismatch by waiting for mount
  const [mounted, setMounted] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if we are in a dashboard route
  const isDashboardRoute = 
    pathname.startsWith('/admin/dashboard') || 
    (pathname.startsWith('/vendor/') && !['/vendor/login', '/vendor/register', '/vendor/verify-otp'].includes(pathname));

  return (
    <header className="cnc-navbar-shadow sticky top-0 z-40 w-full border-b border-secondary-light/20 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button - Only show if not in dashboard */}
          {!isDashboardRoute && (
            <div className="relative md:hidden">
              <button 
                className="p-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <MenuIcon size={24} />
              </button>
              
              {isMobileMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 top-16 bg-black/20 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-56 bg-background border border-secondary-light/20 rounded-xl shadow-xl py-2 flex flex-col gap-1 z-50">
                    <Link href="/" className="px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary-light/10 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                      Home
                    </Link>
                    <Link href="/orders" className="px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary-light/10 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                      My Orders
                    </Link>
                    <Link href="/vendor/login" className="px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary-light/10 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                      Vendor Login
                    </Link>
                    <Link href="/vendor/register" className="px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary-light/10 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                      Become a Vendor
                    </Link>
                    <Link href="/admin/login" className="px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary-light/10 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                      Admin Login
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
          
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
          <Link href="/vendor/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Vendor
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
