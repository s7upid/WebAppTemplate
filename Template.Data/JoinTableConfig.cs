namespace Template.Data;

public class JoinTableConfig
{
    // The table name as configured in the model (e.g. "UserPermissions")
    public string TableName { get; init; } = null!;


    // Column name that references the parent (e.g. "RoleId" or "UserId")
    public string ParentKeyName { get; init; } = null!;


    // Column name that references the child (e.g. "PermissionId")
    public string ChildKeyName { get; init; } = null!;


    // A function that given the DbContext and the parent key value returns the parent entity
    // This makes the config extensible: you can provide any loader logic for the parent.
    public Func<ApplicationDbContext, object?, object?> ParentLoader { get; init; } = null!;


    // Optional: a function that transforms a list of child ids into more human-readable data
    public Func<ApplicationDbContext, List<object?>, object?>? ChildAggregator { get; init; }
}
