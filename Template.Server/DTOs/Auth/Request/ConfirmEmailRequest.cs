namespace Template.Server.DTOs.Auth.Request;

public class ConfirmEmailRequest
{
    public string Email { get; set; } = null!;
    public string Token { get; set; } = null!;
    public string Password { get; set; } = null!;
}
