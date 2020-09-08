package rerun

import (
	"fmt"
	"os"
	"os/exec"
	"syscall"
)

type Cmd struct {
	cmd  *exec.Cmd
	args []string
}

func StartCommand(args ...string) (*Cmd, error) {
	c := &Cmd{
		args: args,
	}
	if err := c.Start(); err != nil {
		return nil, err
	}

	return c, nil
}

func (c *Cmd) Start() error {
	cmd := exec.Command(c.args[0], c.args[1:]...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}

	if err := cmd.Start(); err != nil {
		return err
	}
	c.cmd = cmd

	return nil
}

func (c *Cmd) Kill() error {
	// Try to kill the whole process group (which we created via Setpgid: true), if possible.
	// This should kill the command process, all its children and grandchildren.
	if pgid, err := syscall.Getpgid(c.cmd.Process.Pid); err == nil {
		_ = syscall.Kill(-pgid, 9)
	}

	// Kill the process.
	// Note: The process group kill syscall sometimes fails on Mac OS, so let's just do both.
	return c.cmd.Process.Kill()
}

func (c *Cmd) Wait() error {
	// Wait for the process to finish.
	return c.cmd.Wait()
}

func (c *Cmd) PID() string {
	return fmt.Sprintf("PID %v: %v", c.cmd.Process.Pid, c.cmd.ProcessState.String())
}

func (c *Cmd) String() string {
	str := "$"
	for _, arg := range c.args {
		str += " " + arg
	}
	return str
}
