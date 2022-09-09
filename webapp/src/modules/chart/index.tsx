import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Spinner } from 'theme-ui'

import { NetworkSelect } from '~/components/ui/NetworkSelect'
import { SAVED_NETWORK_HANDLE } from '~/constants/localStorageKeys'
import { useStore, DataStore, RouterStore, useObservable } from '~/stores'
import { DataMode } from '~/stores/DataStore'
import { Styled, Box, Flex, Text, Switcher } from '~/style'

import { LineChart } from './LineChart'

export const ChartRoute = () => {
  const dataStore = useStore<DataStore>('data')
  const routerStore = useStore<RouterStore>('router')
  const networks = useObservable(dataStore.networks)
  const network = useObservable(dataStore.network)
  const networkTitle = useObservable(dataStore.networkTitle)
  const suggestedDatasetLoading = useObservable(dataStore.suggestedDatasetLoading)
  const actualDatasetLoading = useObservable(dataStore.actualDatasetLoading)
  const apiError = useObservable(dataStore.apiError)
  const { networkId } = useParams<{ networkId: string }>()

  const loading = suggestedDatasetLoading || actualDatasetLoading

  const currentSupportedNetwork = networks && networks.find(network => network.handle === networkId)

  useEffect(() => {
    dataStore.fetchNetworks()
  }, [])

  useEffect(() => {
    if (currentSupportedNetwork) {
      localStorage.setItem(SAVED_NETWORK_HANDLE, currentSupportedNetwork.handle)
      dataStore.setNetwork(currentSupportedNetwork.handle, currentSupportedNetwork.title)
    }
  }, [networks, networkId])

  if (!networks) {
    return null
  }

  if (apiError) {
    return (
      <Box
        sx={{
          pt: 4,
          px: [0, 0, 5]
        }}
      >
        <Box
          sx={{
            color: 'white',
            fontSize: 4,
            fontWeight: 'heading',
            textAlign: 'center',
            pt: [1, 1, 4],
            pb: [2, 2, 4]
          }}
        >
          An error occurred while fetching the data 😭
          <br />
          Please select a network and try again
        </Box>
        <Box
          sx={{
            color: 'white',
            fontSize: 4,
            fontWeight: 'heading',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <NetworkSelect
            onChange={selectNetwork => {
              dataStore.resetChart()
              routerStore.push(selectNetwork)
            }}
            currentNetwork={''}
            networks={networks}
            showDefaultOption
          />
        </Box>
      </Box>
    )
  }

  if (!currentSupportedNetwork) {
    return (
      <Box
        sx={{
          pt: 4,
          px: [0, 0, 5]
        }}
      >
        <Box
          sx={{
            color: 'white',
            fontSize: 4,
            fontWeight: 'heading',
            textAlign: 'center',
            pt: [1, 1, 4],
            pb: [2, 2, 4]
          }}
        >
          {`The network "${networkId}" is invalid 😭`}
          <br />
          Please select a network from the options below
        </Box>
        <Box
          sx={{
            color: 'white',
            fontSize: 4,
            fontWeight: 'heading',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <NetworkSelect
            onChange={selectNetwork => {
              dataStore.resetChart()
              routerStore.push(selectNetwork)
            }}
            currentNetwork={''}
            networks={networks}
            showDefaultOption
          />
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        // '*': { border: '1px dashed #ccc' }
        pt: 4,
        px: [0, 0, 5]
      }}
    >
      <Box
        sx={{
          color: 'white',
          fontSize: 4,
          fontWeight: 'heading',
          textAlign: 'center',
          pt: [1, 1, 4],
          pb: [2, 2, 4],
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}
      >
        <Text sx={{ margin: 'auto 0' }}>Gas Price Gauge &nbsp;</Text>
        <Box
          sx={{
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ml: '5px',
            mb: '-6px'
          }}
        >
          <NetworkSelect
            onChange={selectNetwork => {
              routerStore.push(selectNetwork)
            }}
            currentNetwork={networkTitle}
            networks={networks.filter(net => net.handle !== network)}
          />
        </Box>
      </Box>

      <Flex type="centered-row" sx={{ mt: 2, mb: 3 }}>
        <Switcher
          option1={{ value: DataMode.SUGGESTED, label: 'Suggested' }}
          option2={{ value: DataMode.ACTUAL, label: 'Actual' }}
          onChange={(v: DataMode) => dataStore.mode.set(v)}
        />
      </Flex>

      <Flex
        type="centered-row"
        sx={{
          flexWrap: 'nowrap',
          m: 1
        }}
      >
        {dataStore.mode.get() === DataMode.SUGGESTED && (
          <>
            <GasStat label={'Fast'} gasPrice={dataStore.suggestedFast.get()} bgColor={'red'} loading={loading} />
            <GasStat label={'Standard'} gasPrice={dataStore.suggestedStandard.get()} bgColor={'green'} loading={loading} />
            <GasStat label={'Slow'} gasPrice={dataStore.suggestedSlow.get()} bgColor={'yellow'} loading={loading} />
          </>
        )}

        {dataStore.mode.get() === DataMode.ACTUAL && (
          <>
            <GasStat label={'Max'} gasPrice={dataStore.actualMax.get()} bgColor={'red'} loading={loading} />
            <GasStat label={'Average'} gasPrice={dataStore.actualAverage.get()} bgColor={'green'} loading={loading} />
            <GasStat label={'Min'} gasPrice={dataStore.actualMin.get()} bgColor={'yellow'} loading={loading} />
          </>
        )}
      </Flex>

      <Box
        sx={{
          textAlign: 'center',
          pt: 4,
          mx: 'auto',
          // width: '80%',
          height: '400px'
        }}
      >
        <LineChart mode={dataStore.mode.get()} data={dataStore.chartData()} />
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
      <Box
        sx={{
          mx: 'auto',
          mt: 4,
          mb: 1,
          py: 3,
          width: ['80%', '80%', '600px'],
          borderTop: '2px dotted #666',
          fontSize: 12,
          textAlign: 'center'
        }}
      >
        Fork it{' '}
        <Styled.a target="_blank" href="https://github.com/0xsequence/ethgas-app">
          github.com/0xsequence/ethgas-app
        </Styled.a>
        , built on{' '}
        <Styled.a target="_blank" href="https://sequence.xyz/">
          Sequence
        </Styled.a>
      </Box>
    </Box>
  )
}

const GasStat = ({
  label,
  gasPrice,
  usdPrice,
  bgColor,
  loading
}: {
  label: string
  gasPrice: number
  usdPrice?: string
  bgColor: string
  loading: boolean
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: ['100px', '100px', '130px'],
        width: '300px',
        border: '2px solid #666',
        borderRadius: '10px',
        backgroundColor: bgColor,
        m: [1, 1, 2],
        p: [1, 1, 3],
        // m: 2,
        // p: 3,
        textAlign: 'center',
        verticalAlign: 'middle'
      }}
    >
      <Box
        sx={{
          color: 'background',
          fontWeight: 'bold',
          fontSize: [2, 2, 4, 4]
        }}
      >
        {label}
      </Box>

      <Box
        sx={{
          color: 'white',
          fontWeight: 'heading',
          fontSize: [3, 3, 5, 5]
        }}
      >
        {loading ? (
          <Spinner sx={{ mt: '5px' }} size={42} />
        ) : (
          <>
            {gasPrice} <Text sx={{ color: '#fff', fontSize: '10px', lineHeight: '0', pb: '10px' }}>Gwei</Text>
          </>
        )}
      </Box>
    </Box>
  )
}
