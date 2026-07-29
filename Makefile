DC_DEV = docker-compose --env-file .env.development.local -f docker-compose.dev.yml

.PHONY: dev stop-dev down-dev clean mig-gen mig-run mig-revert

dev:
	$(DC_DEV) up --build -d

stop-dev:
	$(DC_DEV) stop

down-dev:
	$(DC_DEV) down

clean:
	$(DC_DEV) down -v --rmi all

mig-gen:
	docker exec -it urls-check-api npm run typeorm -- migration:generate src/migrations/$(name) -d src/config/data-source.config.ts

mig-run:
	docker exec -it urls-check-api npm run migration:run

mig-revert:
	docker exec -it urls-check-api npm run typeorm -- migration:revert -d src/config/data-source.config.ts