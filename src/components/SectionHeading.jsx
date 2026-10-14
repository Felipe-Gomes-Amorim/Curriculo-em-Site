import { Heading } from '@chakra-ui/react'
import Reveal from './Reveal'

export default function SectionHeading({ children, ...props }) {
  return (
    <Reveal direction="up">
      <Heading
        as="h2"
        fontFamily="heading"
        fontWeight="600"
        fontSize={{ base: 'xl', md: '2xl' }}
        color="accent"
        textShadow="0 0 12px #39ff8866"
        mb={6}
        {...props}
      >
        <Heading as="span" fontFamily="heading" color="muted" fontSize="inherit" mr={2}>
          &gt;
        </Heading>
        {children}
      </Heading>
    </Reveal>
  )
}
