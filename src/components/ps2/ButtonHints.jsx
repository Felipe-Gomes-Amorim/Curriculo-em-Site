import { Box, Text } from '@chakra-ui/react'
import ButtonGlyph from './ButtonGlyph'

// Bottom-right legend, like the BIOS's "○ Back  △ Options" row. ✕ is a legend only
// (it describes click/Enter); ○ actually goes back, so it's a real button.
export default function ButtonHints({ onBack, backLabel = 'Voltar' }) {
  return (
    <Box
      position="fixed"
      right={{ md: 10, lg: 14 }}
      bottom={{ md: 6, lg: 8 }}
      zIndex={3}
      display={{ base: 'none', md: 'flex' }}
      alignItems="center"
      gap={8}
      fontFamily="ps2"
      fontSize="18px"
      color="ps2White"
    >
      <Box display="flex" alignItems="center" gap={2}>
        <ButtonGlyph shape="cross" />
        <Text as="span">Selecionar</Text>
      </Box>
      <Box
        as="button"
        type="button"
        onClick={onBack}
        display="flex"
        alignItems="center"
        gap={2}
        bg="transparent"
        border="none"
        p={0}
        color="ps2White"
        fontFamily="ps2"
        fontSize="18px"
        cursor="pointer"
        _hover={{ color: '#e6e6e6' }}
        _focusVisible={{ outline: '1px solid', outlineColor: 'ps2Blue', outlineOffset: '4px' }}
      >
        <ButtonGlyph shape="circle" />
        <Text as="span">{backLabel}</Text>
      </Box>
    </Box>
  )
}
