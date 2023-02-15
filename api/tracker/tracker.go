package tracker

import (
	"context"
	"math/big"
	"sort"

	"github.com/0xsequence/ethkit/ethgas"
	"github.com/rs/zerolog"
)

type GasTracker struct {
	Logger      zerolog.Logger
	ETHGasGauge *ethgas.GasGauge

	PriceHistory map[uint64][]float64
	Suggested    []ethgas.SuggestedGasPrice
	Actual       []GasPriceStat
	blockNums    []uint64
}

var NumDataPoints = 100

func NewGasTracker(logger zerolog.Logger, gasGauge *ethgas.GasGauge) (*GasTracker, error) {
	return &GasTracker{
		Logger:       logger,
		ETHGasGauge:  gasGauge,
		PriceHistory: make(map[uint64][]float64),
		Suggested:    []ethgas.SuggestedGasPrice{},
		Actual:       []GasPriceStat{},
		blockNums:    []uint64{},
	}, nil
}

func (g *GasTracker) Start(ctx context.Context) error {
	go g.run()

	err := g.ETHGasGauge.Run(ctx)
	if err != nil {
		return err
	}

	return nil
}

func (g *GasTracker) run() error {
	sub := g.ETHGasGauge.Subscribe()
	defer sub.Unsubscribe()

	for {
		select {
		case blocks := <-sub.Blocks():
			latest := blocks.LatestBlock()
			if latest == nil {
				continue
			}

			txns := latest.Transactions()
			if len(txns) == 0 {
				continue
			}

			// Actual -- stats
			gasPrices := []float64{}
			for _, txn := range txns {
				gp := txn.GasPrice().Uint64()
				if gp < 1e6 {
					continue // skip prices which are outliers / "deals with miner"
				}
				gasPrices = append(gasPrices, float64(txn.GasPrice().Uint64())/float64(1e9))
			}
			// low to high
			sort.Slice(gasPrices, func(i, j int) bool {
				return gasPrices[i] < gasPrices[j]
			})

			gasStat := calcStat(gasPrices)
			gasStat.BlockNum = latest.Block.Number()
			gasStat.BlockTime = latest.Block.Time()
			g.Actual = append(g.Actual, gasStat)
			if len(g.Actual) > NumDataPoints {
				g.Actual = g.Actual[1:]
			}

			// Record raw txn gas prices
			g.blockNums = append(g.blockNums, latest.Block.NumberU64())
			if len(g.blockNums) > NumDataPoints {
				delete(g.PriceHistory, g.blockNums[0])
				g.blockNums = g.blockNums[1:]
			}
			g.PriceHistory[latest.Block.NumberU64()] = gasPrices

			// Suggested gas price
			suggestedGasPrice := g.ETHGasGauge.SuggestedGasPrice()
			if suggestedGasPrice.BlockNum != nil {
				g.Suggested = append(g.Suggested, suggestedGasPrice)
				if len(g.Suggested) > NumDataPoints {
					g.Suggested = g.Suggested[1:]
				}
			}

		case <-sub.Done():
			return nil
		}
	}
}

type GasPriceStat struct {
	// numbers are in gwei
	Num     uint64  `json:"num"`
	Average float64 `json:"average"`
	Median  float64 `json:"median"`
	Min     float64 `json:"min"`
	Max     float64 `json:"max"`

	BlockNum  *big.Int `json:"blockNum"`
	BlockTime uint64   `json:"blockTime"`
}

func calcStat(prices []float64) GasPriceStat {
	if len(prices) == 0 {
		return GasPriceStat{}
	}

	s := GasPriceStat{}
	s.Num = uint64(len(prices))

	// average, min, max
	t := float64(0)
	min := prices[0]
	max := float64(0)
	for _, p := range prices {
		t += p
		if p < min {
			min = p
		}
		if p > max {
			max = p
		}
	}
	s.Average = t / float64(s.Num)
	s.Min = min
	s.Max = max

	// median
	s.Median = prices[s.Num/2]

	return s
}
