import { Box, Heading, Image, Stack, Text } from '@chakra-ui/react'
import profilePhoto from '../assets/about/profile.jpg'
import TerminalLink from './TerminalLink'
import Reveal from './Reveal'

export default function Hero() {
  return (
    <Box as="section" id="hero">
        <Reveal direction="up" delay={0}>
          <Box
            display="inline-block"
            p="3px"
            mb={5}
            borderRadius="full"
            border="1px solid"
            borderColor="border"
            boxShadow="0 0 20px #39ff8833"
          >
            <Image
              src={profilePhoto}
              alt="Felipe Gomes Amorim"
              borderRadius="full"
              boxSize={{ base: '180px', md: '240px' }}
              objectFit="cover"
              display="block"
            />
          </Box>
        </Reveal>

        <Reveal direction="up" delay={0.12}>
          <Heading
            as="h1"
            fontFamily="heading"
            fontSize={{ base: '2xl', md: '4xl' }}
            fontWeight="700"
            color="#eafff2"
            textShadow="0 0 16px #39ff8855"
            mb={2}
          >
            Felipe Gomes Amorim
          </Heading>
        </Reveal>

        <Reveal direction="up" delay={0.22}>
          <Text fontFamily="heading" fontSize={{ base: 'md', md: 'lg' }} color="accent" mb={4}>
            Engenheiro de Software
          </Text>
        </Reveal>

        <Reveal direction="up" delay={0.32}>
          <Text maxW="640px" color="muted" fontSize={{ base: 'sm', md: 'md' }} mb={8}>
            Construo sistemas de naturezas variadas — de aplicações web a jogos e apps desktop — do design à
            entrega.
          </Text>
        </Reveal>

        <Reveal direction="up" delay={0.42}>
          <Stack direction="row" justify="flex-start" gap={4} flexWrap="wrap">
            <TerminalLink href="https://github.com/Felipe-Gomes-Amorim">GitHub</TerminalLink>
            <TerminalLink href="https://www.linkedin.com/in/felipe-gomes-amorim/">LinkedIn</TerminalLink>
            <TerminalLink href="mailto:felipegomespessoal@gmail.com">Contato</TerminalLink>
          </Stack>
        </Reveal>
    </Box>
  )
}
