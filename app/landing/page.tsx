// app/landing/page.tsx
'use client';

import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Faq from '@/components/landing/Faq';
import ContactUs from '@/components/landing/ContactUs';
import Footer from '@/components/landing/Footer';

export default function NewLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-background">
      {/* <Navbar /> */}
      
      <main className="flex-grow flex flex-col">
        <Hero />
        <HowItWorks />
        
        {/* --- SHARED BACKGROUND SECTION FOR FAQ & CONTACT --- */}
        <div className="relative w-full bg-[#FFF7F5] dark:bg-gray-950 overflow-hidden">
          
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: 'url("/bg_overlay.png")',
              backgroundPosition: 'center bottom',
              backgroundSize: 'clamp(1440px, 100vw, 2400px) auto',
              backgroundRepeat: 'no-repeat',
            }}
          />
          
          {/* The content sitting on top of the overlay */}
          <div className="relative z-10 w-full flex flex-col">
            <Faq />
            <ContactUs />
          </div>

        </div>
        {/* --- END SHARED SECTION --- */}
        
        <Footer />

      </main>
    </div>
  );
}