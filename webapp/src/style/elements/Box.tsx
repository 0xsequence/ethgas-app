import { display, DisplayProps, flex, FlexboxProps, position, PositionProps } from 'styled-system'
import { Box as _Box, BoxProps as _BoxProps } from 'theme-ui'

import { styled } from '~/style'

export interface BoxProps extends _BoxProps, DisplayProps, FlexboxProps, PositionProps {
  className?: string
  center?: boolean
}

export const Box = styled(_Box)<BoxProps>(display, flex, position)
