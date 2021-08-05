package ethgas

import (
	"context"
	"net/http"
	"sync"
	"time"

	"github.com/0xsequence/ethgas-app/config"
	"github.com/0xsequence/ethgas-app/lib/stdzerolog"
	"github.com/0xsequence/ethgas-app/rpc"
	"github.com/0xsequence/ethgas-app/tracker"
	"github.com/0xsequence/ethkit/ethgas"
	"github.com/0xsequence/ethkit/ethmonitor"
	"github.com/0xsequence/ethkit/ethrpc"
	"github.com/go-chi/httplog"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

var (
	VERSION         = "dev"
	GITBRANCH       = "branch"
	GITCOMMIT       = "last commit"
	GITCOMMITDATE   = "last change"
	GITCOMMITAUTHOR = "last author"
)

type ETHGas struct {
	ctx *Context

	Config *config.Config
	Logger zerolog.Logger

	RPCService *rpc.RPC

	ETHProvider *ethrpc.Provider
	ETHMonitor  *ethmonitor.Monitor
	ETHGasGauge *ethgas.GasGauge

	GasTracker *tracker.GasTracker
}

func New(cfg *config.Config) (*ETHGas, error) {
	var err error

	cfg.GitCommit = GITCOMMIT

	// Server ctx
	serverCtx := NewContext()
	serverCtx.Config = cfg

	//
	// Logging
	//
	logger := httplog.NewLogger(cfg.Logging.ServiceName, httplog.Options{
		LogLevel: cfg.Logging.Level,
		JSON:     cfg.Logging.JSON,
		Concise:  cfg.Logging.Concise,
		Tags: map[string]string{
			"serviceVersion": GITCOMMIT,
		},
	})

	//
	// Ethereum JSON-RPC Provider
	//
	provider, err := ethrpc.NewProviderWithConfig(&ethrpc.Config{
		Nodes: []ethrpc.NodeConfig{
			{URL: cfg.Ethereum.URL},
		},
	})
	if err != nil {
		return nil, err
	}

	//
	// Ethereum Monitor
	// --
	// `monitor` is a global service canonical chain monitoring service that listens for
	// new blocks and informs services like ethreceipts.
	//
	// note: ethevents runs its own monitor instance that fetches actual logs.
	//
	var monitor *ethmonitor.Monitor
	modlog := log.Logger.With().Str("module", "monitor").Logger()
	monitorOptions := ethmonitor.DefaultOptions
	monitorOptions.Logger = stdzerolog.Wrap(modlog)
	// if logLevel == zerolog.DebugLevel {
	// 	monitorOptions.DebugLogging = true
	// }
	monitorOptions.StartBlockNumber = nil // track the head
	monitorOptions.PollingInterval = time.Duration(1 * time.Second)
	// if cfg.Environment == "test" {
	// 	monitorOptions.PollingInterval = time.Duration(100 * time.Millisecond)
	// }
	monitorOptions.WithLogs = false // no need for logs in this monitor
	monitor, err = ethmonitor.NewMonitor(provider, monitorOptions)
	if err != nil {
		return nil, err
	}

	//
	// Gas gauge
	//
	gasGauge, err := ethgas.NewGasGauge(stdzerolog.Wrap(log.Logger), monitor)
	if err != nil {
		return nil, err
	}

	//
	// Gas tracker
	//
	gasTracker, err := tracker.NewGasTracker(logger, gasGauge)
	if err != nil {
		return nil, err
	}

	//
	// WebRPC Service
	//
	rpcService, err := rpc.New(cfg, provider, monitor, gasGauge, gasTracker)
	if err != nil {
		return nil, err
	}

	return &ETHGas{
		ctx:         serverCtx,
		Config:      cfg,
		Logger:      logger,
		RPCService:  rpcService,
		ETHProvider: provider,
		ETHMonitor:  monitor,
		ETHGasGauge: gasGauge,
		GasTracker:  gasTracker,
	}, nil
}

func (s *ETHGas) Serve() []error {
	services := make(chan error)
	var wg sync.WaitGroup

	oplog := s.Logger.With().Str("op", "start").Logger()
	oplog.Info().Msgf("=> ethgas service init")

	// RPC Service
	oplog.Info().Msgf("-> rpc: boot")
	wg.Add(1)
	go func() {
		defer wg.Done()
		err := s.RPCService.Start()
		if err == http.ErrServerClosed {
			err = nil
		}
		services <- err
	}()

	// ETH Monitor
	if s.ETHMonitor != nil {
		startingBlockNum := s.ETHMonitor.Options().StartBlockNumber
		var startingBlockNumLabel string
		if startingBlockNum == nil {
			startingBlockNumLabel = "latest"
		} else {
			startingBlockNumLabel = startingBlockNum.String()
		}
		oplog.Info().Msgf("-> ethmonitor: boot, starting_block_num=%s", startingBlockNumLabel)
		wg.Add(1)
		go func() {
			defer wg.Done()
			err := s.ETHMonitor.Run(context.Background()) // TODO: ctx..
			services <- err
		}()
	}

	// Gas Tracker
	if s.GasTracker != nil {
		oplog.Info().Msgf("-> gasTracker: boot")
		wg.Add(1)
		go func() {
			defer wg.Done()
			err := s.GasTracker.Start(context.Background()) // TODO: ctx..
			services <- err
		}()
	}

	// Check for start errors
	errs := []error{}
	go func() {
		for err := range services {
			if err != nil {
				errs = append(errs, err)
			}
		}
	}()

	wg.Wait()
	close(services)

	return errs
}

// Stop will gracefully shutdown the services + server
func (s *ETHGas) Stop() {
	oplog := s.Logger.With().Str("op", "stop").Logger()
	oplog.Info().Msg("=> ethgas service shutdown")

	// Signal to base context to stop
	s.ctx.stopFn()

	// Fail-safe timeout context / signal
	timeoutCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var wg sync.WaitGroup

	// Shutdown RPC service
	wg.Add(1)
	go func() {
		defer wg.Done()
		s.RPCService.Stop(timeoutCtx)
	}()

	// Shutdown ETHMonitor
	if s.ETHMonitor != nil {
		wg.Add(1)
		go func() {
			defer wg.Done()
			oplog.Info().Msg("-> ethmonitor: stopping..")
			s.ETHMonitor.Stop()
			oplog.Info().Msg("-> ethmonitor: stopped.")
		}()
	}

	wg.Wait()

	oplog.Info().Msgf("-> bye.")
}

type Context struct {
	context.Context
	stopFn context.CancelFunc

	Config *config.Config
}

var _ context.Context = &Context{}

func NewContext() *Context {
	ctx, stopFn := context.WithCancel(context.Background())
	return &Context{
		Context: ctx,
		stopFn:  stopFn,
	}
}
