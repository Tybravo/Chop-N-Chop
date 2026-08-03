'use client';

import Hero from '@/components/landing/Hero';

export default function NewLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-background">
      <main className="flex-grow">
        <Hero />
        {/* Future sections (Features, Menu, etc.) will go here */}
      </main>

    </div>
  );
}