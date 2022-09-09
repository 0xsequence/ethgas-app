import React from 'react'
import { NetworkInfo } from '~/lib/apiclient'
import { Select } from '~/style'

interface NetworkSelectProps {
  networks: NetworkInfo[]
  onChange: (val:string) => void
  currentNetwork: string
  showDefaultOption?: boolean
}

export const NetworkSelect = (props: NetworkSelectProps) => {
  const { networks, onChange, currentNetwork, showDefaultOption = false } = props

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
      {showDefaultOption && (
        <option
          style={{
            color: 'black',
            backgroundColor: 'background'
          }}
        >
          Select a network...
        </option>
      )}
      {networks.map((network) => {
        return (
          <option
            style={{
              color: 'black',
              backgroundColor: 'background'
            }}
            value={network.handle}
          >
            {network.title}
          </option>
        )
      })}
    </Select>
  )
}