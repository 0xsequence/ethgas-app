import React from 'react'
import { NetworkInfo } from '~/lib/apiclient'
import { Box, Text, Select } from '~/style'

interface NetworkSelectProps {
  networks: NetworkInfo[]
  onChange: (val:string) => void
  currentNetwork: string
}

export const NetworkSelect = (props: NetworkSelectProps) => {
  const { networks, onChange, currentNetwork } = props

  return (
    <Select
      onChange={(e) => onChange(e.target.value)}
      value={currentNetwork}
      sx={{
        color: 'white',
        fontSize: 2 ,
        fontWeight:'heading',
        width: 'fit-content',
        pr: '30px'
      }}
    >
      {networks.map((network) => {
        return (
          <option
            style={{
              color: 'black',
              backgroundColor: 'background'
            }}
            value={network.handle}
            // label={network.title}
          >{network.title}</option>
        )
      })}
    </Select>
  )
}