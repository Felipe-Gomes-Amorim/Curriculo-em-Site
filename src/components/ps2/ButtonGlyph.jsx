// Outlined face-button symbols, drawn the way the PS2 BIOS draws its button hints
// (thin strokes, no filled discs). Colors sampled from real BIOS screenshots.
const SHAPES = {
  cross: { color: '#8E94C9', d: <path d="M5 5 L15 15 M15 5 L5 15" /> },
  circle: { color: '#D25770', d: <circle cx="10" cy="10" r="6" /> },
  triangle: { color: '#32AA75', d: <path d="M10 3.5 L16.5 15.5 L3.5 15.5 Z" /> },
}

export default function ButtonGlyph({ shape, size = 18 }) {
  const { color, d } = SHAPES[shape]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, filter: `drop-shadow(0 0 3px ${color}66)` }}
    >
      {d}
    </svg>
  )
}
