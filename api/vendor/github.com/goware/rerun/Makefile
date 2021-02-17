.PHONY: help
help:
	@cat Makefile | grep '^[a-z]*[:]$$'

.PHONY: install
install:
	go install ./cmd/rerun

.PHONY: dist
dist:
	@rm -rf ./dist/*
	@mkdir -p ./dist
	GOOS=darwin GOARCH=amd64 go build -o ./bin/rerun-darwin64 ./cmd/rerun
	GOOS=linux GOARCH=amd64 go build -o ./bin/rerun-linux64 ./cmd/rerun
	GOOS=linux GOARCH=386 go build -o ./bin/rerun-linux386 ./cmd/rerun
	#GOOS=windows GOARCH=amd64 go build -o ./bin/rerun-windows64.exe ./cmd/rerun
	#GOOS=windows GOARCH=386 go build -o ./bin/rerun-windows386.exe ./cmd/rerun

.PHONY: test
test:
	go test ./...

.PHONY: vendor
vendor:
	GO111MODULE=on go mod vendor && GO111MODULE=on go mod tidy
