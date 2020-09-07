import React from 'react'
import { Box, Button, Styled } from '~/style'

export const Typography = () => {
  return (
    <Box>
      <Box flex={0.25} ml={4}>
        <Button to="/_debug">Back</Button>
      </Box>
      <Styled.h1>H1 - Montserrat, Bold, 30pt</Styled.h1>
      <Styled.h2>H2 - Montserrat, Bold, 24pt</Styled.h2>
      <Styled.h3>H3 - Montserrat, Bold, 20pt</Styled.h3>
      <Styled.p>Body Large - Montserrat, Regular, 18pt</Styled.p>
    </Box>
  )
}
