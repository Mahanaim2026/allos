import React from 'react';

interface AllosLogoProps {
  size?: number;
  variant?: 'light' | 'dark' | 'mono';
  showWordmark?: boolean;
  className?: string;
}

export default function AllosLogo({ size = 40, variant = 'light', showWordmark = false, className = '' }: AllosLogoProps) {
  const ring = variant === 'dark' ? '#F6F9FB' : '#1B3A57';
  const gold = '#C8943F';

  const mark = (
    <svg viewBox="0 0 120 120" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Allos Hour of Hope mark">
      <circle cx="60" cy="60" r="40" stroke={ring} strokeWidth="3"/>
      <path d="M60 22 L60 32" stroke={ring} strokeWidth="4" strokeLinecap="round"/>
      <path d="M60 88 L60 98" stroke={ring} strokeWidth="4" strokeLinecap="round"/>
      <path d="M22 60 L32 60" stroke={ring} strokeWidth="4" strokeLinecap="round"/>
      <path d="M88 60 L98 60" stroke={ring} strokeWidth="4" strokeLinecap="round"/>
      <path d="M60 60 L44 38" stroke={gold} strokeWidth="5" strokeLinecap="round"/>
      <path d="M60 60 L76 38" stroke={gold} strokeWidth="5" strokeLinecap="round"/>
      <circle cx="60" cy="60" r="5" fill={gold}/>
    </svg>
  );

  if (!showWordmark) return <span className={className}>{mark}</span>;

  return (
    <span className={"flex items-center gap-2 " + className}>
      {mark}
      <span style={{
        fontFamily: "'Spectral', Georgia, serif",
        fontSize: size * 0.6,
        fontWeight: 400,
        color: variant === 'dark' ? '#F6F9FB' : '#1B3A57',
        letterSpacing: '-0.01em',
        lineHeight: 1
      }}>
        Allos
      </span>
    </span>
  );
}
