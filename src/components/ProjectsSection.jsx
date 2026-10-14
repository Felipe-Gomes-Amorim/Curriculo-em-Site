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

  const activeProject = projects.find((p) => p.id === activeId) ?? null

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

          {activeProject && (
            <Box key={activeProject.id} className="project-panel">
              <ProjectCard project={activeProject} reverse={false} />
            </Box>
          )}
        </Reveal>
    </Box>
  )
}
