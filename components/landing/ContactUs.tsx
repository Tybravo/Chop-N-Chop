// components/landing/ContactUs.tsx
'use client';

import React from 'react';
import { MessageSquareText, MessageCircleQuestion, Phone } from 'lucide-react';

export default function ContactUs() {
  return (
    <section id="contact-us" className="w-full flex flex-col items-center pt-12 md:pt-24 pb-12 md:pb-16 px-4 md:px-[10px] bg-transparent">
      
      <div className="w-full max-w-[637px] flex flex-col items-center mb-10 md:mb-12 text-center">
        <h2 className="text-[28px] md:text-[40px] font-bold text-[#3E3D42] dark:text-white mb-2">
          Contact Us
        </h2>
        <p className="text-[15px] md:text-[16px] text-[#555F66] dark:text-gray-400">
          Questions about today&apos;s drop, your order, or delivery? We&apos;re here to help.
        </p>
      </div>

      <div className="w-full max-w-[1080px] grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        
        {/* Card 1 */}
        {/* Changed md:items-start to lg:items-start and md:p-10 to lg:p-10 */}
        <div className="bg-white dark:bg-gray-900 rounded-[20px] p-8 lg:p-10 flex flex-col items-center lg:items-start shadow-sm border border-gray-100 dark:border-gray-800 transition-transform hover:-translate-y-1 duration-300">
          <div className="mb-4 lg:mb-6 text-[#3E3D42] dark:text-white">
            <MessageSquareText size={32} strokeWidth={1.5} />
          </div>
          {/* Changed md:items-start md:text-left to lg:items-start lg:text-left */}
          <div className="flex flex-col items-center lg:items-start gap-2 mb-6 lg:mb-8 text-center lg:text-left">
            <h3 className="text-lg lg:text-xl font-bold text-[#3E3D42] dark:text-white leading-tight">Chat to sales</h3>
            <p className="text-[#555F66] dark:text-gray-400 text-[14px] lg:text-[15px] leading-tight">Speak to our friendly team</p>
          </div>
          <a href="https://wa.link/1e3ijy" className="mt-auto text-[#FF6633] font-semibold text-[14px] lg:text-[15px] underline decoration-[#FF6633]/30 underline-offset-4 hover:decoration-[#FF6633] transition-colors">
            sales@chopnchop.ng
          </a>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-gray-900 rounded-[20px] p-8 lg:p-10 flex flex-col items-center lg:items-start shadow-sm border border-gray-100 dark:border-gray-800 transition-transform hover:-translate-y-1 duration-300">
          <div className="mb-4 lg:mb-6 text-[#3E3D42] dark:text-white">
            <MessageCircleQuestion size={32} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-center lg:items-start gap-2 mb-6 lg:mb-8 text-center lg:text-left">
            <h3 className="text-lg lg:text-xl font-bold text-[#3E3D42] dark:text-white leading-tight">Chat to support</h3>
            <p className="text-[#555F66] dark:text-gray-400 text-[14px] lg:text-[15px] leading-tight">We&apos;re here to help</p>
          </div>
          <a href="mailto:chopnchop.system@gmail.com" className="mt-auto text-[#FF6633] font-semibold text-[14px] lg:text-[15px] underline decoration-[#FF6633]/30 underline-offset-4 hover:decoration-[#FF6633] transition-colors">
            chopnchop.system@gmail.com
          </a>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-gray-900 rounded-[20px] p-8 lg:p-10 flex flex-col items-center lg:items-start shadow-sm border border-gray-100 dark:border-gray-800 transition-transform hover:-translate-y-1 duration-300">
          <div className="mb-4 lg:mb-6 text-[#3E3D42] dark:text-white">
            <Phone size={32} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-center lg:items-start gap-2 mb-6 lg:mb-8 text-center lg:text-left">
            <h3 className="text-lg lg:text-xl font-bold text-[#3E3D42] dark:text-white leading-tight">Call us</h3>
            <p className="text-[#555F66] dark:text-gray-400 text-[14px] lg:text-[15px] leading-tight">Mon-Sat from 8am to 5pm</p>
          </div>
          <a href="tel:+2348172028728" className="mt-auto text-[#FF6633] font-semibold text-[14px] lg:text-[15px] underline decoration-[#FF6633]/30 underline-offset-4 hover:decoration-[#FF6633] transition-colors">
            +234 817 202 8728
          </a>
        </div>

      </div>
    </section>
  );
}