// components/landing/Faq.tsx
'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Image from 'next/image';

const faqs = [
  { question: "What is Chop'n Chop?", answer: "Chop'n Chop is a meal delivery service that lets you order from a curated daily meal drop. Simply place your order before the cutoff time, and we'll deliver your meal within the scheduled delivery window." },
  { question: "How do I place an order?", answer: "Browse Today's Drop, choose your meal, complete your payment, and we'll handle the rest. Your meal will be prepared and delivered within the delivery window." },
  { question: "What time do orders close?", answer: "Orders close at the cutoff time displayed for each daily drop. We recommend placing your order early, as availability is limited." },
  { question: "When will my meal be delivered?", answer: "Your meal will be delivered during the delivery window shown on Today's Drop. We'll keep you updated every step of the way." },
  { question: "Why are there limited slots available?", answer: "We prepare a limited number of meals for each daily drop to maintain quality and ensure every order is delivered on time." }
];

interface FaqItemProps { question: string; answer: string; isOpen: boolean; onClick: () => void; }

function FaqItem({ question, answer, isOpen, onClick }: FaqItemProps) {
  return (
    <div className="flex flex-col bg-[#FFF7F5] dark:bg-gray-900 rounded-[5px] overflow-hidden transition-colors duration-200">
      <button onClick={onClick} className="flex flex-row justify-between items-center w-full py-[20px] px-[16px] md:py-[23px] md:px-[24px] text-left cursor-pointer hover:bg-[#ffece6] dark:hover:bg-gray-800 transition-colors">
        <span className="text-[#3E3D42] dark:text-white font-medium text-[15px] md:text-[16px]">{question}</span>
        <span className="flex-shrink-0 text-[#FF6633] ml-4 transition-transform duration-300">
          {isOpen ? <Minus size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
        </span>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="pb-[20px] px-[16px] md:pb-[23px] md:px-[24px] text-[#555F66] dark:text-gray-400 text-[14px] md:text-[15px] leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    // Added 'relative' and 'overflow-hidden' to contain the background image
    <section id="faqs" className="relative w-full flex flex-col items-center pt-12 md:pt-16 pb-16 md:pb-24 px-4 md:px-[10px] bg-white dark:bg-background overflow-hidden">
      
      {/* 10% Opacity Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <Image 
          src="/bg_overlay.png" 
          alt="Street Background Overlay" 
          fill 
          className="object-cover object-top" 
          quality={100}
        />
      </div>

      <div className="relative z-10 w-full max-w-[637px] flex flex-col items-center">
        <h2 className="text-[28px] md:text-[40px] font-bold text-[#3E3D42] dark:text-white mb-2 text-center">
          FAQ&apos;s
        </h2>
        <p className="text-[15px] md:text-[16px] text-[#555F66] dark:text-gray-400 mb-8 md:mb-12 text-center">
          Everything you need to know before placing an order.
        </p>
        <div className="w-full flex flex-col gap-2">
          {faqs.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} isOpen={openIndex === index} onClick={() => setOpenIndex(openIndex === index ? null : index)} />
          ))}
        </div>
      </div>
    </section>
  );
}