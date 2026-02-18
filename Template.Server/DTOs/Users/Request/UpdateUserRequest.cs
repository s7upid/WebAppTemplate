namespace Template.Server.DTOs.Users.Request;

public class UpdateUserRequest
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? Avatar { get; set; }
    public Guid? RoleId { get; set; }
    public List<string>? PermissionKeys { get; set; }
    public int? Status { get; set; }
}