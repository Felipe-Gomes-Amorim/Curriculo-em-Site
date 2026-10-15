import { Box } from '@chakra-ui/react'
import SectionHeading from './SectionHeading'
import TerminalWindow from './TerminalWindow'
import TypewriterText from './TypewriterText'
import Reveal from './Reveal'

const ABOUT_TEXT =
  'Sou Engenheiro de Software, formado pela Universidade de Mogi das Cruzes, com experiência prática ' +
  'construindo sistemas de naturezas variadas: aplicações web, apps desktop, jogos, integrações com APIs e ' +
  'ferramentas de inteligência artificial — incluindo passagem como AI Developer & Software Engineer na ' +
  'ArcadiA Education, com software aplicado a soluções de IA para o setor educacional — e engenharia ' +
  'reversa de baixo nível, como a recompilação estática de um jogo de GBA. Gosto de participar do processo completo de um projeto — da arquitetura à entrega — e de ' +
  'aprender a fundo cada tecnologia que uso.'

export default function About() {
  return (
    <Box as="section" id="sobre">
        <SectionHeading>sobre</SectionHeading>
        <Reveal direction="up">
          <TerminalWindow title="sobre.txt">
            <TypewriterText
              text={ABOUT_TEXT}
              durationMs={4000}
              color="#d7ded9"
              fontSize={{ base: 'sm', md: 'md' }}
              lineHeight="1.8"
            />
          </TerminalWindow>
        </Reveal>
    </Box>
  )
}
