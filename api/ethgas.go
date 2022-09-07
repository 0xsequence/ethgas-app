package ethgas

import (
	"context"
	"net/http"
	"sync"
	"time"

	"github.com/0xsequence/ethgas-app/config"
	"github.com/0xsequence/ethgas-app/lib/ethproviders"
	"github.com/0xsequence/ethgas-app/rpc"
	"github.com/0xsequence/ethgas-app/tracker"
	"github.com/0xsequence/ethkit/ethgas"
	"github.com/0xsequence/ethkit/ethmonitor"
	"github.com/0xsequence/go-sequence/lib/logadapter"
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

	ETHProviders *ethproviders.Providers
	ETHMonitors  map[string]*ethmonitor.Monitor
	ETHGasGauges map[string]*ethgas.GasGauge
	GasTrackers  map[string]*tracker.GasTracker
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
	// Ethereum JSON-RPC Providers
	//
	providers, err := ethproviders.NewProviders(cfg.Networks)
	if err != nil {
		return nil, err
	}

	//
	// Setup for each network
	//
	monitors := map[string]*ethmonitor.Monitor{}
	gasGauges := map[string]*ethgas.GasGauge{}
	gasTrackers := map[string]*tracker.GasTracker{}

	for chainHandle, provider := range providers.Map() {

		chainConfig := providers.GetConfig(chainHandle)

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
		monitorOptions.Logger = logadapter.Wrap(modlog)
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

		monitors[chainHandle] = monitor

		//
		// Gas gauge
		//
		minGasPrice := chainConfig.MinGasPrice
		if minGasPrice == 0 {
			minGasPrice = 1
		}
		gasGauge, err := ethgas.NewGasGaugeWei(logadapter.Wrap(modlog), monitor, minGasPrice, chainConfig.UseEIP1559)
		if err != nil {
			return nil, err
		}
		gasGauges[chainHandle] = gasGauge

		//
		// Gas tracker
		//
		gasTracker, err := tracker.NewGasTracker(logger, gasGauge)
		if err != nil {
			return nil, err
		}
		gasTrackers[chainHandle] = gasTracker

	}

	//
	// WebRPC Service
	//
	rpcService, err := rpc.New(cfg, providers, monitors, gasGauges, gasTrackers)
	if err != nil {
		return nil, err
	}

	return &ETHGas{
		ctx:          serverCtx,
		Config:       cfg,
		Logger:       logger,
		RPCService:   rpcService,
		ETHProviders: providers,
		ETHMonitors:  monitors,
		ETHGasGauges: gasGauges,
		GasTrackers:  gasTrackers,
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
	if s.ETHMonitors != nil {
		for chainHandle, monitor := range s.ETHMonitors {
			chainHandle := chainHandle // loop var
			monitor := monitor         // loop var

			startingBlockNum := monitor.Options().StartBlockNumber
			var startingBlockNumLabel string
			if startingBlockNum == nil {
				startingBlockNumLabel = "latest"
			} else {
				startingBlockNumLabel = startingBlockNum.String()
			}
			oplog.Info().Msgf("-> ethmonitor: boot %s, starting_block_num=%s", chainHandle, startingBlockNumLabel)
			wg.Add(1)
			go func() {
				defer wg.Done()
				err := monitor.Run(context.Background()) // TODO: ctx..
				services <- err
			}()
		}
	}

	// Gas Tracker
	if s.GasTrackers != nil {
		for chainHandle, gasTracker := range s.GasTrackers {
			chainHandle := chainHandle // loop var
			gasTracker := gasTracker   // loop var
			oplog.Info().Msgf("-> gasTracker: boot %s", chainHandle)
			wg.Add(1)
			go func() {
				defer wg.Done()
				err := gasTracker.Start(context.Background()) // TODO: ctx..
				services <- err
			}()
		}
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
	if s.ETHMonitors != nil {
		for chainHandle, monitor := range s.ETHMonitors {
			monitor := monitor         // loop var
			chainHandle := chainHandle // loop var
			wg.Add(1)
			go func() {
				defer wg.Done()
				oplog.Info().Msgf("-> ethmonitor: %s stopping..", chainHandle)
				monitor.Stop()
				oplog.Info().Msgf("-> ethmonitor: %s stopped.", chainHandle)
			}()
		}
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
