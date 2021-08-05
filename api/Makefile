SHELL             = bash -o pipefail
TEST_FLAGS        ?= -v

# MOD_VENDOR        ?= -mod=vendor
GOMODULES         ?= on

TOP 							:= $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

CONFIG         		?= $(TOP)/etc/ethgas.conf

GITTAG 						?= $(shell git describe --exact-match --tags HEAD 2>/dev/null || :)
GITBRANCH 				?= $(shell git rev-parse --abbrev-ref HEAD 2>/dev/null || :)
LONGVERSION 			?= $(shell git describe --tags --long --abbrev=8 --always HEAD)$(echo -$GITBRANCH | tr / - | grep -v '\-master' || :)
VERSION 					?= $(if $(GITTAG),$(GITTAG),$(LONGVERSION))
GITCOMMIT 				?= $(shell git log -1 --date=iso --pretty=format:%H)
GITCOMMITDATE 		?= $(shell git log -1 --date=iso --pretty=format:%cd)
GITCOMMITAUTHOR 	?= $(shell git log -1 --date=iso --pretty="format:%an")


all:
	@echo "*****************************************************************"
	@echo "**                     ETHGas Build Tool                       **"
	@echo "*****************************************************************"
	@echo "make <cmd>"
	@echo ""
	@echo "commands:"
	@echo ""
	@echo " + Development:"
	@echo "   - bootstrap"
	@echo "   - run"
	@echo "   - test"
	@echo ""
	@echo " + Builds:"
	@echo "   - build"
	@echo "   - clean"
	@echo "   - generate"
	@echo ""
	@echo "   - proto"
	@echo "   - proto-clean"
	@echo ""
	@echo " + Dep management:"
	@echo "   - vendor"
	@echo "   - dep-upgrade-all"
	@echo ""


##
## Development
##
bootstrap: copy-sample-config

copy-sample-config:
	for i in ethgas; do \
		test -f ./etc/$$i.conf || cp ./etc/$$i.conf{.sample,}; \
	done

define run
	@go run github.com/goware/rerun/cmd/rerun -watch ./ -ignore vendor bin tests -run \
		sh -c 'GOGC=off GO111MODULE=$(GOMODULES) go build -o ./bin/$(1) ./cmd/$(1) && ./bin/$(1) --config=./etc/$(1).conf'
endef

run:
	$(call run,ethgas)

test:
	export CONFIG=$(TOP)/etc/ethgas.test.conf && \
	$(MAKE) -j1 \
		test-pkgs

test-pkgs:
	GOGC=off GO111MODULE=$(GOMODULES) go test $(TEST_FLAGS) $(MOD_VENDOR) ./... | grep -v '\[no test files\]' | grep -v '\(cached\)'



##
## Builds
##
define build
	GOGC=off GO111MODULE=$(GOMODULES) GOBIN=$$PWD/bin \
	go install -v \
	  $(MOD_VENDOR) \
		-tags='$(BUILDTAGS)' \
		-gcflags='-e' \
		-ldflags='-X "github.com/0xsequence/ethgas-app.VERSION=$(VERSION)" -X "github.com/0xsequence/ethgas-app.GITBRANCH=$(GITBRANCH)" -X "github.com/0xsequence/ethgas-app.GITCOMMIT=$(GITCOMMIT)" -X "github.com/0xsequence/ethgas-app.GITCOMMITDATE=$(GITCOMMITDATE)" -X "github.com/0xsequence/ethgas-app.GITCOMMITAUTHOR=$(GITCOMMITAUTHOR)"' \
		$(1)
endef

build: build-ethgas

build-ethgas:
	$(call build, ./cmd/ethgas)

build-pkgs:
	GOGC=off GO111MODULE=$(GOMODULES) GOBIN=$$PWD/bin \
	go build -i -v \
	  $(MOD_VENDOR) \
		-tags='$(BUILDTAGS)' \
		-gcflags='-e' \
		-ldflags='-X "github.com/0xsequence/ethgas-app.VERSION=$(VERSION)" -X "github.com/0xsequence/ethgas-app.GITBRANCH=$(GITBRANCH)" -X "github.com/0xsequence/ethgas-app.GITCOMMIT=$(GITCOMMIT)" -X "github.com/0xsequence/ethgas-app.GITCOMMITDATE=$(GITCOMMITDATE)" -X "github.com/0xsequence/ethgas-app.GITCOMMITAUTHOR=$(GITCOMMITAUTHOR)"' \
		./...

generate:
	go generate ./...

clean:
	rm -rf ./bin/*

dist: BUILDTAGS += production
dist: clean generate build

proto: proto-clean
	go generate ./proto/...

proto-clean:
	rm -f ./proto/*.gen.go


##
## Dependency mgmt
##

# update ./vendor folder
.PHONY: vendor
vendor:
	@export GO111MODULE=on \
		go mod tidy && \
		rm -rf ./vendor && \
		go mod vendor && \
		go run github.com/goware/modvendor -copy="**/*.c **/*.h **/*.s **/*.proto"

# upgrade all go modules in go.mod to latest
dep-upgrade-all:
	@GO111MODULE=on go get -u=patch
	@$(MAKE) vendor


##
## Repo health checks
##
repository-check: large-file-check goimports-check

large-file-check:
	@find . -not -iname '*/.git/*' -name '*' -size +2048k -exec du -hs {} \; | grep '.*' && { echo; echo "Aborting due to big files in the git repository."; exit 1; } || :

goimports-check:
	@go run golang.org/x/tools/cmd/goimports -d $(shell find . -type f -name '*.go' -not -path "./vendor/*") | grep '.*' && { echo; echo "Aborting due to non-empty goimports output."; exit 1; } || :

clang-format-check:
	@which clang-format 2>/dev/null || echo "Get clang-format https://clang.llvm.org/docs/ClangFormat.html"
	@clang-format -i -style=LLVM $(shell find . -type f -name '*.proto' -not -path "./vendor/*")

