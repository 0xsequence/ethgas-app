package rpc

import (
	"context"
	"math"
	"math/big"

	"github.com/0xsequence/ethgas-app/proto"
	"github.com/0xsequence/ethgas-app/tracker"
)

func (s *RPC) ListNetworks(ctx context.Context) ([]*proto.NetworkInfo, error) {
	return s.networkList, nil
}

func (s *RPC) SuggestedGasPrice(ctx context.Context, network string) (*proto.SuggestedGasPrice, error) {
	gasGauge, ok := s.ETHGasGauges[network]
	if !ok {
		return nil, proto.Failf("unknown network")
	}

	sg := gasGauge.SuggestedGasPrice()

	if sg.BlockNum == nil {
		return nil, proto.Errorf(proto.ErrAborted, "suggested price hasn't been computed yet")
	}

	resp := &proto.SuggestedGasPrice{
		BlockNum:  sg.BlockNum.Uint64(),
		BlockTime: sg.BlockTime,
		Instant:   formatGwei(sg.InstantWei),
		Fast:      formatGwei(sg.FastWei),
		Standard:  formatGwei(sg.StandardWei),
		Slow:      formatGwei(sg.SlowWei),
	}

	return resp, nil
}

func (s *RPC) AllSuggestedGasPrices(ctx context.Context, network string, count *uint) ([]*proto.SuggestedGasPrice, error) {
	gasTracker, ok := s.GasTrackers[network]
	if !ok {
		return nil, proto.Failf("unknown network")
	}

	data := gasTracker.Suggested
	if len(data) == 0 {
		return nil, proto.Errorf(proto.ErrAborted, "suggested price hasn't been computed yet")
	}

	c := tracker.NumDataPoints
	if count != nil && int(*count) > 0 && int(*count) < tracker.NumDataPoints {
		c = int(*count)
	}
	if len(data) > c {
		data = data[len(data)-c:]
	}

	resp := []*proto.SuggestedGasPrice{}
	for _, v := range data {
		d := &proto.SuggestedGasPrice{
			BlockNum:  v.BlockNum.Uint64(),
			BlockTime: v.BlockTime,
			Instant:   formatGwei(v.InstantWei),
			Fast:      formatGwei(v.FastWei),
			Standard:  formatGwei(v.StandardWei),
			Slow:      formatGwei(v.SlowWei),
		}
		resp = append(resp, d)
	}

	return resp, nil
}

func (s *RPC) AllGasStats(ctx context.Context, network string, count *uint) ([]*proto.GasStat, error) {
	gasTracker, ok := s.GasTrackers[network]
	if !ok {
		return nil, proto.Failf("unknown network")
	}

	data := gasTracker.Actual
	if len(data) == 0 {
		return nil, proto.Errorf(proto.ErrAborted, "awaiting incoming block data")
	}

	c := tracker.NumDataPoints
	if count != nil && int(*count) > 0 && int(*count) < tracker.NumDataPoints {
		c = int(*count)
	}
	if len(data) > c {
		data = data[len(data)-c:]
	}

	resp := []*proto.GasStat{}
	for _, v := range data {
		d := &proto.GasStat{
			BlockNum:  v.BlockNum.Uint64(),
			BlockTime: v.BlockTime,
			Max:       formatFloat64(v.Max),
			Average:   formatFloat64(v.Average),
			Min:       formatFloat64(v.Min),
		}
		resp = append(resp, d)
	}

	return resp, nil
}

func (s *RPC) GasPriceHistory(ctx context.Context, network string) (map[uint64][]float64, error) {
	gasTracker, ok := s.GasTrackers[network]
	if !ok {
		return nil, proto.Failf("unknown network")
	}

	return gasTracker.PriceHistory, nil
}

func formatGwei(wei *big.Int) float64 {
	if wei == nil {
		return 0
	}

	oneGwei := big.NewInt(1_000_000_000)

	gwei := big.NewInt(0).Set(wei)
	gwei = gwei.Mul(gwei, big.NewInt(1000)) // for decimals
	gwei = gwei.Div(gwei, oneGwei)

	n := float64(gwei.Uint64()) / float64(1000)
	if n >= 1 {
		return float64(uint64(n))
	} else {
		return n
	}
}

func formatFloat64(n float64) float64 {
	if n >= 1 {
		return float64(uint64(n)) // truncate decimals
	} else if n >= 0.01 {
		return math.Round(n*100) / 100 // 2 decimal places
	} else {
		return math.Round(n*1000) / 1000 // 3 decimal places
	}
}
