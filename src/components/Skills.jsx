import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { Box, Image, Link, Text } from '@chakra-ui/react'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import SaveGlyph from './ps2/SaveGlyph'
import ButtonGlyph from './ps2/ButtonGlyph'
import { skillCategories, modelCredits } from '../data/skills'

// three.js + models are only fetched once this screen is actually opened (and the 2D
// glyphs show instantly in the meantime / forever if WebGL isn't available).
const ModelStage = lazy(() => import('./ps2/ModelStage'))

// Optional: any png/jpg/webp dropped in src/assets/pokemon/ replaces the 3D icon for a
// save, each one rolling a random image per page load.
const POKEMON_ICONS = Object.values(
  import.meta.glob('../assets/pokemon/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' })
)
const pickIcon = () =>
  POKEMON_ICONS.length ? POKEMON_ICONS[Math.floor(Math.random() * POKEMON_ICONS.length)] : null

// Validated categorical palette carried over from the old skill cards (no green, no
// aqua — see git history of SkillCard.jsx); now marks each item in a save's list.
const ITEM_COLORS = ['#d95926', '#3987e5', '#c98500', '#9085e9', '#e66767']

const TOTAL_ITEMS = skillCategories.reduce((sum, c) => sum + c.items.length, 0)

// The PS2 memory card browser's gray "fog" backdrop, built from colors sampled off a
// real screenshot: light top-left, darkening to an olive-gray bottom-right.
const CARD_BG =
  'radial-gradient(ellipse at 12% 0%, #a3a3a3 0%, #7c7c7a 32%, #615d57 60%, #45453a 82%, #36362b 100%)'

// 2D stand-in for a save's icon. The 3D stage draws on top of this element's box once
// the model is ready, at which point the glyph fades out.
function SaveIcon({ category, icon, size, forwardRef, hideGlyph }) {
  return (
    <Box ref={forwardRef} boxSize={`${size}px`} position="relative">
      <Box opacity={hideGlyph ? 0 : 1} transition="opacity 0.25s ease">
        {icon ? (
          <Image src={icon} alt="" boxSize={`${size}px`} objectFit="contain" />
        ) : (
          <SaveGlyph glyph={category.glyph} size={size} />
        )}
      </Box>
    </Box>
  )
}

// Soft white halo the BIOS puts behind the highlighted save.
function SelectionGlow({ on, size }) {
  return (
    <Box
      position="absolute"
      left="50%"
      top="50%"
      boxSize={`${size}px`}
      transform="translate(-50%, -50%)"
      borderRadius="full"
      bg="radial-gradient(circle, rgba(255,253,248,0.95) 0%, rgba(255,253,248,0.55) 28%, rgba(255,253,248,0) 68%)"
      opacity={on ? 1 : 0}
      transition="opacity 0.25s ease"
      pointerEvents="none"
    />
  )
}

export default function Skills({ registerBack }) {
  const [selected, setSelected] = useState(0)
  const [openIndex, setOpenIndex] = useState(null)
  const [icons] = useState(() => skillCategories.map(pickIcon))
  const [readySlots, setReadySlots] = useState(() => new Set())
  const [stageFailed, setStageFailed] = useState(false)

  const tileEls = useRef([])
  const detailEl = useRef(null)
  const view = useRef({ selected, openIndex, icons })
  view.current = { selected, openIndex, icons }

  // While a save is open, ○ Voltar (button or Esc) closes it instead of leaving the
  // section — same as backing out of a save on the real console.
  useEffect(() => {
    registerBack?.(openIndex === null ? null : () => setOpenIndex(null))
    return () => registerBack?.(null)
  }, [openIndex, registerBack])

  // Read by the stage every frame: which DOM boxes get a 3D model, and which spins.
  // Saves with a user-supplied image keep that image instead of a model.
  const getSlots = useCallback(() => {
    const { selected: sel, openIndex: open, icons: imgs } = view.current
    if (open !== null) {
      return imgs[open] ? [] : [{ key: 'detail', el: detailEl.current, model: skillCategories[open].model, active: true }]
    }
    return skillCategories
      .map((c, i) => ({ key: `tile-${i}`, el: tileEls.current[i], model: c.model, active: i === sel, hasImage: !!imgs[i] }))
      .filter((s) => !s.hasImage)
  }, [])

  const current = skillCategories[openIndex ?? selected]
  const glyphHidden = (key) => !stageFailed && readySlots.has(key)

  return (
    <Box as="section" id="skills">
      <SectionHeading>skills</SectionHeading>

      <Reveal direction="up">
        <Box
          position="relative"
          bg={CARD_BG}
          borderRadius="md"
          overflow="hidden"
          minH={{ base: '460px', md: '540px' }}
          px={{ base: 5, md: 8 }}
          py={{ base: 5, md: 7 }}
          fontFamily="ps2"
          boxShadow="0 20px 60px rgba(0, 0, 0, 0.45)"
        >
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={6}>
            <Box color="white" textShadow="0 1px 2px rgba(0,0,0,0.35)">
              <Text fontSize={{ base: 'lg', md: '22px' }} lineHeight="1.2">
                Memory Card{' '}
                <Text as="span" fontSize="0.65em">
                  (PS2)
                </Text>
                /1
              </Text>
              <Text fontSize={{ base: 'sm', md: '15px' }} mt={1}>
                {TOTAL_ITEMS} itens salvos
              </Text>
            </Box>
            <Text
              color="ps2CardYellow"
              fontSize={{ base: 'lg', md: '22px' }}
              lineHeight="1.3"
              textAlign="right"
              maxW="55%"
              textShadow="0 1px 2px rgba(0,0,0,0.4)"
            >
              {current.label}
            </Text>
          </Box>

          {openIndex === null ? (
            <Box
              display="grid"
              gridTemplateColumns={{ base: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }}
              rowGap={{ base: 8, md: 10 }}
              columnGap={4}
              mt={{ base: 10, md: 14 }}
            >
              {skillCategories.map((category, index) => (
                <Reveal key={category.id} direction="up" delay={index * 0.06}>
                  <Box
                    as="button"
                    type="button"
                    aria-label={`${category.label} — ${category.items.length} itens`}
                    onMouseEnter={() => setSelected(index)}
                    onFocus={() => setSelected(index)}
                    onClick={() => setOpenIndex(index)}
                    position="relative"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="100%"
                    h={{ base: '96px', md: '110px' }}
                    bg="transparent"
                    border="none"
                    cursor="pointer"
                    _focusVisible={{ outline: '1px solid', outlineColor: 'white', outlineOffset: '2px' }}
                  >
                    <SelectionGlow on={index === selected} size={130} />
                    <Box
                      position="relative"
                      transition="transform 0.25s ease"
                      transform={index === selected ? 'translateY(-4px) scale(1.06)' : 'none'}
                    >
                      <SaveIcon
                        category={category}
                        icon={icons[index]}
                        size={84}
                        forwardRef={(el) => {
                          tileEls.current[index] = el
                        }}
                        hideGlyph={glyphHidden(`tile-${index}`)}
                      />
                    </Box>
                  </Box>
                </Reveal>
              ))}
            </Box>
          ) : (
            <Box
              key={current.id}
              className="project-panel"
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems={{ base: 'flex-start', md: 'center' }}
              gap={{ base: 6, md: 12 }}
              mt={{ base: 8, md: 12 }}
            >
              <Box position="relative" flexShrink={0} boxSize="200px" display="flex" alignItems="center" justifyContent="center">
                <SelectionGlow on size={240} />
                <SaveIcon
                  category={current}
                  icon={icons[openIndex]}
                  size={170}
                  forwardRef={(el) => {
                    detailEl.current = el
                  }}
                  hideGlyph={glyphHidden('detail')}
                />
              </Box>

              <Box color="white" textShadow="0 1px 2px rgba(0,0,0,0.35)">
                <Text fontSize="15px" color="#e6e6e6" mb={3}>
                  {current.items.length} {current.items.length === 1 ? 'item' : 'itens'}
                </Text>
                <Box as="ul" listStyleType="none" m={0} p={0}>
                  {current.items.map((item, i) => (
                    <Box as="li" key={item} display="flex" alignItems="center" gap={3} fontSize={{ base: 'md', md: '19px' }} lineHeight="1.9">
                      <Box boxSize="10px" flexShrink={0} bg={ITEM_COLORS[i % ITEM_COLORS.length]} boxShadow="0 0 6px rgba(0,0,0,0.35)" />
                      {item}
                    </Box>
                  ))}
                </Box>
                {current.note && (
                  <Text fontSize="14px" color="#dcdcdc" mt={4}>
                    {current.note}
                  </Text>
                )}
                <Box
                  as="button"
                  type="button"
                  onClick={() => setOpenIndex(null)}
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  mt={6}
                  bg="transparent"
                  border="none"
                  p={0}
                  color="white"
                  fontFamily="ps2"
                  fontSize="16px"
                  cursor="pointer"
                  _hover={{ color: '#ffffff' }}
                  _focusVisible={{ outline: '1px solid', outlineColor: 'white', outlineOffset: '4px' }}
                >
                  <ButtonGlyph shape="circle" />
                  Voltar
                </Box>
              </Box>
            </Box>
          )}

          <Text
            position="absolute"
            left={{ base: 5, md: 8 }}
            right={{ base: 5, md: 8 }}
            bottom={3}
            fontSize="11px"
            color="rgba(255,255,255,0.7)"
            lineHeight="1.5"
            zIndex={3}
          >
            Modelos 3D:{' '}
            {modelCredits.map((c, i) => (
              <span key={c.name}>
                {i > 0 && ' · '}
                <Link href={c.href} target="_blank" rel="noreferrer" color="inherit" textDecoration="underline">
                  {c.name}
                </Link>{' '}
                por {c.author} ({c.license})
              </span>
            ))}
          </Text>

          {!stageFailed && (
            <Suspense fallback={null}>
              <ModelStage getSlots={getSlots} onSlotsChange={setReadySlots} onFail={() => setStageFailed(true)} />
            </Suspense>
          )}
        </Box>
      </Reveal>
    </Box>
  )
}
