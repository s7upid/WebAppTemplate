# 🚀 Template - Backend

A secure, scalable .NET 10 Web API template with enterprise-grade security features — ready to be extended for any project.

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Technologies](#-technologies)
- [Security Features](#-security-features)
- [API Documentation](#-api-documentation)
- [Database](#-database)
- [Authentication](#-authentication)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)

## 🚀 Quick Start

### Prerequisites

- **.NET 10 SDK**
- **PostgreSQL 14+**
- **Git**

### Installation

```bash
# Restore packages
dotnet restore

# Update database
dotnet ef database update

# Run the application
dotnet run

   # Access the API
   # http://localhost:5249 (http) or https://localhost:7168 (https)
   # Swagger UI: http://localhost:5249/swagger
```

### Environment Setup

Create `appsettings.Development.json`:

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

## 📁 Project Structure

```
Template.Server/
├── 📁 Controllers/              # API Controllers
│   ├── AuthController.cs        # Authentication endpoints
│   ├── UsersController.cs       # User management
│   ├── RolesController.cs       # Role management
│   ├── PermissionsController.cs # Permission management
│   ├── AuditController.cs       # Audit log management
│   └── DashboardController.cs   # Dashboard data endpoints
├── 📁 Services/                 # Business Logic Services
│   ├── 📁 Interfaces/           # Service interfaces
│   │   ├── IAuthService.cs      # Authentication service
│   │   ├── IUsersService.cs     # User management service
│   │   ├── IRolesService.cs     # Role management service
│   │   ├── IPermissionService.cs # Permission service
│   │   ├── IEmailService.cs     # Email service
│   │   ├── IAuditService.cs     # Audit logging
│   │   └── IRateLimitService.cs # Rate limiting
│   ├── IdentityAuthService.cs   # Identity-based authentication
│   ├── UsersService.cs          # User management implementation
│   ├── RolesService.cs          # Role management implementation
│   ├── PermissionService.cs     # Permission implementation
│   ├── EmailService.cs          # Email implementation
│   ├── AuditService.cs          # Audit logging implementation
│   └── RateLimitService.cs      # Rate limiting implementation
├── 📁 DTOs/                     # Data Transfer Objects
│   ├── 📁 Auth/                 # Authentication DTOs
│   │   ├── LoginRequest.cs      # Login request model
│   │   ├── AuthResponse.cs      # Authentication response
│   │   ├── ForgotPasswordRequest.cs # Password reset request
│   │   ├── SetupPasswordRequest.cs  # Password setup request
│   │   ├── ChangePasswordRequest.cs # Password change request
│   │   └── UserDto.cs           # User data transfer object
│   ├── 📁 Users/                # User management DTOs
│   ├── 📁 Roles/                # Role management DTOs
│   └── 📁 Permissions/          # Permission DTOs
├── 📁 Handlers/                 # Authorization Handlers
│   ├── PermissionHandler.cs     # Permission-based authorization
│   ├── PermissionPolicyProvider.cs # Dynamic policy provider
│   └── PermissionRequirement.cs # Permission requirement
├── 📁 Extensions/               # Extension Methods
│   ├── AuthorizationExtensions.cs # Authorization configuration
│   └── UserExtensions.cs        # User utility extensions
├── 📁 Attributes/               # Custom Attributes
│   └── RateLimitAttribute.cs    # Rate limiting attribute
├── 📁 Helpers/                  # Utility Classes
│   └── Helper.cs                # Common helper methods
├── 📁 Properties/               # Project Properties
├── 📁 Migrations/               # Database Migrations
├── 📁 Data/                     # Data Layer (from Data project)
│   └── 📁 Common/              # Shared types
│       ├── Result.cs            # Result<T> record (status code + data/error)
│       ├── PagedResult.cs       # PagedResult<T> (Items, TotalCount, PageNumber, PageSize)
│       └── PagedResultParams.cs # Pagination/sort/filter query parameters
├── appsettings.json             # Application configuration
├── appsettings.Development.json # Development configuration
├── Program.cs                   # Application entry point
├── JwtSettings.cs               # JWT configuration
└── README.md                    # This file
```

## 🛠️ Technologies

### Core Technologies

- **.NET 10** - Application framework
- **ASP.NET Core** - Web API framework
- **Entity Framework Core** - ORM
- **PostgreSQL** - Database

### Security Technologies

- **ASP.NET Core Identity** - User management and authentication
- **JWT Bearer Authentication** - Token-based authentication
- **Identity Password Hashing** - Secure password storage
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling
- **Audit Logging** - Security event tracking

### Development Tools

- **Swagger/OpenAPI** - API documentation
- **Serilog** - Structured logging
- **xUnit** - Unit testing framework
- **Entity Framework Migrations** - Database versioning

## 🛡️ Security Features

### Enterprise-Grade Security

This backend implements comprehensive security features:

#### 🔐 Authentication & Authorization

- **JWT Token-based Authentication**
- **Role-based Access Control (RBAC)**
- **Permission-based Authorization**
- **Token Revocation** for immediate logout via RevokedTokenService
- **Automatic Token Refresh**

#### ⏱️ Rate Limiting

- **Login Endpoint**: 5 requests per 15 minutes per IP address (prevents brute force attacks)
- **Refresh Token Endpoint**: 10 requests per 15 minutes
- **Configurable Limits** per endpoint via `[RateLimit(maxRequests, windowMinutes)]`
- **IP + User-based** rate limiting (IP for login, IP+User for authenticated endpoints)
- **In-memory Cache** for performance (cleared on restart)

#### 📊 Audit Logging

- **Comprehensive Event Tracking**
- **Authentication Events** (login, logout, refresh)
- **Security Events** (failed attempts)
- **Success/Failure** logging

#### 🔒 Token Revocation

- **Immediate Token Revocation** via RevokedTokenService
- **JWT Validation Integration**
- **Automatic Cleanup** of expired revoked tokens

### Security Implementation Details

#### JWT Configuration

```csharp
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtSettings.Audience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SigningKey)),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(2)
    };
});
```

#### Rate Limiting Implementation

```csharp
[RateLimit(10, 15)]
[HttpPost("refresh-token")]
public async Task<IActionResult> RefreshToken(CancellationToken cancellationToken)
{

}
```

#### Audit Logging Example

```csharp
await auditService.LogAuthenticationEventAsync(
    AuditEventType.Login,
    "User logged in successfully",
    userId,
    httpContext,
    success: true
);
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/login

Authenticate user and return JWT token.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "guid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": { "name": "Admin" },
      "permissions": ["users:view", "users:create"],
      "permissionKeys": ["users:view", "users:create"]
    },
    "token": "jwt-token-string",
    "expiresAt": "2024-01-01T12:00:00Z"
  }
}
```

#### POST /api/auth/logout

Logout user; client discards JWT (no blacklist).

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": true
}
```

#### POST /api/auth/reset-password

Reset user password using reset token from email.

**Request:**

```json
{
  "email": "user@example.com",
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}
```

**Response:**

```json
{
  "success": true,
  "data": true
}
```

#### POST /api/auth/confirm-email

Confirm user email address using confirmation token and set password. This endpoint both confirms the email and sets the user's password in a single operation.

**Request:**

```json
{
  "email": "user@example.com",
  "token": "confirmation-token-from-email",
  "password": "newpassword123"
}
```

**Response:**

```json
{
  "success": true,
  "data": true
}
```

#### POST /api/auth/change-password

Change current user's password (requires authentication).

**Headers:** `Authorization: Bearer <token>`
**Request:**

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**

```json
{
  "success": true,
  "data": true
}
```

#### GET /api/auth/me

Get current authenticated user's profile information.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "guid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": { "name": "Admin" },
    "permissions": ["users:view", "users:create"]
  }
}
```

### User Management Endpoints

#### GET /api/users

Get paginated list of users.

**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**

- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10)
- `filter[status]`: Filter by status
- `sortBy`: Sort field
- `sortOrder`: asc/desc

#### GET /api/users/{id}

Get specific user by ID.

**Headers:** `Authorization: Bearer <token>`

#### POST /api/users

Create new user.

**Headers:** `Authorization: Bearer <token>`
**Request:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "roleId": "role-guid",
  "status": 1
}
```

#### PUT /api/users/{id}

Update existing user.

**Headers:** `Authorization: Bearer <token>`

#### DELETE /api/users/{id}

Delete user by ID.

**Headers:** `Authorization: Bearer <token>`

#### PUT /api/users/profile

Update current authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

### Role Management Endpoints

#### GET /api/roles

Get paginated list of roles.

**Headers:** `Authorization: Bearer <token>`

#### POST /api/roles

Create new role.

**Headers:** `Authorization: Bearer <token>`

#### PUT /api/roles/{id}/permissions

Update role permissions.

**Headers:** `Authorization: Bearer <token>`

### Permission Management Endpoints

#### GET /api/permissions

Get paginated list of permissions.

**Headers:** `Authorization: Bearer <token>`

### Audit Log Endpoints

#### GET /api/audit

Get paginated list of audit logs.

**Headers:** `Authorization: Bearer <token>`
**Required Role:** `administrator`
**Query Parameters:**

- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10)
- `sortBy`: Sort field
- `sortOrder`: asc/desc

### Dashboard Endpoints

#### GET /api/dashboard/recent-logs

Get recent audit logs for dashboard display.

**Headers:** `Authorization: Bearer <token>`
**Required Role:** `administrator`
**Returns:** Recent 10 audit logs sorted by timestamp (descending)

## 🗄️ Database

### Database Schema

The application uses PostgreSQL with the following main tables:

#### Core Tables

- **Users** - User accounts and authentication data
- **Roles** - User roles for RBAC
- **Permissions** - Granular permissions
- **UserPermissions** - Direct user-to-permission assignments
- **RolePermissions** - Role-to-permission assignments

#### Security Tables

- **RevokedTokens** - Revoked JWT tokens (via RevokedTokenService)
- **AuditLogs** - Security event audit trail

### Database Migrations

```bash
# Create new migration (interactive - prompts for name)
./add-migration.sh                   # macOS / Linux (from project root)
add-migration.bat                    # Windows (from project root)

# Or manually:
dotnet ef migrations add <MigrationName> \
    --project ./Template.Data \
    --startup-project ./Template.Server \
    --context Template.Data.Data.ApplicationDbContext

# Update database
dotnet ef database update

# Remove last migration
dotnet ef migrations remove

# Generate SQL script
dotnet ef migrations script
```

### Database Configuration

```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DbConnectionString"));
});
```

## 🔐 Authentication

### Authentication Flow

1. **Login**: User submits credentials → JWT token generated
2. **API Requests**: JWT validated → Blacklist checked → Permissions verified
3. **Token Refresh**: Rate-limited refresh → New token generated
4. **Logout**: Client discards JWT → User logged out

### Permission System

The application implements a two-tier permission system:

1. **JWT Claims**: Permissions embedded in token for fast access
2. **Database Fallback**: Permission lookup from database if claims missing

### Permission Handler

```csharp
public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {

        var permissionClaims = context.User.FindAll("perm").Select(c => c.Value).ToHashSet();
        if (permissionClaims.Contains(requirement.PermissionKey))
        {
            context.Succeed(requirement);
            return;
        }


        var userId = context.User.FindFirst("sub")?.Value;
        var user = await _dbContext.Users
            .Include(u => u.Role).ThenInclude(r => r.Permissions)
            .Include(u => u.Permissions)
            .FirstOrDefaultAsync(u => u.Id == Guid.Parse(userId));

        var effectivePermissions = user.GetEffectivePermissions();
        if (effectivePermissions.Contains(requirement.PermissionKey))
        {
            context.Succeed(requirement);
        }
    }
}
```

## 🚀 Development

### Available Commands

```bash
# Development
dotnet run                    # Run application
dotnet watch run             # Run with hot reload
dotnet build                 # Build application
dotnet clean                 # Clean build artifacts

# Database
dotnet ef migrations add <name>     # Create migration
dotnet ef database update          # Apply migrations
dotnet ef migrations remove        # Remove last migration

# Testing
dotnet test                   # Run all tests
dotnet test --filter <test>   # Run specific test
dotnet test --logger "console;verbosity=detailed" # Verbose output
```

### Development Workflow

1. **Start Database**: Ensure PostgreSQL is running
2. **Run Migrations**: `dotnet ef database update`
3. **Start Application**: `dotnet run`
4. **Access Swagger**: http://localhost:5249/swagger
5. **Run Tests**: `dotnet test`

### Environment Configuration

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
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

## 🧪 Testing

### Test Structure

```
Template.Tests/
├── 📁 Controllers/           # Controller tests
├── 📁 Services/              # Service tests
├── 📁 Handlers/              # Authorization handler tests
└── 📁 Integration/           # Integration tests
```

### Running Tests

```bash
# Run all tests
dotnet test

# Run specific test class
dotnet test --filter "AuthControllerTests"

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run integration tests
dotnet test --filter "Integration"
```

### Test Examples

```csharp
[Fact]
public async Task Login_WithValidCredentials_ReturnsToken()
{

    var loginRequest = new LoginRequest { Email = "test@example.com", Password = "password" };


    var result = await _authService.LoginAsync(loginRequest, CancellationToken.None);


    Assert.True(result.Success);
    Assert.NotNull(result.Data.Token);
}
```

## 🚀 Deployment

### Production Build

```bash
# Build for production
dotnet publish -c Release -o ./publish

# Run production build
dotnet ./publish/Template.Server.dll
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["Template.Server/Template.Server.csproj", "Template.Server/"]
RUN dotnet restore "Template.Server/Template.Server.csproj"
COPY . .
WORKDIR "/src/Template.Server"
RUN dotnet build "Template.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Template.Server.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Template.Server.dll"]
```

### Environment Variables

```bash
# Production environment variables
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DbConnectionString="Host=prod-db;Database=template;Username=user;Password=pass"
Jwt__SigningKey="production-secret-key-minimum-32-characters"
```

### Deployment Options

1. **IIS** - Windows Server deployment
2. **Docker** - Containerized deployment
3. **Linux** - Self-hosted on Linux
4. **Cloud** - Azure, AWS, Google Cloud
5. **Kubernetes** - Container orchestration

## 📊 Performance

### Performance Optimizations

- **Entity Framework** query optimization
- **Database indexing** for security tables
- **In-memory caching** for rate limiting
- **Background services** for cleanup
- **Async/await** throughout

### Monitoring

- **Serilog** structured logging
- **Health checks** for monitoring
- **Performance counters** for metrics
- **Audit logging** for security events

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U postgres -d template
```

#### JWT Token Issues

```bash
# Check JWT configuration
echo $Jwt__SigningKey

# Verify token expiration
# Check ClockSkew setting
```

#### Migration Issues

```bash
# Reset database
dotnet ef database drop
dotnet ef database update

# Check migration status
dotnet ef migrations list
```

### Debug Configuration

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Information"
    }
  }
}
```

## 📚 Additional Resources

- **[Security Enhancements](../Documentation/Security-Enhancements.md)** - Detailed security documentation
- **[Authentication Flow](../Documentation/Authentication-Flow-Diagram.md)** - Complete auth flow diagrams
- **[Authentication Sequence](../Documentation/Authentication-Sequence-Diagram.md)** - Step-by-step auth flow
- **[Database Schema](../Documentation/Security-Database-Schema.md)** - Security database design
- **[API Documentation](http://localhost:5249/swagger)** - Interactive API docs

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes**: Follow C# coding conventions
4. **Add tests**: Maintain high test coverage
5. **Run tests**: `dotnet test`
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Code Standards

- **C# Coding Conventions**: Follow Microsoft guidelines
- **SOLID Principles**: Maintain clean architecture
- **Testing**: Write unit and integration tests
- **Documentation**: Update docs for new features
- **Security**: Follow security best practices

---

**Built with ❤️ using .NET 10, ASP.NET Core, and enterprise security practices**
