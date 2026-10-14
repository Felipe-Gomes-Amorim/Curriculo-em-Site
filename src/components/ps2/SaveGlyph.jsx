import { useId } from 'react'

// Flat-but-shaded 2D stand-ins for the PS2's 3D save icons (3D comes later).
// Gradient ids go through useId because the same glyph renders twice at once
// (grid tile + enlarged detail view) and SVG ids are document-global.
export default function SaveGlyph({ glyph, size = 72 }) {
  const uid = useId().replace(/:/g, '')
  const g = (name) => `${name}-${uid}`

  const shapes = {
    code: (
      <>
        <defs>
          <linearGradient id={g('a')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffd27a" />
            <stop offset="1" stopColor="#d9771f" />
          </linearGradient>
        </defs>
        <path
          d="M24 12 C16 12 18 24 12 32 C18 40 16 52 24 52 M40 12 C48 12 46 24 52 32 C46 40 48 52 40 52"
          fill="none"
          stroke={`url(#${g('a')})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="32" r="3.5" fill="#fff3d6" />
      </>
    ),
    browser: (
      <>
        <defs>
          <linearGradient id={g('a')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8fd3ff" />
            <stop offset="1" stopColor="#2a6fd6" />
          </linearGradient>
        </defs>
        <rect x="8" y="12" width="48" height="40" rx="5" fill={`url(#${g('a')})`} />
        <rect x="8" y="12" width="48" height="9" rx="4" fill="#1d4f9e" />
        <circle cx="14" cy="16.5" r="1.8" fill="#ff8a8a" />
        <circle cx="20" cy="16.5" r="1.8" fill="#ffd27a" />
        <circle cx="26" cy="16.5" r="1.8" fill="#9ef0b0" />
        <rect x="13" y="26" width="16" height="20" rx="2" fill="#e8f6ff" opacity="0.9" />
        <rect x="33" y="26" width="18" height="5" rx="2" fill="#e8f6ff" opacity="0.85" />
        <rect x="33" y="34" width="18" height="5" rx="2" fill="#e8f6ff" opacity="0.6" />
        <rect x="33" y="42" width="12" height="4" rx="2" fill="#e8f6ff" opacity="0.45" />
      </>
    ),
    database: (
      <>
        <defs>
          <linearGradient id={g('a')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6e5bd6" />
            <stop offset="0.5" stopColor="#b3a6ff" />
            <stop offset="1" stopColor="#5a48c2" />
          </linearGradient>
        </defs>
        <path d="M14 16 V48 C14 53 50 53 50 48 V16" fill={`url(#${g('a')})`} />
        <path d="M14 27 C14 32 50 32 50 27 M14 38 C14 43 50 43 50 38" fill="none" stroke="#3d2f99" strokeWidth="2" />
        <ellipse cx="32" cy="16" rx="18" ry="5.5" fill="#d9d2ff" />
      </>
    ),
    neural: (
      <>
        <defs>
          <radialGradient id={g('a')} cx="0.35" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#ffd1ec" />
            <stop offset="1" stopColor="#d1468f" />
          </radialGradient>
        </defs>
        <g fill="none" stroke="#f0a5cf" strokeWidth="2" opacity="0.85">
          <path d="M14 18 L32 32 L14 46 M14 18 L32 14 L50 32 M14 46 L32 50 L50 32 M32 14 L32 50 M32 32 L50 32" />
        </g>
        {[
          [14, 18],
          [14, 46],
          [32, 14],
          [32, 32],
          [32, 50],
          [50, 32],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5.5" fill={`url(#${g('a')})`} />
        ))}
      </>
    ),
    wrench: (
      <>
        <defs>
          <linearGradient id={g('a')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff1b0" />
            <stop offset="0.5" stopColor="#d4a72c" />
            <stop offset="1" stopColor="#8a6514" />
          </linearGradient>
        </defs>
        <path
          d="M44 8 a12 12 0 0 0 -11 16 L10 47 a4.5 4.5 0 0 0 0 6.4 l1.6 1.6 a4.5 4.5 0 0 0 6.4 0 L41 32 a12 12 0 0 0 16 -11 l-7 7 l-7 -2 l-2 -7 Z"
          fill={`url(#${g('a')})`}
          stroke="#6b4d0e"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </>
    ),
    speech: (
      <>
        <defs>
          <linearGradient id={g('a')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9ff3f0" />
            <stop offset="1" stopColor="#1f9fb0" />
          </linearGradient>
          <linearGradient id={g('b')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#c9d3dd" />
          </linearGradient>
        </defs>
        <path d="M8 14 h30 a5 5 0 0 1 5 5 v14 a5 5 0 0 1 -5 5 h-18 l-8 7 v-7 h-4 a5 5 0 0 1 -5 -5 v-14 a5 5 0 0 1 5 -5 Z" fill={`url(#${g('a')})`} />
        <path d="M30 28 h24 a5 5 0 0 1 5 5 v12 a5 5 0 0 1 -5 5 h-3 v6 l-7 -6 h-14 a5 5 0 0 1 -5 -5 v-12 a5 5 0 0 1 5 -5 Z" fill={`url(#${g('b')})`} />
        <path d="M14 24 h20 M14 29 h14" stroke="#0e5d68" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M36 37 h17 M36 42 h11" stroke="#5b6b7a" strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      style={{ display: 'block', filter: 'drop-shadow(0 6px 6px rgba(0, 0, 0, 0.45))' }}
    >
      {shapes[glyph]}
    </svg>
  )
}
