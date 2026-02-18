namespace Template.Server.DTOs.Auth.Response;

public class AuthResponse
{
    public UserResponse User { get; set; } = null!;
    public string Token { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
}
