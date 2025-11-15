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
  const height = size * 0.43; // 120/280 ratio for horizontal logo
  
  return (
    <div 
      className={`inline-block ${animated ? 'animate-float' : ''} ${className}`}
      style={{ width: showPay ? size : size * 0.65, height }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox={showPay ? "0 0 280 120" : "0 0 180 120"} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Blue Background (Light Protocol style) */}
        <rect width={showPay ? "280" : "180"} height="120" rx="12" fill="#0066FF"/>
        
        {/* Left "E" Bracket - BOLDER & THICKER */}
        <g id="left-e">
          <rect x="30" y="20" width="14" height="80" fill="white" rx="3"/>
          <rect x="30" y="20" width="45" height="14" fill="white" rx="3"/>
          <rect x="30" y="53" width="38" height="14" fill="white" rx="3"/>
          <rect x="30" y="86" width="45" height="14" fill="white" rx="3"/>
        </g>
        
        {/* Center "X" - LARGER & CONNECTS THE E's */}
        <g id="center-x">
          <rect x="80" y="20" width="14" height="80" fill="white" rx="3" transform="rotate(45 87 60)"/>
          <rect x="80" y="20" width="14" height="80" fill="white" rx="3" transform="rotate(-45 87 60)"/>
        </g>
        
        {/* Right "E" Bracket (mirrored) - BOLDER & THICKER */}
        <g id="right-e">
          <rect x="136" y="20" width="14" height="80" fill="white" rx="3"/>
          <rect x="105" y="20" width="45" height="14" fill="white" rx="3"/>
          <rect x="112" y="53" width="38" height="14" fill="white" rx="3"/>
          <rect x="105" y="86" width="45" height="14" fill="white" rx="3"/>
        </g>
        
        {/* "Pay" Text - MOVED DOWN & CLOSER */}
        {showPay && (
          <text 
            x="165" 
            y="95" 
            fontFamily="Arial, sans-serif" 
            fontSize="32" 
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
        
        <g transform="translate(25, 60)">
          <g id="left-e">
            <rect x="0" y="0" width="12" height="80" fill="white" rx="3"/>
            <rect x="0" y="0" width="42" height="12" fill="white" rx="3"/>
            <rect x="0" y="34" width="35" height="12" fill="white" rx="3"/>
            <rect x="0" y="68" width="42" height="12" fill="white" rx="3"/>
          </g>
          
          <g id="center-x" transform="translate(50, 0)">
            <rect x="0" y="0" width="12" height="80" fill="white" rx="3" transform="rotate(45 6 40)"/>
            <rect x="0" y="0" width="12" height="80" fill="white" rx="3" transform="rotate(-45 6 40)"/>
          </g>
          
          <g id="right-e" transform="translate(108, 0)">
            <rect x="0" y="0" width="12" height="80" fill="white" rx="3"/>
            <rect x="-30" y="0" width="42" height="12" fill="white" rx="3"/>
            <rect x="-23" y="34" width="35" height="12" fill="white" rx="3"/>
            <rect x="-30" y="68" width="42" height="12" fill="white" rx="3"/>
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
        
        <g transform="translate(3, 6)">
          <rect x="0" y="0" width="3" height="20" fill="white" rx="1"/>
          <rect x="0" y="0" width="8" height="3" fill="white" rx="1"/>
          <rect x="0" y="8.5" width="7" height="3" fill="white" rx="1"/>
          <rect x="0" y="17" width="8" height="3" fill="white" rx="1"/>
          
          <g transform="translate(10, 0)">
            <rect x="0" y="0" width="3" height="20" fill="white" rx="1" transform="rotate(45 1.5 10)"/>
            <rect x="0" y="0" width="3" height="20" fill="white" rx="1" transform="rotate(-45 1.5 10)"/>
          </g>
          
          <g transform="translate(23, 0)">
            <rect x="0" y="0" width="3" height="20" fill="white" rx="1"/>
            <rect x="-5" y="0" width="8" height="3" fill="white" rx="1"/>
            <rect x="-4" y="8.5" width="7" height="3" fill="white" rx="1"/>
            <rect x="-5" y="17" width="8" height="3" fill="white" rx="1"/>
          </g>
        </g>
      </svg>
    </div>
  );
};

// Default export
export default LogoEXE;

