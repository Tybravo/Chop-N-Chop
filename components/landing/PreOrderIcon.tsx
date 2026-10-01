// components/PreOrderIcon.tsx
import React from 'react';

// A custom SVG icon matching the figma pre-order icon (hand holding box with steam)
export function PreOrderIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Container holding box and steam paths */}
      <g clipPath="url(#clip0_1073_10)">
        {/* Steam paths */}
        <path d="M10.875 3.375C10.875 3.375 10.375 2.125 10.875 1C11.375 -0.125 10.875 -1.375 10.875 -1.375M12.375 3.375C12.375 3.375 12.875 2.125 12.375 1C11.875 -0.125 12.375 -1.375 12.375 -1.375" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
        
        {/* Box path */}
        <path d="M6.375 5.875H13.625C13.9011 5.875 14.125 6.09886 14.125 6.375V11.125C14.125 11.4011 13.9011 11.625 13.625 11.625H6.375C6.09886 11.625 5.875 11.4011 5.875 11.125V6.375C5.875 6.09886 6.09886 5.875 6.375 5.875Z" stroke="currentColor" strokeWidth="1.25"/>
        
        {/* Hand path */}
        <path d="M11 14.5L10 13.5L9.5 13H4.5L4 13.5L2.5 15H1V10H2.5L4 11.5L4.5 12H9.5L10 12.5L11 13.5V14.5Z" fill="currentColor" fillOpacity="0.25"/>
        <path d="M1 10.125V14.875M4 11.125L2.125 10.125M4 13.875L2.125 14.875" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_1073_10">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}