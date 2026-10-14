import { useEffect, useState } from 'react'
import CosmicBG from './CosmicBG'
import OrbitingCubes from './OrbitingCubes'
import './BootIntro.css'

const RED_PALETTE = { core: '#B3131F', mid: '#FF3B3B', accent: '#8C1120', outer: '#F5D9D9' }
const BLUE_PALETTE = { core: '#123E91', mid: '#2F7BFF', accent: '#1B2A8C', outer: '#D9E6F5' }
const SCRIM_OPACITY = 0.35

const TEXT_FADE_MS = 500
const TRANSITION_MS = 1600
const BG_REVEAL_MS = 3000

const TYPE_SPEED_MS = 16
const HOLD_AFTER_TYPE_MS = 2700

const BOOT_SEGMENTS = [
  { text: 'Please insert a ' },
  { text: 'PlayStation', bold: true },
  { text: '®', sup: true },
  { break: true },
  { text: 'or ' },
  { text: 'PlayStation', bold: true },
  { text: '®', sup: true },
  { text: '2 format disc.' },
]

const BOOT_CHARS = BOOT_SEGMENTS.flatMap((seg) =>
  seg.break ? [{ isBreak: true }] : [...seg.text].map((char) => ({ char, bold: seg.bold, sup: seg.sup }))
)

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex([r, g, b]) {
  const c = (v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}

function lerpPalette(a, b, t) {
  const eased = t * t * (3 - 2 * t)
  const out = {}
  for (const key of Object.keys(a)) {
    const [r1, g1, b1] = hexToRgb(a[key])
    const [r2, g2, b2] = hexToRgb(b[key])
    out[key] = rgbToHex([r1 + (r2 - r1) * eased, g1 + (g2 - g1) * eased, b1 + (b2 - b1) * eased])
  }
  return out
}

function shouldSkipIntro() {
  const forced = new URLSearchParams(window.location.search).get('intro')
  if (forced === 'force') return false
  if (forced === 'skip') return true

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function BootIntro({ children }) {
  const [phase, setPhase] = useState(() => (shouldSkipIntro() ? 'done' : 'text'))
  const [palette, setPalette] = useState(() => (phase === 'done' ? BLUE_PALETTE : RED_PALETTE))
  const [scrim, setScrim] = useState(() => (phase === 'done' ? SCRIM_OPACITY : 0))
  const [bgRevealed, setBgRevealed] = useState(false)
  const [cubesReady, setCubesReady] = useState(false)
  const [visibleChars, setVisibleChars] = useState(() => (phase === 'done' ? BOOT_CHARS.length : 0))

  // Runs once on mount: types the boot text out, then schedules the fade-out and
  // color transition. Deliberately NOT keyed on `phase` — re-running on every phase
  // change would clear the later timers before they ever fire (mount-only lifetime).
  useEffect(() => {
    if (phase !== 'text') return

    const typingDuration = BOOT_CHARS.length * TYPE_SPEED_MS
    const start = performance.now()
    let raf = 0

    const typeTick = (now) => {
      const elapsed = now - start
      setVisibleChars(Math.min(BOOT_CHARS.length, Math.floor(elapsed / TYPE_SPEED_MS)))
      if (elapsed < typingDuration) raf = requestAnimationFrame(typeTick)
    }
    raf = requestAnimationFrame(typeTick)

    const holdDelay = typingDuration + HOLD_AFTER_TYPE_MS
    const t1 = setTimeout(() => setPhase('textFadeOut'), holdDelay)
    const t2 = setTimeout(() => setPhase('transition'), holdDelay + TEXT_FADE_MS)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t1)
      clearTimeout(t2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Zoom+fade the background in on mount, masking the WebGL shader's first-frame setup.
  // Double rAF ensures the initial (scaled-down, transparent) style actually paints
  // before flipping to the target style, otherwise the browser may skip the transition.
  useEffect(() => {
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setBgRevealed(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [])

  // The two glass cubes each build a ~27k-vertex geometry (with per-vertex `pow()`
  // calls) and spin up their own WebGL renderer — real work that, if it runs at
  // the exact moment the boot text starts typing, blocks the main thread long
  // enough to drop several rAF frames in a row. The typing loop is elapsed-time
  // based, so a dropped-frame gap makes it "catch up" by jumping several
  // characters at once instead of advancing one at a time. Deferring the cubes'
  // mount to an idle moment keeps that setup off the main thread during the
  // typing animation's critical first stretch.
  useEffect(() => {
    const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 300))
    const cic = window.cancelIdleCallback || clearTimeout
    const id = ric(() => setCubesReady(true), { timeout: 800 })
    return () => cic(id)
  }, [])

  useEffect(() => {
    if (phase !== 'transition') return

    let raf = 0
    const start = performance.now()

    const tick = (now) => {
      const t = Math.min(1, (now - start) / TRANSITION_MS)
      setPalette(lerpPalette(RED_PALETTE, BLUE_PALETTE, t))
      setScrim(t * SCRIM_OPACITY)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setPhase('done')
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  const showText = phase === 'text'

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          transform: 'translateZ(0)',
          willChange: 'transform',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: bgRevealed ? 1 : 0,
            transform: bgRevealed ? 'scale(1)' : 'scale(1.25)',
            transition: `opacity ${BG_REVEAL_MS}ms ease, transform ${BG_REVEAL_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          }}
        >
          <CosmicBG
            coreColor={palette.core}
            midColor={palette.mid}
            accentColor={palette.accent}
            outerColor={palette.outer}
            detail={16}
            brightness={38}
            speed={22}
            rotation={12}
          />
          <div
            style={{
              position: 'absolute',
              top: '38%',
              left: '50%',
              width: 850,
              height: 850,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          >
            {cubesReady && <OrbitingCubes palette={palette} />}
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#050607',
            opacity: scrim,
            pointerEvents: 'none',
          }}
        />
      </div>

      {phase !== 'done' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 24px',
            opacity: showText ? 1 : 0,
            transition: `opacity ${TEXT_FADE_MS}ms ease`,
            pointerEvents: 'none',
          }}
        >
          <p
            style={{
              margin: 0,
              color: '#fbeaea',
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(28px, 4.8vw, 44px)',
              lineHeight: 1.7,
              textShadow: '0 0 18px rgba(255, 200, 200, 0.65), 0 0 40px rgba(255, 120, 120, 0.35)',
            }}
          >
            {BOOT_CHARS.slice(0, visibleChars).map((c, i) => {
              if (c.isBreak) return <br key={i} />
              if (c.sup) return <sup key={i}>{c.char}</sup>
              if (c.bold)
                return (
                  <strong key={i} style={{ fontWeight: 800, letterSpacing: '0.5px' }}>
                    {c.char}
                  </strong>
                )
              return <span key={i}>{c.char}</span>
            })}
            {phase === 'text' && visibleChars < BOOT_CHARS.length && (
              <span className="boot-cursor">▌</span>
            )}
          </p>
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Mounted only once the intro starts handing off, not from the very start.
            The real page was always in the DOM here before, just hidden behind an
            `opacity: 0` on this wrapper — which meant every section's scroll-reveal
            IntersectionObserver had the entire multi-second boot sequence to
            silently decide "I'm on screen" for whatever fit in the first viewport,
            before the user ever saw or scrolled past it. It then had nothing left
            to animate: it fired mid-boot, invisibly, and simply appeared
            already-done the moment the intro faded out.
            No opacity fade of our own here either, for the same reason: this
            wrapper's own fade used to run at the same time as (and blend
            invisibly into) whatever was in view already fading itself in via its
            own Reveal — two overlapping fades reading as one indistinct block
            instead of visibly separate, individually-triggered elements. Content
            is just shown as soon as it mounts; each piece's own Reveal is now the
            only thing responsible for how it appears. */}
        {(phase === 'transition' || phase === 'done') && children}
      </div>
    </>
  )
}
