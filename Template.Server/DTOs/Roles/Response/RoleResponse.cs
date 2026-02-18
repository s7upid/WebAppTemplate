namespace Template.Server.DTOs.Roles.Response;

public class RoleResponse
{
    public Guid Id { get; set; }
    public string Description { get; set; } = null!;
    public string Name { get; set; } = null!;
    public List<PermissionResponse> Permissions { get; set; } = [];
    public List<UserResponse> Users { get; set; } = [];
    public bool IsSystem { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public static RoleResponse Map(Role role) => new()
    {
        Id = role.Id,
        Name = role.Name!,
        Description = role.Description,
        IsSystem = role.IsSystem,
        CreatedAt = role.CreatedAt,
        UpdatedAt = role.UpdatedAt,
        Permissions = [.. role.Permissions.Select(PermissionResponse.Map)],
        Users = role.UserRoles?.Select(ur => UserResponse.Map(ur.User)).ToList() ?? [],
    };
}
