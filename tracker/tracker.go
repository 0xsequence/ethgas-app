package tracker

import (
	"context"
	"fmt"
	"math"
	"sort"

	"github.com/arcadeum/ethkit/ethgas"
	"github.com/rs/zerolog"
)

type GasTracker struct {
	Logger      zerolog.Logger
	ETHGasGauge *ethgas.GasGauge
	History     map[uint64][]uint64
}

func NewGasTracker(logger zerolog.Logger, gasGauge *ethgas.GasGauge) (*GasTracker, error) {
	return &GasTracker{
		Logger:      logger,
		ETHGasGauge: gasGauge,
		History:     make(map[uint64][]uint64),
	}, nil
}

func (g *GasTracker) Start(ctx context.Context) error {
	err := g.ETHGasGauge.Start(ctx)
	if err != nil {
		return err
	}

	go g.Main()
	return nil
}

func (g *GasTracker) Main() error {
	sub := g.ETHGasGauge.Subscribe()
	defer sub.Unsubscribe()

	for {
		select {
		case blocks := <-sub.Blocks():
			latest := blocks.LatestBlock()

			txns := latest.Transactions()
			if len(txns) == 0 {
				continue
			}

			gasPrices := []uint64{}
			for _, txn := range txns {
				gp := txn.GasPrice().Uint64()
				if gp <= 1e9 {
					continue // skip prices which are outliers / "deals with miner"
				}
				gasPrices = append(gasPrices, txn.GasPrice().Uint64()/1e9)
			}
			// low to high
			sort.Slice(gasPrices, func(i, j int) bool {
				return gasPrices[i] < gasPrices[j]
			})

			// Record
			g.History[latest.Block.NumberU64()] = gasPrices

		case <-sub.Done():
			return nil
		}
	}
}

// func (g *GasStats) Main2() error {
// 	sub := g.ETHGasGauge.Subscribe()
// 	defer sub.Unsubscribe()

// 	for {
// 		select {
// 		case blocks := <-sub.Blocks():
// 			latest := blocks.LatestBlock()

// 			fmt.Println("")
// 			fmt.Println("")

// 			fmt.Println("=> block", latest.Hash().String(), "number", latest.NumberU64())
// 			fmt.Println("gasLimit", latest.GasLimit())
// 			fmt.Println("gasUsed", latest.GasUsed())

// 			txns := latest.Transactions()
// 			fmt.Println("num txns", len(txns))
// 			fmt.Println("")

// 			if len(txns) == 0 {
// 				continue
// 			}

// 			gasPrices := []uint64{}
// 			for _, txn := range txns {
// 				gp := txn.GasPrice().Uint64()
// 				if gp <= 1e9 {
// 					continue // skip prices which are outliers / "deals with miner"
// 				}
// 				gasPrices = append(gasPrices, txn.GasPrice().Uint64())
// 			}
// 			// high to low
// 			sort.Slice(gasPrices, func(i, j int) bool {
// 				return gasPrices[i] > gasPrices[j]
// 			})

// 			top100 := calcStats(gasPrices)
// 			top95 := calcStats(gasPrices[0:uint64(float64(len(gasPrices)-1)*0.95)])
// 			top75 := calcStats(gasPrices[0:uint64(float64(len(gasPrices)-1)*0.75)])
// 			top50 := calcStats(gasPrices[0:uint64(float64(len(gasPrices)-1)*0.5)])
// 			top25 := calcStats(gasPrices[0:uint64(float64(len(gasPrices)-1)*0.25)])

// 			printStats("TOP 25%", top25)
// 			printStats("TOP 50%", top50)
// 			printStats("TOP 75%", top75)
// 			printStats("TOP 95%", top95)
// 			printStats("ALL", top100)

// 			// reverse the list -- is now, low to high
// 			sort.Slice(gasPrices, func(i, j int) bool {
// 				return gasPrices[i] < gasPrices[j]
// 			})

// 			// --

// 			p20 := percentileValue(gasPrices, 0.20)
// 			p50 := percentileValue(gasPrices, 0.50)
// 			p75 := percentileValue(gasPrices, 0.75)
// 			p99 := percentileValue(gasPrices, 0.99)

// 			fmt.Println("20% value", p20/uint64(1e9))
// 			fmt.Println("50% value", p50/uint64(1e9))
// 			fmt.Println("75% value", p75/uint64(1e9))
// 			fmt.Println("99% value", p99/uint64(1e9))

// 			fmt.Println("==> suggested", g.ETHGasTracker.SuggestedGasPrice())

// 		case <-sub.Done():
// 			return nil
// 		}
// 	}
// }

func percentileValue(prices []uint64, p float64) uint64 {
	return prices[uint64(float64(len(prices)-1)*p)]
}

type stats struct {
	n, average, median, min, max uint64
}

func calcStats(prices []uint64) *stats {
	if len(prices) == 0 {
		return nil
	}

	s := &stats{}
	s.n = uint64(len(prices))

	// average, min, max
	t := uint64(0)
	min := prices[0]
	max := uint64(0)
	for _, p := range prices {
		t += p
		if p < min {
			min = p
		}
		if p > max {
			max = p
		}
	}
	s.average = t / s.n
	s.min = min
	s.max = max

	// median
	s.median = prices[s.n/2]

	return s
}

func printStats(label string, s *stats) {
	fmt.Println("->", label)
	fmt.Println("n       :", s.n)
	fmt.Println("average :", s.average/uint64(math.Pow(10, 9)))
	fmt.Println("median  :", s.median/uint64(math.Pow(10, 9)))
	fmt.Println("min     :", s.min/uint64(math.Pow(10, 9)))
	fmt.Println("max     :", s.max/uint64(math.Pow(10, 9)))
	fmt.Println("")
}
