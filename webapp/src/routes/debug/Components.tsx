// import Loading from '#/layout/Loading'
import React from 'react'
import { Box, Button, Flex, styled, Text } from '~/style'

export const Components = () => {
  return (
    <Box>
      <Box flex={0.25} ml={4}>
        <Button to="/_debug">Back</Button>
      </Box>

      <Flex>
        <Flex
          flex={1}
          sx={{
            justifyContent: 'center',
            borderBottom: '1px solid black'
          }}
        >
          <Box sx={{ fontWeight: 'bold', fontSize: 2 }}>Components</Box>
        </Flex>

        <Box flex={0.25} mr={4}></Box>
      </Flex>

      <Flex
        flex={1}
        p={20}
        sx={{
          width: ['100%', '80%', '75%'],
          flexWrap: 'wrap',
          // flex: '1 0 auto',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          m: 'auto'
        }}
      >
        <GridBox>
          {/* <Loading fullscreen={true} /> */}
        </GridBox>
      </Flex>
    </Box>
  )
}

const GridBox = styled(Box)`
  /* display: flex;
  flex: 1 0 auto;
  flex-direction: 'row'; */
  display: flex;
  border: 1px solid #333333;
  min-width: 300px;

  margin: 20px;
  padding: 20px;
  text-align: center;
  justify-content: center;
  align-items: center;
`
