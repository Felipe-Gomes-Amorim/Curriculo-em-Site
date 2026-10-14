// Pixel Trail — adapted from Originkit (TS -> JS, "use client" dropped: not Next.js).
// Original component was a self-contained banner (its own background + optional caption,
// pointer events captured on itself). Adapted here as a page-wide ambient overlay instead:
// tracks the mouse on `window` (so it works everywhere, not just inside one box), stays
// `pointer-events: none` so it never blocks real clicks/scroll/hover, and has no background
// of its own — it only paints the trailing pixels on top of whatever is on the page.

import { useEffect, useMemo, useRef, useState } from 'react'

const MAX_CELLS = 9000
const FADE_EASING = 'linear'
const WALK_FRACTION = 0.5
const MAX_WALK_STEPS = 96

// Peak opacity of a lit cell. `mix-blend-mode: difference` against the mostly-black
// page background is mathematically identical to flat color (black is the identity
// value for difference), so full opacity there just reads as an opaque block sitting
// on top of the text. Capping it well under 1 keeps it a translucent wash instead —
// it still genuinely inverts colors under it (very visible over lighter content like
// photos or badges), but never fully hides what's underneath.
const MAX_ALPHA = 0.4

const DEFAULT_PIXEL = {
  color: '#39ff88',
  gap: 0,
  radius: 0,
}

const DEFAULT_TRAIL = {
  hold: 0.15,
  fade: 0.3,
  reach: 0,
}

const DEFAULTS = {
  columns: 120,
}

const CELL_STYLE = {
  width: '100%',
  aspectRatio: '1 / 1',
  background: 'var(--pt-color)',
  borderRadius: 'var(--pt-radius)',
  opacity: 0,
  mixBlendMode: 'difference',
}

export default function PixelTrail({ columns = DEFAULTS.columns, pixel, trail, style }) {
  const hostRef = useRef(null)
  const gridRef = useRef(null)
  const cellsRef = useRef([])
  const timersRef = useRef([])
  const lastRef = useRef(null)

  const px = { ...DEFAULT_PIXEL, ...pixel }
  const tr = { ...DEFAULT_TRAIL, ...trail }

  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const read = (w, h) =>
      setSize((s) => (Math.abs(s.w - w) < 0.5 && Math.abs(s.h - h) < 0.5 ? s : { w, h }))

    read(host.clientWidth, host.clientHeight)

    const ro = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect
      if (box) read(box.width, box.height)
    })
    ro.observe(host)
    return () => ro.disconnect()
  }, [])

  const grid = useMemo(() => {
    const gap = Math.max(0, px.gap)
    let cols = Math.max(2, Math.round(columns))
    if (size.w <= 0 || size.h <= 0) return { cols, rows: 0, gap, pitch: 0, count: 0 }

    const measure = (c) => {
      const cell = Math.max(1, (size.w - gap * (c - 1)) / c)
      const pitch = cell + gap
      return { pitch, rows: Math.max(1, Math.ceil((size.h + gap) / pitch)) }
    }

    let m = measure(cols)
    let guard = 0
    while (cols * m.rows > MAX_CELLS && cols > 2 && guard++ < 16) {
      cols = Math.max(2, Math.floor(cols * 0.85))
      m = measure(cols)
    }

    return { cols, rows: m.rows, gap, pitch: m.pitch, count: cols * m.rows }
  }, [columns, px.gap, size.w, size.h])

  const liveRef = useRef({
    cols: 0,
    rows: 0,
    pitch: 0,
    hold: DEFAULT_TRAIL.hold,
    fade: DEFAULT_TRAIL.fade,
    reach: DEFAULT_TRAIL.reach,
  })
  liveRef.current = {
    cols: grid.cols,
    rows: grid.rows,
    pitch: grid.pitch,
    hold: Math.max(0, tr.hold),
    fade: Math.max(0, tr.fade),
    reach: Math.max(0, Math.round(tr.reach)),
  }

  useEffect(() => {
    for (const t of timersRef.current) if (t) window.clearTimeout(t)
    const g = gridRef.current
    cellsRef.current = g ? Array.from(g.children) : []
    timersRef.current = new Array(cellsRef.current.length).fill(0)
    lastRef.current = null
  }, [grid.cols, grid.rows])

  useEffect(
    () => () => {
      for (const t of timersRef.current) if (t) window.clearTimeout(t)
    },
    []
  )

  const strike = (col, row, alpha) => {
    const { cols, rows, hold, fade } = liveRef.current
    if (col < 0 || row < 0 || col >= cols || row >= rows) return

    const i = row * cols + col
    const el = cellsRef.current[i]
    if (!el) return

    const pending = timersRef.current[i]
    if (pending) window.clearTimeout(pending)

    const current = parseFloat(el.style.opacity) || 0
    const next = current > alpha ? current : alpha

    el.style.transition = 'none'
    el.style.opacity = String(next)

    timersRef.current[i] = window.setTimeout(() => {
      timersRef.current[i] = 0
      el.style.transition = `opacity ${fade}s ${FADE_EASING}`
      el.style.opacity = '0'
    }, hold * 1000)
  }

  const stamp = (x, y) => {
    const { pitch, reach } = liveRef.current
    if (pitch <= 0) return

    const col = Math.floor(x / pitch)
    const row = Math.floor(y / pitch)

    if (reach <= 0) {
      strike(col, row, MAX_ALPHA)
      return
    }

    for (let dr = -reach; dr <= reach; dr++) {
      for (let dc = -reach; dc <= reach; dc++) {
        const d = Math.sqrt(dc * dc + dr * dr)
        if (d > reach + 0.5) continue
        strike(col + dc, row + dr, MAX_ALPHA * (1 - d / (reach + 1)))
      }
    }
  }

  const trace = (x, y) => {
    const pitch = liveRef.current.pitch
    const last = lastRef.current

    if (last) {
      const dx = x - last.x
      const dy = y - last.y
      const steps = Math.min(MAX_WALK_STEPS, Math.ceil(Math.sqrt(dx * dx + dy * dy) / (pitch * WALK_FRACTION)))
      for (let i = 1; i < steps; i++) {
        stamp(last.x + (dx * i) / steps, last.y + (dy * i) / steps)
      }
    }

    stamp(x, y)
    lastRef.current = { x, y }
  }

  // Tracked on `window` (not on the overlay div itself) because the overlay is
  // `pointer-events: none` so real page content stays fully clickable/scrollable.
  useEffect(() => {
    const onMove = (native) => {
      const host = hostRef.current
      if (!host || liveRef.current.pitch <= 0) return

      const rect = host.getBoundingClientRect()
      const layoutWidth = host.offsetWidth
      const scale = layoutWidth > 0 ? rect.width / layoutWidth : 1
      if (!(scale > 0)) return

      const samples = native.getCoalescedEvents ? native.getCoalescedEvents() : []
      const points = samples.length ? samples : [native]

      for (const p of points) {
        trace((p.clientX - rect.left) / scale, (p.clientY - rect.top) / scale)
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
    }
  }, [])

  const gridStyle = {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
    gap: `${grid.gap}px`,
    alignContent: 'start',
    pointerEvents: 'none',
    '--pt-color': px.color,
    '--pt-radius': `${Math.max(0, px.radius)}px`,
  }

  const cells = useMemo(
    () => Array.from({ length: grid.count }, (_, i) => <div key={i} style={CELL_STYLE} />),
    [grid.count]
  )

  return (
    <div
      ref={hostRef}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <div ref={gridRef} style={gridStyle}>
        {cells}
      </div>
    </div>
  )
}
