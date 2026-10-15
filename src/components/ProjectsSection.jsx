import { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import SectionHeading from './SectionHeading'
import ProjectIcon from './ProjectIcon'
import ProjectCard from './ProjectCard'
import { projects } from '../data/projects'
import Reveal from './Reveal'
import './ProjectsSection.css'

export default function ProjectsSection() {
  const [activeId, setActiveId] = useState(projects[0].id)

  return (
    <Box as="section" id="projetos">
        <SectionHeading>projetos</SectionHeading>

        <Reveal direction="up">
          <Flex
            className="project-icon-row"
            gap={4}
            overflowX="auto"
            alignItems="flex-start"
            pt={4}
            pb={20}
            px={10}
          >
            {projects.map((project) => (
              <ProjectIcon
                key={project.id}
                project={project}
                active={project.id === activeId}
                onClick={() => setActiveId(project.id)}
              />
            ))}
          </Flex>

          {/* Every card sits in the same grid cell so the area is always as tall as the
              tallest one; otherwise the vertically-centered section shifts (and the
              icon row jumps) whenever a shorter/longer project is selected. */}
          <Box display="grid">
            {projects.map((project) => {
              const isActive = project.id === activeId
              return (
                <Box
                  key={project.id}
                  gridArea="1 / 1"
                  className={isActive ? 'project-panel' : undefined}
                  visibility={isActive ? 'visible' : 'hidden'}
                  aria-hidden={!isActive}
                >
                  <ProjectCard project={project} reverse={false} />
                </Box>
              )
            })}
          </Box>
        </Reveal>
    </Box>
  )
}
