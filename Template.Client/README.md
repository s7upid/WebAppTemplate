# 🎨 Template - Frontend

A modern React-based frontend template with TypeScript, Vite, and comprehensive testing — ready to be extended for any project.

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Technologies](#-technologies)
- [Development](#-development)
- [Testing](#-testing)
- [Authentication](#-authentication)
- [Components](#-components)
- [State Management](#-state-management)
- [Styling](#-styling)
- [API Integration](#-api-integration)
- [Build & Deployment](#-build--deployment)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 24+ (fully compatible with latest Node.js)
- **npm** 10+
- **Git**

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access the application
# http://localhost:3000
```

### Environment Setup

Create `.env.local` file:

```bash
# API Configuration
VITE_API_URL=http://localhost:5249

# Mock Data (for development)
VITE_USE_MOCK_DATA=false

# Environment
VITE_NODE_ENV=development
```

## 📁 Project Structure

```
Template.Client/
├── 📁 public/                    # Static assets
├── 📁 src/
│   ├── 📁 components/            # App-specific UI components (exported from @/components)
│   │   ├── 📁 AuditLogCard/      # Audit log card (compact/modern)
│   │   ├── 📁 AuditLogTimeline/  # Audit timeline
│   │   ├── 📁 AvatarUploader/   # Avatar upload with preview
│   │   ├── 📁 BasePage/          # Page wrapper with tabs
│   │   ├── 📁 EntityToolbar/     # Search, filters, sort for grids
│   │   ├── 📁 Guards/            # PermissionGuard, RoleGuard
│   │   ├── 📁 Layout/            # Layout, UserMenu
│   │   └── 📁 QuickActions/      # Quick action buttons
│   ├── 📁 pages/                 # Page components
│   │   ├── 📁 auth/              # Authentication pages
│   │   ├── 📁 users/             # User management (grid, detail, pending)
│   │   ├── 📁 roles/             # Role management
│   │   ├── 📁 permissions/       # Permission management
│   │   ├── 📁 dashboards/        # Role-based dashboards
│   │   ├── 📁 audit/             # Audit logs
│   │   └── 📁 password/          # Forgot password, reset
│   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── 📁 queries/           # TanStack Query (useUsersQuery, useRolesQuery, etc.)
│   │   ├── 📁 auth/              # Authentication hooks
│   │   └── 📁 ui/                # useToast, useTheme, useGridFilters, usePaginationWithScroll, useDetailPageHeader
│   ├── 📁 services/             # API services
│   │   ├── 📁 base/              # Base service classes
│   │   ├── 📁 auth/              # Authentication service
│   │   └── 📁 entities/          # Entity services (users, roles, etc.)
│   ├── 📁 store/                 # Redux store (client state only)
│   │   ├── 📁 slices/            # authSlice, themeSlice
│   │   └── index.ts              # Store configuration
│   ├── 📁 utils/                 # Utility functions (scrollToTop, cn, env, logger, etc.)
│   ├── 📁 models/                # TypeScript models (generated + shared, e.g. createEmptyPagedResult)
│   ├── 📁 config/                # navigation, constants, generated/ (permissionKeys.generated.ts)
│   ├── 📁 validations/           # Zod schemas
│   ├── 📁 mock/                  # Mock data for development
│   ├── 📁 test/                  # Test utilities and __mocks__ (e.g. solstice-ui)
│   ├── App.tsx                   # Main application component
│   ├── index.tsx                 # Entry point
│   └── index.css                 # Global styles (Tailwind + theme-aware classes)
├── 📁 cypress/                   # E2E tests
├── package.json                 # Dependencies and scripts
├── vite.config.ts               # Vite configuration
├── tailwind.config.ts           # Tailwind CSS (darkMode: 'class')
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

**UI library:** Primitives (Button, Card, Input, DataPage, LoadingSpinner, EmptyState, Dialog, etc.) come from **solstice-ui**. Import them from `"solstice-ui"`; do not re-export from `@/components`. Use **DataPage** with `layout="grid"` or `layout="list"` for grid/list pages; use **Dialog** with `footerActions` for confirmations (or the app’s **ConfirmationDialog** from `@/components`).

## 🛠️ Technologies

### Core Technologies

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2 | UI library |
| TypeScript | 5.9 | Type safety |
| Vite | 7.3 | Build tool and dev server |
| React Router | 7.13 | Client-side routing |

### State Management

| Package | Version | Purpose |
|---------|---------|---------|
| TanStack Query | 5.90 | Server state management (API data) |
| Redux Toolkit | 2.11 | Client state (auth, theme) |
| React Redux | 9.2 | React bindings for Redux |

### Forms & Validation

| Package | Version | Purpose |
|---------|---------|---------|
| React Hook Form | 7.71 | Form state management |
| Zod | 4.3 | Schema validation |
| @hookform/resolvers | 5.2 | Zod integration |

### Styling

| Package | Version | Purpose |
|---------|---------|---------|
| Tailwind CSS | 4.2 | Utility-first CSS framework |
| Lucide React | 0.577 | Icons |
| clsx + tailwind-merge | - | Class name utilities |

### Testing

| Package | Version | Purpose |
|---------|---------|---------|
| Jest | 30.2 | Unit testing framework |
| React Testing Library | 16.3 | Component testing |
| Cypress | 15.11 | End-to-end testing |
| cypress-split | 1.24 | Parallel spec distribution |
| concurrently | 9.2 | Run multiple Cypress processes |
| c8 | 11.0 | Native V8 code coverage |

### Development Tools

| Package | Version | Purpose |
|---------|---------|---------|
| ESLint | 9.39 | Code linting |
| typescript-eslint | 8.56 | TypeScript ESLint support |
| Vite | 7.3 | Fast development server |

## 🚀 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run test:ci          # Run tests for CI/CD

# E2E Testing
npm run cypress:open     # Open Cypress test runner
npm run cypress:run      # Run Cypress tests headlessly (sequential)
npm run cypress:run:parallel   # Run in parallel (4 processes, ~3-4x faster)

# Cleanup
npm run clean            # Clean coverage artifacts
npm run clean:all        # Clean everything including node_modules

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Run ESLint with auto-fix
npm run typecheck       # TypeScript check (tsc --noEmit)
```

### Development Workflow

1. **Start Backend**: Ensure backend is running on port 5249
2. **Start Frontend**: `npm run dev`
3. **Access Application**: http://localhost:3000
4. **Run Tests**: `npm test` for unit tests
5. **E2E Tests**: `npm run cypress:open` for end-to-end testing

### Code Generation

TypeScript models and constants are auto-generated from the backend C# code:

```bash
# From project root (run when backend models or permissions change)
./scripts/regenerate-models.command   # or: npm run regenerate-models
```

This generates:
- `src/models/generated.ts` - DTOs and types from NSwag
- `src/config/generated/permissionKeys.generated.ts` - Permission and role constants

**Usage:**

```typescript
import { UserResponse } from "@/models/generated";
import { PERMISSION_KEYS, ROLE_NAMES } from "@/config";

// Permission checking
if (hasPermission(PERMISSION_KEYS.USERS.VIEW)) { ... }

// Role guards
<RoleGuard allowedRoles={[ROLE_NAMES.ADMINISTRATOR]} />
```

> ⚠️ Never edit generated files directly! Modify the backend and regenerate.

## 🧪 Testing

### Unit Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- Button.test.tsx
```

### Test Structure

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx      # Component tests
│       └── Button.stories.tsx   # Storybook stories
├── pages/
│   └── LoginPage/
│       ├── LoginPage.tsx
│       └── LoginPage.test.tsx   # Page tests
└── services/
    └── authService.test.ts      # Service tests
```

### Testing Best Practices

- **Component Testing**: Test user interactions and rendering
- **Service Testing**: Mock API calls and test business logic
- **Integration Testing**: Test component interactions
- **Accessibility Testing**: Ensure components are accessible

### E2E Testing with Cypress

```bash
# Open Cypress test runner
npm run cypress:open

# Run Cypress tests headlessly (sequential)
npm run cypress:run

# Run in parallel (4 processes, ~3-4x faster)
npm run cypress:run:parallel

# Run with coverage (parallel + merge)
npm run cypress:run:parallel:coverage
npm run cypress:merge-coverage

# Full coverage pipeline (from project root)
./scripts/generate-test-report.command   # or: npm run coverage
```
## 🔐 Authentication

### Authentication Flow

The frontend implements a comprehensive authentication system:

1. **Login Process**

   - User submits credentials
   - API validates and returns JWT token
   - Token stored in secure storage
   - User redirected to dashboard

2. **Token Management**

   - Automatic token refresh before expiration
   - Proactive refresh (5 minutes before expiry)
   - Reactive refresh (on 401 responses)
   - Secure token storage

3. **Logout Process**
   - Token blacklisted on backend
   - Local storage cleared
   - User redirected to login

### Authentication Hook

```typescript
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Dashboard user={user} />;
}
```

### Permission Checking

```typescript
import { usePermissions } from "@/hooks/usePermissions";

function ProtectedComponent() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("users:view")) {
    return <AccessDenied />;
  }

  return <UserManagement />;
}
```

## 🧩 Components

### App components (`@/components`)

These are exported from `src/components/index.ts`:

| Component | Description |
|-----------|-------------|
| **QuickActions** | Quick action button group |
| **AuditLogCard** | Audit event card (compact or modern variant) |
| **AuditLogTimeline** | Timeline of audit events |
| **AvatarUploader** | Avatar upload with preview |
| **BasePage** | Page wrapper with optional tabs |
| **EntityToolbar** | Search, filters, sort for grid pages |
| **PermissionGuard** | Renders children only if user has permission(s) |
| **RoleGuard** | Renders children only if user has role(s) |
| **Layout** | Main app layout (sidebar, header, theme toggle) |
| **UserMenu** | User dropdown in header |

### UI primitives (solstice-ui)

Import from `"solstice-ui"` (do not re-export from `@/components`):

- **Button**, **Input**, **Form**, **Dropdown**, **SearchInput**
- **Card**, **DataPage**, **EmptyState**, **Alert**
- **LoadingSpinner**, **PageHeader**, **Dialog**, **Pagination**
- **ThemeToggle**, **TabNavigation** (and type **TabItem**)

### Component usage

```typescript
import { Button, Card, DataPage } from "solstice-ui";
import { EntityToolbar, Layout } from "@/components";

function MyPage() {
  return (
    <Layout>
      <DataPage
        layout="grid"
        items={items}
        loading={isLoading}
        renderCard={(item) => <Card>...</Card>}
        contentBetweenHeaderAndContent={<EntityToolbar ... />}
      />
      <Button variant="primary">Submit</Button>
    </Layout>
  );
}
```

## 🏪 State Management

### Redux Store Structure

```typescript
interface RootState {
  auth: AuthState;
  theme: ThemeState;   // light/dark mode, persisted
}
```

### Redux Slices

- **authSlice** - Authentication state and actions
- **themeSlice** - Theme state (light/dark); applied as `dark` class on `<html>` for Tailwind

### Using Redux

```typescript
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { loginUser } from "@/store/slices/authSlice";

function LoginComponent() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (credentials) => {
    await dispatch(loginUser(credentials));
  };

  return <form onSubmit={handleLogin}>{/* Login form */}</form>;
}
```

## 🎨 Styling

### Tailwind CSS

The app uses **Tailwind CSS v4** with `darkMode: 'class'`. The theme is applied by toggling the `dark` class on `<html>` (see `useTheme` and Redux `themeSlice`). Use `dark:` variants so components work in both themes.

```typescript
// Prefer theme-aware classes
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4">
  {children}
</div>
```

### Global styles

Global styles live in `src/index.css` (`@import "tailwindcss"`). Theme-aware utility classes (e.g. `.input-label`, `.input-field`, `.dark .input-field`) are defined there. Component-specific styles use CSS modules (`.module.css`) with `:global(.dark)` for dark variants.

### Responsive Design

```typescript
function ResponsiveGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Grid items */}
    </div>
  );
}
```

## 🔌 API Integration

### Service Layer

The application uses a service layer for API communication:

```typescript
abstract class BaseService {
  protected baseUrl: string;

  protected async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {}
}

class AuthService extends BaseService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }
}
```

### API Error Handling

```typescript
try {
  const result = await authService.login(credentials);
} catch (error) {}
```

### Mock Data

For development, the application can use mock data:

```typescript
VITE_USE_MOCK_DATA = true;

const mockAuthService = new MockAuthService();
```

## 🏗️ Build & Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Build Configuration

The build is configured in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          redux: ["@reduxjs/toolkit", "react-redux"],
        },
      },
    },
  },
});
```

### Environment Variables

```bash
# Production environment variables
VITE_API_URL=https://api.example.com
VITE_USE_MOCK_DATA=false
VITE_NODE_ENV=production
```

### Deployment Options

1. **Static Hosting** (Netlify, Vercel, GitHub Pages)
2. **CDN** (AWS CloudFront, Cloudflare)
3. **Container** (Docker with Nginx)
4. **Server** (Apache, Nginx)

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📊 Performance

### Optimization Features

- **Code Splitting** - Automatic route-based splitting
- **Lazy Loading** - Components loaded on demand
- **Tree Shaking** - Unused code elimination
- **Bundle Analysis** - Build size monitoring

### Performance Monitoring

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

## 🔧 Troubleshooting

### Common Issues

#### Development Server Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 24+
```

#### Build Issues

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check linting issues
npm run lint
```

#### API Connection Issues

```bash
# Verify backend is running
curl http://localhost:5249/health

# Check environment variables
echo $VITE_API_URL
```

### Debug Mode

```bash
# Run with debug logging
DEBUG=* npm run dev
```

## 📚 Additional Resources

- **[Development Guide](../Documentation/Development-Guide.md)** - Detailed development setup
- **[Testing Guide](../Documentation/Testing-Guide.md)** - Comprehensive testing guide (Frontend + Backend)
- **[Test Coverage Guide](../Documentation/Test-Coverage-Guide.md)** - Coverage reporting and analysis
- **[Design Guide](../Documentation/Design-Guide.md)** - UI/UX design principles
- **[Cypress Guide](../Documentation/Cypress-Guide.md)** - E2E testing guide
- **[Cypress Framework](../Documentation/Cypress-Readme.md)** - Cypress testing framework details
- **[Scripts Documentation](../Documentation/Scripts-Readme.md)** - Build and utility scripts
- **[Token Refresh Implementation](../Documentation/Token-Refresh-Implementation.md)** - Token refresh logic and implementation

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes**: Follow coding standards and add tests
4. **Run tests**: `npm test` and `npm run cypress:run`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Standards

- **TypeScript**: Use strict typing
- **ESLint**: Follow configured rules
- **Testing**: Maintain high test coverage
- **Documentation**: Update docs for new features

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
