import { Box, Heading, Stack, Text } from '@chakra-ui/react'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

export const entries = [
  {
    role: 'AI Developer & Software Engineer',
    place: 'ArcadiA Education (EdTech)',
    period: 'fev. 2026 – out. 2026',
    description: 'Desenvolvimento de software aplicado a soluções de IA para o setor educacional.',
  },
  {
    role: 'Serviços técnicos, tecnológicos e som',
    place: 'Secretaria Municipal de Educação de São Paulo (voluntariado)',
    period: 'jun. 2025',
    description:
      'Suporte tecnológico e sonoro da XI Jornada Pedagógica – Educação Infantil Paulistana 2025, evento formativo para os profissionais de Educação Infantil da Rede Municipal (23 a 27 de junho).',
  },
  {
    role: 'Bacharelado em Engenharia de Software',
    place: 'Universidade de Mogi das Cruzes',
    period: '2022 — 2025',
    description: 'Formação em Engenharia de Software.',
  },
]

export default function Experience() {
  return (
    <Box as="section" id="experiencia">
        <SectionHeading>experiencia</SectionHeading>
        <Stack gap={0}>
          {entries.map((entry, index) => (
            <Reveal key={entry.role} direction={index % 2 === 0 ? 'left' : 'right'} delay={index * 0.1}>
              <Box
                borderLeft="2px solid"
                borderColor="accentMuted"
                pl={6}
                py={5}
                position="relative"
                _before={{
                  content: '""',
                  position: 'absolute',
                  left: '-6px',
                  top: '28px',
                  boxSize: '10px',
                  borderRadius: 'full',
                  bg: 'accent',
                  boxShadow: '0 0 8px #39ff88aa',
                }}
              >
                <Heading as="h3" fontFamily="heading" fontSize={{ base: 'sm', md: 'md' }} color="#eafff2">
                  {entry.role}
                </Heading>
                <Text fontFamily="heading" fontSize="xs" color="accent" mt={1}>
                  {entry.place} · {entry.period}
                </Text>
                <Text color="muted" fontSize="sm" mt={2}>
                  {entry.description}
                </Text>
              </Box>
            </Reveal>
          ))}
        </Stack>
    </Box>
  )
}
