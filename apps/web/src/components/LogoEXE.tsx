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
  const height = size * 0.3; // 120/400 ratio for horizontal logo
  
  return (
    <div 
      className={`inline-block ${animated ? 'animate-float' : ''} ${className}`}
      style={{ width: showPay ? size : size * 0.5, height }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox={showPay ? "0 0 400 120" : "0 0 200 120"} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Blue Background (Light Protocol style) */}
        <rect width={showPay ? "400" : "200"} height="120" rx="12" fill="#0066FF"/>
        
        {/* Left "E" Bracket */}
        <g id="left-e">
          <rect x="40" y="25" width="8" height="70" fill="white" rx="2"/>
          <rect x="40" y="25" width="35" height="8" fill="white" rx="2"/>
          <rect x="40" y="56" width="28" height="8" fill="white" rx="2"/>
          <rect x="40" y="87" width="35" height="8" fill="white" rx="2"/>
        </g>
        
        {/* Center "X" */}
        <g id="center-x">
          <rect x="105" y="35" width="8" height="50" fill="white" rx="2" transform="rotate(45 109 60)"/>
          <rect x="105" y="35" width="8" height="50" fill="white" rx="2" transform="rotate(-45 109 60)"/>
        </g>
        
        {/* Right "E" Bracket (mirrored) */}
        <g id="right-e">
          <rect x="152" y="25" width="8" height="70" fill="white" rx="2"/>
          <rect x="125" y="25" width="35" height="8" fill="white" rx="2"/>
          <rect x="132" y="56" width="28" height="8" fill="white" rx="2"/>
          <rect x="125" y="87" width="35" height="8" fill="white" rx="2"/>
        </g>
        
        {/* "Pay" Text */}
        {showPay && (
          <text 
            x="220" 
            y="72" 
            fontFamily="Arial, sans-serif" 
            fontSize="48" 
            fontWeight="600" 
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
        
        <g transform="translate(30, 65)">
          <g id="left-e">
            <rect x="0" y="0" width="6" height="70" fill="white" rx="2"/>
            <rect x="0" y="0" width="30" height="6" fill="white" rx="2"/>
            <rect x="0" y="32" width="24" height="6" fill="white" rx="2"/>
            <rect x="0" y="64" width="30" height="6" fill="white" rx="2"/>
          </g>
          
          <g id="center-x" transform="translate(45, 5)">
            <rect x="0" y="0" width="6" height="60" fill="white" rx="2" transform="rotate(45 3 30)"/>
            <rect x="0" y="0" width="6" height="60" fill="white" rx="2" transform="rotate(-45 3 30)"/>
          </g>
          
          <g id="right-e" transform="translate(94, 0)">
            <rect x="0" y="0" width="6" height="70" fill="white" rx="2"/>
            <rect x="-24" y="0" width="30" height="6" fill="white" rx="2"/>
            <rect x="-18" y="32" width="24" height="6" fill="white" rx="2"/>
            <rect x="-24" y="64" width="30" height="6" fill="white" rx="2"/>
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
        
        <g transform="translate(4, 8)">
          <rect x="0" y="0" width="2" height="16" fill="white"/>
          <rect x="0" y="0" width="6" height="2" fill="white"/>
          <rect x="0" y="7" width="5" height="2" fill="white"/>
          <rect x="0" y="14" width="6" height="2" fill="white"/>
          
          <g transform="translate(9, 0)">
            <rect x="0" y="0" width="2" height="16" fill="white" transform="rotate(45 1 8)"/>
            <rect x="0" y="0" width="2" height="16" fill="white" transform="rotate(-45 1 8)"/>
          </g>
          
          <g transform="translate(18, 0)">
            <rect x="0" y="0" width="2" height="16" fill="white"/>
            <rect x="-4" y="0" width="6" height="2" fill="white"/>
            <rect x="-3" y="7" width="5" height="2" fill="white"/>
            <rect x="-4" y="14" width="6" height="2" fill="white"/>
          </g>
        </g>
      </svg>
    </div>
  );
};

// Default export
export default LogoEXE;

