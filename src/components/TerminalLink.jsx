import { Link as ChakraLink } from '@chakra-ui/react'

export default function TerminalLink({ href, children }) {
  return (
    <ChakraLink
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel="noreferrer"
      fontFamily="heading"
      fontSize="sm"
      color="accent"
      border="1px solid"
      borderColor="accentMuted"
      borderRadius="sm"
      px={4}
      py={2}
      transition="all 0.15s ease"
      _hover={{
        bg: '#39ff8814',
        borderColor: 'accent',
        boxShadow: '0 0 12px #39ff8855',
      }}
    >
      {children}
    </ChakraLink>
  )
}
