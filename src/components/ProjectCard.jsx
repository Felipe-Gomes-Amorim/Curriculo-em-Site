import { Badge, Box, Heading, Image, Stack, Text } from '@chakra-ui/react'
import TerminalLink from './TerminalLink'
import NeonBorder from './NeonBorder'

const NEON_GREEN = '#39ff88'

export default function ProjectCard({ project, reverse }) {
  return (
    <Box position="relative">
      <Box position="absolute" inset={0} pointerEvents="none" zIndex={1}>
        <NeonBorder
          color={NEON_GREEN}
          rounded={4}
          thickness={2}
          borderSize={32}
          glow={55}
          movement="continuous"
          speed={7}
        />
      </Box>

      <Stack
        direction={{ base: 'column', md: reverse ? 'row-reverse' : 'row' }}
        gap={{ base: 4, md: 8 }}
        align="stretch"
        border="1px solid"
        borderColor="border"
        borderRadius="lg"
        overflow="hidden"
        bg="bgRaised"
        position="relative"
        zIndex={2}
      >
        <Box flex="1" minW={0} position="relative" bg="#0c100d" minH={{ base: '180px', md: 'auto' }}>
          {project.image ? (
            <Image
              src={project.image}
              alt={project.name}
              w="100%"
              h="100%"
              objectFit="cover"
              filter="saturate(0.9) brightness(0.85)"
            />
          ) : (
            <Box
              w="100%"
              h="100%"
              minH={{ base: '180px', md: '260px' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              backgroundImage="repeating-linear-gradient(45deg, #12160f 0px, #12160f 10px, #0c100d 10px, #0c100d 20px)"
            >
              <Text fontFamily="heading" color="accentMuted" fontSize="sm" textAlign="center" px={4}>
                [ sem preview disponível ]
              </Text>
            </Box>
          )}
        </Box>

        <Box flex="1.4" minW={0} p={{ base: 5, md: 8 }}>
          <Heading as="h3" fontFamily="heading" fontSize={{ base: 'xl', md: '2xl' }} color="#eafff2" mb={3}>
            {project.name}
          </Heading>
          <Stack direction="row" flexWrap="wrap" gap={2} mb={4}>
            {project.stack.map((tech) => (
              <Badge
                key={tech}
                fontFamily="heading"
                fontSize="xs"
                color="accent"
                border="1px solid"
                borderColor="accentMuted"
                bg="transparent"
                borderRadius="sm"
                px={2}
                py={0.5}
              >
                {tech}
              </Badge>
            ))}
          </Stack>
          <Text color="muted" fontSize="sm" lineHeight="1.7" mb={5}>
            {project.description}
          </Text>
          <TerminalLink href={project.github}>Repositório</TerminalLink>
        </Box>
      </Stack>
    </Box>
  )
}
