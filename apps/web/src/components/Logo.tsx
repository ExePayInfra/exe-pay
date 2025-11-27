'use client';

import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
  variant?: 'transparent' | 'full';
}

export function Logo({ size = 40, className = '', animated = false, variant = 'transparent' }: LogoProps) {
  const logoSrc = variant === 'full' ? '/exepay-logo-full.png' : '/exepay-logo.png';
  
  return (
    <div className={`relative ${className} ${animated ? 'hover:scale-105 transition-transform duration-300' : ''}`} style={{ width: size, height: size }}>
      <Image
        src={logoSrc}
        alt="ExePay Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}

export function LogoText({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-0 ${className} group cursor-pointer`}>
      {/* Exe logo image */}
      <div className="relative w-32 h-14 transition-all duration-500 group-hover:scale-110">
        <Image
          src="/exepay-logo.png"
          alt="Exe"
          fill
          className="object-contain object-center"
          priority
          style={{ filter: 'brightness(0) saturate(100%) invert(32%) sepia(99%) saturate(2381%) hue-rotate(217deg) brightness(96%) contrast(101%)' }}
        />
      </div>
      {/* Pay text - same size as logo, black, closer */}
      <span className="text-[1.75rem] font-bold text-black -ml-6 tracking-tight leading-[1.75rem] transition-all duration-500 group-hover:scale-110" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        Pay
      </span>
    </div>
  );
}

export function LogoIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src="/exepay-logo.png"
        alt="ExePay Icon"
        fill
        className="object-contain"
      />
    </div>
  );
}

