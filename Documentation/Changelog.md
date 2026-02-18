# 📝 Changelog

All notable changes to this project will be documented in this file.

## [3.1.0] - 2026-01-09 - Centralized Constants & Architecture Improvements

### 🎉 New Features

#### ✅ Centralized Permission & Role Constants (Single Source of Truth)

- **Backend (`PermissionKeys.cs`)**
  - Created `Template.Data/Constants/PermissionKeys.cs` with all permission constants
  - Created `RoleNames` static class with all role name constants
  - Updated all controllers to use constants instead of hardcoded strings
  - Updated `DefaultDataSeeder.cs` to use constants for seed data

- **Frontend (Auto-Generated)**
  - Created `generate-constants.js` script to generate TypeScript from C#
  - Auto-generates `src/config/generated/permissionKeys.generated.ts`
  - Exports `PERMISSION_KEYS`, `ROLE_NAMES`, and type helpers
  - Updated `Regenerate-models-for-FE.bat` to run constant generation

- **Usage Pattern**
  ```typescript
  // Frontend
  import { PERMISSION_KEYS, ROLE_NAMES } from "@/config";
  hasPermission(PERMISSION_KEYS.USERS.VIEW);
  
  // Backend
  using static Template.Data.Constants.PermissionKeys;
  [Authorize(Policy = Users.View)]
  ```

#### ✅ StatusBadge Component Enhancement

- Updated to use `UserStatus` enum from generated types instead of hardcoded strings

### 🔧 Technical Improvements

#### Package Updates

- **Removed unused packages:**
  - `axe-core`, `cypress-axe`, `cypress-plugin-tab`
  - `dotenv`, `fast-xml-parser`, `tsconfig-paths-webpack-plugin`

- **Added ESLint packages:**
  - `@eslint/js`, `eslint`, `eslint-plugin-react-hooks`
  - `eslint-plugin-react-refresh`, `globals`, `typescript-eslint`

- **New npm script:** `npm run lint`

#### Code Cleanup

- Removed redundant re-export files (`config/permissionKeys.ts`, `config/roleKeys.ts`)
- All imports now use generated constants directly
- Zero npm vulnerabilities

### 📚 Documentation Updates

- Updated Changelog with all architectural changes
- Added constant generation to development workflow

---

## [3.0.0] - 2026-01-08 - Node.js 24+ Compatibility & TanStack Query Migration

### 🔄 Breaking Changes

- **Node.js 24+** is now required (was Node.js 18+)
- Removed `nyc` and `@cypress/code-coverage` in favor of `c8` for coverage collection
- **Server state management migrated from Redux to TanStack Query**

### 🎉 New Features

#### ✅ TanStack Query Integration

- Added `@tanstack/react-query` 5.9 for server state management
- Added `@tanstack/react-query-devtools` for debugging
- Created query hooks: `useUsersQuery`, `useRolesQuery`, `usePermissionsQuery`, `useAuditQuery`, `useDashboardQuery`
- Automatic caching, background refetching, and cache invalidation on mutations
- Redux now used **only** for client state (auth, theme)

#### ✅ Cleanup Scripts

- Added `test-coverage/cleanup.bat` for cleaning all coverage artifacts
- Added `npm run clean` and `npm run clean:all` scripts
- Updated `.gitignore` to exclude all coverage output files

#### ✅ Collapsible Sidebar

- Added collapsible sidebar to main layout
- Sidebar can be collapsed/expanded with a toggle button
- Collapsed state shows icons only with tooltips

### 🔧 Technical Improvements

#### Node.js 24+ Compatibility

- Replaced `nyc` with `c8` for code coverage (nyc incompatible with Node.js 24+)
- Updated `vite-plugin-istanbul` configuration for Cypress coverage
- Fixed `env.ts` to work with both Vite and Jest environments
- Updated all documentation for Node.js 24+ requirements

#### Architecture Simplification

- Removed entity-based Redux slices (replaced by TanStack Query)
- Removed `baseSlice.ts` and entity-specific slices
- Removed `useEntity` hooks (replaced by query hooks)
- Simplified state management from 3 layers to 2 (Service → Query Hook)

#### Backend Test Fixes

- Fixed `AuthServiceTests.cs` to use `NullLogger<SignInManager<User>>` instead of Serilog's `Logger.None`
- All backend tests now pass with proper mock instantiation

#### CSS Module Improvements

- Converted `px` units to `rem` for better responsive design
- Fixed dark mode styles to use `:global(.dark)` pattern consistently
- Improved tab navigation styling to prevent flickering

### 📚 Documentation Updates

- Updated all README files for Node.js 24+
- Added cleanup script documentation
- Updated test coverage documentation

---

## [2.0.0] - 2024-01-XX - Complete Authentication System Implementation

### 🎉 Major Features Added

#### ✅ Complete Password Reset Flow

- **Backend Implementation**

  - Added `ResetPasswordAsync` method to `AuthService`
  - Added `POST /api/auth/reset-password` endpoint
  - Created `ResetPasswordRequest` DTO
  - Integrated with ASP.NET Core Identity `UserManager.ResetPasswordAsync()`
  - Added comprehensive audit logging for password reset events

- **Frontend Implementation**
  - Created `ResetPasswordPage.tsx` with full form validation
  - Added URL parameter extraction for email and token
  - Implemented password visibility toggles
  - Added password confirmation validation
  - Integrated with Redux store and auth service
  - Added professional UI with proper error handling

#### ✅ Email Confirmation System

- **Backend Implementation**

  - Added `ConfirmEmailAndSetPasswordAsync` method to `AuthService`
  - Added `POST /api/auth/confirm-email` endpoint
  - Created `ConfirmEmailRequest` DTO (includes email, token, and password)
  - Integrated with ASP.NET Core Identity `UserManager.ConfirmEmailAsync()` and password setting
  - Added comprehensive audit logging for email confirmation events

- **Frontend Implementation**
  - Created `ConfirmEmailPage.tsx` with form validation
  - Added URL parameter extraction for email and token
  - Implemented password input and validation
  - Implemented success confirmation screen
  - Added professional UI with proper error handling
  - Integrated with Redux store and auth service

#### ✅ Enhanced Email Templates

- **Professional HTML Templates**

  - Updated `PasswordResetEmailService.ConfirmationHtml()` with complete HTML template
  - Added welcome message with clear instructions
  - Included security information and expiration notice
  - Added professional styling and branding

- **Plain Text Templates**
  - Updated `PasswordResetEmailService.ConfirmationPlainText()` with complete template
  - Added clear instructions for email confirmation
  - Included security information and expiration notice

#### ✅ Complete API Integration

- **New API Endpoints**

  - `POST /api/auth/reset-password` - Password reset with token validation
  - `POST /api/auth/confirm-email` - Email confirmation with token validation

- **Updated API Paths**
  - Added `resetPassword: "/reset-password"` to `AUTH_API`
  - Added `confirmEmail: "/confirm-email"` to `AUTH_API`

#### ✅ Form Validation Schemas

- **New Validation Schemas**
  - `resetPasswordSchema` - Complete password reset form validation
  - `confirmEmailSchema` - Email confirmation and password setup form validation
  - Added password complexity validation
  - Added password confirmation matching validation

#### ✅ Frontend Models and Services

- **New Models**

  - `ConfirmEmailRequest` interface
  - Updated model exports in `models/index.ts`

- **Enhanced Services**
  - Added `resetPassword()` method to `AuthService`
  - Added `confirmEmail()` method to `AuthService`
  - Updated mock implementations for testing

#### ✅ Routing and Navigation

- **New Routes**
  - `/reset-password` - Password reset page
  - `/confirm-email` - Email confirmation page
  - Added proper route imports and components

### 🔧 Technical Improvements

#### Backend Enhancements

- **Service Layer**

  - Enhanced `IAuthService` interface with new methods
  - Added comprehensive error handling and validation
  - Improved audit logging for all authentication events
  - Added proper token validation and user verification

- **Controller Layer**
  - Added new endpoints with proper documentation
  - Implemented comprehensive error handling
  - Added proper HTTP status codes and responses
  - Enhanced security with proper validation

#### Frontend Enhancements

- **Component Architecture**

  - Created reusable form components with validation
  - Added proper error handling and user feedback
  - Implemented loading states and success screens
  - Added professional UI styling and UX

- **State Management**
  - Enhanced Redux store with new actions
  - Added proper error handling and success states
  - Implemented seamless user experience flows

### 🛡️ Security Enhancements

#### Authentication Security

- **Token Validation**

  - Comprehensive token validation for password reset
  - Secure token generation for email confirmation
  - Proper token expiration and validation

- **User Verification**
  - Email and user existence validation
  - Proper error handling without information leakage
  - Secure token-based verification

#### Audit Logging

- **New Event Types**

  - `PasswordReset` - Password reset events
  - `EmailConfirmed` - Email confirmation events
  - `PasswordResetRequested` - Password reset request events

- **Enhanced Tracking**
  - Complete audit trail for all authentication flows
  - Success and failure event logging

### 📚 Documentation Updates

#### Updated Documentation

- **Main README**

  - Updated security features section
  - Added complete authentication system description
  - Enhanced security monitoring section

- **Authentication Flow Diagrams**

  - Updated to reflect complete authentication system
  - Added password reset and email confirmation flows

- **API Documentation**
  - Added new endpoint documentation
  - Updated API examples and responses
  - Enhanced security documentation

### 🧪 Testing Enhancements

#### Mock Implementations

- **Enhanced Mock Services**
  - Added `resetPassword()` mock implementation
  - Added `confirmEmail()` mock implementation
  - Added proper validation and error handling

#### Test Coverage

- **New Test Scenarios**
  - Password reset flow testing
  - Email confirmation flow testing
  - Error handling and validation testing

### 🚀 Deployment Ready

#### Production Features

- **Complete Authentication System**
  - All authentication features fully implemented
  - Production-ready security features
  - Comprehensive error handling and validation

#### User Experience

- **Seamless Flows**
  - Professional UI for all authentication pages
  - Clear error messages and success feedback
  - Intuitive user experience

---

## [1.0.0] - 2024-01-XX - Initial Release

### 🎉 Initial Features

#### ✅ Core Authentication

- User login with JWT tokens
- User logout functionality
- Token refresh with rate limiting
- Forgot password email sending

#### ✅ Security Features

- ASP.NET Core Identity integration
- Account lockout protection
- Rate limiting on sensitive endpoints
- Comprehensive audit logging

#### ✅ User Management

- User creation and management
- Role-based access control
- Permission system
- User profile management

#### ✅ Frontend Implementation

- React-based frontend
- Redux state management
- Professional UI components
- Form validation and error handling

---

## 🔄 Migration Notes

### From Previous Versions

#### Breaking Changes

- None - This is a feature addition release

#### New Dependencies

- No new dependencies added
- All features use existing technology stack

#### Configuration Updates

- No configuration changes required
- All new features use existing configuration

---

## 📋 Future Roadmap

### Planned Features

- [ ] Two-factor authentication (2FA)
- [ ] Social login integration
- [ ] Advanced user analytics
- [ ] Enhanced email templates customization
- [ ] Mobile app support

### Security Enhancements

- [ ] Advanced threat detection
- [ ] Enhanced audit reporting
- [ ] Security dashboard
- [ ] Automated security monitoring

---

**This changelog documents the complete implementation of the authentication system with all requested features now fully functional and production-ready.**
