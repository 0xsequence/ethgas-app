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
