import { Box, Text } from '@chakra-ui/react'

// Right-hand navigation modeled on the PS2 BIOS "Version Information" screen:
// yellow screen title, rows of right-aligned labels with a left-aligned value
// column, the selected row in light blue (value in white), everything else dim gray.
export default function SystemMenu({ title, items, activeId, onSelect }) {
  return (
    <Box as="nav" aria-label={title} fontFamily="ps2" w="100%">
      <Text
        color="ps2Yellow"
        fontSize={{ base: 'lg', md: '22px', lg: '24px' }}
        fontWeight="500"
        textShadow="0 0 8px rgba(203, 210, 46, 0.35)"
        textAlign={{ base: 'left', md: 'right' }}
        pr={{ md: '8.5rem' }}
        mb={{ base: 2, md: 8 }}
      >
        {title}
      </Text>

      <Box
        as="ul"
        listStyleType="none"
        m={0}
        p={0}
        display="flex"
        flexDirection={{ base: 'row', md: 'column' }}
        gap={{ base: 5, md: 2 }}
        overflowX={{ base: 'auto', md: 'visible' }}
        pb={{ base: 2, md: 0 }}
      >
        {items.map((item) => {
          const selected = item.id === activeId
          return (
            <Box as="li" key={item.id} flexShrink={0}>
              <Box
                as="button"
                type="button"
                onClick={() => onSelect(item.id)}
                aria-current={selected ? 'page' : undefined}
                display="grid"
                gridTemplateColumns={{ base: 'auto', md: 'minmax(0, 1fr) 7.5rem' }}
                columnGap={6}
                alignItems="baseline"
                w="100%"
                bg="transparent"
                border="none"
                p={0}
                cursor="pointer"
                fontFamily="ps2"
                fontSize={{ base: 'md', md: '20px', lg: '22px' }}
                lineHeight="1.6"
                color={selected ? 'ps2Blue' : 'ps2Gray'}
                textShadow={selected ? '0 0 10px rgba(73, 193, 237, 0.55)' : 'none'}
                transition="color 0.2s ease, text-shadow 0.2s ease"
                _hover={{ color: selected ? 'ps2Blue' : '#9a9a9a' }}
                _focusVisible={{ outline: '1px solid', outlineColor: 'ps2Blue', outlineOffset: '4px' }}
              >
                <Text as="span" textAlign={{ base: 'left', md: 'right' }} whiteSpace="nowrap">
                  {item.label}
                </Text>
                <Text
                  as="span"
                  display={{ base: 'none', md: 'block' }}
                  textAlign="left"
                  whiteSpace="nowrap"
                  color={selected ? 'ps2White' : 'ps2Gray'}
                  textShadow="none"
                >
                  {item.value}
                </Text>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
