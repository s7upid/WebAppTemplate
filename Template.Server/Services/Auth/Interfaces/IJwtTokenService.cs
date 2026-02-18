namespace Template.Server.Services.Auth.Interfaces;

public interface IJwtTokenService
{
    Task<AuthResponse> GenerateTokenAsync(User user);
}
