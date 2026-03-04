# 🚀 Web App Template

![Backend Coverage](https://img.shields.io/badge/backend-48%25-red?style=flat-square&logo=dotnet) ![Unit Test Coverage](https://img.shields.io/badge/unit%20tests-76%25-yellowgreen?style=flat-square&logo=jest) ![E2E Test Coverage](https://img.shields.io/badge/e2e%20tests-25%25-red?style=flat-square&logo=cypress)

![Node.js](https://img.shields.io/badge/node-24%2B-brightgreen?style=flat-square&logo=node.js) ![Vulnerabilities](https://img.shields.io/badge/vulnerabilities-0-brightgreen?style=flat-square)

A modern, secure management system built with React (Frontend) and .NET (Backend).

## Project Overview

This is a production-ready full-stack web application template designed as a starting point for new projects. It provides a comprehensive admin dashboard with user management, role-based access control, audit logging, and enterprise-grade security features out of the box.

**Key Features:**
- Secure JWT-based authentication with automatic token refresh
- Role-based access control (RBAC) with granular permissions
- User, role, and permission management
- Comprehensive audit logging
- Rate limiting and account lockout protection
- Responsive UI with light/dark theme support

## Technologies Used

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI library |
| TypeScript | 5.9 | Type safety |
| Vite | 7.3 | Build tool and dev server |
| React Router | 7.13 | Client-side routing |
| TanStack Query | 5.90 | Server state management |
| Redux Toolkit | 2.11 | Client state (auth, theme) |
| Tailwind CSS | 4.2 | Styling framework |
| Zod | 4.3 | Schema validation |
| React Hook Form | 7.71 | Form management |
| Lucide React | 0.577 | Icons |
| Jest | 30.2 | Unit testing |
| Cypress | 15.11 | E2E testing (with parallel support) |
| ESLint | 9.39 | Code linting |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| .NET | 10 | Application framework |
| ASP.NET Core | 10 | Web API framework |
| Entity Framework Core | 9.0 | ORM |
| PostgreSQL (Npgsql) | 9.0 | Database |
| ASP.NET Core Identity | 9.0 | User management |
| JWT Bearer Auth | 10.0 | Token-based authentication |
| Serilog | 4.3 | Structured logging |
| Swagger/OpenAPI | 10.0 | API documentation |
| NSwag | 14.6 | Code generation |
| xUnit | - | Unit testing |

### Tools & Infrastructure
- **NSwag 14** - OpenAPI to TypeScript code generation
- **Custom Constants Generator** - C# to TypeScript constant generation
- **c8** - Native V8 code coverage (Node.js 24+ compatible)
- **Git** - Version control

## Project Structure

```
Template/
├── Template.Client/     # React Frontend
│   ├── src/
│   │   ├── components/              # App components (Layout, EntityToolbar, Guards, etc.); UI primitives from solstice-ui
│   │   ├── pages/                   # Page components
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── store/                   # Redux store (slices)
│   │   ├── services/                # API services
│   │   ├── models/                  # TypeScript types/interfaces
│   │   ├── config/                  # App configuration
│   │   ├── utils/                   # Utility functions
│   │   ├── mock/                    # Mock data for development
│   │   └── test/                    # Test utilities
│   └── cypress/                     # E2E tests
├── Template.Server/     # .NET Backend API
│   ├── Controllers/                 # API controllers
│   ├── Services/                    # Business logic
│   ├── DTOs/                        # Data transfer objects
│   ├── Handlers/                    # Authorization handlers
│   └── Attributes/                  # Custom attributes
├── Template.Data/       # Database models & migrations
│   ├── Common/                      # Shared types (Result, PagedResult, PagedResultParams)
│   └── Constants/                   # Centralized permission/role constants
├── Template.Tests/      # Backend unit tests
├── Documentation/                   # Detailed documentation
├── scripts/                         # Main scripts (see scripts/README.md)
│   ├── start.command                # Start all services (DB + Backend + Frontend)
│   ├── add-migration.command        # Create EF Core migration
│   ├── regenerate-models.command    # Regenerate TS models & constants
│   ├── clean.command                # Clean build artifacts
│   └── generate-test-report.command # Full coverage pipeline
├── test-coverage/                   # Coverage step scripts (see test-coverage/README.md)
├── generate-constants.js            # C# to TypeScript constant generator (run via scripts)
└── README.md                        # This file
```

## Setup & Installation

### Prerequisites

- **Node.js** 24+ (for frontend) - fully compatible with latest Node.js
- **.NET 10 SDK** (for backend)
- **PostgreSQL** 14+ (for database)
- **Git**

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Template
   ```

2. **Backend Setup**
   ```bash
   cd Template.Server
   dotnet restore
   dotnet ef database update
   ```

3. **Frontend Setup**
   ```bash
   cd Template.Client
   npm install
   ```
   The Client uses the **Solstice UI** component library from a sibling folder: `"solstice-ui": "file:../../solstice-ui"`. Ensure the Solstice UI repo/folder is cloned or linked at that path and named **solstice-ui**. For full UI library and component docs, see [UI Library and Components](Documentation/UI-Library-and-Components.md).

4. **Environment Configuration**

   **Backend** (`appsettings.Development.json`):
   ```json
   {
     "ConnectionStrings": {
       "DbConnectionString": "Host=localhost;Database=template;Username=postgres;Password=password"
     },
     "Jwt": {
       "Issuer": "Template",
       "Audience": "Template.Users",
       "SigningKey": "your-super-secret-key-here-minimum-32-characters",
       "ExpiryHours": 8
     }
   }
   ```

   **Frontend** (`.env.local`):
   ```bash
   VITE_API_URL=http://localhost:5249
   VITE_USE_MOCK_DATA=false
   ```

## Running the Project

### Development Mode

1. **Start Backend**
   ```bash
   cd Template.Server
   dotnet run
   ```
   - API: http://localhost:5249 (http) or https://localhost:7168 (https)
   - Swagger UI: http://localhost:5249/swagger

2. **Start Frontend**
   ```bash
   cd Template.Client
   npm run dev
   ```
   - Frontend: http://localhost:3000

### Production Build

```bash
# Backend
cd Template.Server
dotnet publish -c Release -o ./publish

# Frontend
cd Template.Client
npm run build
```

## Scripts & Commands

### Backend Commands

```bash
# Development
dotnet run                    # Run application
dotnet watch run             # Run with hot reload
dotnet build                 # Build application

# Database
dotnet ef migrations add <name>     # Create migration
dotnet ef database update          # Apply migrations

# Testing
dotnet test                   # Run all tests
```

### Frontend Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run unit tests
npm run test:coverage    # Run tests with coverage
npm run cypress:open     # Open Cypress test runner
npm run cypress:run      # Run Cypress tests headlessly (sequential)
npm run cypress:run:parallel   # Run Cypress in parallel (4 processes, ~3-4x faster)
```

### Code Generation

```bash
# Regenerate TypeScript models AND constants from C# (run from project root)
./scripts/regenerate-models.command   # macOS / Linux / Git Bash

# Or: npm run regenerate-models

# This runs: dotnet build, NSwag, then node generate-constants.js
# Generated: Template.Client/src/models/generated.ts, .../config/generated/permissionKeys.generated.ts
```

### Quick Start (All Services)

See **[scripts/README.md](scripts/README.md)** for full details. From project root (macOS/Linux/Git Bash):

```bash
# Start PostgreSQL + Backend + Frontend
./scripts/start.command
# Or: npm run start:full

# Create a new EF Core migration (prompts for name)
./scripts/add-migration.command

# Clean build artifacts (bin, obj, node_modules, dist, coverage)
./scripts/clean.command
# Or: npm run clean:scripts
```

### Coverage Scripts

Full coverage pipeline is in **scripts**. See [scripts/README.md](scripts/README.md#coverage-generate-test-report).

```bash
# Run all coverage (Backend + Jest + Cypress → extract → badges)
./scripts/generate-test-report.command
# Or: npm run coverage

# Individual steps (in test-coverage/)
./test-coverage/1-run-be-coverage.sh        # Backend (.NET) only
./test-coverage/2-run-fe-jest-coverage.sh   # Frontend Jest only
./test-coverage/3-run-fe-cypress-coverage.sh  # Frontend Cypress only (uses parallel)

# Extract results and update badges
node test-coverage/4-extract-results.js
node test-coverage/5-update-readme-badges.js
```

### Cleanup Scripts

```bash
# Clean frontend only (from Template.Client)
npm run clean           # Clean coverage artifacts
npm run clean:all       # Clean everything including node_modules
```

See [scripts/README.md](scripts/README.md) for detailed documentation.

## Testing

### Test Frameworks

- **Backend**: xUnit for unit and integration tests
- **Frontend**: Jest + React Testing Library for unit tests
- **E2E**: Cypress for end-to-end testing

### Running Tests

```bash
# Backend tests
dotnet test Template.Tests

# Frontend unit tests
cd Template.Client
npm test

# E2E tests
npm run cypress:run
```

For detailed testing information, see [Testing Guide](Documentation/Testing-Guide.md).

## Documentation

| Guide | Description |
|-------|-------------|
| [Development Guide](Documentation/Development-Guide.md) | Setup, architecture, and development guidelines |
| [Testing Guide](Documentation/Testing-Guide.md) | Jest and backend testing strategies |
| [Cypress Guide](Documentation/Cypress-Testing-Complete.md) | E2E testing with Cypress |
| [Design Guide](Documentation/Design-Guide.md) | UI/UX design principles |
| [UI Library and Components](Documentation/UI-Library-and-Components.md) | Solstice UI architecture, component list, and reference page |
| [Authentication System](Documentation/Complete-Authentication-System.md) | JWT auth, token refresh, flows |
| [Security Enhancements](Documentation/Security-Enhancements.md) | Rate limiting, lockout, audit logging |
| [Security Database Schema](Documentation/Security-Database-Schema.md) | Database design for security |
| [Changelog](Documentation/Changelog.md) | Version history and changes |
| [Scripts (incl. coverage)](scripts/README.md) | Main scripts & test coverage |

**API Documentation**: [Swagger UI](http://localhost:5249/swagger) (when running)

---

**Built with ❤️ for modern management**

**Version**: 3.2
