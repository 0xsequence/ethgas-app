package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/0xsequence/ethgas-app"
)

func ethgasMain() error {
	instance, err := ethgas.New(cfg)
	if err != nil {
		return err
	}

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)
	go func() {
		for range sig {
			instance.Stop()
		}
	}()

	errs := instance.Serve()
	if len(errs) > 0 {
		log.Println("server error:", errs)
	}
	log.Println("bye.")

	return nil
}
