# Amy - Recruitment Platform Makefile
# Comprehensive shortcuts for development, testing, and deployment

.PHONY: help install clean dev build start test lint docs db swagger docker

# Default target
help: ## Show this help message
	@echo "Amy - Recruitment Platform"
	@echo "=========================="
	@echo ""
	@echo "Available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Development URLs:"
	@echo "  API Server:       http://localhost:3001"
	@echo "  Swagger Docs:     http://localhost:3001/api/docs"
	@echo "  Landing Page:     http://localhost:5173"
	@echo "  Recruiter App:    http://localhost:5174"
	@echo "  Admin App:        http://localhost:5175"
	@echo ""

# =============================================================================
# INSTALLATION & SETUP
# =============================================================================

install: ## Install all dependencies
	@echo "📦 Installing dependencies..."
	pnpm install

clean: ## Clean all node_modules and build artifacts
	@echo "🧹 Cleaning project..."
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf packages/*/node_modules
	rm -rf apps/*/dist
	rm -rf packages/*/dist
	rm -rf .turbo
	@echo "✅ Clean complete"

fresh-install: clean install ## Clean install from scratch
	@echo "🆕 Fresh installation complete"

# =============================================================================
# DEVELOPMENT
# =============================================================================

dev: ## Start all development servers (API, Web, App, Admin)
	@echo "🚀 Starting all development servers..."
	pnpm dev

dev-api: ## Start API server only
	@echo "🚀 Starting API server..."
	pnpm dev:api

dev-web: ## Start landing page only
	@echo "🚀 Starting landing page..."
	pnpm dev:web

dev-app: ## Start recruiter app only
	@echo "🚀 Starting recruiter app..."
	pnpm dev:app

dev-admin: ## Start admin app only
	@echo "🚀 Starting admin app..."
	pnpm dev:admin

# =============================================================================
# BUILDING & PRODUCTION
# =============================================================================

build: ## Build all applications for production
	@echo "🔨 Building all applications..."
	pnpm build

build-api: ## Build API server only
	@echo "🔨 Building API server..."
	pnpm -C apps/api build

build-web: ## Build landing page only
	@echo "🔨 Building landing page..."
	pnpm -C apps/web build

build-app: ## Build recruiter app only
	@echo "🔨 Building recruiter app..."
	pnpm -C apps/app build

build-admin: ## Build admin app only
	@echo "🔨 Building admin app..."
	pnpm -C apps/admin build

start: ## Start production servers
	@echo "🚀 Starting production servers..."
	pnpm start

# =============================================================================
# DATABASE OPERATIONS
# =============================================================================

db-generate: ## Generate Prisma client
	@echo "⚡ Generating Prisma client..."
	pnpm db:generate

db-migrate: ## Run database migrations
	@echo "📊 Running database migrations..."
	pnpm db:migrate

db-seed: ## Seed database with test data
	@echo "🌱 Seeding database..."
	pnpm db:seed

db-studio: ## Open Prisma Studio
	@echo "🎨 Opening Prisma Studio..."
	pnpm db:studio

db-reset: ## Reset database (migrate + seed)
	@echo "🔄 Resetting database..."
	pnpm -C packages/db prisma migrate reset --force
	$(MAKE) db-seed

db-setup: db-generate db-migrate db-seed ## Complete database setup
	@echo "✅ Database setup complete"

# =============================================================================
# SWAGGER DOCUMENTATION
# =============================================================================

swagger-generate: ## Generate Swagger JSDoc comments for all routes
	@echo "📚 Generating Swagger documentation..."
	pnpm -C apps/api swagger:generate

swagger-update: ## Update Swagger descriptions with meaningful content
	@echo "📝 Updating Swagger descriptions..."
	pnpm -C apps/api swagger:update-descriptions

swagger-fix: ## Fix duplicate summaries and improve all descriptions
	@echo "🔧 Fixing Swagger descriptions..."
	pnpm -C apps/api swagger:fix

swagger-dev: ## Generate Swagger docs and start API server
	@echo "📚 Starting API with Swagger generation..."
	pnpm -C apps/api swagger:dev

swagger-open: ## Open Swagger documentation in browser
	@echo "🌐 Opening Swagger documentation..."
	@command -v open >/dev/null 2>&1 && open http://localhost:3001/api/docs || \
	 command -v xdg-open >/dev/null 2>&1 && xdg-open http://localhost:3001/api/docs || \
	 echo "Please open http://localhost:3001/api/docs in your browser"

docs: swagger-generate swagger-open ## Generate docs and open in browser

# =============================================================================
# TESTING
# =============================================================================

test: ## Run all tests
	@echo "🧪 Running tests..."
	pnpm test

test-ui: ## Run tests with UI
	@echo "🧪 Running tests with UI..."
	pnpm test:ui

test-coverage: ## Run tests with coverage report
	@echo "🧪 Running tests with coverage..."
	pnpm test:coverage

test-watch: ## Run tests in watch mode
	@echo "🧪 Running tests in watch mode..."
	pnpm test --watch

# =============================================================================
# CODE QUALITY
# =============================================================================

lint: ## Lint all code
	@echo "🔍 Linting code..."
	pnpm lint

lint-fix: ## Lint and fix all code
	@echo "🔧 Linting and fixing code..."
	pnpm lint --fix

type-check: ## Type check all TypeScript code
	@echo "📝 Type checking..."
	pnpm type-check

format: ## Format code with Prettier
	@echo "💅 Formatting code..."
	pnpm prettier --write .

quality: lint type-check ## Run all quality checks

# =============================================================================
# DOCKER OPERATIONS
# =============================================================================

docker-dev: ## Start development services (PostgreSQL, Redis, MinIO, MailHog)
	@echo "🐳 Starting development services..."
	docker-compose -f docker/docker-compose.dev.yml up -d

docker-dev-stop: ## Stop development services
	@echo "🛑 Stopping development services..."
	docker-compose -f docker/docker-compose.dev.yml down

docker-dev-logs: ## View logs from development services
	@echo "📋 Viewing development service logs..."
	docker-compose -f docker/docker-compose.dev.yml logs -f

docker-build-api: ## Build API Docker image
	@echo "🐳 Building API Docker image..."
	docker build -t amy-api apps/api

docker-build-web: ## Build Web Docker image
	@echo "🐳 Building Web Docker image..."
	docker build -t amy-web apps/web

docker-build-app: ## Build App Docker image
	@echo "🐳 Building App Docker image..."
	docker build -t amy-app apps/app

docker-build-admin: ## Build Admin Docker image
	@echo "🐳 Building Admin Docker image..."
	docker build -t amy-admin apps/admin

docker-build-all: docker-build-api docker-build-web docker-build-app docker-build-admin ## Build all Docker images

# =============================================================================
# UTILITY COMMANDS
# =============================================================================

health: ## Check if all services are running
	@echo "🏥 Checking service health..."
	@echo "API Server:"
	@curl -s http://localhost:3001/api/health | jq . || echo "❌ API not responding"
	@echo "\nWeb Apps:"
	@curl -s -I http://localhost:5173 | head -n1 || echo "❌ Web app not responding"
	@curl -s -I http://localhost:5174 | head -n1 || echo "❌ Recruiter app not responding"
	@curl -s -I http://localhost:5175 | head -n1 || echo "❌ Admin app not responding"

logs: ## Show logs from development servers
	@echo "📋 Showing development logs..."
	@echo "Check your terminal windows or use 'make docker-dev-logs' for Docker services"

ports: ## Show which ports are in use
	@echo "🔌 Checking ports..."
	@echo "Port 3001 (API):"
	@lsof -i :3001 || echo "Not in use"
	@echo "\nPort 5173 (Web):"
	@lsof -i :5173 || echo "Not in use"
	@echo "\nPort 5174 (App):"
	@lsof -i :5174 || echo "Not in use"
	@echo "\nPort 5175 (Admin):"
	@lsof -i :5175 || echo "Not in use"

kill-ports: ## Kill processes on development ports
	@echo "💀 Killing processes on development ports..."
	@lsof -ti :3001 | xargs kill -9 2>/dev/null || echo "Port 3001 clear"
	@lsof -ti :5173 | xargs kill -9 2>/dev/null || echo "Port 5173 clear"
	@lsof -ti :5174 | xargs kill -9 2>/dev/null || echo "Port 5174 clear"
	@lsof -ti :5175 | xargs kill -9 2>/dev/null || echo "Port 5175 clear"
	@echo "✅ All ports cleared"

# =============================================================================
# QUICK START WORKFLOWS
# =============================================================================

setup: install db-setup ## Complete project setup for new developers
	@echo "🎉 Project setup complete!"
	@echo ""
	@echo "Next steps:"
	@echo "1. Copy env.example to .env and configure"
	@echo "2. Run 'make docker-dev' to start services"
	@echo "3. Run 'make dev' to start development servers"
	@echo "4. Open http://localhost:3001/api/docs for API documentation"

quick-start: docker-dev db-setup dev ## Quick start everything (Docker + DB + Dev servers)

reset: kill-ports clean fresh-install db-reset ## Nuclear reset - clean everything and start fresh
	@echo "💥 Complete reset finished!"

# =============================================================================
# DEPLOYMENT HELPERS
# =============================================================================

deploy-check: build test lint type-check ## Pre-deployment checks
	@echo "✅ All deployment checks passed!"

version: ## Show version information
	@echo "Amy Recruitment Platform"
	@echo "Node.js: $$(node --version)"
	@echo "pnpm: $$(pnpm --version)"
	@echo "Docker: $$(docker --version 2>/dev/null || echo 'Not installed')"

# =============================================================================
# DEVELOPMENT ALIASES (shorter commands)
# =============================================================================

d: dev ## Alias for 'make dev'
b: build ## Alias for 'make build'
t: test ## Alias for 'make test'
l: lint ## Alias for 'make lint'
s: swagger-open ## Alias for 'make swagger-open' 