import { Box } from '@chakra-ui/react'
import { useInView } from '../hooks/useInView'

const OFFSET = {
  up: 'translateY(32px)',
  down: 'translateY(-32px)',
  left: 'translateX(36px)',
  right: 'translateX(-36px)',
}

// Fade + directional slide-in, triggered once the element scrolls into view.
// Plain IntersectionObserver + CSS transition — no animation library needed for
// a one-shot reveal like this.
export default function Reveal({ children, direction = 'up', delay = 0, ...props }) {
  const [ref, inView] = useInView()

  return (
    <Box
      ref={ref}
      opacity={inView ? 1 : 0}
      transform={inView ? 'translate(0, 0)' : OFFSET[direction]}
      transition={`opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`}
      willChange="opacity, transform"
      {...props}
    >
      {children}
    </Box>
  )
}
