# Contributing to Orbitra

Thank you for your interest in contributing to Orbitra! This document provides guidelines for contributing to the project.

## Development Setup

### Prerequisites
- Go 1.21 or later
- Git
- A NASA API key (optional, DEMO_KEY works for development)

### Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/orbitra.git
   cd orbitra
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your NASA API key (optional)
   ```

3. **Install dependencies**
   ```bash
   make install
   ```

4. **Run the application**
   ```bash
   make run
   # Or for development with auto-reload:
   make dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## Project Structure

```
orbitra/
├── cmd/                    # Application entry point
│   └── main.go
├── internal/               # Private application code
│   ├── config/            # Configuration management
│   ├── handlers/          # HTTP handlers
│   ├── middleware/        # HTTP middleware
│   ├── models/           # Data models
│   └── services/         # Business logic
├── static/               # Frontend assets
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript modules
│   └── index.html       # Main HTML file
├── data/                # Static data files
├── docs/                # Documentation
└── tests/               # Test files
```

## Development Guidelines

### Code Style
- Follow Go conventions and use `gofmt`
- Use meaningful variable and function names
- Add comments for exported functions and complex logic
- Keep functions small and focused

### Frontend Guidelines
- Use modern JavaScript (ES6+)
- Follow consistent naming conventions
- Keep CSS organized with CSS custom properties
- Ensure responsive design works on mobile devices

### Testing
- Write tests for new functionality
- Run tests before submitting: `make test`
- Aim for good test coverage: `make test-coverage`

### Git Workflow
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test your changes: `make test`
4. Format code: `make format`
5. Commit with descriptive messages
6. Push and create a pull request

## Available Make Commands

- `make help` - Show available commands
- `make install` - Install dependencies
- `make run` - Run the application
- `make dev` - Run with auto-reload
- `make build` - Build the application
- `make test` - Run tests
- `make test-coverage` - Run tests with coverage
- `make format` - Format Go code
- `make lint` - Run linter
- `make clean` - Clean build artifacts

## API Endpoints

### ISS Position
- **GET** `/api/iss` - Get current ISS position
- Response: `{"success": true, "data": {"latitude": 0, "longitude": 0, "timestamp": "..."}}`

### NASA Imagery
- **GET** `/api/nasa?lat=0&lng=0` - Get Earth imagery
- Response: `{"success": true, "data": {"url": "...", "title": "..."}}`

### NBL Simulation
- **GET** `/api/nbl` - Get simulation status
- **POST** `/api/nbl` - Submit game score

## Deployment

### Docker
```bash
make docker-build
make docker-run
```

### Docker Compose
```bash
docker-compose up -d
```

### Manual Deployment
```bash
make deploy-prep
# Copy build/ directory to your server
```

## Troubleshooting

### Common Issues
1. **Port already in use**: Change PORT in .env file
2. **NASA API rate limits**: Use your own API key instead of DEMO_KEY
3. **CORS issues**: Check middleware configuration

### Getting Help
- Check existing issues on GitHub
- Create a new issue with detailed description
- Include error messages and steps to reproduce

## License

By contributing to Orbitra, you agree that your contributions will be licensed under the MIT License.