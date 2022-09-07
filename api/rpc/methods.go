package rpc

import (
	"context"

	"github.com/0xsequence/ethgas-app/proto"
	"github.com/0xsequence/ethgas-app/tracker"
)

func (s *RPC) ListNetworks(ctx context.Context) ([]string, error) {
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
		Instant:   sg.Instant,
		Fast:      sg.Fast,
		Standard:  sg.Standard,
		Slow:      sg.Slow,
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
			Instant:   v.Instant,
			Fast:      v.Fast,
			Standard:  v.Standard,
			Slow:      v.Slow,
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
			Max:       v.Max,
			Average:   v.Average,
			Min:       v.Min,
		}
		resp = append(resp, d)
	}

	return resp, nil
}

func (s *RPC) GasPriceHistory(ctx context.Context, network string) (map[uint64][]uint64, error) {
	gasTracker, ok := s.GasTrackers[network]
	if !ok {
		return nil, proto.Failf("unknown network")
	}

	return gasTracker.PriceHistory, nil
}
