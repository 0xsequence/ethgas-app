//go:generate go run github.com/webrpc/webrpc/cmd/webrpc-gen -schema=api.ridl -target=go -pkg=proto -server -client -out=./api.gen.go
//go:generate go run github.com/webrpc/webrpc/cmd/webrpc-gen -schema=api.ridl -target=ts -pkg=proto -client -out=./index.ts
package proto
