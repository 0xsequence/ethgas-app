import { SuggestedGasPrice, GasStat, NetworkInfo } from '~/lib/apiclient'
import { RootStore, observable } from '~/stores'

export enum DataMode {
  SUGGESTED = 'SUGGESTED',
  ACTUAL = 'ACTUAL'
}

export const MaxNumDataPoints = 70

export class DataStore {
  networks = observable<Array<NetworkInfo> | null>(null)

  network = observable('mainnet')
  networkTitle = observable('Ethereum')
  networkToken = observable('ETH')

  suggestedDatasetLoading = observable(true)
  actualDatasetLoading = observable(true)

  apiError = observable(false)

  mode = observable<DataMode>(DataMode.SUGGESTED)

  suggestedFast = observable<number>(0)
  suggestedStandard = observable<number>(0)
  suggestedSlow = observable<number>(0)

  suggestedDataset: any[] = [
    { id: 'slow', data: [] },
    { id: 'standard', data: [] },
    { id: 'fast', data: [] }
  ]

  actualMax = observable<number>(0)
  actualAverage = observable<number>(0)
  actualMin = observable<number>(0)

  actualDataset: any[] = [
    { id: 'min', data: [] },
    { id: 'average', data: [] },
    { id: 'max', data: [] }
  ]

  lastSuggestedPoll: number = 0
  lastActualPoll: number = 0
  updated = observable<number>(0)

  constructor(private root: RootStore) {
    const poll = () => {
      this.pollSuggested()
      this.pollActual()

      // will trigger a re-render as it updates the set value
      this.updated.set(this.lastSuggestedPoll)
    }

    poll()
    setInterval(() => poll(), 1500)
  }

  async pollSuggested() {
    try {
      const network = this.network.get()
      const api = this.root.api

      let count = MaxNumDataPoints
      if (this.lastSuggestedPoll > 0) {
        count = 5
      }

      const { suggestedGasPrices } = await api.allSuggestedGasPrices({ network: this.network.get(), count: count })

      if (suggestedGasPrices.length === 0 || network !== this.network.get()) {
        return
      }
      const suggestedGasPrice = suggestedGasPrices[suggestedGasPrices.length - 1]
      if (this.lastSuggestedPoll > 0 && this.lastSuggestedPoll === suggestedGasPrice.blockNum) {
        return
      }

      const blockNum = suggestedGasPrice.blockNum
      this.lastSuggestedPoll = blockNum

      this.suggestedFast.set(suggestedGasPrice.fast)
      this.suggestedStandard.set(suggestedGasPrice.standard)
      this.suggestedSlow.set(suggestedGasPrice.slow)

      this.updateSuggestedDataset(suggestedGasPrices)
      this.suggestedDatasetLoading.set(false)
    } catch (e) {
      console.error('An error occurred while fetching the suggested dataset')
      this.apiError.set(true)
    }
  }

  async pollActual() {
    try {
      const network = this.network.get()
      const api = this.root.api

      let count = MaxNumDataPoints
      if (this.lastActualPoll > 0) {
        count = 5
      }

      const { gasStats } = await api.allGasStats({ network: this.network.get(), count: count })

      if (gasStats.length === 0 || network !== this.network.get()) {
        return
      }
      const gasStat = gasStats[gasStats.length - 1]
      if (this.lastActualPoll > 0 && this.lastActualPoll === gasStat.blockNum) {
        return
      }

      const blockNum = gasStat.blockNum
      this.lastActualPoll = blockNum

      this.actualMax.set(gasStat.max)
      this.actualAverage.set(gasStat.average)
      this.actualMin.set(gasStat.min)

      this.updateActualDataset(gasStats)
      this.actualDatasetLoading.set(false)
    } catch (e) {
      console.log('An error occurrred while fetching the actual dataset')
      this.apiError.set(true)
    }
  }

  updateSuggestedDataset(data: SuggestedGasPrice[]) {
    const pushDataset = (set: SuggestedGasPrice[]) => {
      for (let i = 0; i < set.length; i++) {
        const blockNum = set[i].blockNum
        this.suggestedDataset[0].data.push({
          x: `${blockNum}`,
          y: `${set[i].slow}`
        })
        this.suggestedDataset[1].data.push({
          x: `${blockNum}`,
          y: `${set[i].standard}`
        })
        this.suggestedDataset[2].data.push({
          x: `${blockNum}`,
          y: `${set[i].fast}`
        })
      }
    }

    const len = this.suggestedDataset[0].data.length

    if (len === 0) {
      // Fresh dataset
      pushDataset(data)
    } else {
      // Existing dataset
      const lastBlockNum = parseInt(this.suggestedDataset[0].data[len - 1].x)

      let idx = -1
      for (let i = 0; i < data.length; i++) {
        if (idx < 0 && data[i].blockNum > lastBlockNum) {
          idx = i
          break
        }
      }

      if (idx >= 0) {
        pushDataset(data.splice(idx))
      }
    }

    // truncate to max set
    if (this.suggestedDataset[0].data.length > MaxNumDataPoints) {
      this.suggestedDataset[0].data.splice(0, Math.abs(MaxNumDataPoints - this.suggestedDataset[0].data.length))
      this.suggestedDataset[1].data.splice(0, Math.abs(MaxNumDataPoints - this.suggestedDataset[1].data.length))
      this.suggestedDataset[2].data.splice(0, Math.abs(MaxNumDataPoints - this.suggestedDataset[2].data.length))
    }

    // will trigger a re-render as it updates the set value
    // const lastBlockNum = parseInt(this.suggestedDataset[0].data[this.suggestedDataset[0].data.length-1].x)
    // this.updated.set(lastBlockNum)
  }

  updateActualDataset(data: GasStat[]) {
    const pushDataset = (set: GasStat[]) => {
      for (let i = 0; i < set.length; i++) {
        const blockNum = set[i].blockNum
        this.actualDataset[0].data.push({
          x: `${blockNum}`,
          y: `${set[i].min}`
        })
        this.actualDataset[1].data.push({
          x: `${blockNum}`,
          y: `${set[i].average}`
        })
        this.actualDataset[2].data.push({
          x: `${blockNum}`,
          y: `${set[i].max}`
        })
      }
    }

    const len = this.actualDataset[0].data.length

    if (len === 0) {
      // Fresh dataset
      pushDataset(data)
    } else {
      // Existing dataset
      const lastBlockNum = parseInt(this.actualDataset[0].data[len - 1].x)

      let idx = -1
      for (let i = 0; i < data.length; i++) {
        if (idx < 0 && data[i].blockNum > lastBlockNum) {
          idx = i
          break
        }
      }

      if (idx >= 0) {
        pushDataset(data.splice(idx))
      }
    }

    // truncate to max set
    if (this.actualDataset[0].data.length > MaxNumDataPoints) {
      this.actualDataset[0].data.splice(0, Math.abs(MaxNumDataPoints - this.actualDataset[0].data.length))
      this.actualDataset[1].data.splice(0, Math.abs(MaxNumDataPoints - this.actualDataset[1].data.length))
      this.actualDataset[2].data.splice(0, Math.abs(MaxNumDataPoints - this.actualDataset[2].data.length))
    }

    // will trigger a re-render as it updates the set value
    // const lastBlockNum = parseInt(this.actualDataset[0].data[this.actualDataset[0].data.length-1].x)
    // this.updated.set(lastBlockNum)
  }

  chartData() {
    if (this.mode.get() === DataMode.ACTUAL) {
      return this.actualDataset
    } else {
      return this.suggestedDataset
    }
  }

  resetChart() {
    this.suggestedFast.set(0)
    this.suggestedStandard.set(0)
    this.suggestedSlow.set(0)

    this.actualMax.set(0)
    this.actualAverage.set(0)
    this.actualMin.set(0)

    this.actualDataset.forEach(dataset => {
      dataset.data = []
    })

    this.suggestedDataset.forEach(dataset => {
      dataset.data = []
    })

    this.lastSuggestedPoll = 0
    this.lastActualPoll = 0

    this.updated.set(0)

    this.suggestedDatasetLoading.set(true)
    this.actualDatasetLoading.set(true)
    this.apiError.set(false)
  }

  async fetchNetworks() {
    if (!this.networks.get()) {
      try {
        const response = await this.root.api.listNetworks()
        this.networks.set(response.networks)
      } catch (e) {
        console.error('Failed to fetch list of networks', e)
        this.apiError.set(true)
      }
    }
  }

  setNetwork(handle: string, title: string, token: string) {
    this.network.set(handle)
    this.networkTitle.set(title)
    this.networkToken.set(token)
    this.resetChart()
  }
}
