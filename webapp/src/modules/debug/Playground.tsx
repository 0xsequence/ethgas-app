import React from 'react'
import { Box, Button, Container, Flex } from '~/style'

export const Playground = () => {
  return (
    <Container>
      <Flex
        type="start-column"
        sx={{
          border: '1px solid red',
          // set this to `minHeight: '100vh'` for full viewport height
          minHeight: 256
        }}
      >
        <Box
          sx={{
            width: '100%'
          }}
        >
          Header
        </Box>
        <Box sx={{ width: '100%', flex: '1 1 auto' }}>Main</Box>
        <Box
          sx={{
            width: '100%'
          }}
        >
          Footer
        </Box>
      </Flex>

      <Box sx={{ '*': { border: '1px solid red' } }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap'
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              flexBasis: 'sidebar'
            }}
          >
            Sidebar
          </Box>
          <Box
            sx={{
              flexGrow: 99999,
              flexBasis: 0,
              minWidth: 320
            }}
          >
            Main
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
