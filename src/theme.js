import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
    html: {
      scrollBehavior: 'smooth',
    },
    'html, body': {
      margin: 0,
      padding: 0,
      backgroundColor: '#08090a',
      color: '#d7ded9',
      fontFamily: "'Inter', sans-serif",
    },
    a: {
      textDecoration: 'none',
      color: 'inherit',
    },
    '::selection': {
      backgroundColor: '#39ff8855',
      color: '#eafff2',
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'JetBrains Mono', monospace" },
        body: { value: "'Inter', sans-serif" },
        mono: { value: "'JetBrains Mono', monospace" },
        // The PS2 OSD typeface itself isn't documented anywhere reliable; M PLUS 1p
        // is a close-enough Japanese-style sans in the same family of shapes.
        ps2: { value: "'M PLUS 1p', 'Inter', sans-serif" },
      },
      colors: {
        // Sampled from real PS2 BIOS screenshots (glyph cores, not anti-aliased edges).
        ps2Yellow: { value: '#CBD22E' },
        ps2CardYellow: { value: '#E0E46D' },
        ps2Blue: { value: '#49C1ED' },
        // Measured #585858; nudged lighter so unselected items stay legible over the
        // nebula background instead of pure black.
        ps2Gray: { value: '#727272' },
        ps2White: { value: '#BCBCBC' },
        ps2Cross: { value: '#8E94C9' },
        ps2Circle: { value: '#D25770' },
        ps2Triangle: { value: '#32AA75' },
        accent: { value: '#39ff88' },
        accentMuted: { value: '#1f8f52' },
        bgRaised: { value: '#0f1211' },
        border: { value: '#1c2420' },
        muted: { value: '#8ea298' },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: '#08090a' },
        fg: { value: '#d7ded9' },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
