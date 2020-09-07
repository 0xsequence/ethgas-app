import React from 'react'
import { backgroundColor } from 'styled-system'
import { Styled, Box, Flex, Text } from '~/style'
import { BarChart, barData } from './BarChart'
import { LineChart } from './LineChart'
import { Switcher } from '~/style'
import { useStore, DataStore } from '~/stores'

export const HomeRoute = () => {
  const dataStore = useStore<DataStore>('data') //, null)

  return (
    <Box
      sx={{
        // '*': { border: '1px dashed #ccc' }
        pt: 4,
        px: [0, 0, 5],
    }}>

      <Box sx={{
        color: 'white',
        fontSize: 4,
        fontWeight:'heading',
        textAlign: 'center',
        py: 4
      }}>
        Ethereum Gas Price Tracker
      </Box>

      <Flex type='centered-row' sx={{ mt: 2, mb: 3 }}>
        <Switcher option1={{value: '1', label: "Suggested"}} option2={{value: '2', label: "Actual"}} onChange={() => {}} />
      </Flex>

      <Flex type='centered-row' sx={{
        flexWrap: 'nowrap'
      }}>
        <GasStat label={"Fast"} gasPrice={dataStore.suggestedFast.get()} usdPrice={'0.25'} bgColor={'red'} />
        <GasStat label={"Standard"} gasPrice={dataStore.suggestedStandard.get()} usdPrice={'0.10'} bgColor={'green'} />
        <GasStat label={"Slow"} gasPrice={dataStore.suggestedSlow.get()} usdPrice={'0.05'} bgColor={'yellow'} />
      </Flex>

      <Box sx={{
        textAlign: 'center',
        pt: 4,
        mx: 'auto',
        // width: '80%',
        height: '400px'
      }}>
        <LineChart data={dataStore.suggestedDataset} />
      </Box>

      {/* <Box sx={{
        mt: 5,
        mx: 5,
        backgroundColor: '#222',
        borderRadius: '15px',
        color: 'white',
        p: 3,
        textAlign: 'center',
        fontSize: 2
      }}>
        <Styled.h3>API</Styled.h3>
        hello
      </Box> */}

      {/* FOOTER */}
      <Box sx={{
        mx: 'auto',
        mt: 4,
        mb: 1,
        py: 3,
        width: ['80%', '80%', '600px'],
        borderTop: '2px dotted #666',
        fontSize: 12,
        textAlign: 'center'
      }}>
        Fork it <Styled.a href="https://github.com">github.com/arcadeum/ethgas-app</Styled.a>,
        by <Styled.a href="">Horizon.io</Styled.a>
      </Box>

    </Box>
  )
}

const GasStat = ({
  label,
  gasPrice,
  usdPrice,
  bgColor
}: {
  label: string,
  gasPrice: number,
  usdPrice?: string,
  bgColor: string,
}) => {
  return (
    <Box
      sx={{
        width: '300px',
        border: '2px solid #666',
        borderRadius: '10px',
        backgroundColor: bgColor,
        m: 2,
        p: 3,
        textAlign: 'center',
        verticalAlign: 'middle',
      }}
    >
      <Box sx={{
        color: 'background', fontWeight: 'bold', fontSize: [2, 2, 4, 4]
      }}>
        {label}
      </Box>

      <Box sx={{
        color: 'white', fontWeight: 'heading', fontSize: [3, 3, 5, 5]
      }}>
        {gasPrice} <Text sx={{ color: '#fff', fontSize: '10px', lineHeight: '0', pb: '10px' }}>Gwei</Text>
      </Box>
    </Box>
  )
}

// const TabBar = () => {
//   return (
//     <Flex type='centered-row' sx={{
//       // mx: 'auto',
//       mt: 4,
//       mb: 0,
//       color: 'black',
//       borderRadius: '20px',
//       border: '2px solid #ff',
//       fontSize: 1,
//       fontWeight: 'bold',
//       // backgroundColor: '#E5E5E5',
//     }}>
//       {/* <Box sx={{
//         backgroundColor: '#E5E5E5',
//         borderRadius: '24px',
//         border: '2px solid #fff',
//         p: '8px',
//         // flexShrink: 1,
//         // width: '300px'
//         fontSize: 1,
//         fontWeight: 'bold',
//       }}> */}
//         <Box sx={{
//           // width: '120px'
//           px: 2,
//           py: 2,
//           flexBasis: '175px',
//           // border: '1px solid red',
//           borderRadius: '20px',
//           textAlign: 'center',
//           backgroundColor: '#666',
//           color: 'white',
//           zIndex: 100
//         }}>Suggested</Box>

//         <Box sx={{
//           // width: '1200px'
//           px: 2,
//           py: 2,
//           flexBasis: '175px',
//           // border: '1px solid red',
//           borderRadius: '20px',
//           textAlign: 'center',
//           ml: '-40px',
//           backgroundColor: '#E5E5E5'
//         }}>Actual</Box>

//       {/* </Box> */}

//     </Flex>
//   )
// }
