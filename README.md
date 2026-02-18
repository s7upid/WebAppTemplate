# 🚀 Web App Template

![Backend Coverage](https://img.shields.io/badge/backend-73%25-yellowgreen?style=flat-square&logo=dotnet) ![Unit Test Coverage](https://img.shields.io/badge/unit%20tests-70%25-yellowgreen?style=flat-square&logo=jest) ![E2E Test Coverage](https://img.shields.io/badge/e2e%20tests-27%25-red?style=flat-square&logo=cypress)

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
| TypeScript | 5.3 | Type safety |
| Vite | 7.1 | Build tool and dev server |
| React Router | 7.9 | Client-side routing |
| TanStack Query | 5.9 | Server state management |
| Redux Toolkit | 2.0 | Client state (auth, theme) |
| Tailwind CSS | 4.1 | Styling framework |
| Zod | 4.1 | Schema validation |
| React Hook Form | 7.48 | Form management |
| Lucide React | 0.562 | Icons |
| Jest | 30 | Unit testing |
| Cypress | 15 | E2E testing |
| ESLint | 9.28 | Code linting |

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
│   │   ├── components/              # Reusable UI components
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
├── test-coverage/                   # Coverage scripts (.bat + .sh)
├── generate-constants.js            # C# to TypeScript constant generator
├── start.sh / start.bat             # Start all services (DB + Backend + Frontend)
├── add-migration.sh / .bat          # Create EF Core migration
├── regenerate-models-for-fe.sh / Regenerate-models-for-FE.bat  # Regenerate TS models
├── clean-bin-obj-folders.sh / Clean-bin-obj-folders.bat         # Clean build artifacts
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
npm run cypress:run      # Run Cypress tests headlessly
```

### Code Generation

```bash
# Regenerate TypeScript models AND constants from C# (run from project root)
./regenerate-models-for-fe.sh        # macOS / Linux
Regenerate-models-for-FE.bat         # Windows

# This runs:
# 1. dotnet build (builds backend)
# 2. dotnet tool run nswag run nswag.json (generates models)
# 3. node generate-constants.js (generates permission/role constants)

# Generated files:
# - Template.Client/src/models/generated.ts
# - Template.Client/src/config/generated/permissionKeys.generated.ts
```

### Quick Start (All Services)

```bash
# Start PostgreSQL + Backend + Frontend in one command
./start.sh                           # macOS / Linux
start.bat                            # Windows

# Create a new EF Core migration
./add-migration.sh                   # macOS / Linux
add-migration.bat                    # Windows

# Clean all build artifacts (bin, obj, node_modules, dist, coverage)
./clean-bin-obj-folders.sh           # macOS / Linux
Clean-bin-obj-folders.bat            # Windows
```

### Coverage Scripts

All coverage scripts are in the [`test-coverage/`](test-coverage/README.md) folder (available as both `.bat` and `.sh`):

```bash
# Run all coverage (Backend + Jest + Cypress)
./test-coverage/0-run-all-coverage.sh        # macOS / Linux
test-coverage\0-run-all-coverage.bat         # Windows

# Run individual scripts
./test-coverage/1-run-be-coverage.sh         # Backend (.NET) only
./test-coverage/2-run-fe-jest-coverage.sh    # Frontend Jest only
./test-coverage/3-run-fe-cypress-coverage.sh # Frontend Cypress only

# Extract results and update badges (after running tests)
cd test-coverage
node 4-extract-results.js
node 5-update-readme-badges.js

# Clean up all coverage artifacts
./test-coverage/cleanup.sh                   # macOS / Linux
test-coverage\cleanup.bat                    # Windows
```

### Cleanup Scripts

```bash
# Clean all coverage artifacts (from project root)
./test-coverage/cleanup.sh           # macOS / Linux
test-coverage\cleanup.bat            # Windows

# Clean frontend only (from Template.Client)
npm run clean           # Clean coverage artifacts
npm run clean:all       # Clean everything including node_modules
```

See [test-coverage/README.md](test-coverage/README.md) for detailed documentation.

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
| [Authentication System](Documentation/Complete-Authentication-System.md) | JWT auth, token refresh, flows |
| [Security Enhancements](Documentation/Security-Enhancements.md) | Rate limiting, lockout, audit logging |
| [Security Database Schema](Documentation/Security-Database-Schema.md) | Database design for security |
| [Changelog](Documentation/Changelog.md) | Version history and changes |
| [Coverage Scripts](test-coverage/README.md) | Test coverage generation |

**API Documentation**: [Swagger UI](http://localhost:5249/swagger) (when running)

---

**Built with ❤️ for modern management**

**Version**: 3.1
