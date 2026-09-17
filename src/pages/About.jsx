import { Box, Button, Container, Heading, Image, Link as ChakraLink, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import Header from '../components/Header'
import profilePhoto from '../assets/about/profile.png'
import frontendPhoto from '../assets/about/frontend.png'
import uxuiPhoto from '../assets/about/uxui.png'
import contactPhoto from '../assets/about/contact.png'

function Section({ image, imageAlt, reverse, children }) {
  return (
    <Stack
      direction={{ base: 'column', md: reverse ? 'row-reverse' : 'row' }}
      align="center"
      gap={{ base: 6, md: 12 }}
      maxW="1140px"
      w="80%"
      mx="auto"
      py={16}
    >
      <Image src={image} alt={imageAlt} borderRadius="lg" maxH="280px" objectFit="cover" flexShrink={0} />
      <Box>{children}</Box>
    </Stack>
  )
}

export default function About() {
  return (
    <Box bg="black" color="#eee" minH="100vh">
      <Header />

      <Container maxW="1140px" py={20} textAlign="center">
        <Heading as="h1" fontFamily="heading" size="2xl" mb={6}>
          Felipe Gomes Amorim
        </Heading>
        <Image
          src={profilePhoto}
          alt="foto de perfil"
          borderRadius="full"
          boxSize="180px"
          objectFit="cover"
          mx="auto"
          mb={4}
        />
        <Text fontSize="lg" color="accent" mb={6}>
          Front End e UX/UI
        </Text>
        <Stack direction={{ base: 'column', sm: 'row' }} justify="center" gap={4}>
          <ChakraLink asChild>
            <a href="https://github.com/Felipe-Gomes-Amorim" target="_blank" rel="noreferrer">
              <Button colorPalette="orange" variant="solid">
                Meu github
              </Button>
            </a>
          </ChakraLink>
          <ChakraLink asChild>
            <a href="https://www.linkedin.com/in/felipe-gomes-19832a24a/" target="_blank" rel="noreferrer">
              <Button variant="outline" borderColor="#eee" color="#eee">
                Meu linkedin
              </Button>
            </a>
          </ChakraLink>
        </Stack>
      </Container>

      <Section image={frontendPhoto} imageAlt="Habilidades de front-end">
        <Heading as="h2" size="lg" mb={4}>
          Habilidades de Front-End
        </Heading>
        <Text color="#ccc">
          Desenvolvedor front-end com experiência em construção de interfaces responsivas e acessíveis
          utilizando HTML, CSS, JavaScript e React. Familiaridade com princípios de design responsivo,
          componentização, hooks, consumo de APIs REST e boas práticas de versionamento com Git. Comprometido
          com a entrega de código limpo, reutilizável e alinhado com padrões modernos de desenvolvimento.
        </Text>
      </Section>

      <Section image={uxuiPhoto} imageAlt="Habilidades de UX/UI" reverse>
        <Heading as="h2" size="lg" mb={4}>
          Habilidades de UX/UI
        </Heading>
        <Text color="#ccc">
          Domínio de ferramentas como Photoshop e Figma, para elaboração de ideias de estética e como suporte
          na estilização das páginas, com habilidades de edição de imagem, correção de cor, fontes e
          tipografias.
        </Text>
      </Section>

      <Section image={contactPhoto} imageAlt="Formas de contato">
        <Heading as="h2" size="lg" mb={4}>
          Formas de Contato
        </Heading>
        <Text color="#ccc" mb={4}>
          Você pode me contatar tanto por e-mail quanto por WhatsApp.
        </Text>
        <ChakraLink asChild>
          <RouterLink to="/contato">
            <Button colorPalette="orange">Página de Contato</Button>
          </RouterLink>
        </ChakraLink>
      </Section>
    </Box>
  )
}
