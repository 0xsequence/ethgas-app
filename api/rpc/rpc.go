package rpc

import (
	"context"
	"net/http"
	"time"

	"github.com/0xsequence/ethgas-app/config"
	"github.com/0xsequence/ethgas-app/lib/ethproviders"
	"github.com/0xsequence/ethgas-app/proto"
	"github.com/0xsequence/ethgas-app/tracker"
	"github.com/0xsequence/ethkit/ethgas"
	"github.com/0xsequence/ethkit/ethmonitor"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/httplog"
	"github.com/go-chi/stampede"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

type RPC struct {
	Config *config.Config
	Log    zerolog.Logger

	HTTP *http.Server

	ETHProviders *ethproviders.Providers
	ETHMonitors  map[string]*ethmonitor.Monitor
	ETHGasGauges map[string]*ethgas.GasGauge
	GasTrackers  map[string]*tracker.GasTracker

	networkList []string
}

func New(cfg *config.Config, providers *ethproviders.Providers, monitors map[string]*ethmonitor.Monitor, gasGauges map[string]*ethgas.GasGauge, gasTrackers map[string]*tracker.GasTracker) (*RPC, error) {
	networkList := []string{}
	for chainHandle := range monitors {
		networkList = append(networkList, chainHandle)
	}

	s := &RPC{
		Config:       cfg,
		Log:          log.With().Str("module", "rpc").Logger(),
		HTTP:         &http.Server{Addr: cfg.Listen},
		ETHProviders: providers,
		ETHMonitors:  monitors,
		ETHGasGauges: gasGauges,
		GasTrackers:  gasTrackers,
		networkList:  networkList,
	}
	return s, nil
}

func (s *RPC) Start() error {
	s.Log.Info().Str("op", "start").Msgf("-> rpc: listening on %s", s.HTTP.Addr)

	// TODO: add a status page with ethmonitor, etc........

	r := chi.NewRouter()
	r.Use(middleware.RealIP)
	r.Use(httplog.RequestLogger(s.Log))
	r.Use(middleware.NoCache)
	r.Use(middleware.Heartbeat("/ping"))

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           600,
	})
	r.Use(c.Handler)

	r.Use(stampede.Handler(512, 1500*time.Millisecond))

	r.HandleFunc("/", indexHandler)

	// Mount rest endpoints for convenience
	r.Mount("/v1", routesV1(s))

	// Mount rpc service
	rpcHandler := proto.NewETHGasServer(s)
	r.Handle("/*", rpcHandler)

	// Boot the server and listen for incoming requests
	s.HTTP.Handler = r
	return s.HTTP.ListenAndServe()
}

func (s *RPC) Stop(timeoutCtx context.Context) {
	// signal to stop service
	s.Log.Info().Str("op", "stop").Msg("-> rpc: stopping..")

	s.HTTP.Shutdown(timeoutCtx)

	s.Log.Info().Str("op", "stop").Msg("-> rpc: stopped.")
}

// Ping is a healthcheck that returns an empty message.
func (s *RPC) Ping(ctx context.Context) (bool, error) {
	return true, nil
}

// Version returns service version details
func (s *RPC) Version(ctx context.Context) (*proto.Version, error) {
	return &proto.Version{
		WebrpcVersion: proto.WebRPCVersion(),
		SchemaVersion: proto.WebRPCSchemaVersion(),
		SchemaHash:    proto.WebRPCSchemaHash(),
		AppVersion:    s.Config.GitCommit,
	}, nil
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("."))
}
