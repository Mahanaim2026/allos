import React from 'react';

interface AllosLogoProps {
  size?: number;
  variant?: 'light' | 'dark' | 'baby-blue' | 'outline';
  showWordmark?: boolean;
  className?: string;
}

/**
 * Allos compass mark - "One mark, four meanings"
 * Flat, no shadows, no gradients. Four variants:
 *   light     - navy on white/transparent (default)
 *   dark      - white on transparent (use on navy bg)
 *   baby-blue - navy on baby-blue bg circle
 *   outline   - ring only, no inner mark
 */
export default function AllosLogo({
  size = 40,
  variant = 'light',
  showWordmark = false,
  className = '',
}: AllosLogoProps) {
  const navy = '#0A2342';
  const baby = '#A8C5E0';
  const white = '#FFFFFF';

  const mark = variant === 'dark' ? white : navy;
  const bg = variant === 'baby-blue' ? baby : 'none';
  const sw = 3.2;
  const aw = 3.8;
  const R = 42;
  const tickInC = 35.5;
  const tickOutC = 42;
  const tickInD = 38;

  const pt = (r: number, deg: number) => {
    const rad = (deg - 90) * Math.PI / 180;
    return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
  };

  const ticks = [0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
    const isCard = deg % 90 === 0;
    const inner = isCard ? tickInC : tickInD;
    const a = pt(inner, deg);
    const b = pt(tickOutC, deg);
    return React.createElement('line', {
      key: deg, x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      stroke: mark, strokeWidth: sw, strokeLinecap: 'round',
    });
  });

  const Apeak  = { x: 50,   y: 14.5 };
  const Aleft  = { x: 33.5, y: 55 };
  const Aright = { x: 66.5, y: 55 };
  const Xbar_l = { x: 39.5, y: 43 };
  const Xbar_r = { x: 60.5, y: 43 };

  const innerMark = variant !== 'outline'
    ? React.createElement(React.Fragment, null,
        ...ticks,
        React.createElement('line', { x1: Apeak.x, y1: Apeak.y, x2: Aleft.x,  y2: Aleft.y,  stroke: mark, strokeWidth: aw, strokeLinecap: 'round' }),
        React.createElement('line', { x1: Apeak.x, y1: Apeak.y, x2: Aright.x, y2: Aright.y, stroke: mark, strokeWidth: aw, strokeLinecap: 'round' }),
        React.createElement('line', { x1: Xbar_l.x, y1: Xbar_l.y, x2: Xbar_r.x, y2: Xbar_r.y, stroke: mark, strokeWidth: aw, strokeLinecap: 'round' })
      )
    : null;

  const markSvg = React.createElement('svg', {
    viewBox: '0 0 100 100', width: size, height: size,
    fill: 'none', xmlns: 'http://www.w3.org/2000/svg',
    'aria-label': 'Allos compass mark',
    style: { display: 'block', flexShrink: 0 },
  },
    bg !== 'none' ? React.createElement('circle', { cx: '50', cy: '50', r: '50', fill: bg }) : null,
    React.createElement('circle', { cx: '50', cy: '50', r: R, stroke: mark, strokeWidth: sw }),
    innerMark
  );

  if (!showWordmark) {
    return React.createElement('span', { className, style: { display: 'inline-flex', alignItems: 'center' } }, markSvg);
  }

  return React.createElement('span', {
    className: 'flex items-center ' + className,
    style: { display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.28) },
  },
    markSvg,
    React.createElement('span', {
      style: {
        fontFamily: "'Spectral', Georgia, serif",
        fontSize: Math.round(size * 0.58),
        fontWeight: 400,
        color: variant === 'dark' ? white : navy,
        letterSpacing: '-0.01em',
        lineHeight: 1,
        userSelect: 'none' as const,
      },
    }, 'Allos')
  );
}
