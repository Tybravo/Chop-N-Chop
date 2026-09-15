import FloatingBottomNav from "@/components/customer/FloatingBottomNav";
import Link from "next/link";
import { Search, ShoppingBag, User, MapPin } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle"; // Imported your existing component

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col md:bg-white md:dark:bg-zinc-900">
      
      {/* DESKTOP TOP NAV (Hidden on Mobile) */}
      <header className="hidden md:block border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/customer" className="flex-shrink-0 flex items-center gap-2.5">
              <img 
                src="/logo_icon.png" 
                alt="Chopnchop Icon" 
                className="h-8 w-8 object-contain" 
              />
              <img 
                src="/Chopnchop.png" 
                alt="Chopnchop" 
                className="h-5 w-auto object-contain dark:brightness-0 dark:invert" 
              />
            </Link>

            {/* Desktop Search Bar */}
            <div className="flex-1 max-w-xl mx-12">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-full bg-gray-50 dark:bg-zinc-800 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Search meals or vendors in your area..."
                />
              </div>
            </div>

            {/* Desktop Nav Links */}
            <nav className="flex items-center gap-8">
              <Link href="/customer" className="text-sm font-semibold text-orange-500">Home</Link>
              <Link href="/customer/explore" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-500">Explore</Link>
              
              <div className="flex items-center gap-5 ml-4 border-l border-gray-200 dark:border-zinc-700 pl-8">
                
                {/* Desktop Theme Toggle Inserted Here */}
                <ThemeToggle />

                <Link href="/customer/cart" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 relative">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
                </Link>
                <Link href="/customer/profile" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500">
                  <User className="w-5 h-5" />
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex justify-center w-full">
        {/* ADDED: overflow-x-hidden md:overflow-visible to prevent horizontal blowout on mobile */}
        <main className="w-full max-w-md md:max-w-7xl bg-white dark:bg-zinc-900 md:bg-transparent min-h-screen relative flex flex-col shadow-xl md:shadow-none border-x border-gray-100 dark:border-zinc-800 md:border-none pb-28 md:pb-12 overflow-x-hidden md:overflow-visible">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAV (Hidden on Desktop) */}
      <div className="md:hidden">
        <FloatingBottomNav />
      </div>
    </div>
  );
}