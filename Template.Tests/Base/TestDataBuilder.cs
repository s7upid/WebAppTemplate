namespace Template.Tests.Base;

/// <summary>
/// Builder class for creating test data
/// </summary>
public static class TestDataBuilder
{
    public static User CreateUser(
        string? email = null,
        string? firstName = null,
        string? lastName = null,
        UserStatus status = UserStatus.Active,
        bool emailConfirmed = true,
        bool lockoutEnabled = false)
    {
        return new User
        {
            Id = Guid.NewGuid(),
            Email = email ?? $"test{Guid.NewGuid():N}@example.com",
            UserName = email ?? $"test{Guid.NewGuid():N}@example.com",
            FirstName = firstName ?? "Test",
            LastName = lastName ?? "User",
            Status = status,
            EmailConfirmed = emailConfirmed,
            LockoutEnabled = lockoutEnabled,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            UserRoles = [],
            Permissions = []
        };
    }

    public static Role CreateRole(
        string? name = null,
        string? description = null,
        bool isSystem = false)
    {
        return new Role
        {
            Id = Guid.NewGuid(),
            Name = name ?? $"TestRole_{Guid.NewGuid():N}",
            NormalizedName = (name ?? $"TestRole_{Guid.NewGuid():N}").ToUpperInvariant(),
            Description = description ?? "Test Role Description",
            IsSystem = isSystem,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Permissions = [],
            UserRoles = []
        };
    }

    public static Permission CreatePermission(
        string? key = null,
        string? name = null,
        string? description = null,
        string? resource = null,
        string? action = null,
        string? category = null)
    {
        var permissionKey = key ?? $"test.permission.{Guid.NewGuid():N}";
        var parts = permissionKey.Split(':');
        var defaultResource = parts.Length > 0 ? parts[0] : "test";
        var defaultAction = parts.Length > 1 ? parts[1] : "view";
        
        return new Permission
        {
            Id = Guid.NewGuid(),
            Key = permissionKey,
            Name = name ?? $"Test Permission {Guid.NewGuid():N}",
            Description = description ?? "Test Permission Description",
            Resource = resource ?? defaultResource,
            Action = action ?? defaultAction,
            Category = category ?? "Test",
            CreatedAt = DateTime.UtcNow,
        };
    }

    public static LoginRequest CreateLoginRequest(string? email = null, string? password = null)
    {
        return new LoginRequest
        {
            Email = email ?? "test@example.com",
            Password = password ?? "TestPassword123!"
        };
    }

    public static CreateUserRequest CreateUserRequest(
        string? email = null,
        string? firstName = null,
        string? lastName = null,
        Guid? roleId = null)
    {
        return new CreateUserRequest
        {
            Email = email ?? $"test{Guid.NewGuid():N}@example.com",
            FirstName = firstName ?? "Test",
            LastName = lastName ?? "User",
            Status = (int)UserStatus.Pending,
            RoleId = roleId ?? Guid.Empty
        };
    }

    public static UpdateUserRequest CreateUpdateUserRequest(
        string? firstName = null,
        string? lastName = null,
        Guid? roleId = null)
    {
        return new UpdateUserRequest
        {
            FirstName = firstName ?? "Updated",
            LastName = lastName ?? "User",
            RoleId = roleId
        };
    }

    public static CreateRoleRequest CreateRoleRequest(
        string? name = null,
        string? description = null,
        List<string>? permissionKeys = null)
    {
        return new CreateRoleRequest
        {
            Name = name ?? $"TestRole_{Guid.NewGuid():N}",
            Description = description ?? "Test Role Description",
            PermissionKeys = permissionKeys ?? []
        };
    }

    public static UpdateRoleRequest CreateUpdateRoleRequest(
        string? name = null,
        string? description = null,
        List<string>? permissionKeys = null)
    {
        return new UpdateRoleRequest
        {
            Name = name ?? $"UpdatedRole_{Guid.NewGuid():N}",
            Description = description ?? "Updated Role Description",
            PermissionKeys = permissionKeys
        };
    }
}

