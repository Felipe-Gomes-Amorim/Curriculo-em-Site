import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  globalCss: {
    '*': {
      boxSizing: 'border-box',
    },
    'html, body': {
      margin: 0,
      padding: 0,
      backgroundColor: 'black',
      color: '#eee',
      fontFamily: "'Montserrat', sans-serif",
    },
    a: {
      textDecoration: 'none',
      color: 'inherit',
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Playfair Display', serif" },
        body: { value: "'Montserrat', sans-serif" },
      },
      colors: {
        accent: { value: '#ff7f50' },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
