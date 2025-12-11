'use client';

import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
  variant?: 'transparent' | 'full';
  with3D?: boolean;
}

export function Logo({ size = 40, className = '', animated = false, variant = 'transparent', with3D = false }: LogoProps) {
  const logoSrc = variant === 'full' ? '/exepay-logo-full.png' : '/exepay-logo.png';
  
  return (
    <div 
      className={`relative ${className} ${animated ? 'hover:scale-105 transition-transform duration-300' : ''} ${with3D ? 'logo-3d' : ''}`} 
      style={{ 
        width: size, 
        height: size,
        ...(with3D && {
          filter: 'drop-shadow(0 4px 8px rgba(79, 70, 229, 0.3)) drop-shadow(0 8px 16px rgba(79, 70, 229, 0.2))',
          transform: 'perspective(1000px) rotateX(5deg)',
        })
      }}
    >
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

export function LogoText({ className = '', with3D = false }: { className?: string; with3D?: boolean }) {
  return (
    <div className={`flex items-center gap-0 ${className} group cursor-pointer`}>
      {/* Exe logo image with 3D effect */}
      <div 
        className="relative w-32 h-14 transition-all duration-500 group-hover:scale-110"
        style={with3D ? {
          filter: 'drop-shadow(0 4px 8px rgba(79, 70, 229, 0.4)) drop-shadow(0 8px 16px rgba(79, 70, 229, 0.2))',
          transform: 'perspective(1000px) rotateY(-5deg)',
        } : {}}
      >
        <Image
          src="/exepay-logo.png"
          alt="Exe"
          fill
          className="object-contain object-center"
          priority
          style={{ filter: 'brightness(0) saturate(100%) invert(32%) sepia(99%) saturate(2381%) hue-rotate(217deg) brightness(96%) contrast(101%)' }}
        />
      </div>
      {/* Pay text - solid blue to match Exe logo */}
      <span 
        className="text-[1.75rem] font-bold -ml-10 tracking-tight leading-[1.75rem] transition-all duration-500 group-hover:scale-110"
        style={{
          color: '#3B5BA5',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 800,
        }}
      >
        Pay
      </span>
    </div>
  );
}

export function LogoIcon({ size = 24, className = '', with3D = false }: { size?: number; className?: string; with3D?: boolean }) {
  return (
    <div 
      className={`relative ${className}`} 
      style={{ 
        width: size, 
        height: size,
        ...(with3D && {
          filter: 'drop-shadow(0 2px 4px rgba(79, 70, 229, 0.3)) drop-shadow(0 4px 8px rgba(79, 70, 229, 0.15))',
        })
      }}
    >
      <Image
        src="/exepay-logo.png"
        alt="ExePay Icon"
        fill
        className="object-contain"
      />
    </div>
  );
}

