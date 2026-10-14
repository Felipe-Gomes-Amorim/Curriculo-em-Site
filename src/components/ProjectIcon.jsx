import { useState } from 'react'
import { Box, Image, Text } from '@chakra-ui/react'
import NeonBorder from './NeonBorder'
import './ProjectIcon.css'

const NEON_GREEN = '#39ff88'

export default function ProjectIcon({ project, active, onClick }) {
  const [pointerOver, setPointerOver] = useState(false)
  const [focusVisible, setFocusVisible] = useState(false)
  // Focus only counts as "highlighted" for keyboard users (:focus-visible). A mouse
  // click also leaves the button focused, and the browser re-fires `focus` on it
  // when the window regains focus (alt+tab back) — treating that as hover made the
  // clicked icon light up with no mouse anywhere near it, and nothing turned it off
  // since no mouseleave ever fired. Kept separate from pointerOver so a blur can't
  // cancel a genuine mouse hover either.
  const hovered = pointerOver || focusVisible

  return (
    // `contain: layout` stops this icon's own overflowing descendants (the glow's
    // blur layers reach up to 160px past its edges, and the hover label sits below
    // it) from counting toward the SCROLLABLE overflow of the icon row above it.
    // They still paint fine outside this box — containment isn't clipping — it
    // just keeps the row's own scrollable area from "seeing" that overflow.
    // Without it, the row picked up a real (if often near-invisible) vertical
    // scrollbar it never needed, since Firefox renders it as a visible classic
    // scrollbar where Chromium's default overlay style hides it almost entirely.
    <Box
      position="relative"
      w={{ base: '84px', md: '104px' }}
      aspectRatio="1 / 1"
      flexShrink={0}
      style={{ contain: 'layout' }}
      onMouseEnter={() => setPointerOver(true)}
      onMouseLeave={() => setPointerOver(false)}
      onFocus={(e) => setFocusVisible(e.target.matches(':focus-visible'))}
      onBlur={() => setFocusVisible(false)}
    >
      {/* The glow lives INSIDE the button (not as a sibling) so it rides along with
          the same hover-lift transform — as a sibling it stayed put while the
          button translated up on hover, which read as the glow drifting off the
          icon's edges. The button itself must stay overflow-visible for the glow's
          blur to bleed past its bounds, so the image gets its own clipped inner
          wrapper instead of clipping the button as a whole. */}
      <Box
        as="button"
        type="button"
        onClick={onClick}
        display="block"
        position="relative"
        w="100%"
        h="100%"
        borderRadius="md"
        border="1px solid"
        borderColor={active ? 'accent' : 'border'}
        bg="#0c100d"
        cursor="pointer"
        transition="transform 0.15s ease"
        transform={hovered ? 'translateY(-4px)' : 'none'}
      >
        <Box
          position="absolute"
          inset={0}
          borderRadius="md"
          overflow="hidden"
          filter={hovered ? 'brightness(1)' : 'brightness(0.55)'}
          transition="filter 0.25s ease"
        >
          {project.icon ? (
            <Image src={project.icon} alt={project.name} w="100%" h="100%" objectFit="cover" />
          ) : (
            <Box
              w="100%"
              h="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              backgroundImage="repeating-linear-gradient(45deg, #12160f 0px, #12160f 8px, #0c100d 8px, #0c100d 16px)"
            >
              <Text fontFamily="heading" fontSize="2xl" fontWeight="700" color="accentMuted">
                {project.name.charAt(0)}
              </Text>
            </Box>
          )}
        </Box>

        {/* Own clipped layer, as a sibling of the image wrapper rather than inside it:
            the image wrapper is dimmed with `filter: brightness()` when not hovered,
            and a streak inside it would be dimmed right along with the icon. */}
        {active && (
          <Box position="absolute" inset={0} borderRadius="md" overflow="hidden" pointerEvents="none" zIndex={1}>
            <Box className="project-icon-shine" />
          </Box>
        )}

        <Box
          position="absolute"
          inset={0}
          pointerEvents="none"
          zIndex={2}
          opacity={hovered ? 1 : 0}
          transition="opacity 0.25s ease"
        >
          {/* Glow layers grow their own corner radius as they spread outward, which
              reads fine on the big project cards but visibly overshoots a tiny
              84-104px icon's sharp corners — keeping `glow` low keeps that in check. */}
          <NeonBorder
            color={NEON_GREEN}
            rounded={10}
            thickness={2}
            borderSize={40}
            glow={22}
            movement="continuous"
            speed={hovered ? 9 : 0}
          />
        </Box>
      </Box>

      <Text
        position="absolute"
        top="100%"
        left="50%"
        mt={2}
        w="150px"
        ml="-75px"
        whiteSpace="normal"
        textAlign="center"
        fontFamily="heading"
        fontSize="xs"
        color="#eafff2"
        bg="rgba(5, 6, 7, 0.85)"
        border="1px solid"
        borderColor="border"
        borderRadius="sm"
        px={2}
        py={1}
        pointerEvents="none"
        zIndex={3}
        opacity={hovered ? 1 : 0}
        transform={hovered ? 'translateY(0)' : 'translateY(8px)'}
        transition="opacity 0.25s ease, transform 0.25s ease"
      >
        {project.name}
      </Text>
    </Box>
  )
}
