# Orbitra - ISS Tracker Makefile

.PHONY: build run test clean dev install help

# Variables
BINARY_NAME=orbitra
MAIN_PATH=./cmd/main.go
BUILD_DIR=./build

# Default target
help: ## Show this help message
	@echo "Orbitra - ISS Tracker"
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	@echo "📦 Installing dependencies..."
	@go mod tidy
	@go mod download

build: ## Build the application
	@echo "🔨 Building $(BINARY_NAME)..."
	@mkdir -p $(BUILD_DIR)
	@go build -o $(BUILD_DIR)/$(BINARY_NAME) $(MAIN_PATH)
	@echo "✅ Build complete: $(BUILD_DIR)/$(BINARY_NAME)"

run: ## Run the application in development mode
	@echo "🚀 Starting Orbitra server..."
	@go run $(MAIN_PATH)

dev: ## Run with auto-reload (requires air: go install github.com/cosmtrek/air@latest)
	@echo "🔄 Starting development server with auto-reload..."
	@air

test: ## Run tests
	@echo "🧪 Running tests..."
	@go test -v ./...

test-coverage: ## Run tests with coverage
	@echo "📊 Running tests with coverage..."
	@go test -v -coverprofile=coverage.out ./...
	@go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report: coverage.html"

clean: ## Clean build artifacts
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf $(BUILD_DIR)
	@rm -f coverage.out coverage.html
	@echo "✅ Clean complete"

format: ## Format Go code
	@echo "🎨 Formatting code..."
	@go fmt ./...
	@echo "✅ Code formatted"

lint: ## Run linter (requires golangci-lint)
	@echo "🔍 Running linter..."
	@golangci-lint run

docker-build: ## Build Docker image
	@echo "🐳 Building Docker image..."
	@docker build -t orbitra:latest .

docker-run: ## Run Docker container
	@echo "🐳 Running Docker container..."
	@docker run -p 8080:8080 orbitra:latest

deploy-prep: clean build ## Prepare for deployment
	@echo "📦 Preparing deployment package..."
	@cp -r static $(BUILD_DIR)/
	@cp .env.example $(BUILD_DIR)/
	@echo "✅ Deployment package ready in $(BUILD_DIR)/"