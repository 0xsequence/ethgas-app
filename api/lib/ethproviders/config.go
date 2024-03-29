package ethproviders

import "strings"

type Config map[string]NetworkConfig

type NetworkConfig struct {
	Pos         int    `toml:"pos"`
	Title       string `toml:"title"`
	ChainId			int		 `toml:"chain_id"`
	Token       string `toml:"token"`
	URL         string `toml:"url"`
	MinGasPrice uint64 `toml:"min_gas_price"`
	UseEIP1559  bool   `toml:"use_eip_1559"`
}

func (n Config) GetByName(name string) (NetworkConfig, bool) {
	name = strings.ToLower(name)
	for k, v := range n {
		if k == name {
			return v, true
		}
	}
	return NetworkConfig{}, false
}
