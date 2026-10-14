import { useCallback, useEffect, useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'
import Hero from '../components/Hero'
import About from '../components/About'
import Experience, { entries as experienceEntries } from '../components/Experience'
import ProjectsSection from '../components/ProjectsSection'
import Skills from '../components/Skills'
import Contact, { contactLinks } from '../components/Contact'
import ScreenTexture from '../components/ScreenTexture'
import SystemMenu from '../components/ps2/SystemMenu'
import ButtonHints from '../components/ps2/ButtonHints'
import { projects } from '../data/projects'
import { skillCategories } from '../data/skills'

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

// One "compartment" per entry, shown one at a time. `value` fills the right-hand
// column of the PS2-style menu, like the version numbers on the BIOS screen.
const SECTIONS = [
  { id: 'inicio', label: 'Início', value: 'perfil', Component: Hero },
  { id: 'sobre', label: 'Sobre', value: 'sobre.txt', Component: About },
  { id: 'experiencia', label: 'Experiência', value: plural(experienceEntries.length, 'item', 'itens'), Component: Experience },
  { id: 'projetos', label: 'Projetos', value: plural(projects.length, 'projeto', 'projetos'), Component: ProjectsSection },
  { id: 'skills', label: 'Skills', value: plural(skillCategories.length, 'save', 'saves'), Component: Skills },
  { id: 'contato', label: 'Contato', value: plural(contactLinks.length, 'canal', 'canais'), Component: Contact },
]

const sectionFromHash = () => {
  const id = window.location.hash.slice(1)
  return SECTIONS.some((s) => s.id === id) ? id : SECTIONS[0].id
}

const isTyping = (el) => el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))

export default function Home() {
  const [activeId, setActiveId] = useState(sectionFromHash)
  const historyRef = useRef([])
  // A section can claim ○ Voltar for itself (Skills does while a save is open).
  const backInterceptRef = useRef(null)
  const registerBack = useCallback((fn) => {
    backInterceptRef.current = fn
  }, [])

  const select = useCallback(
    (id) => {
      if (id === activeId) return
      historyRef.current.push(activeId)
      backInterceptRef.current = null
      setActiveId(id)
    },
    [activeId]
  )

  const goBack = useCallback(() => {
    if (backInterceptRef.current) {
      backInterceptRef.current()
      return
    }
    const previous = historyRef.current.pop()
    if (previous) setActiveId(previous)
    else if (activeId !== SECTIONS[0].id) setActiveId(SECTIONS[0].id)
  }, [activeId])

  // Keep the URL shareable (#projetos opens straight to Projetos) without stacking
  // browser history entries for every menu move.
  useEffect(() => {
    window.history.replaceState(null, '', `#${activeId}`)
  }, [activeId])

  // A hash typed into the address bar (or an in-page #link) on an already-loaded page
  // only fires hashchange, not a reload. replaceState above never fires it, so no loop.
  useEffect(() => {
    const onHash = () => select(sectionFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [select])

  // The left panel isn't remounted between sections (only its content is), so its
  // scroll position would otherwise carry over from the previous section.
  const mainRef = useRef(null)
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
    window.scrollTo({ top: 0 })
  }, [activeId])

  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || isTyping(e.target)) return
      const index = SECTIONS.findIndex((s) => s.id === activeId)
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const step = e.key === 'ArrowDown' ? 1 : -1
        select(SECTIONS[(index + step + SECTIONS.length) % SECTIONS.length].id)
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault()
        goBack()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeId, select, goBack])

  const active = SECTIONS.find((s) => s.id === activeId)
  const ActiveSection = active.Component

  return (
    <Box color="#d7ded9">
      <ScreenTexture />

      <Box
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        h={{ md: '100vh' }}
        minH={{ base: '100vh', md: 0 }}
      >
        {/* Left: the selected compartment. Scrolls on its own if taller than the
            screen; `my="auto"` on the inner box centers short sections vertically
            without the top-clipping that justify-content: center causes on overflow. */}
        <Box
          as="main"
          ref={mainRef}
          order={{ base: 2, md: 1 }}
          flex="1"
          minW={0}
          overflowY={{ md: 'auto' }}
          display="flex"
          flexDirection="column"
          px={{ base: 5, md: 12, lg: 20 }}
          py={{ base: 8, md: 12 }}
        >
          {/* `contain: layout` keeps things that only *paint* past this box (Reveal's
              entrance offset, the project card's glow bleed) from counting as
              scrollable overflow — otherwise the panel's scrollbar flashed in and out
              while a section animated in. Real content height still scrolls normally. */}
          <Box
            key={activeId}
            my={{ base: 0, md: 'auto' }}
            w="100%"
            maxW="960px"
            style={{ contain: 'layout' }}
          >
            <ActiveSection registerBack={registerBack} />
          </Box>
        </Box>

        {/* Right: PS2 BIOS-style menu. A soft dark falloff keeps it readable over
            the nebula, the way the BIOS menus sit on near-black. */}
        <Box
          order={{ base: 1, md: 2 }}
          w={{ base: '100%', md: '360px', lg: '420px' }}
          flexShrink={0}
          display="flex"
          alignItems="center"
          px={{ base: 5, md: 10, lg: 14 }}
          pt={{ base: 6, md: 0 }}
          pb={{ base: 2, md: 0 }}
          bg={{
            base: 'linear-gradient(to bottom, rgba(5,6,7,0.75), rgba(5,6,7,0))',
            md: 'linear-gradient(to left, rgba(5,6,7,0.7), rgba(5,6,7,0))',
          }}
        >
          <SystemMenu title="Navegação" items={SECTIONS} activeId={activeId} onSelect={select} />
        </Box>
      </Box>

      <ButtonHints onBack={goBack} />
    </Box>
  )
}
