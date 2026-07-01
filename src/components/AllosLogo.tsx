import React from 'react';

interface AllosLogoProps {
    size?: number;
    variant?: 'light' | 'dark' | 'baby-blue' | 'outline';
    showWordmark?: boolean;
    className?: string;
}

/**
 * Allos compass mark — "One mark, four meanings"
 * The letter A / North arrow / Compass / Season marker
 * Flat, no shadows, no gradients. Four variants:
 *   light      — navy mark on white/transparent (default)
 *   dark       — white mark on transparent (use on navy bg)
 *   baby-blue  — navy mark on baby-blue bg circle
 *   outline    — stroke-only navy ring, no inner mark (monochrome / embossed use)
 */
export default function AllosLogo({
    size = 40,
    variant = 'light',
    showWordmark = false,
    className = '',
}: AllosLogoProps) {
    // Colour system — brand guide: navy #0A2342, baby blue #A8C5E0, white #FFFFFF
  const navy = '#0A2342';
    const baby = '#A8C5E0';
    const white = '#FFFFFF';

  const mark = variant === 'dark' ? white : navy; // the compass ink
  const bg = variant === 'baby-blue' ? baby : 'none'; // circle fill

  // Stroke width scaled to viewBox (100×100)
  const sw = 3.2; // outer ring & ticks
  const aw = 3.8; // A strokes (slightly bolder for legibility)

  // Compass geometry — all in 100×100 space, centre = (50,50)
  const R = 42; // ring radius

  // 8 tick marks: from inner to outer radius
  // Cardinal (N/S/E/W) ticks: longer
  const tickInC = 35.5; // inner end of cardinal tick
  const tickOutC = 42;  // outer end (touches ring)
  // Diagonal ticks: shorter
  const tickInD = 38;
    // Note: diagonal ticks share the same outer radius as cardinal ticks (tickOutC)

  // Helper: point on circle at angle (degrees, 0=top/north)
  const pt = (r: number, deg: number) => {
        const rad = (deg - 90) * Math.PI / 180;
        return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
  };

  // Build 8 tick lines
  const ticks = [0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
        const isCard = deg % 90 === 0;
        const inner = isCard ? tickInC : tickInD;
        const a = pt(inner, deg);
        const b = pt(tickOutC, deg);
        return <line key={deg} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={mark} strokeWidth={sw} strokeLinecap="round" />;
  });

  // "A" letterform — peak at north (top), feet at bottom-left and bottom-right
  const Apeak  = { x: 50,   y: 14.5 };
    const Aleft  = { x: 33.5, y: 55 };
    const Aright = { x: 66.5, y: 55 };
    const Xbar_l = { x: 39.5, y: 43 };
    const Xbar_r = { x: 60.5, y: 43 };

  // outline variant — ring only, no ticks or A mark
  const mark_svg = (
        <svg
                viewBox="0 0 100 100"
                width={size}
                height={size}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Allos compass mark"
                style={{ display: 'block', flexShrink: 0 }}
              >
          {/* Background circle (baby-blue variant only) */}
          {bg !== 'none' && <circle cx="50" cy="50" r="50" fill={bg} />}
        
          {/* Outer compass ring */}
              <circle cx="50" cy="50" r={R} stroke={mark} strokeWidth={sw} />
        
          {/* Inner mark — hidden for outline variant */}
          {variant !== 'outline' && (
                        <>
                          {/* 8 tick marks */}
                          {ticks}
                        
                          {/* "A" — left leg */}
                                  <line x1={Apeak.x} y1={Apeak.y} x2={Aleft.x} y2={Aleft.y} stroke={mark} strokeWidth={aw} strokeLinecap="round" />
                          {/* "A" — right leg */}
                                  <line x1={Apeak.x} y1={Apeak.y} x2={Aright.x} y2={Aright.y} stroke={mark} strokeWidth={aw} strokeLinecap="round" />
                          {/* "A" — crossbar */}
                                  <line x1={Xbar_l.x} y1={Xbar_l.y} x2={Xbar_r.x} y2={Xbar_r.y} stroke={mark} strokeWidth={aw} strokeLinecap="round" />
                        </>>
                      )}
        </svg>svg>
      );
  
    if (!showWordmark) return <span className={className} style={{ display: 'inline-flex', alignItems: 'center' }}>{mark_svg}</span>span>;
  
    return (
          <span
                  className={"flex items-center " + className}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.28) }}
                >
            {mark_svg}
                <span style={{
                          fontFamily: "'Spectral', Georgia, serif",
                          fontSize: Math.round(size * 0.58),
                          fontWeight: 400,
                          color: variant === 'dark' ? white : navy,
                          letterSpacing: '-0.01em',
                          lineHeight: 1,
                          userSelect: 'none',
                }}>
                        Allos
                </span>span>
          </span>span>
        );
}</></svg>
