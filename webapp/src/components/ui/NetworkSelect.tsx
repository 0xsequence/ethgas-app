import * as Popover from '@radix-ui/react-popover';
import React, { useState } from 'react'
import ArrowDown from '~/components/assets/svg/ArrowDown'
import { NetworkInfo } from '~/lib/apiclient'
import { Box, Text } from '~/style'

interface NetworkSelectProps {
  networks: NetworkInfo[]
  onChange: (val:string) => void
  currentNetwork: string
  showDefaultOption?: boolean
}


export const NetworkSelect = (props: NetworkSelectProps) => {
  const { networks, onChange, currentNetwork, showDefaultOption = false } = props
  const [open, setOpen] = useState(false)

  const width = showDefaultOption ? '300px' : '180px'

  return (
    <Popover.Root open={open}
      sx={{
        backgroundColor: 'green'
      }}
    >
      <Popover.Trigger
        data-is-trigger="true"
        asChild
        onClick={() => setOpen(!open)}
        sx={(theme) => {
          return ({
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width,
              padding: '4px 12px',
              backgroundColor: open ? theme?.colors?.secondary : theme?.colors?.background,
              border: `2px solid ${theme?.colors?.secondary}`,
              '&:hover': {
                cursor: 'pointer',
                backgroundColor: theme?.colors?.secondary
              },
              borderRadius: '10px',
              'svg': {
                height: '20px',
                width: '20px',
                fill: 'white',
                transform: open ? 'rotate(180deg)' : '',
                transition: '0.3s',
              },
            })
          }
        }
      >
        <Box>
          <Text sx={{ userSelect: 'none' }}>{showDefaultOption ? 'Select a network...' : currentNetwork}</Text><ArrowDown />
        </Box>
      </Popover.Trigger>
      <Popover.Content
        asChild
        side="bottom"
        onPointerDownOutside={(e) => {
          // @ts-ignore-next-line
          let isTrigger = e?.target?.dataset?.isTrigger
          // @ts-ignore-next-line
          e?.path?.forEach(element => {
            if (element?.dataset?.isTrigger) {
              isTrigger = true
            }
          })

          if(!isTrigger) {
            setOpen(false)
          }
        }}
        sx={{
          zIndex: 999,
          outline: 'none',
          backgroundColor: 'transparent'
        }}
      >
        <Box>
          {networks.map((network) => {
            return (
              <Box
                key={network.handle}
                sx={(theme) => ({
                  width,
                  zIndex: 999,
                  marginTop: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justiftyContent: 'center',
                  color: 'white',
                  backgroundColor: theme?.colors?.background,
                  padding: '4px 12px',
                  border: `2px solid ${theme?.colors?.secondary}`,
                  '&:hover': {
                    cursor: 'pointer',
                    backgroundColor: theme?.colors?.secondary
                  },
                  borderRadius: '10px'
                })}
                onClick={() => {
                  setOpen(false)
                  onChange(network.handle)
                }}
              >
                <Text sx={{ width: '100%', textAlign: 'left', userSelect: 'none' }}>
                  {network.title}
                </Text>
              </Box>
            )
          })
        }
        </Box>
      </Popover.Content>
    </Popover.Root>
  )

  // Note: using the select leaves the option's styling up to the browser
  // and cannot be styled using css
  // return (
  //   <Select
  //     onChange={(e) => onChange(e.target.value)}
  //     value={currentNetwork}
  //     sx={{
  //       color: 'white',
  //       fontSize: 2 ,
  //       fontWeight:'heading',
  //       width: 'fit-content',
  //       pr: '30px'
  //     }}
  //   >
  //     {showDefaultOption && (
  //       <option
  //         style={{
  //           color: 'black',
  //           backgroundColor: 'background'
  //         }}
  //       >
  //         Select a network...
  //       </option>
  //     )}
  //     {networks.map((network) => {
  //       return (
  //         <option
  //           value={network.handle}
  //         >
  //           {network.title}
  //         </option>
  //       )
  //     })}
  //   </Select>
  // )
}
