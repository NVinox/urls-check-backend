DC_DEV = docker-compose --env-file .env.development.local -f docker-compose.dev.yml

.PHONY: dev stop-dev down-dev clean

dev:
	$(DC_DEV) up --build -d

stop-dev:
	$(DC_DEV) stop

down-dev:
	$(DC_DEV) down

clean:
	$(DC_DEV) down -v --rmi all