import { useEffect, useRef, useState } from 'react'
import { Text } from '@chakra-ui/react'
import { useInView } from '../hooks/useInView'
import './TypewriterText.css'

// Types `text` out character by character over `durationMs`, starting once it
// scrolls into view (own IntersectionObserver via useInView, same trigger point
// as Reveal). Elapsed-time based rather than a fixed per-character interval, so
// the full read always takes ~durationMs regardless of frame rate.
export default function TypewriterText({ text, durationMs = 4000, ...props }) {
  const [ref, inView] = useInView()
  const [visibleChars, setVisibleChars] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleChars(text.length)
      return
    }

    const start = performance.now()
    let raf = 0

    const tick = (now) => {
      const elapsed = now - start
      const count = Math.min(text.length, Math.floor((elapsed / durationMs) * text.length))
      setVisibleChars(count)
      if (elapsed < durationMs) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, text, durationMs])

  const done = visibleChars >= text.length

  return (
    <Text ref={ref} {...props}>
      {text.slice(0, visibleChars)}
      {!done && (
        <Text as="span" className="typewriter-cursor" aria-hidden="true">
          ▌
        </Text>
      )}
    </Text>
  )
}
