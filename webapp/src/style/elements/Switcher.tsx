import classNames from 'classnames'
import React, { useState, useEffect } from 'react'

import { styled } from '~/style'

import { Box } from './Box'
import { Flex } from './Flex'

export interface SwitcherOption {
  value: string
  label: string
}

export interface SwitcherProps {
  option1: SwitcherOption
  option2: SwitcherOption
  onChange: (value: string) => void
  selected?: SwitcherOption['value']
}

export const Switcher = ({ selected, option1, option2, onChange }: SwitcherProps) => {
  const [selectedOption, changeSelected] = useState(selected || option1.value)
  useEffect(() => {
    if (selected !== selectedOption && !!selected) {
      changeSelected(selected)
    }
  }, [selected, selectedOption])

  const handleChange = () => {
    const value = selectedOption === option1.value ? option2.value : option1.value
    changeSelected(value)
    onChange(value)
  }
  return (
    <Box
      sx={{
        width: '250px',
        height: '48px',
        border: '3px solid',
        borderColor: 'hint',
        borderRadius: '24px',
        position: 'relative',
        '&:hover': {
          borderColor: 'white'
        },
        transition: 'border-color 0.2s ease-in-out'
      }}
    >
      <Flex
        type="start-row"
        sx={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          left: '0px',
          top: '0px',
          zIndex: 2
        }}
        onClick={handleChange}
      >
        <SwitcherOption type="centered-row" className={classNames({ isSelected: option1.value === selectedOption })}>
          {option1.label.toUpperCase()}
        </SwitcherOption>
        <SwitcherOption type="centered-row" className={classNames({ isSelected: option2.value === selectedOption })}>
          {option2.label.toUpperCase()}
        </SwitcherOption>
      </Flex>
      <Box
        sx={{
          position: 'absolute',
          zIndex: 1,
          top: '6px',
          bottom: '6px',
          backgroundColor: 'grey',
          transition: 'all 0.125s ease-in-out',
          borderRadius: '18px',
          width: 'calc(50% - 6px)'
        }}
        style={{
          right: option1.value === selectedOption ? '50%' : '6px'
        }}
      />
    </Box>
  )
}

const SwitcherOption = styled(Flex)`
  transition: color 0.2s ease-in-out;
  height: 100%;
  flex: 1;
  background-color: transparent;
  font-size: 14px;
  cursor: pointer;
  color: ${props => props.theme.colors.hint};
  font-weight: ${props => props.theme.fontWeights.bold};
  user-select: none;
  &.isSelected {
    color: ${props => props.theme.colors.background};
  }
  &:hover:not(.isSelected) {
    color: ${props => props.theme.colors.text};
  }
`
