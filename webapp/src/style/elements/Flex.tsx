import { styled } from '~/style'
import { Box, BoxProps } from './Box'
import { flexBoxType } from './helpers'

type FlexTypes =
  | 'centered-row'
  | 'centered-column'
  | 'start-column'
  | 'start-row'
  | 'end-row'
  | 'end-column'
  | 'centered-start-column'
  | 'centered-start-row'
  | 'centered-between-row'
  | 'centered-end-column'
  | 'centered-end-row'

export interface FlexProps extends BoxProps {
  type?: FlexTypes
}

export const Flex = styled(Box)<FlexProps>(
  {
    display: 'flex'
  },
  flexBoxType
)
