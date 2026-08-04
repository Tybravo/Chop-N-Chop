'use client';

import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Faq from '@/components/landing/Faq'; // Import new component
import ContactUs from '@/components/landing/ContactUs';
import Footer from '@/components/landing/Footer'; 

export default function NewLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-background">
     
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <Faq />
        <ContactUs />
      </main>

      <Footer />
    </div>
  );
}