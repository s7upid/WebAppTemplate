namespace Template.Data.Models;

public class Role : IdentityRole<Guid>
{
    [Searchable]
    public override string? Name { get; set; }

    public string Description { get; set; } = null!;

    public ICollection<Permission> Permissions { get; set; } = [];

    public ICollection<UserRole> UserRoles { get; set; } = [];

    public bool IsSystem { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
