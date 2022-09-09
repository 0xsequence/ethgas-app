all:
	@echo "*****************************************************************"
	@echo "**                     ETHGas Build Tool                       **"
	@echo "*****************************************************************"


##
## Docker
##
docker-build-api:
	docker build -f Dockerfile.api -t ethgas/api .

docker-build-webapp:
	docker build -f Dockerfile.webapp -t ethgas/webapp .

docker-run-api:
	docker run --name ethgas-api -d -e VIRTUAL_HOST=api.ethgas.app \
		-p 4444:4444 -v /etc/ethgas.conf:/etc/ethgas.conf \
		--log-opt max-size=100m --log-opt max-file=5 \
		ethgas/api

docker-run-webapp:
	docker run --name ethgas-webapp -d \
		-e VIRTUAL_HOST=ethgas.app \
		-p 5555:80 \
		--log-opt max-size=100m --log-opt max-file=5 \
		ethgas/webapp

docker-run-nginx:
	docker run -d --name=nginx -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock \
	--log-opt max-size=100m --log-opt max-file=5 \
	jwilder/nginx-proxy
