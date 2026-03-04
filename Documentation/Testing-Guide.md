# Testing Guide

## Overview

Comprehensive testing strategy with Jest, React Testing Library, and Cypress covering unit tests, integration tests, and end-to-end tests.

## Testing Stack

### Frontend Testing

| Tool | Version | Purpose |
|------|---------|---------|
| Jest | 30.2 | Test runner |
| React Testing Library | 16.3 | Component testing |
| Cypress | 15.11 | E2E testing |
| cypress-split | 1.24 | Parallel spec distribution |
| concurrently | 9.2 | Run multiple Cypress processes |
| c8 | 11.0 | Native V8 code coverage (Node.js 24+ compatible) |

### Backend Testing

| Tool | Version | Purpose |
|------|---------|---------|
| xUnit | - | Test framework |
| FluentAssertions | - | Readable assertions |
| Moq | - | Service mocking |
| In-Memory EF Core | 9.0 | Database testing |
| XPlat Code Coverage | - | Coverage collection |

## Quick Commands

### Unit Testing

```bash
npm run test                    # Run unit tests
npm run test:watch             # Watch mode
npm run test:coverage          # With coverage
npm run test:ci                # CI mode
```

### E2E Testing

```bash
npm run cypress:open           # Interactive GUI
npm run cypress:run            # Headless (sequential)
npm run cypress:run:parallel   # Headless (4 parallel processes, ~3-4x faster)
```

### Backend Testing

```bash
# Run all backend tests
dotnet test Template.Tests

# Run with detailed output
dotnet test Template.Tests --verbosity normal

# Run with code coverage
dotnet test Template.Tests --collect:"XPlat Code Coverage"

# Run specific test category
dotnet test Template.Tests --filter "Category=Unit"
dotnet test Template.Tests --filter "Category=Integration"
```

### Combined Testing

Use the coverage script in the `scripts/` folder (see [scripts/README.md](../scripts/README.md)):

```bash
./scripts/generate-test-report.command   # macOS / Linux / Git Bash; or: npm run coverage
```

## Test Structure

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx         # Component
│       ├── Button.test.tsx    # Co-located test
│       └── Button.module.css  # Styles
├── hooks/                     # Hook tests co-located (*.test.tsx)
├── pages/                     # Page tests co-located (*.test.tsx)
├── services/                  # Service tests co-located (*.test.ts)
├── utils/                     # Utility tests co-located (*.test.ts)
└── test/                      # Test utilities and setup
    ├── setup.ts               # Global Jest setup
    ├── base-test-utils.tsx    # Mocking utilities
    └── test-utils.tsx         # Render helpers

cypress/
├── e2e/                       # E2E test files (modular)
│   ├── auth/                  # login, access control
│   ├── user-management/       # user CRUD flows
│   ├── role-management/       # role CRUD flows
│   ├── permission-management/ # permission management
│   ├── navigation/            # navigation tests
│   └── regression/            # pagination, validation, errors
└── support/                   # Helpers and configuration
```

## Unit Testing

### Component Testing

```typescript
import { render, screen } from "@testing-library/react";
import ComponentName from "../ComponentName";

describe("ComponentName", () => {
  it("renders correctly", () => {
    render(<ComponentName />);
    expect(screen.getByText("Expected Text")).toBeTruthy();
  });
});
```

### Hook Testing

```typescript
import { renderHook } from "@testing-library/react";
import { useCustomHook } from "../useCustomHook";

describe("useCustomHook", () => {
  it("returns expected values", () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.value).toBe("expected");
  });
});
```

### TanStack Query Testing

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUsersQuery } from "../useUsersQuery";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useUsersQuery", () => {
  it("fetches users successfully", async () => {
    const { result } = renderHook(() => useUsersQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.users).toHaveLength(10);
  });
});
```

### Redux Testing (Client State Only)

Redux is now used only for client state (auth, theme). Example:

```typescript
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/auth/authSlice";

describe("authSlice", () => {
  it("handles logout correctly", () => {
    const store = configureStore({ reducer: { auth: authReducer } });
    store.dispatch(logout());
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });
});
```

## Frontend E2E Testing

### Cypress Test Structure

```typescript
describe("Feature Name", () => {
  beforeEach(() => {
    cy.visit("/page-url");
  });

  it("should perform user action", () => {
    cy.get('[data-testid="element"]').click();
    cy.get('[data-testid="result"]').should("be.visible");
  });
});
```

### Test Categories

- **Authentication** - Login/logout flows
- **User Management** - CRUD operations
- **Role Management** - Permission handling
- **Navigation** - Route testing
- **Theme** - Dark/light mode
- **Responsive** - Mobile/desktop

## Backend Testing

### Test Structure

The backend test project is organized into the following categories:

```
Template.Tests/
├── Unit/                    # Unit tests
│   ├── Services/           # Service layer tests
│   │   ├── AuthServiceTests.cs
│   │   ├── UsersServiceTests.cs
│   │   ├── RevokedTokenServiceTests.cs
│   │   ├── AuditServiceTests.cs
│   │   └── RateLimitServiceTests.cs
│   └── Handlers/           # Authorization handler tests
├── Integration/            # Integration tests
│   ├── Controllers/        # API endpoint tests
│   │   ├── AuthControllerIntegrationTests.cs
│   │   └── UsersControllerIntegrationTests.cs
│   ├── Database/          # Database operation tests
│   └── Workflows/         # End-to-end workflow tests
│       └── AuthWorkflowIntegrationTests.cs
└── TestUtilities/         # Test helpers and base classes
    ├── TestBase.cs        # Common test functionality
    └── TestDataBuilder.cs # Test data creation helpers
```

### Unit Testing

#### Service Testing

```csharp
[Fact]
public async Task LoginAsync_WithValidCredentials_ReturnsToken()
{

    var loginRequest = new LoginRequest { Email = "test@example.com", Password = "password" };


    var result = await _authService.LoginAsync(loginRequest, CancellationToken.None);


    result.IsSuccess.Should().BeTrue();
    result.Data.Token.Should().NotBeNullOrEmpty();
}
```

#### Authorization Handler Testing

```csharp
using static Template.Data.Constants.PermissionKeys;

[Fact]
public async Task HandleRequirementAsync_WithValidPermission_Succeeds()
{
    // Use centralized constants for permissions
    var requirement = new PermissionRequirement(Users.View);
    var context = CreateAuthorizationContext(userId, permissions: [Users.View]);

    await _handler.HandleAsync(context, requirement);

    context.HasSucceeded.Should().BeTrue();
}
```

### Integration Testing

#### Controller Testing

```csharp
[Fact]
public async Task Login_WithValidCredentials_ReturnsOk()
{

    var loginRequest = new LoginRequest { Email = "test@example.com", Password = "password" };


    var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);


    response.StatusCode.Should().Be(HttpStatusCode.OK);
    var content = await response.Content.ReadFromJsonAsync<Result<AuthResponse>>();
    content.IsSuccess.Should().BeTrue();
}
```

#### Database Testing

```csharp
[Fact]
public async Task CreateUser_WithValidData_SavesToDatabase()
{

    var userDto = new CreateUserRequest { Email = "new@example.com", FirstName = "John" };


    await _usersService.CreateUserAsync(userDto, CancellationToken.None);


    var savedUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == "new@example.com");
    savedUser.Should().NotBeNull();
    savedUser.FirstName.Should().Be("John");
}
```

### Test Utilities

#### TestBase Class

The `TestBase` class provides common functionality:

- In-memory database setup
- Mock service configuration
- Test data creation helpers
- Proper cleanup and disposal

#### TestDataBuilder

Static helper class for creating test data:

- JWT settings configuration
- DTOs for various operations
- User and role creation helpers

### API Endpoints Coverage

The test suite covers all major API endpoints:

#### Authentication Endpoints (`/api/auth`)

- ✅ POST `/login` - User login with email/password
- ✅ POST `/logout` - Logout and revoke current token
- ✅ POST `/refresh-token` - Refresh JWT token (rate limited: 10/15min)
- ✅ POST `/forgot-password` - Send password reset email
- ✅ POST `/confirm-email` - Confirm email and set password with token
- ✅ POST `/change-password` - Change current user's password
- ✅ GET `/me` - Get current user profile

#### User Management Endpoints (`/api/users`)

- ✅ GET `/` - Get paginated users list with filters
- ✅ GET `/{id}` - Get user by ID
- ✅ POST `/` - Create new user
- ✅ PUT `/{id}` - Update user details
- ✅ DELETE `/{id}` - Delete user
- ✅ POST `/{id}/approve` - Approve pending user
- ✅ POST `/{id}/reject` - Reject pending user

#### Security Services

- ✅ Token revocation and cleanup
- ✅ Audit logging with various event types
- ✅ Rate limiting functionality

### Test Data Management

#### In-Memory Database

- Each test uses a fresh in-memory database
- No data persistence between tests
- Automatic cleanup after test completion

#### Mock Services

- Email service mocking for testing notifications
- Audit service mocking for verification
- Revoked token service mocking
- Rate limit service mocking

### Best Practices

#### Test Isolation

- Each test is independent and can run in any order
- No shared state between tests
- Proper setup and teardown

#### Assertions

- Using FluentAssertions for readable test assertions
- Comprehensive verification of return values
- Mock service interaction verification

#### Error Testing

- Testing both success and failure scenarios
- Edge case coverage
- Exception handling verification

## Coverage Reports

### Generate Coverage

```bash
# Frontend unit test coverage
npm run test:coverage

# Frontend E2E test coverage (runs parallel Cypress + merges coverage)
./test-coverage/3-run-fe-cypress-coverage.sh  # macOS / Linux / Git Bash
test-coverage\3-run-fe-cypress-coverage.bat   # Windows

# Backend test coverage
dotnet test Template.Tests --collect:"XPlat Code Coverage"

# All coverage reports (lint → backend → Jest → Cypress → extract → badges)
./scripts/generate-test-report.command   # or: npm run coverage
```

### Coverage Locations

- **Jest Coverage**: `Template.Client/coverage/jest/index.html`
- **Cypress Coverage**: `Template.Client/coverage/cypress/index.html`
- **Backend Coverage**: `coverage/report/Cobertura.xml`

### Update README Badges

```bash
# From repo root (extract-results and update-badges are in test-coverage/)
node test-coverage/4-extract-results.js      # Extract coverage data
node test-coverage/5-update-readme-badges.js # Update badges
```

## Test Data Management

### Fixtures

- **Users**: `cypress/fixtures/users.json`
- **Roles**: `cypress/fixtures/roles.json`
- **Permissions**: `cypress/fixtures/permissions.json`

### Mocks

- **API Responses**: `src/test/__mocks__/`
- **Service Mocks**: Service-specific mocks
- **Component Mocks**: Component-specific mocks
- **Mock Services**: `src/mock/services/`

## Performance Testing

### Cypress Performance

```bash
# Parallel execution (4 processes, ~3-4x faster)
npm run cypress:run:parallel

# Parallel with coverage
npm run cypress:run:parallel:coverage
npm run cypress:merge-coverage
```

### Test Optimization

- Use `cy.intercept()` for API mocking
- Implement proper waiting strategies
- Optimize test data setup
- Use `npm run cypress:run:parallel` for ~3-4x faster E2E runs

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run Tests
  run: |
    npm run test:ci
    npm run cypress:run:parallel
```

### Coverage Reporting

- Automated coverage collection
- README badge updates
- Coverage threshold enforcement

## Best Practices

### Test Writing

- Write descriptive test names
- Test both happy and error paths
- Use proper assertions
- Keep tests independent

### Performance

- Use efficient selectors
- Implement proper cleanup
- Optimize test data
- Use parallel execution

### Maintenance

- Regular test updates
- Remove obsolete tests
- Update test data
- Monitor test performance

## Troubleshooting

### Common Issues

1. **Tests timing out** - Increase timeout or fix async issues
2. **Elements not found** - Check selectors and page state
3. **Coverage not generated** - Verify configuration
4. **CI failures** - Check environment setup

### Debug Tools

- **Cypress Test Runner** - Interactive debugging
- **Browser DevTools** - Network and console inspection
- **Jest Debug Mode** - Unit test debugging
- **Coverage Reports** - Identify untested code

---

## Related Documentation

- **[Cypress Guide](./Cypress-Testing-Complete.md)** - E2E testing with Cypress
- **[Scripts](../scripts/README.md)** - Main scripts
- **[Test Coverage](../test-coverage/README.md)** - Coverage step scripts
