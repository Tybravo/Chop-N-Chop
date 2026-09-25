import React from "react";

// Robust Card Type & Luhn Algorithm Validator
export const getCardInfo = (number: string) => {
  const cleanNum = number.replace(/\D/g, "");

  let type = "CARD";
  let gradient = "from-gray-800 via-gray-700 to-gray-900 border-gray-600";

  if (/^4/.test(cleanNum)) {
    type = "VISA";
    gradient = "from-blue-800 via-blue-700 to-blue-900 border-blue-500/50 shadow-blue-900/40";
  } else if (/^(5[1-5]|2[2-7])/.test(cleanNum) || cleanNum === "5" || cleanNum.startsWith("22")) {
    type = "MasterCard";
    gradient = "from-gray-900 via-gray-800 to-black border-gray-700 shadow-gray-900/50"; // Sleek black for Mastercard
  } else if (/^(506|507|650)/.test(cleanNum)) {
    type = "Verve";
    gradient = "from-red-700 via-red-600 to-rose-900 border-red-500/50 shadow-red-900/40";
  } else if (/^3[47]/.test(cleanNum) || cleanNum === "3") {
    type = "AMEX";
    gradient = "from-sky-100 via-slate-200 to-gray-300 border-white text-slate-800 shadow-gray-400/40";
  } else if (/^6/.test(cleanNum)) {
    type = "Discover";
    gradient = "from-orange-500 via-orange-400 to-orange-700 border-orange-300/50 shadow-orange-900/40";
  }

  let sum = 0;
  let isSecond = false;
  for (let i = cleanNum.length - 1; i >= 0; i--) {
    let d = parseInt(cleanNum.charAt(i), 10);
    if (isSecond) {
      d = d * 2;
      if (d > 9) d = Math.floor(d / 10) + (d % 10);
    }
    sum += d;
    isSecond = !isSecond;
  }

  const isValid = cleanNum.length >= 13 && cleanNum.length <= 19 && sum % 10 === 0;

  return { type, gradient, isValid, length: cleanNum.length, isLight: type === "AMEX" };
};

// --- Helper for rendering realistic brand logos ---
const CardLogo = ({ type }: { type: string }) => {
  if (type === "VISA") {
    return <span className="font-extrabold italic text-2xl tracking-widest text-white drop-shadow-md">VISA</span>;
  }
  if (type === "MasterCard") {
    return (
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-[#EB001B] opacity-90 mix-blend-screen z-10" />
        <div className="w-8 h-8 rounded-full bg-[#F79E1B] opacity-90 mix-blend-screen -ml-3 z-0" />
      </div>
    );
  }
  if (type === "Verve") {
    return <span className="font-extrabold italic text-xl tracking-wider text-white drop-shadow-md">Verve</span>;
  }
  if (type === "AMEX") {
    return <span className="font-bold text-lg tracking-widest text-blue-600 drop-shadow-sm border-2 border-blue-600 px-1.5 py-0.5 rounded-sm">AMEX</span>;
  }
  return <span className="font-extrabold italic text-lg tracking-wider opacity-80">{type}</span>;
};

type DynamicCreditCardProps = {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cardInfo: ReturnType<typeof getCardInfo>;
};

export default function DynamicCreditCardDetector({
  cardNumber,
  cardName,
  expiryDate,
  cardInfo,
}: DynamicCreditCardProps) {
  
  // Custom text shadow to mimic embossed plastic card numbers
  const embossedText = cardInfo.isLight 
    ? { textShadow: "0px 1px 1px rgba(255,255,255,0.8)" } 
    : { textShadow: "0px 1px 2px rgba(0,0,0,0.7)" };

  const textColor = cardInfo.isLight ? "text-slate-800" : "text-white";
  const labelColor = cardInfo.isLight ? "text-slate-500" : "text-gray-300";

  return (
    <div
      className={`w-full aspect-[1.6/1] bg-gradient-to-br ${cardInfo.gradient} border rounded-[24px] p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-500`}
    >
      {/* Holographic / Light Glare Effects */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

      {/* TOP ROW: Chip, NFC, and Logo */}
      <div className="flex justify-between items-start relative z-10 w-full">
        <div className="flex items-center gap-3">
          {/* Realistic Golden EMV Chip */}
          <div className="relative w-12 h-9 rounded-md bg-gradient-to-br from-[#e5c571] via-[#d6a848] to-[#b38323] border border-[#8a631c] flex items-center justify-center shadow-sm overflow-hidden">
            <div className="absolute w-full h-full opacity-60">
              <div className="absolute top-1/4 left-0 w-3 h-px bg-[#735113]" />
              <div className="absolute top-2/4 left-0 w-3 h-px bg-[#735113]" />
              <div className="absolute top-3/4 left-0 w-3 h-px bg-[#735113]" />
              <div className="absolute top-1/4 right-0 w-3 h-px bg-[#735113]" />
              <div className="absolute top-2/4 right-0 w-3 h-px bg-[#735113]" />
              <div className="absolute top-3/4 right-0 w-3 h-px bg-[#735113]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-5 border border-[#735113] rounded-[2px]" />
            </div>
          </div>

          {/* Contactless (NFC) Icon */}
          <svg 
            width="22" height="22" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" 
            className={`opacity-70 ${textColor}`}
          >
            <path d="M5.5 20.5A15.5 15.5 0 0 0 5.5 3.5"/>
            <path d="M9 17.5A11 11 0 0 0 9 6.5"/>
            <path d="M12.5 14.5A6.5 6.5 0 0 0 12.5 9.5"/>
            <path d="M16 11.5a2 2 0 0 0 0-3"/>
          </svg>
        </div>

        {/* Dynamic Brand Logo */}
        <CardLogo type={cardInfo.type} />
      </div>

      {/* MIDDLE ROW: Card Number */}
      <div className="relative z-10 w-full mt-2">
        <p 
          className={`font-mono text-[22px] sm:text-2xl md:text-[28px] tracking-[0.15em] font-medium ${textColor} whitespace-nowrap`}
          style={embossedText}
        >
          {cardNumber || "**** **** **** ****"}
        </p>
      </div>

      {/* BOTTOM ROW: Name & Expiry */}
      <div className={`flex justify-between items-end gap-3 w-full relative z-10 ${textColor}`}>
        
        {/* Cardholder Name */}
        <div className="min-w-0 flex-1">
          <p className={`text-[9px] sm:text-[10px] ${labelColor} uppercase tracking-widest mb-1 font-semibold`}>
            Cardholder
          </p>
          <p 
            className="font-mono text-[14px] sm:text-[16px] tracking-widest truncate uppercase"
            style={embossedText}
          >
            {cardName || "JOHN DOE"}
          </p>
        </div>

        {/* Expiry Date with VALID THRU */}
        <div className="shrink-0 flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className={`text-[6px] sm:text-[7px] ${labelColor} font-bold leading-[1.1]`}>VALID</span>
            <span className={`text-[6px] sm:text-[7px] ${labelColor} font-bold leading-[1.1]`}>THRU</span>
          </div>
          <div>
            <p className={`text-[9px] sm:text-[10px] ${labelColor} uppercase tracking-widest mb-1 font-semibold invisible`}>
              Exp
            </p>
            <p 
              className="font-mono text-[14px] sm:text-[16px] tracking-widest"
              style={embossedText}
            >
              {expiryDate || "MM/YY"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}