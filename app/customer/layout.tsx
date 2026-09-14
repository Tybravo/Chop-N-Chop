import FloatingBottomNav from "@/components/customer/FloatingBottomNav";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex justify-center">
      {/* Mobile Container Boundary */}
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 min-h-screen relative flex flex-col shadow-xl border-x border-gray-100 dark:border-zinc-800">
        
        {/* Main scrollable content area with padding for the floating nav */}
        <main className="flex-1 overflow-y-auto pb-28">
          {children}
        </main>
        
        <FloatingBottomNav />
      </div>
    </div>
  );
}