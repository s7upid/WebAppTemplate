namespace Template.Server.DTOs.Users.Request;

public class CreateUserRequest
{
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public Guid RoleId { get; set; }
    public int Status { get; set; } = 2;
}