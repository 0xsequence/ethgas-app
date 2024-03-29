package config

import (
	"errors"
	"fmt"
	"os"

	"github.com/0xsequence/ethgas-app/lib/ethproviders"
	"github.com/BurntSushi/toml"
)

type Config struct {
	GitCommit string `toml:"-"`

	Listen string `toml:"listen"`

	Logging LoggingConfig `toml:"logging"`
	Auth    Auth          `toml:"auth"`

	Networks ethproviders.Config `toml:"networks"`

	Api ApiConfig `toml:"api"`
}

type ApiConfig struct {
	GetPrice string `toml:"get_price"`
}

type LoggingConfig struct {
	ServiceName string `toml:"service"`
	Level       string `toml:"level"`
	JSON        bool   `toml:"json"`
	Concise     bool   `toml:"concise"`
	Statsd      string `toml:"statsd"`
	Tracing     string `toml:"tracing"`
}

type Auth struct {
	JWTSecret string `toml:"jwt_secret"`
}

func NewFromFile(file string, env string, config interface{}) error {
	if file == "" {
		file = env
	}
	_, err := os.Stat(file)
	if os.IsNotExist(err) {
		return fmt.Errorf("config error: failed to load config file %w", err)
	}
	if _, err := toml.DecodeFile(file, config); err != nil {
		return fmt.Errorf("config error: failed to parse config file %w", err)
	}
	if k, ok := config.(WithParser); ok {
		return k.Parse()
	}
	return nil
}

func (c *Config) Parse() error {
	// ServiceName
	if c.Logging.ServiceName == "" {
		return errors.New("config error: logging.service cannot be empty")
	}

	return nil
}

type WithParser interface {
	Parse() error
}
