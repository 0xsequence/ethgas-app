import React, { forwardRef } from 'react'
import { useHistory } from 'react-router-dom'
import { Button as _Button, ButtonProps as _ButtonProps } from 'theme-ui'

export type ButtonLook = 'none' | 'fancy'

export interface ButtonProps extends _ButtonProps {
  to?: string
  look?: ButtonLook
}

export const Button = ({ sx, look = 'fancy', to, onClick, ...props }: ButtonProps) => {
  const history = useHistory()

  if (!onClick && to) {
    onClick = () => history.push(to)
  }

  let style: any = {
    fontSize: '13px',
    borderRadius: '6px',
    boxShadow: '0px 0px 3px primary',
    fontFamily: 'body',
    height: '48px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...sx
  }

  switch (look) {
    case 'fancy':
      style = {
        transition: 'all 0.2s linear',
        '&:hover': {
          color: 'primary'
        },
        ...style
      }
      break
    default:
  }

  return <_Button sx={style} onClick={onClick} {...props} />
}
