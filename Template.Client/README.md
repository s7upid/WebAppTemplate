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
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 Button/           # Button component
│   │   ├── 📁 Input/            # Input components
│   │   ├── 📁 Modal/            # Modal components
│   │   ├── 📁 Table/            # Table components
│   │   ├── 📁 Toast/            # Toast notifications
│   │   └── 📁 Layout/           # Layout components
│   ├── 📁 pages/                # Page components
│   │   ├── 📁 auth/             # Authentication pages
│   │   ├── 📁 users/            # User management
│   │   ├── 📁 roles/             # Role management
│   │   ├── 📁 permissions/      # Permission management
│   │   └── 📁 dashboard/        # Dashboard pages
│   ├── 📁 hooks/                # Custom React hooks
│   │   ├── 📁 queries/          # TanStack Query hooks
│   │   │   ├── useUsersQuery.ts # User data fetching
│   │   │   ├── useRolesQuery.ts # Role data fetching
│   │   │   └── usePermissionsQuery.ts # Permission fetching
│   │   ├── 📁 auth/             # Authentication hooks
│   │   └── 📁 ui/               # UI hooks (useToast, useTheme, etc.)
│   ├── 📁 services/             # API services
│   │   ├── 📁 base/             # Base service classes
│   │   ├── 📁 auth/             # Authentication service
│   │   └── 📁 entities/         # Entity services (users, roles, etc.)
│   ├── 📁 store/                # Redux store (client state only)
│   │   ├── 📁 slices/           # Redux slices
│   │   │   ├── authSlice.ts     # Authentication state
│   │   │   └── themeSlice.ts    # Theme state
│   │   └── index.ts             # Store configuration
│   ├── 📁 utils/                # Utility functions
│   │   ├── entityOperations.ts  # CRUD operation helpers
│   │   ├── storage.ts           # Secure storage utilities
│   │   ├── permissionCache.ts   # Permission checking cache
│   │   ├── errorHandling.ts     # API error utilities
│   │   ├── routeUtils.ts        # Navigation utilities
│   │   └── ...                  # Other utilities (cn, env, logger)
│   ├── 📁 models/               # TypeScript models
│   │   ├── 📁 auth/             # Authentication models
│   │   ├── 📁 users/            # User models
│   │   ├── 📁 roles/            # Role models
│   │   └── 📁 shared/           # Shared models
│   ├── 📁 config/               # Configuration files
│   │   ├── navigation.ts        # Navigation configuration
│   │   ├── constants.ts         # Application constants
│   │   ├── modules/             # Module configurations
│   │   └── generated/           # Auto-generated constants
│   │       └── permissionKeys.generated.ts  # Permission & role constants
│   ├── 📁 mock/                 # Mock data for development
│   ├── App.tsx                  # Main application component
│   ├── index.tsx                # Application entry point
│   └── index.css                # Global styles
├── 📁 cypress/                  # E2E tests
├── 📁 documentation/            # Documentation
├── package.json                 # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🛠️ Technologies

### Core Technologies

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2 | UI library |
| TypeScript | 5.3 | Type safety |
| Vite | 7.1 | Build tool and dev server |
| React Router | 7.9 | Client-side routing |

### State Management

| Package | Version | Purpose |
|---------|---------|---------|
| TanStack Query | 5.9 | Server state management (API data) |
| Redux Toolkit | 2.0 | Client state (auth, theme) |
| React Redux | 9.0 | React bindings for Redux |

### Forms & Validation

| Package | Version | Purpose |
|---------|---------|---------|
| React Hook Form | 7.48 | Form state management |
| Zod | 4.1 | Schema validation |
| @hookform/resolvers | 5.2 | Zod integration |

### Styling

| Package | Version | Purpose |
|---------|---------|---------|
| Tailwind CSS | 4.1 | Utility-first CSS framework |
| Lucide React | 0.562 | Icons |
| clsx + tailwind-merge | - | Class name utilities |

### Testing

| Package | Version | Purpose |
|---------|---------|---------|
| Jest | 30.2 | Unit testing framework |
| React Testing Library | 16.3 | Component testing |
| Cypress | 15.3 | End-to-end testing |
| c8 | 10.1 | Native V8 code coverage |

### Development Tools

| Package | Version | Purpose |
|---------|---------|---------|
| ESLint | 9.28 | Code linting |
| typescript-eslint | 8.33 | TypeScript ESLint support |
| Vite | 7.1 | Fast development server |

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
npm run cypress:run      # Run Cypress tests headlessly

# Cleanup
npm run clean            # Clean coverage artifacts
npm run clean:all        # Clean everything including node_modules

# Code Quality
npm run lint             # Run ESLint
npx eslint . --fix       # Fix ESLint issues (manual)
npx tsc --noEmit         # Run TypeScript checks (manual)
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
./regenerate-models-for-fe.sh        # macOS / Linux
Regenerate-models-for-FE.bat         # Windows
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

# Run Cypress tests headlessly
npm run cypress:run

# Run with coverage (from project root)
./test-coverage/3-run-fe-cypress-coverage.sh # macOS / Linux
test-coverage\3-run-fe-cypress-coverage.bat  # Windows
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

### Component Library

The application includes a comprehensive component library:

#### Core Components

- **Button** - Various button styles and states
- **Input** - Form input components
- **Modal** - Modal dialogs and overlays
- **Table** - Data tables with sorting and pagination
- **Toast** - Notification system
- **LoadingSpinner** - Loading indicators

#### Layout Components

- **Layout** - Main application layout
- **Sidebar** - Navigation sidebar
- **Header** - Application header
- **Footer** - Application footer

#### Form Components

- **FormField** - Form field wrapper
- **Select** - Dropdown select component
- **Checkbox** - Checkbox input
- **Radio** - Radio button input
- **DatePicker** - Date selection component

### Component Usage

```typescript
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";

function MyComponent() {
  return (
    <Modal isOpen={true} onClose={() => {}}>
      <Input placeholder="Enter text..." />
      <Button variant="primary">Submit</Button>
    </Modal>
  );
}
```

## 🏪 State Management

### Redux Store Structure

```typescript
interface RootState {
  auth: AuthState;
  users: UsersState;
  roles: RolesState;
  permissions: PermissionsState;
  ui: UIState;
}
```

### Redux Slices

- **authSlice** - Authentication state and actions
- **userSlice** - User management state
- **roleSlice** - Role management state
- **permissionSlice** - Permission management state

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

The application uses Tailwind CSS for styling:

```typescript
function Card({ children }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {children}
    </div>
  );
}
```

### Custom CSS Classes

```css
/* Global styles in index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded;
  }
}
```

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
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
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
