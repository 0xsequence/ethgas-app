package rpc

import (
	"context"

	"github.com/arcadeum/ethgas-app/proto"
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

func (s *RPC) History(ctx context.Context) (map[uint64][]uint64, error) {
	return s.GasTracker.History, nil
}
