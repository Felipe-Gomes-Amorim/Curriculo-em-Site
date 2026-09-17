import { Box, Flex, Link as ChakraLink } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Projetos' },
  { to: '/contato', label: 'Contatos' },
  { to: '/sobre', label: 'Sobre' },
]

export default function Header() {
  return (
    <Box
      as="header"
      position="relative"
      zIndex={100}
      w="1140px"
      maxW="80%"
      mx="auto"
      h="50px"
      display="flex"
      alignItems="center"
    >
      <Flex as="nav" gap="2rem">
        {links.map((link) => (
          <ChakraLink key={link.to} asChild color="#eee" fontSize="14px">
            <RouterLink to={link.to}>{link.label}</RouterLink>
          </ChakraLink>
        ))}
      </Flex>
    </Box>
  )
}
