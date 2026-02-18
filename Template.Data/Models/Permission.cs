namespace Template.Data.Models;

public class Permission
{
    public Guid Id { get; set; }

    [Searchable]
    public string Key { get; set; } = null!;

    [Searchable]
    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Resource { get; set; } = null!;

    public string Action { get; set; } = null!;

    public string Category { get; set; } = null!;

    public bool IsSystem { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
