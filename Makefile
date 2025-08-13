# Accompli Development Environment

.PHONY: help dev build test lint clean db-migrate db-reset db-seed

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development
dev: ## Start all services in development mode
	docker-compose up -d db redis minio
	pnpm dev

build: ## Build all services for production
	pnpm build

test: ## Run all tests
	pnpm test

lint: ## Lint all code
	pnpm lint

format: ## Format all code
	pnpm format

typecheck: ## Type check all TypeScript code
	pnpm typecheck

clean: ## Clean all build artifacts and dependencies
	pnpm clean
	docker-compose down -v
	docker system prune -f

# Database
db-migrate: ## Run database migrations
	cd services/api && alembic upgrade head

db-reset: ## Reset database and run migrations
	docker-compose down -v db
	docker-compose up -d db
	sleep 5
	$(MAKE) db-migrate
	$(MAKE) db-seed

db-seed: ## Seed database with sample data
	cd services/api && python -m app.db.seed

# Docker
docker-build: ## Build all Docker images
	docker-compose build

docker-up: ## Start all services with Docker
	docker-compose up -d

docker-down: ## Stop all Docker services
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

# Production
deploy-staging: ## Deploy to staging environment
	@echo "Deploying to staging..."
	# Add staging deployment commands

deploy-prod: ## Deploy to production environment
	@echo "Deploying to production..."
	# Add production deployment commands
