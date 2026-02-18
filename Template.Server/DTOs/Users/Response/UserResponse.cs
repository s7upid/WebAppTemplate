namespace Template.Server.DTOs.Users.Response;

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

    public static UserResponse Map(User user)
    {
        var role = user.UserRoles.FirstOrDefault()?.Role;
        return new()
        {
            Id = user.Id,
            Email = user.Email ?? "",
            FirstName = user.FirstName ?? "",
            LastName = user.LastName ?? "",
            CustomPermissionsCount = user.Permissions?.Count ?? 0,
            IsActive = !user.LockoutEnabled || (user.LockoutEnd != null && user.LockoutEnd <= DateTimeOffset.UtcNow),
            UserStatus = user.Status,
            LastLogin = user.LastLogin,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            Avatar = user.Avatar,
            Role = role != null ? new RoleResponse { Id = role.Id, Name = role.Name ?? string.Empty } : null,
            Permissions = [.. user.Permissions?.Select(PermissionResponse.Map) ?? []],
            PermissionKeys = user.PermissionKeys
        };
    }
}
