import { Box, Container, Heading, Link as ChakraLink, Stack, Text } from '@chakra-ui/react'
import Header from '../components/Header'

const channels = [
  { label: 'E-mail', href: 'mailto:felipegomespessoal@gmail.com', value: 'felipegomespessoal@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/Felipe-Gomes-Amorim', value: 'github.com/Felipe-Gomes-Amorim' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/felipe-gomes-19832a24a/',
    value: 'linkedin.com/in/felipe-gomes-19832a24a',
  },
]

export default function Contact() {
  return (
    <Box bg="black" color="#eee" minH="100vh">
      <Header />
      <Container maxW="1140px" py={20}>
        <Heading as="h1" fontFamily="heading" size="2xl" mb={8}>
          Contato
        </Heading>
        <Stack gap={4}>
          {channels.map((channel) => (
            <Box key={channel.label}>
              <Text fontWeight="bold" color="accent">
                {channel.label}
              </Text>
              <ChakraLink asChild color="#eee">
                <a href={channel.href} target="_blank" rel="noreferrer">
                  {channel.value}
                </a>
              </ChakraLink>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  )
}
