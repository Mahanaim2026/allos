import React from 'react';

interface AllosLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'wordmark';
  light?: boolean; // true = white version for dark backgrounds
  className?: string;
}

const cfg = {
  xs: { icon: 20, word: 13, tag: 0,  gap: 7  },
  sm: { icon: 28, word: 16, tag: 0,  gap: 9  },
  md: { icon: 36, word: 20, tag: 8,  gap: 11 },
  lg: { icon: 48, word: 26, tag: 9,  gap: 14 },
  xl: { icon: 64, word: 34, tag: 10, gap: 18 },
};

// The mark: a single upward breath-flame path — minimal, poignant, original
// Represents the Paraclete (breath / spirit / advocate)
function AllosMark({ px, light }: { px: number; light: boolean }) {
  const navy   = light ? '#FFFFFF' : '#1A2E4A';
  const blue   = light ? 'rgba(255,255,255,0.7)' : '#2E6DA4';
  const accent = light ? 'rgba(255,255,255,0.45)' : '#5B9FD4';
  const r = px / 2;

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Clean circle background */}
      <circle cx="32" cy="32" r="32" fill={navy} />

      {/* Breath-flame glyph — three ascending curves, like breath rising */}
      {/* Left arc */}
      <path
        d="M22 46 C22 38 18 30 24 22"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Centre arc — tallest, brightest */}
      <path
        d="M32 48 C32 36 26 26 32 16"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right arc */}
      <path
        d="M42 46 C42 38 46 30 40 22"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Base line — grounding */}
      <line x1="20" y1="50" x2="44" y2="50" stroke={blue} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function AllosLogo({
  size = 'md',
  variant = 'full',
  light = false,
  className = '',
}: AllosLogoProps) {
  const { icon, word, tag, gap } = cfg[size];
  const textColor   = light ? '#FFFFFF' : '#1A2E4A';
  const tagColor    = light ? 'rgba(255,255,255,0.6)' : '#2E6DA4';

  if (variant === 'icon') {
    return (
      <span className={className}>
        <AllosMark px={icon} light={light} />
      </span>
    );
  }

  if (variant === 'wordmark') {
    return (
      <span className={`flex flex-col ${className}`}>
        <span style={{
          fontFamily: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
          fontSize: word,
          fontWeight: 500,
          color: textColor,
          letterSpacing: '0.28em',
          lineHeight: 1,
        }}>
          ALLOS
        </span>
        {tag > 0 && (
          <span style={{
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            fontSize: tag,
            color: tagColor,
            letterSpacing: '0.18em',
            lineHeight: 1,
            marginTop: 4,
            textTransform: 'uppercase' as const,
          }}>
            Scripture for the Season
          </span>
        )}
      </span>
    );
  }

  // Full: mark + wordmark side by side
  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap }}>
      <AllosMark px={icon} light={light} />
      <span className="flex flex-col">
        <span style={{
          fontFamily: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
          fontSize: word,
          fontWeight: 500,
          color: textColor,
          letterSpacing: '0.28em',
          lineHeight: 1,
        }}>
          ALLOS
        </span>
        {tag > 0 && (
          <span style={{
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            fontSize: tag,
            color: tagColor,
            letterSpacing: '0.18em',
            lineHeight: 1,
            marginTop: 4,
          }}>
            Scripture for the Season
          </span>
        )}
      </span>
    </span>
  );
}
