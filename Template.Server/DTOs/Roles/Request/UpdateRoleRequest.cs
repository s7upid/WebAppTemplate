namespace Template.Server.DTOs.Roles.Request;

public class UpdateRoleRequest
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public List<string>? PermissionKeys { get; set; }
}