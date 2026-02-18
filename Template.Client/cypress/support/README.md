# Cypress Test Support Files

This directory contains reusable utilities and helpers for Cypress E2E tests.

## Files

### `test-helpers.ts`

Common utility functions for test operations:

- **Setup/Cleanup**: `setupTest()`, `cleanupTest()`, `clearSession()`
- **Authentication**: `loginAndWait()`, `waitForLogin()`, `waitForLoginRedirect()`, `waitForAuthenticatedPage()`, `loginAndVisit()`
- **Verification**: `verifyTokenExists()`, `verifyTokenCleared()`, `verifyAuthDataCleared()`, `verifyUserDataExists()`
- **Token Helpers**: `createExpiredToken()`, `createExpiringToken()`, `setExpiredToken()`, `setExpiringToken()`, `setInvalidToken()`, `setMalformedToken()`, `setMissingToken()`
- **URL Helpers**: `waitForUrl()`, `waitForUrlNot()`
- **Theme Helpers**: `setTheme()`, `getTheme()`
- **UI Helpers**: `clickLogout()`, `ifElementExists()`, `elementExists()`
- **Intercept Helpers**: `interceptApiError()`, `interceptUnauthorized()`, `interceptRateLimit()`, `interceptTokenRefresh()`, `interceptRevokedToken()`
- **API Helpers**: `waitForApiRequest()`, `getAuthToken()`

### `base-test.ts`

Base test configuration functions:

- `baseTestSetup()` - Common beforeEach setup (clears cookies and localStorage)
- `baseTestCleanup()` - Common afterEach cleanup
- `authTestSetup()` - Setup for auth-related tests
- `cleanStateSetup()` - Setup for tests needing clean state
- `setupUncaughtExceptionHandler()` - Setup handler for uncaught exceptions with configurable ignore patterns
- `setupIgnoreAllExceptions()` - Setup handler that ignores all uncaught exceptions (use with caution)

### `commands.ts`

Custom Cypress commands:

- `cy.loginAndWait()` - Login and wait for completion
- `cy.verifyAuthenticated()` - Verify user is authenticated
- `cy.verifyLoggedOut()` - Verify user is logged out
- Enhanced `cy.logout()` - Uses helper functions

## Usage Examples

### Basic Setup

```typescript
import { baseTestSetup } from "../../../support/base-test";

describe("My Test Suite", () => {
  beforeEach(() => {
    baseTestSetup();
  });
});
```

### Using Helpers

```typescript
import {
  loginAndWait,
  waitForLoginRedirect,
  verifyTokenExists,
} from "../../../support/test-helpers";

it("should login successfully", () => {
  loginAndWait();
  verifyTokenExists();
});

it("should redirect on expired token", () => {
  setExpiredToken();
  cy.visit("/users");
  waitForLoginRedirect();
});
```

### Using Intercepts

```typescript
import {
  interceptUnauthorized,
  interceptRateLimit,
} from "../../../support/test-helpers";

it("should handle 401 error", () => {
  loginAndWait();
  interceptUnauthorized("**/api/users**", "unauthorized");
  cy.visit("/users");
  cy.wait("@unauthorized");
  waitForLoginRedirect();
});
```

### Using Custom Commands

```typescript
it("should verify authentication", () => {
  cy.loginAndWait();
  cy.verifyAuthenticated();
});
```

## Benefits

1. **DRY Principle**: Eliminates duplicate code across test files
2. **Consistency**: Ensures all tests use the same patterns
3. **Maintainability**: Changes to common logic only need to be made in one place
4. **Readability**: Tests are more concise and easier to understand
5. **Reliability**: Common patterns are tested and proven to work
