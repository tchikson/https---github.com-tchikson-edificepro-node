.PHONY: help start stop restart logs test lint migrate seed db-reset install build

help: ## Affiche l'aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Installe les dépendances
	npm install

start: ## Démarre les conteneurs Docker
	docker compose up -d

stop: ## Arrête les conteneurs Docker
	docker compose down

restart: ## Redémarre les conteneurs
	docker compose down
	docker compose up -d

logs: ## Affiche les logs des conteneurs
	docker compose logs -f

logs-app: ## Affiche les logs de l'application
	docker compose logs -f app

build: ## Build les images Docker
	docker compose build --no-cache

migrate: ## Lance les migrations
	docker compose exec app npx sequelize-cli db:migrate

seed: ## Lance les seeders
	docker compose exec app npx sequelize-cli db:seed:all

db-reset: ## Réinitialise la base (undo all + migrate + seed)
	docker compose exec app npx sequelize-cli db:migrate:undo:all
	docker compose exec app npx sequelize-cli db:migrate
	docker compose exec app npx sequelize-cli db:seed:all

test: ## Lance les tests
	npm test

test-coverage: ## Lance les tests avec couverture
	npm test -- --coverage

lint: ## Lance le linter
	npm run lint

lint-fix: ## Corrige automatiquement les erreurs de lint
	npx eslint src/ --fix

dev: ## Lance le serveur en mode développement
	npm run dev

shell: ## Ouvre un shell dans le conteneur app
	docker compose exec app sh

db-shell: ## Ouvre un shell PostgreSQL
	docker compose exec database psql -U app -d app
