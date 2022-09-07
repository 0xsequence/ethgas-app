package ethproviders

import (
	"github.com/0xsequence/ethkit/ethrpc"
)

type Providers struct {
	byName       map[string]*ethrpc.Provider
	configByName map[string]NetworkConfig
}

type ChainInfo struct {
	Title  string `json:"title"`
	Handle string `json:"handle"`
}

func NewProviders(cfg Config) (*Providers, error) {
	providers := &Providers{
		byName:       map[string]*ethrpc.Provider{},
		configByName: map[string]NetworkConfig{},
	}

	for name, details := range cfg {
		p, err := ethrpc.NewProvider(details.URL)
		if err != nil {
			return nil, err
		}
		providers.byName[name] = p
		providers.configByName[name] = details
	}

	return providers, nil
}

func (p *Providers) Map() map[string]*ethrpc.Provider {
	return p.byName
}

func (p *Providers) GetProvider(chainHandle string) *ethrpc.Provider {
	return p.byName[chainHandle]
}

func (p *Providers) GetConfig(chainHandle string) NetworkConfig {
	return p.configByName[chainHandle]
}
