namespace Template.Server.Services.Auth.Interfaces;

public interface IAuthService
{
    Task<Result<AuthResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken);
    Task<Result<AuthResponse>> RefreshTokenAsync(Guid userId, CancellationToken cancellationToken);
    Task<Result<bool>> ForgotPasswordAsync(string email, CancellationToken cancellationToken);
    Task<Result<bool>> ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken);
    Task<Result<bool>> ChangePasswordAsync(Guid userId, ChangePasswordRequest request, CancellationToken cancellationToken);
    Task<Result<bool>> ConfirmEmailAndSetPasswordAsync(string email, string token, string password, CancellationToken cancellationToken);
    Task<Result<UserResponse>> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<Result<bool>> LogoutAsync(string tokenId, Guid userId, DateTime tokenExpiresAt, CancellationToken cancellationToken = default);
}