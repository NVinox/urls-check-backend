DC_DEV = docker-compose --env-file .env.development.local -f docker-compose.dev.yml
DC_PROD = docker-compose --env-file .env.production.local -f docker-compose.prod.yml

.PHONY: dev stop-dev down-dev prod stop-prod down-prod clean mig-gen mig-run mig-run-prod mig-revert-prod mig-revert

dev:
	$(DC_DEV) up --build -d

stop-dev:
	$(DC_DEV) stop

down-dev:
	$(DC_DEV) down

prod:
	$(DC_PROD) up --build -d

stop-prod:
	$(DC_PROD) stop

down-prod:
	$(DC_PROD) down

clean:
	$(DC_DEV) down -v --rmi all
	$(DC_PROD) down -v --rmi all

mig-gen:
	docker exec -it urls-check-api npm run typeorm -- migration:generate src/migrations/$(name) -d src/config/data-source.config.ts

mig-run:
	docker exec -it urls-check-api npm run migration:run

mig-revert:
	docker exec -it urls-check-api npm run typeorm -- migration:revert -d src/config/data-source.config.ts

mig-run-prod:
	docker exec -it urls-check-api npm run migration:run:prod

mig-revert-prod:
	docker exec -it urls-check-api npm run typeorm:prod -- migration:revert -d dist/config/data-source.config.js