import { RootStore, observable } from '~/stores'
import { SuggestedGasPrice, GasStat } from '~/lib/apiclient'

export enum DataMode {
  SUGGESTED = 'SUGGESTED',
  ACTUAL = 'ACTUAL'
}

export const MaxNumDataPoints = 80

export class DataStore {
  mode = observable<DataMode>(DataMode.SUGGESTED)

  suggestedFast = observable<number>(0)
  suggestedStandard = observable<number>(0)
  suggestedSlow = observable<number>(0)

  suggestedDataset: any[] = [
    { 'id': 'slow', 'data': [] },
    { 'id': 'standard', 'data': [] },
    { 'id': 'fast', 'data': [] }
  ]

  actualMax = observable<number>(0)
  actualAverage = observable<number>(0)
  actualMin = observable<number>(0)

  actualDataset: any[] = [
    { 'id': 'min', 'data': [] },
    { 'id': 'average', 'data': [] },
    { 'id': 'max', 'data': [] }
  ]

  lastBlockPolled: number = 0
  updated = observable<number>(0)

  constructor(private root: RootStore) {
    this.pollSuggested()
    this.pollActual()

    setInterval(() => {
      this.pollSuggested()
      this.pollActual()
    }, 1500)
  }

  async pollSuggested() {
    const api = this.root.api

    let count = 100
    if (this.lastBlockPolled > 0) {
      count = 5
    }

    const { suggestedGasPrices } = await api.allSuggestedGasPrices({ count: count })

    if (suggestedGasPrices.length === 0) {
      return
    }
    const suggestedGasPrice = suggestedGasPrices[suggestedGasPrices.length-1]
    if (this.lastBlockPolled > 0 && this.lastBlockPolled === suggestedGasPrice.blockNum) {
      return
    }

    const blockNum = suggestedGasPrice.blockNum
    this.lastBlockPolled = blockNum

    this.suggestedFast.set(suggestedGasPrice.fast)
    this.suggestedStandard.set(suggestedGasPrice.standard)
    this.suggestedSlow.set(suggestedGasPrice.slow)

    this.updateSuggestedDataset(suggestedGasPrices)
  }

  async pollActual() {
    const api = this.root.api

    let count = 100
    if (this.lastBlockPolled > 0) {
      count = 5
    }

    const { gasStats } = await api.allGasStats({ count: count })

    if (gasStats.length === 0) {
      return
    }
    const gasStat = gasStats[gasStats.length-1]
    if (this.lastBlockPolled > 0 && this.lastBlockPolled === gasStat.blockNum) {
      return
    }

    this.actualMax.set(gasStat.max)
    this.actualAverage.set(gasStat.average)
    this.actualMin.set(gasStat.min)

    this.updateActualDataset(gasStats)
  }

  updateSuggestedDataset(data: SuggestedGasPrice[]) {
    const pushDataset = (set: SuggestedGasPrice[]) => {
      for (let i=0; i < set.length; i++) {
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
      const lastBlockNum = parseInt(this.suggestedDataset[0].data[len-1].x)

      let idx = -1
      for (let i=0; i < data.length; i++) {
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
      this.suggestedDataset[0].data.splice(0, Math.abs(MaxNumDataPoints-this.suggestedDataset[0].data.length))
      this.suggestedDataset[1].data.splice(0, Math.abs(MaxNumDataPoints-this.suggestedDataset[1].data.length))
      this.suggestedDataset[2].data.splice(0, Math.abs(MaxNumDataPoints-this.suggestedDataset[2].data.length))
    }

    // will trigger a re-render as it updates the set value
    const lastBlockNum = parseInt(this.suggestedDataset[0].data[len-1].x)
    this.updated.set(lastBlockNum)
  }

  updateActualDataset(data: GasStat[]) {
    const pushDataset = (set: GasStat[]) => {
      for (let i=0; i < set.length; i++) {
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
      const lastBlockNum = parseInt(this.actualDataset[0].data[len-1].x)

      let idx = -1
      for (let i=0; i < data.length; i++) {
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
      this.actualDataset[0].data.splice(0, Math.abs(MaxNumDataPoints-this.actualDataset[0].data.length))
      this.actualDataset[1].data.splice(0, Math.abs(MaxNumDataPoints-this.actualDataset[1].data.length))
      this.actualDataset[2].data.splice(0, Math.abs(MaxNumDataPoints-this.actualDataset[2].data.length))
    }

    // will trigger a re-render as it updates the set value
    const lastBlockNum = parseInt(this.actualDataset[0].data[len-1].x)
    this.updated.set(lastBlockNum)
  }

  chartData() {
    if (this.mode.get() === DataMode.ACTUAL) {
      return this.actualDataset
    } else {
      return this.suggestedDataset
    }
  }

}

