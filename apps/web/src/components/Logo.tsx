'use client';

interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function Logo({ size = 40, className = '', animated = false }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animated ? 'animate-float' : ''}`}
    >
      {/* Outer glow circle */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#glow)"
        opacity="0.3"
        className={animated ? 'animate-pulse' : ''}
      />
      
      {/* Main circle */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="url(#gradient)"
        stroke="url(#borderGradient)"
        strokeWidth="2"
      />
      
      {/* Stylized "E" for ExePay */}
      <path
        d="M 35 35 L 65 35 M 35 50 L 60 50 M 35 65 L 65 65 M 35 35 L 35 65"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Privacy shield accent */}
      <path
        d="M 50 25 L 58 30 L 58 42 C 58 48 54 52 50 54 C 46 52 42 48 42 42 L 42 30 Z"
        fill="rgba(255, 255, 255, 0.2)"
        stroke="white"
        strokeWidth="1.5"
      />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
        
        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
        
        <radialGradient id="glow">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function LogoText({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo size={40} animated />
      <span className="text-2xl font-bold text-white tracking-tight">
        Exe<span className="text-gradient-brand">Pay</span>
      </span>
    </div>
  );
}

export function LogoIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="40" fill="url(#iconGradient)" />
      <path
        d="M 35 35 L 65 35 M 35 50 L 60 50 M 35 65 L 65 65 M 35 35 L 35 65"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
    </svg>
  );
}

