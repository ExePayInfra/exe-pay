'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  label?: string;
  className?: string;
}

export function BackButton({ label = 'Back', className = '' }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all hover:gap-3 group ${className}`}
    >
      <svg 
        className="w-5 h-5 transition-transform group-hover:-translate-x-1" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span className="font-medium">{label}</span>
    </button>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  showBack?: boolean;
  breadcrumbs?: string[];
}

export function PageHeader({ title, description, showBack = true, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      {showBack && (
        <div className="mb-4">
          <BackButton />
        </div>
      )}
      
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          {breadcrumbs.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              <span className={i === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}>
                {item}
              </span>
            </div>
          ))}
        </nav>
      )}
      
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      {description && (
        <p className="text-sm sm:text-base text-gray-600">{description}</p>
      )}
    </div>
  );
}

