'use client';

import React from 'react';

interface LogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
  showPay?: boolean;
}

export const LogoEXE: React.FC<LogoProps> = ({ 
  size = 200, 
  animated = false, 
  className = '',
  showPay = true 
}) => {
  const height = size * 0.375; // 120/320 ratio for horizontal logo
  
  return (
    <div 
      className={`inline-block ${animated ? 'animate-float' : ''} ${className}`}
      style={{ width: showPay ? size : size * 0.5, height }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox={showPay ? "0 0 320 120" : "0 0 170 120"} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Blue Background (Light Protocol style) */}
        <rect width={showPay ? "320" : "170"} height="120" rx="12" fill="#0066FF"/>
        
        {/* Left "E" Bracket - PERFECTLY ALIGNED */}
        <g id="left-e">
          <rect x="30" y="25" width="12" height="70" fill="white" rx="3"/>
          <rect x="30" y="25" width="40" height="12" fill="white" rx="3"/>
          <rect x="30" y="54" width="33" height="12" fill="white" rx="3"/>
          <rect x="30" y="83" width="40" height="12" fill="white" rx="3"/>
        </g>
        
        {/* Center "X" - PERFECTLY CENTERED between E's */}
        <g id="center-x" transform="translate(85, 25)">
          <rect x="0" y="0" width="12" height="70" fill="white" rx="3" transform="rotate(45 6 35)"/>
          <rect x="0" y="0" width="12" height="70" fill="white" rx="3" transform="rotate(-45 6 35)"/>
        </g>
        
        {/* Right "E" Bracket (mirrored) - PERFECTLY ALIGNED */}
        <g id="right-e">
          <rect x="128" y="25" width="12" height="70" fill="white" rx="3"/>
          <rect x="100" y="25" width="40" height="12" fill="white" rx="3"/>
          <rect x="107" y="54" width="33" height="12" fill="white" rx="3"/>
          <rect x="100" y="83" width="40" height="12" fill="white" rx="3"/>
        </g>
        
        {/* "Pay" Text - ALIGNED with baseline of E's */}
        {showPay && (
          <text 
            x="175" 
            y="88" 
            fontFamily="Arial, sans-serif" 
            fontSize="36" 
            fontWeight="700" 
            fill="#1a1a1a"
          >
            Pay
          </text>
        )}
      </svg>
    </div>
  );
};

export const LogoSquare: React.FC<Omit<LogoProps, 'showPay'>> = ({ 
  size = 200, 
  animated = false, 
  className = '' 
}) => {
  return (
    <div 
      className={`inline-block ${animated ? 'animate-float' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="200" height="200" rx="20" fill="#0066FF"/>
        
        <g transform="translate(35, 65)">
          <g id="left-e">
            <rect x="0" y="0" width="10" height="70" fill="white" rx="3"/>
            <rect x="0" y="0" width="35" height="10" fill="white" rx="3"/>
            <rect x="0" y="30" width="28" height="10" fill="white" rx="3"/>
            <rect x="0" y="60" width="35" height="10" fill="white" rx="3"/>
          </g>
          
          <g id="center-x" transform="translate(50, 0)">
            <rect x="0" y="0" width="10" height="70" fill="white" rx="3" transform="rotate(45 5 35)"/>
            <rect x="0" y="0" width="10" height="70" fill="white" rx="3" transform="rotate(-45 5 35)"/>
          </g>
          
          <g id="right-e" transform="translate(95, 0)">
            <rect x="0" y="0" width="10" height="70" fill="white" rx="3"/>
            <rect x="-25" y="0" width="35" height="10" fill="white" rx="3"/>
            <rect x="-18" y="30" width="28" height="10" fill="white" rx="3"/>
            <rect x="-25" y="60" width="35" height="10" fill="white" rx="3"/>
          </g>
        </g>
      </svg>
    </div>
  );
};

export const LogoIcon: React.FC<Omit<LogoProps, 'showPay'>> = ({ 
  size = 32, 
  animated = false, 
  className = '' 
}) => {
  return (
    <div 
      className={`inline-block ${animated ? 'animate-float' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="4" fill="#0066FF"/>
        
        <g transform="translate(5, 8)">
          <rect x="0" y="0" width="2.5" height="16" fill="white" rx="1"/>
          <rect x="0" y="0" width="7" height="2.5" fill="white" rx="1"/>
          <rect x="0" y="6.75" width="6" height="2.5" fill="white" rx="1"/>
          <rect x="0" y="13.5" width="7" height="2.5" fill="white" rx="1"/>
          
          <g transform="translate(9.5, 0)">
            <rect x="0" y="0" width="2.5" height="16" fill="white" rx="1" transform="rotate(45 1.25 8)"/>
            <rect x="0" y="0" width="2.5" height="16" fill="white" rx="1" transform="rotate(-45 1.25 8)"/>
          </g>
          
          <g transform="translate(19.5, 0)">
            <rect x="0" y="0" width="2.5" height="16" fill="white" rx="1"/>
            <rect x="-4.5" y="0" width="7" height="2.5" fill="white" rx="1"/>
            <rect x="-3.5" y="6.75" width="6" height="2.5" fill="white" rx="1"/>
            <rect x="-4.5" y="13.5" width="7" height="2.5" fill="white" rx="1"/>
          </g>
        </g>
      </svg>
    </div>
  );
};

// Default export
export default LogoEXE;

