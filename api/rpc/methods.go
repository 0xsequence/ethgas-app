package rpc

import (
	"context"

	"github.com/arcadeum/ethgas-app/proto"
	"github.com/arcadeum/ethgas-app/tracker"
)

func (s *RPC) SuggestedGasPrice(ctx context.Context) (*proto.SuggestedGasPrice, error) {
	sg := s.ETHGasGauge.SuggestedGasPrice()

	if sg.BlockNum == nil {
		return nil, proto.Errorf(proto.ErrAborted, "suggested price hasn't been computed yet")
	}

	resp := &proto.SuggestedGasPrice{
		BlockNum:  sg.BlockNum.Uint64(),
		BlockTime: sg.BlockTime,
		Rapid:     sg.Rapid,
		Fast:      sg.Fast,
		Standard:  sg.Standard,
		Slow:      sg.Slow,
	}

	return resp, nil
}

func (s *RPC) AllSuggestedGasPrices(ctx context.Context, count *uint) ([]*proto.SuggestedGasPrice, error) {
	data := s.GasTracker.Suggested
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
			Rapid:     v.Rapid,
			Fast:      v.Fast,
			Standard:  v.Standard,
			Slow:      v.Slow,
		}
		resp = append(resp, d)
	}

	return resp, nil
}

func (s *RPC) AllGasStats(ctx context.Context, count *uint) ([]*proto.GasStat, error) {
	data := s.GasTracker.Actual
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

func (s *RPC) GasPriceHistory(ctx context.Context) (map[uint64][]uint64, error) {
	return s.GasTracker.PriceHistory, nil
}
