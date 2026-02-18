# Feature Development Workflow

## Overview

This guide provides a step-by-step workflow for creating new features from the backend server to the frontend UI. It covers the complete development cycle including database models, services, controllers, API integration, and React components.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Backend Development (Server)](#backend-development-server)
3. [Frontend Development (Client)](#frontend-development-client)
4. [Integration & Testing](#integration--testing)
5. [Complete Example: Users Module](#complete-example-users-module)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FULL STACK ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        BACKEND (.NET Server)                             │   │
│  │                                                                          │   │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────────┐   │   │
│  │  │  Models  │───>│ Services │───>│Controllers│───>│  API Endpoints   │   │   │
│  │  │  (Data)  │    │ (Logic)  │    │  (HTTP)  │    │ (REST/JSON)      │   │   │
│  │  └──────────┘    └──────────┘    └──────────┘    └──────────────────┘   │   │
│  │       │              │               │                    │             │   │
│  │       ▼              ▼               ▼                    ▼             │   │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────────┐   │   │
│  │  │   DTOs   │    │Interfaces│    │Attributes│    │   Handlers       │   │   │
│  │  │          │    │          │    │  (Auth)  │    │ (Permissions)    │   │   │
│  │  └──────────┘    └──────────┘    └──────────┘    └──────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                        │                                        │
│                                        │ HTTP/JSON                              │
│                                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        FRONTEND (React Client)                           │   │
│  │                                                                          │   │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────────┐   │   │
│  │  │  Models  │<───│ Services │<───│  Hooks   │<───│   Components     │   │   │
│  │  │ (Types)  │    │  (API)   │    │ (State)  │    │    (UI)          │   │   │
│  │  └──────────┘    └──────────┘    └──────────┘    └──────────────────┘   │   │
│  │       │              │               │                    │             │   │
│  │       ▼              ▼               ▼                    ▼             │   │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────────┐   │   │
│  │  │  Module  │    │  Store   │    │   Utils  │    │     Pages        │   │   │
│  │  │  Config  │    │ (Redux)  │    │          │    │  (Containers)    │   │   │
│  │  └──────────┘    └──────────┘    └──────────┘    └──────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Backend Development (Server)

### Step 1: Create Database Model

**Location:** `Template.Data/Models/`

```csharp
// User.cs
namespace Template.Data.Models;

public class User : IdentityUser<Guid>
{
    [Searchable]
    public string FirstName { get; set; } = null!;

    [Searchable]
    public string LastName { get; set; } = null!;

    [Searchable]
    public override string? Email { get; set; }

    public UserStatus Status { get; set; } = UserStatus.Active;

    public DateTime? LastLogin { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public string? Avatar { get; set; }

    public ICollection<Permission> Permissions { get; set; } = [];

    public ICollection<UserRole> UserRoles { get; set; } = [];
}

public enum UserStatus
{
    Active,
    Inactive,
    Pending
}
```

### Step 2: Create DTOs (Data Transfer Objects)

**Location:** `Template.Server/DTOs/Users/`

```
DTOs/
└── Users/
    ├── Request/
    │   ├── CreateUserRequest.cs     # Create request DTO
    │   └── UpdateUserRequest.cs     # Update request DTO
    └── Response/
        └── UserResponse.cs          # Response DTO
```

```csharp
// UserResponse.cs
public class UserResponse
{
    public Guid Id { get; set; }
    public string? Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public int CustomPermissionsCount { get; set; }
    public bool IsActive { get; set; } = true;
    public UserStatus UserStatus { get; set; } = UserStatus.Active;
    public DateTime? LastLogin { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public string? Avatar { get; set; }
    public List<string>? PermissionKeys { get; set; }
    public RoleResponse? Role { get; set; }
    public List<PermissionResponse> Permissions { get; set; } = [];
}

// CreateUserRequest.cs
public class CreateUserRequest
{
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public Guid RoleId { get; set; }
    public int Status { get; set; } = 2;
}

// UpdateUserRequest.cs
public class UpdateUserRequest
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Avatar { get; set; }
    public Guid? RoleId { get; set; }
    public List<string>? PermissionKeys { get; set; }
    public int? Status { get; set; }
}
```

### Step 3: Create Service Interface

**Location:** `Template.Server/Services/UsersManager/Interfaces/`

```csharp
// IUsersService.cs
public interface IUsersService
{
    Task<Result<PagedResult<UserResponse>>> GetUsersAsync(PagedResultParams @params, CancellationToken cancellationToken);
    Task<Result<UserResponse>> GetUserByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Result<UserResponse>> CreateUserAsync(CreateUserRequest request, CancellationToken cancellationToken);
    Task<Result<UserResponse>> UpdateUserAsync(Guid id, UpdateUserRequest request, CancellationToken cancellationToken);
    Task<Result<Guid>> DeleteUserAsync(Guid id, CancellationToken cancellationToken);
}
```

### Step 4: Create Service Implementation

**Location:** `Template.Server/Services/UsersManager/`

```csharp
// UsersService.cs
public class UsersService(
    ApplicationDbContext db,
    IEmailService emailService,
    UserManager<User> userManager,
    IRevokedTokenService revokedTokenService,
    IOptions<JwtSettings> jwtOptions) : IUsersService
{
    public async Task<Result<PagedResult<UserResponse>>> GetUsersAsync(
        PagedResultParams @params,
        CancellationToken cancellationToken)
    {
        // Implementation
    }

    public async Task<Result<UserResponse>> GetUserByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        // Implementation
    }

    public async Task<Result<UserResponse>> CreateUserAsync(CreateUserRequest request, CancellationToken cancellationToken)
    {
        // Implementation
    }

    public async Task<Result<UserResponse>> UpdateUserAsync(Guid id, UpdateUserRequest request, CancellationToken cancellationToken)
    {
        // Implementation
    }

    public async Task<Result<Guid>> DeleteUserAsync(Guid id, CancellationToken cancellationToken)
    {
        // Implementation
    }
}
```

### Step 5: Create Controller

**Location:** `Template.Server/Controllers/`

```csharp
// UsersController.cs
using static Template.Data.Constants.PermissionKeys;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IUsersService usersService) : ControllerBase
{
    [HttpGet]
    [Authorize(Policy = Users.View)]  // Use constants, not hardcoded strings!
    public async Task<IActionResult> GetUsers([FromQuery] PagedResultParams @params, CancellationToken cancellationToken)
    {
        Result<PagedResult<UserResponse>> result = await usersService.GetUsersAsync(@params, cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpGet("{id}")]
    [Authorize(Policy = Users.View)]
    public async Task<IActionResult> GetUserById(Guid id, CancellationToken cancellationToken)
    {
        Result<UserResponse> result = await usersService.GetUserByIdAsync(id, cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpPost]
    [Authorize(Policy = Users.Create)]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request, CancellationToken cancellationToken)
    {
        Result<UserResponse> result = await usersService.CreateUserAsync(request, cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpPut("{id}")]
    [Authorize(Policy = Users.Edit)]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request, CancellationToken cancellationToken)
    {
        Result<UserResponse> result = await usersService.UpdateUserAsync(id, request, cancellationToken);
        return this.ToActionResult(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = Users.Delete)]
    public async Task<IActionResult> DeleteUser(Guid id, CancellationToken cancellationToken)
    {
        Result<Guid> result = await usersService.DeleteUserAsync(id, cancellationToken);
        return this.ToActionResult(result);
    }
}
```

### Step 6: Register Services

**Location:** `Template.Server/Program.cs`

```csharp
// Add to service registration
builder.Services.AddScoped<IUsersService, UsersService>();
```

### Step 7: Add Permission Constants

**Location:** `Template.Data/Constants/PermissionKeys.cs`

First, add the permission constants to the centralized constants file:

```csharp
public static class PermissionKeys
{
    // ... other categories
    
    public static class Feature
    {
        public const string View = "feature:view";
        public const string Create = "feature:create";
        public const string Edit = "feature:edit";
        public const string Delete = "feature:delete";
    }
}
```

### Step 8: Add Permissions to Database Seed

**Location:** `Template.Data/Data/Seeds/DefaultDataSeeder.cs`

Use the constants in the seed data:

```csharp
using static Template.Data.Constants.PermissionKeys;

// Add feature permissions using constants
new Permission { Id = Guid.NewGuid(), Key = Feature.View, Name = "View Features", Category = "Features" },
new Permission { Id = Guid.NewGuid(), Key = Feature.Create, Name = "Create Features", Category = "Features" },
new Permission { Id = Guid.NewGuid(), Key = Feature.Edit, Name = "Edit Features", Category = "Features" },
new Permission { Id = Guid.NewGuid(), Key = Feature.Delete, Name = "Delete Features", Category = "Features" },
```

### Step 9: Regenerate Frontend Models & Constants

Run the regeneration script to generate TypeScript types and constants:

```bash
# From project root
./regenerate-models-for-fe.sh  # macOS / Linux
Regenerate-models-for-FE.bat  # Windows
```

This generates:
- `Template.Client/src/models/generated.ts` - DTOs and types
- `Template.Client/src/config/generated/permissionKeys.generated.ts` - Permission and role constants

---

## Frontend Development (Client)

### Step 1: Create Module Configuration

**Location:** `Template.Client/src/config/modules/`

```typescript
// usersModule.ts
import { Users, Clock, User, Shield, Key } from "lucide-react";
import { ModuleConfig, PermissionConfig } from "./types";
import { PERMISSION_KEYS } from "@/config/generated/permissionKeys.generated";

// Use centralized constants - NEVER hardcode permission strings!
const PERMISSIONS: PermissionConfig = {
  view: PERMISSION_KEYS.USERS.VIEW,
  create: PERMISSION_KEYS.USERS.CREATE,
  edit: PERMISSION_KEYS.USERS.EDIT,
  delete: PERMISSION_KEYS.USERS.DELETE,
  assignRole: PERMISSION_KEYS.USERS.ASSIGN_ROLE,
  approve: PERMISSION_KEYS.USERS.APPROVE,
};

export const USERS_MODULE: ModuleConfig = {
  id: "users",
  icon: Users,
  
  routes: {
    base: "/users",
    root: "/users/*",
    detail: "/users/:id",
    api: {
      list: (query: string) => `?${query}`,
      byId: (id: string) => `/${id}`,
      create: "",
      update: (id: string) => `/${id}`,
      remove: (id: string) => `/${id}`,
    },
  },

  permissions: PERMISSIONS,

  labels: {
    singular: "User",
    plural: "Users",
    menuLabel: "User Management",
    description: "Manage users, roles, and permissions",
    detailTitle: "User Details",
    createButton: "Create User",
    backButton: "Back to Users",
  },

  messages: {
    created: "User created successfully",
    updated: "User updated successfully",
    deleted: "User deleted successfully",
  },

  testIds: {
    nav: "nav-users",
    page: "user-page",
    grid: "user-grid",
    form: "user-form",
    detailsPage: "user-details-page",
    createButton: "create-user-button",
    backButton: "back-to-users-button",
  },

  // In-page tabs
  pageTabs: [
    { id: "all", label: "All Users", icon: Users, path: "/users", testId: "all-tab" },
    { id: "pending", label: "Pending Approvals", icon: Clock, path: "/users/pending", permission: "users:approve", testId: "pending-tab" },
  ],

  // Detail page tabs
  detailTabs: [
    { id: "profile", label: "Profile", icon: User, testId: "user-profile-tab" },
    { id: "roles", label: "Roles", icon: Shield, permission: "users:assign-role", testId: "user-roles-tab" },
    { id: "permissions", label: "Permissions", icon: Key, permission: "permissions:assign", testId: "user-permissions-tab" },
  ],
};
```

### Step 2: Update Module Index

**Location:** `Template.Client/src/config/modules/index.ts`

```typescript
import { USERS_MODULE } from "./usersModule";

export const MODULES: ModuleConfigMap = {
  // ... other modules
  users: USERS_MODULE,
};
```

### Step 3: Create API Service

**Location:** `Template.Client/src/services/`

```typescript
// userService.ts
import { apiClient } from "./apiClient";
import { UserResponse, CreateUserRequest, UpdateUserRequest, PagedResult } from "@/models";
import { USERS_MODULE } from "@/config/modules";

class UserService {
  private baseUrl = "/api/users";

  async getUsers(query: string): Promise<PagedResult<UserResponse>> {
    const response = await apiClient.get(`${this.baseUrl}${USERS_MODULE.routes.api.list(query)}`);
    return response.data;
  }

  async getUserById(id: string): Promise<UserResponse> {
    const response = await apiClient.get(`${this.baseUrl}${USERS_MODULE.routes.api.byId!(id)}`);
    return response.data;
  }

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    const response = await apiClient.post(`${this.baseUrl}`, data);
    return response.data;
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse> {
    const response = await apiClient.put(`${this.baseUrl}${USERS_MODULE.routes.api.update!(id)}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}${USERS_MODULE.routes.api.remove!(id)}`);
  }
}

export const userService = new UserService();
```

### Step 4: Create TanStack Query Hook

**Location:** `Template.Client/src/hooks/queries/`

```typescript
// useUsersQuery.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { CreateUserRequest, UpdateUserRequest } from "@/models";

export const useUsersQuery = (params?: { page?: number; pageSize?: number; search?: string }) => {
  const queryClient = useQueryClient();

  // Query for fetching users with automatic caching
  const {
    data: paginationResult,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users", params],
    queryFn: () => userService.getUsers(buildQueryString(params)),
  });

  // Mutation for creating users
  const addMutation = useMutation({
    mutationFn: (data: CreateUserRequest) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // Mutation for updating users
  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // Mutation for deleting users
  const removeMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users: paginationResult?.items ?? [],
    paginationResult,
    isLoading,
    error,
    refetch,
    add: async (data: CreateUserRequest) => {
      await addMutation.mutateAsync(data);
      return { success: true };
    },
    edit: async ({ id, data }: { id: string; data: UpdateUserRequest }) => {
      await editMutation.mutateAsync({ id, data });
      return { success: true };
    },
    remove: async (id: string) => {
      await removeMutation.mutateAsync(id);
      return { success: true };
    },
  };
};
```

**Benefits of TanStack Query:**
- ✅ Automatic caching and background refetching
- ✅ Built-in loading/error states
- ✅ Automatic cache invalidation on mutations
- ✅ No Redux boilerplate needed for server state
- ✅ DevTools for debugging queries

### Step 6: Create Page Components

**Location:** `Template.Client/src/pages/users/`

```
pages/
└── users/
    ├── index.ts                    # Exports
    ├── UsersContainer.tsx          # Main container with routes
    ├── read/
    │   ├── index.ts
    │   ├── UserGridPage.tsx        # List view
    │   └── UserDetailsPage.tsx     # Detail view
    ├── shared/
    │   ├── index.ts
    │   └── userGridConfig.tsx      # Grid configuration
    ├── modals/
    │   ├── index.ts
    │   ├── UserFormModal.tsx       # Create/Edit modal
    │   └── UserDeleteModal.tsx     # Delete confirmation
    └── components/
        ├── index.ts
        └── UserCard.tsx            # User card component
```

### Step 7: Add Navigation

**Location:** `Template.Client/src/config/navigation.ts`

```typescript
// Add to NAVIGATION_CONFIG
{
  id: "users",
  name: USERS_MODULE.labels.menuLabel,
  href: USERS_MODULE.routes.base,
  routePath: USERS_MODULE.routes.root,
  icon: USERS_MODULE.icon,
  permission: "",
  component: UsersContainer,
  testId: USERS_MODULE.testIds.nav,
  showInNav: true,
  children: USERS_MODULE.submenus
    ? createNavigationChildren(USERS_MODULE.submenus, UsersContainer)
    : [],
},
```

### Step 9: Regenerate Frontend Constants

After adding new permissions to `PermissionKeys.cs`, regenerate the TypeScript constants:

```bash
# From project root
./regenerate-models-for-fe.sh  # macOS / Linux
Regenerate-models-for-FE.bat  # Windows
```

This generates **both** TypeScript models and permission constants:
- `src/models/generated.ts` - DTOs and types
- `src/config/generated/permissionKeys.generated.ts` - Permission and role constants

**Generated constants file:**

```typescript
// AUTO-GENERATED - DO NOT EDIT
export const PERMISSION_KEYS = {
  USERS: {
    VIEW: "users:view",
    CREATE: "users:create",
    EDIT: "users:edit",
    DELETE: "users:delete",
    ASSIGN_ROLE: "users:assign-role",
    APPROVE: "users:approve",
  },
  // ... other categories
} as const;

export const ROLE_NAMES = {
  ADMINISTRATOR: "administrator",
  SUPPORT: "support",
  // ... other roles
} as const;
```

> ⚠️ **Never edit the generated file directly!** Always modify `PermissionKeys.cs` and regenerate.

---

## Integration & Testing

### Backend Tests

**Location:** `Template.Tests/`

```
Tests/
├── Unit/
│   └── Services/
│       └── UsersServiceTests.cs
└── Integration/
    └── Controllers/
        └── UsersControllerTests.cs
```

### Frontend Tests

**Location:** `Template.Client/src/`

```
# Unit Tests
src/hooks/queries/useUsersQuery.test.tsx    # TanStack Query hook tests
src/services/entities/userService.test.ts   # Service tests
src/pages/users/UserContainer.test.tsx      # Page tests

# E2E Tests
cypress/e2e/user-management/
├── user-list.cy.ts
├── user-crud.cy.ts
└── user-details.cy.ts
```

---

## Complete Example: Users Module

### Folder Structure Summary

```
Backend (Template.Server)
├── DTOs/
│   └── Users/
│       ├── Request/
│       │   ├── CreateUserRequest.cs
│       │   └── UpdateUserRequest.cs
│       └── Response/
│           └── UserResponse.cs
├── Services/
│   └── UsersManager/
│       ├── Interfaces/
│       │   └── IUsersService.cs
│       └── UsersService.cs
└── Controllers/
    └── UsersController.cs

Data (Template.Data)
└── Models/
    └── User.cs

Frontend (Template.Client)
├── src/
│   ├── config/
│   │   ├── modules/
│   │   │   └── usersModule.ts
│   │   └── generated/
│   │       └── permissionKeys.generated.ts  # Auto-generated constants
│   ├── services/
│   │   └── entities/
│   │       └── userService.ts
│   ├── hooks/
│   │   └── queries/
│   │       └── useUsersQuery.ts             # TanStack Query hook
│   └── pages/
│       └── users/
│           ├── UserContainer.tsx
│           ├── read/
│           ├── shared/
│           ├── modals/
│           └── components/
└── cypress/
    └── e2e/
        └── user-management/
```

### Development Checklist

```
Backend:
□ 1. Create database model (Template.Data/Models/)
□ 2. Create migration if needed: ./add-migration.sh (macOS/Linux) or add-migration.bat (Windows)
□ 3. Create DTOs (Template.Server/DTOs/)
□ 4. Create service interface (Services/Interfaces/)
□ 5. Create service implementation (Services/)
□ 6. Add permission constants (Template.Data/Constants/PermissionKeys.cs)
□ 7. Create controller using constants (Controllers/)
□ 8. Register services in Program.cs
□ 9. Add permissions to seed data (use constants!)
□ 10. Write unit tests
□ 11. Write integration tests

Frontend:
□ 1. Regenerate models & constants: ./regenerate-models-for-fe.sh (macOS/Linux) or Regenerate-models-for-FE.bat (Windows)
□ 2. Create module config using PERMISSION_KEYS (config/modules/)
□ 3. Update modules index (export module + add to MODULES map)
□ 4. Create API service (services/entities/)
□ 5. Create TanStack Query hook (hooks/queries/)
□ 6. Create page components (pages/)
   - Use handleEntitySave, handleEntityDelete from @/utils
   - Use module.messages for success messages
   - Use PERMISSION_KEYS for permission checks
□ 7. Add navigation config (config/navigation.ts)
□ 8. Write unit tests
□ 9. Write E2E tests
□ 10. Update documentation

Integration:
□ 1. Test full workflow manually
□ 2. Run all tests (npm test, cypress:run, dotnet test)
□ 3. Update changelog
```

### Utility Functions

When implementing CRUD operations, use the consolidated entity utilities:

```typescript
// utils/entityOperations.ts provides:
import { handleEntitySave, handleEntityDelete, handleSubmitForm } from "@/utils";

// For save operations (create/edit)
await handleEntitySave(data, { formMode, addEntity, editEntity, successMessages, ... });

// For delete with confirmation
await handleEntityDelete({ entity, id, remove, confirm, showSuccess, showError, ... });

// For form submission with validation
await handleSubmitForm({ data, schema, onSave, entityName, showSuccess, showError });
```

---

## Related Documentation

- [Development Guide](./Development-Guide.md) - General development practices
- [Testing Guide](./Testing-Guide.md) - Testing strategies
- [Design Guide](./Design-Guide.md) - UI/UX guidelines
