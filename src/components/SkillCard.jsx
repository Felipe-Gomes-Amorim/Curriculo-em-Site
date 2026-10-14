import { useState } from 'react'
import { Badge, Box, Heading, Image, Stack, Text } from '@chakra-ui/react'
import CutCornerPanel from './CutCornerPanel'

// Drop icon files straight into src/assets/pokemon/ (png/jpg/webp) — nothing else
// to wire up, this picks them all up automatically. Each card rolls a random one
// on mount, so a page reload reshuffles which icon shows where.
const ICONS = Object.values(
  import.meta.glob('../assets/pokemon/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' })
)

function randomIcon() {
  if (ICONS.length === 0) return null
  return ICONS[Math.floor(Math.random() * ICONS.length)]
}

// Categorical palette, drawn from the dataviz skill's validated dark-mode set with
// green AND the "aqua" slot dropped — aqua (#199e70) reads as green in practice
// (its own green channel dominates), and every card already has a green fill/
// border, so either would just vanish into it instead of contrasting. Re-validated
// this exact 5-color order with the skill's script against our dark surface —
// passes lightness, chroma, CVD separation, normal-vision floor and contrast.
// Assigning by position means colors repeat across different cards but never
// twice within the same one (max 5 badges in any one category here).
const BADGE_COLORS = ['#d95926', '#3987e5', '#c98500', '#9085e9', '#e66767']

export default function SkillCard({ category }) {
  const [icon] = useState(randomIcon)

  return (
    <CutCornerPanel borderColor="#8fffc4" bg="rgba(45, 140, 95, 0.22)">
      <Stack direction="row" align="center" gap={3} mb={3}>
        <Box
          boxSize="56px"
          flexShrink={0}
          borderRadius="md"
          bg="rgba(0, 0, 0, 0.25)"
          border="1px solid"
          borderColor="rgba(234, 255, 242, 0.35)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
        >
          {icon ? (
            <Image src={icon} alt="" boxSize="100%" objectFit="contain" p={1} />
          ) : (
            <Text fontSize="lg" color="accentMuted">
              ?
            </Text>
          )}
        </Box>
        <Heading
          as="h3"
          fontFamily="heading"
          fontSize="sm"
          color="#eafff2"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          {category.label}
        </Heading>
      </Stack>

      <Stack direction="row" flexWrap="wrap" gap={2}>
        {category.items.map((item, index) => {
          const color = BADGE_COLORS[index % BADGE_COLORS.length]
          return (
            <Badge
              key={item}
              fontFamily="heading"
              fontSize="xs"
              color="#ffffff"
              border="1px solid"
              borderColor={color}
              bg={`${color}40`}
              borderRadius="sm"
              px={2}
              py={0.5}
            >
              {item}
            </Badge>
          )
        })}
      </Stack>

      {category.note && (
        <Text fontSize="xs" color="muted" mt={3}>
          {category.note}
        </Text>
      )}
    </CutCornerPanel>
  )
}
