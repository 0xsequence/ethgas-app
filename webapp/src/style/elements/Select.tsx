import React from 'react'
import { Select as _Select, SelectProps as _SelectProps } from 'theme-ui'
import { styled } from '~/style'

export interface SelectProps extends _SelectProps {

}

// Note: the hover color and background color cannot always be changed since
// it is handled by the browser
export const Select = (props:SelectProps) => {
  const { sx }  = props

  const styles: any = {
    'option': {
      color: 'white',
      backgroundColor: 'background',
    },
    ...sx
  }

  // @ts-ignore
  return <_Select {...props} sx={styles} />
}
