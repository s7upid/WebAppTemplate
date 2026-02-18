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

    /// <summary>
    /// Permissions outside of role
    /// </summary>
    public ICollection<Permission> Permissions { get; set; } = [];

    /// <summary>
    /// Roles with permissions
    /// </summary>
    public ICollection<UserRole> UserRoles { get; set; } = [];

    /// <summary>
    /// Used only by permission guard
    /// </summary>
    [NotMapped]
    public List<string>? PermissionKeys { get; set; }
}