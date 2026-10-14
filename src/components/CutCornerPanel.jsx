import { useEffect, useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'

// Diagonally-cut "HUD panel" shape (corners sliced at 45°). Needs the box's actual
// pixel size (via ResizeObserver) rather than a percentage-based cut or a stretched
// SVG viewBox — either of those skews the cut into something other than 45° on a
// non-square card. Fill and border are also kept as independent layers: the fill
// has nothing opaque behind it (so its alpha genuinely blends with the real page),
// and the border is a crisp SVG stroke painted on top, sized to the same measured
// box so it lines up with the fill's clip-path exactly.
export default function CutCornerPanel({ borderColor, bg, children, strokeWidth = 3, cut = 16, ...props }) {
  const ref = useRef(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  // `_hover={{ transform: ... }}` / `_hover={{ translateY: ... }}` silently produce
  // no working hover rule for this element in this Chakra v3 setup (verified: color
  // and boxShadow hover styles work fine elsewhere, only transform doesn't) — so the
  // lift is driven by plain hover state instead, same pattern as ProjectIcon's.
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect
      if (box) setSize({ w: box.width, h: box.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const c = Math.max(0, Math.min(cut, size.w / 2, size.h / 2))
  const ready = size.w > 0 && size.h > 0

  const octagonPoints = ready
    ? [
        [c, 0],
        [size.w - c, 0],
        [size.w, c],
        [size.w, size.h - c],
        [size.w - c, size.h],
        [c, size.h],
        [0, size.h - c],
        [0, c],
      ]
        .map(([x, y]) => `${x},${y}`)
        .join(' ')
    : ''

  return (
    <Box
      ref={ref}
      position="relative"
      h="100%"
      w="100%"
      transition="transform 0.2s ease"
      transform={hovered ? 'translateY(-4px)' : 'none'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {ready && (
        <>
          <Box
            position="absolute"
            inset={0}
            bg={bg}
            style={{
              clipPath: `polygon(${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px), 0 ${c}px)`,
            }}
          />
          <svg
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          >
            <polygon points={octagonPoints} fill="none" stroke={borderColor} strokeWidth={strokeWidth} />
          </svg>
        </>
      )}
      <Box position="relative" h="100%" p={4}>
        {children}
      </Box>
    </Box>
  )
}
