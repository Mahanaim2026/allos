import React from 'react';

interface AllosLogoProps {
  size?: number;
  variant?: 'light' | 'dark' | 'mono';
  showWordmark?: boolean;
  className?: string;
}

export default function AllosLogo({ size = 40, variant = 'light', showWordmark = false, className = '' }: AllosLogoProps) {
  const body = variant === 'dark' ? '#F0F5FA' : '#0F2B45';
  const gold = variant === 'dark' ? '#D4A44C' : '#B8832A';
  const pages = variant === 'dark' ? 'rgba(240,245,250,0.18)' : 'rgba(15,43,69,0.10)';

  const mark = (
    <svg viewBox="0 0 120 120" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Allos — Bible and Cross">
      {/* Bible body */}
      <rect x="22" y="32" width="62" height="72" rx="5" fill={body} opacity="0.12"/>
      <rect x="22" y="32" width="62" height="72" rx="5" stroke={body} strokeWidth="3.5"/>
      {/* Bible spine */}
      <rect x="22" y="32" width="9" height="72" rx="4" fill={body} opacity="0.25"/>
      {/* Bible pages */}
      <rect x="32" y="32" width="52" height="72" rx="3" fill={pages}/>
      {/* Page lines */}
      <line x1="38" y1="60" x2="78" y2="60" stroke={body} strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
      <line x1="38" y1="70" x2="70" y2="70" stroke={body} strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
      <line x1="38" y1="80" x2="74" y2="80" stroke={body} strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
      {/* Cross vertical */}
      <rect x="53" y="16" width="14" height="56" rx="3" fill={gold}/>
      {/* Cross horizontal */}
      <rect x="40" y="30" width="40" height="13" rx="3" fill={gold}/>
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
        color: variant === 'dark' ? '#F0F5FA' : '#0F2B45',
        letterSpacing: '-0.01em',
        lineHeight: 1
      }}>
        Allos
      </span>
    </span>
  );
}
