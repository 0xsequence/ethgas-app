import { RootStore, observable } from '~/stores'

export class DataStore {
  suggestedFast = observable<number>(0)
  suggestedStandard = observable<number>(0)
  suggestedSlow = observable<number>(0)

  suggestedDataset: any[] = [
    {
      'id': 'slow',
      'data': []
    },
    {
      'id': 'standard',
      'data': []
    },
    {
      'id': 'fast',
      'data': []
    }
  ]

  actualMax = observable<number>(0)
  actualAverage = observable<number>(0)
  actualMin = observable<number>(0)

  lastBlockPolled: number = 0

  constructor(private root: RootStore) {
    setInterval(() => {
      this.poll()
    }, 1000)
  }

  async poll() {
    const api = this.root.api

    const { suggestedGasPrice } = await api.suggestedGasPrice()

    if (this.lastBlockPolled > 0 && this.lastBlockPolled === suggestedGasPrice.blockNum) {
      return
    }

    const blockNum = suggestedGasPrice.blockNum
    this.lastBlockPolled = blockNum

    this.suggestedFast.set(suggestedGasPrice.fast)
    this.suggestedStandard.set(suggestedGasPrice.standard)
    this.suggestedSlow.set(suggestedGasPrice.slow)

    if (this.suggestedDataset[0].data.length >= 100) {
      this.suggestedDataset[0].data.splice(0, 1)
      this.suggestedDataset[1].data.splice(0, 1)
      this.suggestedDataset[2].data.splice(0, 1)
    }

    this.suggestedDataset[0].data.push({
      x: `${blockNum}`,
      y: `${suggestedGasPrice.slow}`
    })
    this.suggestedDataset[1].data.push({
      x: `${blockNum}`,
      y: `${suggestedGasPrice.standard}`
    })
    this.suggestedDataset[2].data.push({
      x: `${blockNum}`,
      y: `${suggestedGasPrice.fast}`
    })
  }
}

