package main

import (
	"fmt"
	"log"
	"os"
	"runtime"
	"runtime/pprof"

	"github.com/0xsequence/ethgas-app/config"
	"github.com/spf13/cobra"
)

func main() {
	Execute()
}

var (
	configFile string
	logFile    string

	cpuprofile string
	memprofile string

	cfg = &config.Config{}
)

func initConfig() error {
	err := config.NewFromFile(configFile, os.Getenv("CONFIG"), cfg)
	if err != nil {
		return fmt.Errorf("Error initializing config: %s", err)
	}

	return nil
}

// func initLogging() {
// 	if logFile != "" {
// 		cfg.Logging.LogFile = logFile
// 	}
// }

func initCPUProfile() error {
	if cpuprofile != "" {
		f, err := os.Create(cpuprofile)
		if err != nil {
			return fmt.Errorf("Could not create CPU profile: %s", err)
		}
		if err := pprof.StartCPUProfile(f); err != nil {
			return fmt.Errorf("Could not start CPU profile: %s", err)
		}
	}

	return nil
}

func initMemProfile() error {
	if memprofile != "" {
		f, err := os.Create(memprofile)
		if err != nil {
			return fmt.Errorf("Could not create memory profile: %s", err)
		}
		runtime.GC() // get up-to-date statistics
		if err := pprof.WriteHeapProfile(f); err != nil {
			return fmt.Errorf("Could not write memory profile: %s", err)
		}
	}

	return nil
}

func must(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

var rootCmd = &cobra.Command{
	Use:   "ethgas",
	Short: "ethgas",
	RunE: func(cmd *cobra.Command, args []string) error {
		return ethgasMain()
	},
}

func init() {
	cobra.OnInitialize(func() {
		must(initConfig())
		// initLogging()
		must(initCPUProfile())
		must(initMemProfile())
	})

	rootCmd.PersistentFlags().StringVar(&configFile, "config", "", "path to config file")
	rootCmd.PersistentFlags().StringVar(&logFile, "log", "", "path to log file")

	rootCmd.PersistentFlags().StringVar(&cpuprofile, "cpuprofile", "", "path for cpuprofile output")
	rootCmd.PersistentFlags().StringVar(&memprofile, "memprofile", "", "path for memprofile output")
}

// Execute executes cobra commands
func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
