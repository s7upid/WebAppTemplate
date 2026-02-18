namespace Template.Server.DTOs.Permissions.Response;

public class PermissionResponse
{
    public Guid Id { get; set; }

    public string Key { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Resource { get; set; } = null!;

    public string Action { get; set; } = null!;

    public string Category { get; set; } = null!;

    public bool IsSystem { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public static PermissionResponse Map(Permission perm) => new()
    {
        Id = perm.Id,
        Name = perm.Name,
        Action = perm.Action,
        Category = perm.Category,
        CreatedAt = perm.CreatedAt,
        Description = perm.Description,
        IsSystem = perm.IsSystem,
        Key = perm.Key,
        Resource = perm.Resource
    };
}
