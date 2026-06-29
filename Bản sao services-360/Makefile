# ============================================================================
# Residential Management - Makefile
# ============================================================================
# Usage: make [target]
# Run `make` or `make help` to see all available commands.
# ============================================================================

.PHONY: help
.DEFAULT_GOAL := help

# Container names
APP_CONTAINER := residential_app
DB_CONTAINER := residential_db
NGINX_CONTAINER := residential_nginx
FRONTEND_CONTAINER := residential_frontend

# Colors
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m
BOLD := \033[1m

# ============================================================================
# HELP
# ============================================================================

help: ## Show this help message
	@echo ""
	@echo "$(BOLD)Residential Management$(RESET) - Available Commands"
	@echo "============================================================"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"} \
		/^## ---/ { \
			gsub(/^## --- /, "", $$0); \
			gsub(/ ---$$/, "", $$0); \
			printf "\n$(BOLD)$(YELLOW)%s$(RESET)\n", $$0; \
			next \
		} \
		/^[a-zA-Z0-9_-]+:.*##/ { \
			printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2 \
		}' $(MAKEFILE_LIST)
	@echo ""

# ============================================================================
# DOCKER
# ============================================================================

## --- Docker ---

up: ## Start all containers in background
	docker compose up -d

down: ## Stop all containers
	docker compose down

build: ## Build/rebuild containers
	docker compose build

restart: ## Restart all containers
	docker compose restart

logs: ## Show logs from all containers (follow mode)
	docker compose logs -f

logs-app: ## Show logs from app container only
	docker compose logs -f $(APP_CONTAINER)

logs-db: ## Show logs from database container only
	docker compose logs -f $(DB_CONTAINER)

logs-frontend: ## Show logs from frontend container only
	docker compose logs -f $(FRONTEND_CONTAINER)

ps: ## Show running containers status
	docker compose ps

shell: ## Open a shell inside the app container
	docker exec -it $(APP_CONTAINER) bash

shell-db: ## Open psql shell inside the database container
	docker exec -it $(DB_CONTAINER) psql -U root -d residential_management

# ============================================================================
# SETUP & INSTALL
# ============================================================================

## --- Setup & Install ---

setup: ## Full project setup (composer install, env, key, migrate, npm)
	docker exec $(APP_CONTAINER) composer run setup

install: ## Install PHP dependencies
	docker exec $(APP_CONTAINER) composer install

install-npm: ## Install Node.js dependencies
	docker exec $(APP_CONTAINER) npm install

install-all: install install-npm ## Install all dependencies (PHP + Node.js)

update: ## Update PHP dependencies
	docker exec $(APP_CONTAINER) composer update

env: ## Copy .env.example to .env
	docker exec $(APP_CONTAINER) cp .env.example .env

key: ## Generate application key
	docker exec $(APP_CONTAINER) php artisan key:generate

# ============================================================================
# DEVELOPMENT
# ============================================================================

## --- Development ---

dev: ## Start development server (artisan serve + queue + logs + vite)
	docker exec $(APP_CONTAINER) composer run dev

serve: ## Start only the Laravel dev server
	docker exec $(APP_CONTAINER) php artisan serve --host=0.0.0.0 --port=8000

vite: ## Start Vite dev server (frontend hot reload)
	docker exec $(APP_CONTAINER) npm run dev

vite-build: ## Build frontend assets for production
	docker exec $(APP_CONTAINER) npm run build

tinker: ## Open Laravel Tinker (interactive PHP shell)
	docker exec -it $(APP_CONTAINER) php artisan tinker

routes: ## List all registered routes
	docker exec $(APP_CONTAINER) php artisan route:list

routes-api: ## List API routes only
	docker exec $(APP_CONTAINER) php artisan route:list --path=api

# ============================================================================
# DATABASE
# ============================================================================

## --- Database ---

migrate: ## Run database migrations
	docker exec $(APP_CONTAINER) php artisan migrate

migrate-fresh: ## Drop all tables and re-run all migrations
	docker exec $(APP_CONTAINER) php artisan migrate:fresh

migrate-fresh-seed: ## Drop all tables, re-run migrations, and seed
	docker exec $(APP_CONTAINER) php artisan migrate:fresh --seed

migrate-status: ## Show migration status
	docker exec $(APP_CONTAINER) php artisan migrate:status

migrate-rollback: ## Rollback the last migration batch
	docker exec $(APP_CONTAINER) php artisan migrate:rollback

seed: ## Run database seeders
	docker exec $(APP_CONTAINER) php artisan db:seed

db-show: ## Display database information
	docker exec $(APP_CONTAINER) php artisan db:show

db-wipe: ## Drop all tables, views, and types (use with caution)
	@echo "$(RED)WARNING: This will drop ALL tables!$(RESET)"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] && \
		docker exec $(APP_CONTAINER) php artisan db:wipe || \
		echo "Cancelled."

# ============================================================================
# TESTING
# ============================================================================

## --- Testing ---

test: ## Run all tests
	docker exec $(APP_CONTAINER) php artisan test --compact

test-unit: ## Run unit tests only
	docker exec $(APP_CONTAINER) php artisan test --compact --testsuite=Unit

test-feature: ## Run feature tests only
	docker exec $(APP_CONTAINER) php artisan test --compact --testsuite=Feature

test-modules: ## Run module tests only
	docker exec $(APP_CONTAINER) php artisan test --compact --testsuite=Modules

test-filter: ## Run tests matching a filter (usage: make test-filter F=testName)
	docker exec $(APP_CONTAINER) php artisan test --compact --filter=$(F)

test-file: ## Run tests in a specific file (usage: make test-file FILE=tests/Feature/ExampleTest.php)
	docker exec $(APP_CONTAINER) php artisan test --compact $(FILE)

test-coverage: ## Run tests with coverage report
	docker exec $(APP_CONTAINER) php artisan test --compact --coverage

# ============================================================================
# E2E TESTING (Playwright)
# ============================================================================

## --- E2E Testing ---

e2e-setup: ## Create/reset E2E test tenant (fresh DB + seed data)
	docker exec $(APP_CONTAINER) php artisan e2e:setup --fresh --no-interaction

e2e: ## Run E2E tests (Playwright, from host)
	cd frontend && npx playwright test

e2e-headed: ## Run E2E tests with visible browser
	cd frontend && npx playwright test --headed

e2e-ui: ## Open Playwright UI mode for debugging
	cd frontend && npx playwright test --ui

# ============================================================================
# CODE QUALITY
# ============================================================================

## --- Code Quality ---

lint: ## Check code style with Pint (dry run)
	docker exec $(APP_CONTAINER) vendor/bin/pint --test

format: ## Fix code style with Pint
	docker exec $(APP_CONTAINER) vendor/bin/pint

format-dirty: ## Fix code style for changed files only
	docker exec $(APP_CONTAINER) vendor/bin/pint --dirty

fe-lint: ## Run frontend ESLint check
	cd frontend && pnpm run lint

fe-lint-fix: ## Fix frontend ESLint issues
	cd frontend && pnpm run lint --fix

fe-typecheck: ## Run frontend TypeScript type check
	cd frontend && pnpm run typecheck

# ============================================================================
# CACHE & OPTIMIZATION
# ============================================================================

## --- Cache & Optimization ---

optimize: ## Cache config, routes, and views for production
	docker exec $(APP_CONTAINER) php artisan optimize

optimize-clear: ## Clear all cached files
	docker exec $(APP_CONTAINER) php artisan optimize:clear

cache-clear: ## Clear application cache
	docker exec $(APP_CONTAINER) php artisan cache:clear

config-cache: ## Cache configuration files
	docker exec $(APP_CONTAINER) php artisan config:cache

config-clear: ## Clear configuration cache
	docker exec $(APP_CONTAINER) php artisan config:clear

route-cache: ## Cache route files
	docker exec $(APP_CONTAINER) php artisan route:cache

route-clear: ## Clear route cache
	docker exec $(APP_CONTAINER) php artisan route:clear

view-clear: ## Clear compiled view files
	docker exec $(APP_CONTAINER) php artisan view:clear

# ============================================================================
# MAINTENANCE
# ============================================================================

## --- Maintenance ---

maintenance-on: ## Put application into maintenance mode
	docker exec $(APP_CONTAINER) php artisan down

maintenance-off: ## Bring application out of maintenance mode
	docker exec $(APP_CONTAINER) php artisan up

app-logs: ## Tail Laravel application logs
	docker exec $(APP_CONTAINER) php artisan pail

# ============================================================================
# FRONTEND (Nuxt.js)
# ============================================================================

## --- Frontend ---

fe-install: ## Install frontend dependencies
	docker exec $(FRONTEND_CONTAINER) pnpm install

fe-dev: ## Start frontend dev server
	docker exec $(FRONTEND_CONTAINER) pnpm run dev

fe-build: ## Build frontend for production
	docker exec $(FRONTEND_CONTAINER) pnpm run build

fe-shell: ## Open shell in frontend container
	docker exec -it $(FRONTEND_CONTAINER) sh


# ============================================================================
# API CLIENT (Orval)
# ============================================================================

## --- API Client ---

api-generate: ## Generate TypeScript types & Vue Query composables from backend Swagger
	docker exec $(APP_CONTAINER) php artisan scramble:export
	docker exec $(FRONTEND_CONTAINER) rm -rf lib/api/generated
	docker exec $(FRONTEND_CONTAINER) pnpm run api:generate

api-export: ## Export backend OpenAPI spec only
	docker exec $(APP_CONTAINER) php artisan scramble:export

# ============================================================================
# DEPLOY (K8s)
# ============================================================================
# Default env is "prod" (cluster rke2-demego). Override with K8S_ENV=dev for
# legacy cluster. Example: make k8s-status K8S_ENV=dev

K8S_ENV ?= prod
K8S_NS  := residential-management-$(K8S_ENV)
K8S_DIR := ./infra/k8s/app/$(K8S_ENV)

## --- Deploy ---

k8s-deploy: ## Deploy all services to K8s cluster (K8S_ENV=prod|dev)
	$(K8S_DIR)/deploy.sh

k8s-restart-be: ## Restart backend pods (pull latest image)
	kubectl rollout restart deployment/backend --namespace $(K8S_NS)
	kubectl rollout restart deployment/queue-worker --namespace $(K8S_NS)
	kubectl rollout status deployment/backend --namespace $(K8S_NS) --timeout=120s

k8s-restart-fe: ## Restart frontend pods (pull latest image)
	kubectl rollout restart deployment/frontend --namespace $(K8S_NS)
	kubectl rollout status deployment/frontend --namespace $(K8S_NS) --timeout=120s

k8s-restart-all: ## Restart all pods (pull latest images)
	kubectl rollout restart deployment/backend deployment/queue-worker deployment/frontend --namespace $(K8S_NS)
	kubectl rollout status deployment/backend --namespace $(K8S_NS) --timeout=120s
	kubectl rollout status deployment/frontend --namespace $(K8S_NS) --timeout=120s

k8s-status: ## Show pod status
	kubectl get pods --namespace $(K8S_NS)

k8s-logs: ## Show pod logs (usage: make k8s-logs POD=backend)
	kubectl logs -f deployment/$(POD) --namespace $(K8S_NS)

k8s-be: ## Exec into backend pod (php-fpm container)
	kubectl exec -it deployment/backend -c php-fpm --namespace $(K8S_NS) -- sh

k8s-fe: ## Exec into frontend pod
	kubectl exec -it deployment/frontend --namespace $(K8S_NS) -- sh

k8s-wk: ## Exec into queue worker pod
	kubectl exec -it deployment/queue-worker --namespace $(K8S_NS) -- sh

# ============================================================================
# K8S TUNNEL (rke2-demego via SSH)
# ============================================================================

## --- K8s Tunnel ---

RKE2_LOCAL_PORT := 16443
RKE2_VM_IP := 10.200.0.32
RKE2_SSH_HOST := demego-server
RKE2_CONTEXT := rke2-demego

tunnel-up: ## Start SSH tunnel to rke2-demego API (background)
	@if pgrep -f "ssh -fN -L $(RKE2_LOCAL_PORT):$(RKE2_VM_IP):6443 $(RKE2_SSH_HOST)" >/dev/null; then \
		echo "$(YELLOW)Tunnel already running.$(RESET)"; \
	else \
		ssh -fN -L $(RKE2_LOCAL_PORT):$(RKE2_VM_IP):6443 $(RKE2_SSH_HOST) && \
		echo "$(GREEN)Tunnel up on localhost:$(RKE2_LOCAL_PORT).$(RESET)"; \
	fi

tunnel-down: ## Stop SSH tunnel to rke2-demego
	@pkill -f "ssh -fN -L $(RKE2_LOCAL_PORT):$(RKE2_VM_IP):6443 $(RKE2_SSH_HOST)" && \
		echo "$(GREEN)Tunnel stopped.$(RESET)" || \
		echo "$(YELLOW)No tunnel running.$(RESET)"

tunnel-status: ## Show SSH tunnel status
	@pgrep -fl "ssh -fN -L $(RKE2_LOCAL_PORT):$(RKE2_VM_IP):6443 $(RKE2_SSH_HOST)" || \
		echo "$(YELLOW)No tunnel running.$(RESET)"

k8s-use-demego: ## Switch kubectl context to rke2-demego
	kubectl config use-context $(RKE2_CONTEXT)

k8s-demego-nodes: ## List nodes on rke2-demego (requires tunnel-up)
	kubectl --context=$(RKE2_CONTEXT) get nodes

ssh-host: ## SSH into CentOS host (demego-server)
	ssh $(RKE2_SSH_HOST)

ssh-vm: ## SSH into Ubuntu VM (rke2-vm, via ProxyJump)
	ssh rke2-vm
