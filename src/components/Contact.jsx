import { Box, Heading, Stack, Text } from '@chakra-ui/react'
import SectionHeading from './SectionHeading'
import TerminalLink from './TerminalLink'
import Reveal from './Reveal'

export const contactLinks = [
  { label: 'GitHub', href: 'https://github.com/Felipe-Gomes-Amorim' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/felipe-gomes-amorim/' },
  { label: 'E-mail', href: 'mailto:felipegomespessoal@gmail.com' },
]

export default function Contact() {
  return (
    <Box as="section" id="contato">
      <SectionHeading>contato</SectionHeading>
      <Reveal direction="up" delay={0}>
        <Heading as="h3" fontFamily="heading" fontSize={{ base: 'lg', md: 'xl' }} color="accent" mb={2}>
          Vamos conversar?
        </Heading>
      </Reveal>
      <Reveal direction="up" delay={0.1}>
        <Text color="muted" fontSize="sm" mb={6}>
          felipegomespessoal@gmail.com
        </Text>
      </Reveal>
      <Reveal direction="up" delay={0.2}>
        <Stack direction="row" justify="flex-start" gap={4} flexWrap="wrap">
          {contactLinks.map((link) => (
            <TerminalLink key={link.label} href={link.href}>
              {link.label}
            </TerminalLink>
          ))}
        </Stack>
      </Reveal>
    </Box>
  )
}
