import React from 'react';

interface AllosLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'wordmark';
  className?: string;
}

const sizes = {
  sm: { iconSize: 28, fontSize: 14, tagSize: 7, gap: 8 },
  md: { iconSize: 40, fontSize: 20, tagSize: 9, gap: 10 },
  lg: { iconSize: 52, fontSize: 26, tagSize: 11, gap: 12 },
  xl: { iconSize: 72, fontSize: 36, tagSize: 14, gap: 16 },
};

export default function AllosLogo({ size = 'md', variant = 'full', className = '' }: AllosLogoProps) {
  const { iconSize, fontSize, tagSize, gap } = sizes[size];

  const icon = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Deep navy circle background */}
      <circle cx="22" cy="22" r="22" fill="#1C3154" />
      {/* Vertical beam of cross */}
      <rect x="20" y="9" width="4" height="26" rx="2" fill="#C9A84C" />
      {/* Horizontal beam of cross */}
      <rect x="11" y="19" width="22" height="4" rx="2" fill="#C9A84C" />
      {/* Olive leaf - top right of cross, rotated */}
      <ellipse
        cx="30"
        cy="13"
        rx="4.5"
        ry="2"
        fill="#6B7E4A"
        transform="rotate(-45 30 13)"
      />
      {/* Subtle glow ring */}
      <circle cx="22" cy="22" r="21" stroke="#C9A84C" strokeWidth="0.5" strokeOpacity="0.3" />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={className}>{icon}</div>;
  }

  if (variant === 'wordmark') {
    return (
      <div className={`flex flex-col ${className}`}>
        <span
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: `${fontSize}px`,
            fontWeight: 600,
            color: '#1C3154',
            letterSpacing: '0.2em',
            lineHeight: 1,
          }}
        >
          ALLOS
        </span>
        <span
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: `${tagSize}px`,
            color: '#6B7E4A',
            letterSpacing: '0.15em',
            lineHeight: 1.2,
            marginTop: 3,
          }}
        >
          SCRIPTURE FOR THE SEASON
        </span>
      </div>
    );
  }

  // Full logo: icon + wordmark side by side
  return (
    <div
      className={`flex items-center ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {icon}
      <div className="flex flex-col">
        <span
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: `${fontSize}px`,
            fontWeight: 600,
            color: '#1C3154',
            letterSpacing: '0.2em',
            lineHeight: 1,
          }}
        >
          ALLOS
        </span>
        <span
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: `${tagSize}px`,
            color: '#6B7E4A',
            letterSpacing: '0.15em',
            lineHeight: 1.2,
            marginTop: 3,
          }}
        >
          SCRIPTURE FOR THE SEASON
        </span>
      </div>
    </div>
  );
}