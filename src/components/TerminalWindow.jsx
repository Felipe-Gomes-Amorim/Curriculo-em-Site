import { Box, Flex, Text } from '@chakra-ui/react'

export default function TerminalWindow({ title, children, ...props }) {
  return (
    <Box
      bg="bgRaised"
      border="1px solid"
      borderColor="border"
      borderRadius="md"
      overflow="hidden"
      {...props}
    >
      <Flex align="center" gap={2} px={4} py={2} bg="#141915" borderBottom="1px solid" borderColor="border">
        <Box boxSize="9px" borderRadius="full" bg="#ff5f56" />
        <Box boxSize="9px" borderRadius="full" bg="#ffbd2e" />
        <Box boxSize="9px" borderRadius="full" bg="#27c93f" />
        {title && (
          <Text fontFamily="heading" fontSize="xs" color="muted" ml={2}>
            {title}
          </Text>
        )}
      </Flex>
      <Box p={{ base: 5, md: 8 }}>{children}</Box>
    </Box>
  )
}
