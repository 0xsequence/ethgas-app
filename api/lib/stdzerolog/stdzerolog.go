package stdzerolog

import (
	"fmt"
	stdlog "log"
	"os"

	"github.com/rs/zerolog"
)

// Wraps a zerolog.Logger to properly interface with Go's standard "log" package

var _ Logger = &stdlog.Logger{}

type Logger interface {
	Fatal(v ...interface{})
	Fatalf(format string, v ...interface{})
	Print(v ...interface{})
	Println(v ...interface{})
	Printf(format string, v ...interface{})
}

var _ Logger = &StdLogger{}

func Wrap(log zerolog.Logger) *StdLogger {
	return &StdLogger{log}
}

type StdLogger struct {
	log zerolog.Logger
}

func (s *StdLogger) Fatal(v ...interface{}) {
	s.log.Fatal().Msg(fmt.Sprint(v...))
	os.Exit(1)
}

func (s *StdLogger) Fatalf(format string, v ...interface{}) {
	s.log.Fatal().Msg(fmt.Sprintf(format, v...))
	os.Exit(1)
}

func (s *StdLogger) Print(v ...interface{}) {
	s.log.Info().Msg(fmt.Sprint(v...))
}

func (s *StdLogger) Println(v ...interface{}) {
	s.log.Info().Msg(fmt.Sprintln(v...))
}

func (s *StdLogger) Printf(format string, v ...interface{}) {
	s.log.Info().Msg(fmt.Sprintf(format, v...))
}

// Extra methods used by segment client
func (s *StdLogger) Logf(format string, v ...interface{}) {
	s.log.Info().Msg(fmt.Sprintln(v...))
}

func (s *StdLogger) Errorf(format string, v ...interface{}) {
	s.log.Error().Msg(fmt.Sprintln(v...))
}
