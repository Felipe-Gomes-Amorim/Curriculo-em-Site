import { useEffect, useRef, useState } from 'react'

// Fires once the element is meaningfully on screen — a chunk of its own height
// short of the viewport's bottom edge (rootMargin) AND at least a quarter of it
// actually visible (threshold), not just a sliver grazing the very edge. Tuned to
// read as "revealed once you've scrolled enough to see it," not "the moment it
// technically starts intersecting." `prefers-reduced-motion` skips straight to
// visible.
export function useInView({ threshold = 0.25, rootMargin = '0px 0px -20% 0px', once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [once, threshold, rootMargin])

  return [ref, inView]
}
