namespace Template.Server.Controllers;

/// <summary>
/// Controller for handling user authentication operations including login, logout, token management, and password operations.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    /// <summary>
    /// Authenticates a user with email and password credentials and returns a JWT token.
    /// Rate limited to 5 requests per 15 minutes per IP address to prevent brute force attacks.
    /// </summary>
    /// <param name="request">Login credentials containing email and password</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Authentication response with user data and JWT token</returns>
    [RateLimit(5, 15)]
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(string), StatusCodes.Status429TooManyRequests)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        Result<AuthResponse> result = await authService.LoginAsync(request, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Logs out the current user. Client should discard its JWT; server uses
    /// Identity security features (no blacklist required).
    /// </summary>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Success confirmation of logout operation</returns>
    [Authorize]
    [HttpPost("logout")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        string? tokenIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Jti);
        string? expClaim = User.FindFirstValue(JwtRegisteredClaimNames.Exp);

        if (!Guid.TryParse(userIdClaim, out Guid userId) || string.IsNullOrEmpty(tokenIdClaim) || string.IsNullOrEmpty(expClaim))
        {
            return Unauthorized(new Result<object>(HttpStatusCode.Unauthorized, "Invalid token"));
        }

        if (!long.TryParse(expClaim, out long expUnix))
        {
            return Unauthorized(new Result<object>(HttpStatusCode.Unauthorized, "Invalid token expiration"));
        }

        DateTime tokenExpiresAt = DateTimeOffset.FromUnixTimeSeconds(expUnix).DateTime;
        Result<bool> result = await authService.LogoutAsync(tokenIdClaim, userId, tokenExpiresAt, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Refreshes the current user's JWT token and returns a new token with extended expiration.
    /// Rate limited to 10 requests per 15 minutes.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>New authentication response with refreshed JWT token</returns>
    [Authorize]
    [RateLimit(10, 15)]
    [HttpPost("refresh-token")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status429TooManyRequests)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RefreshToken(CancellationToken cancellationToken)
    {
        string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (!Guid.TryParse(userIdClaim, out Guid guid))
        {
            return Unauthorized(new Result<object>(HttpStatusCode.Unauthorized, "Invalid user"));
        }

        Result<AuthResponse> result = await authService.RefreshTokenAsync(guid, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Initiates password reset process by sending a reset email to the user.
    /// </summary>
    /// <param name="request">Request containing user's email address</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Confirmation that reset email was sent (always returns success for security)</returns>
    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request, CancellationToken cancellationToken)
    {
        Result<bool> result = await authService.ForgotPasswordAsync(request.Email, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Resets a user's password using a reset token from forgot password email.
    /// </summary>
    /// <param name="request">Password reset request containing email, token, and new password</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Confirmation of successful password reset</returns>
    [HttpPost("reset-password")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        Result<bool> result = await authService.ResetPasswordAsync(request, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Changes the current user's password by verifying their current password.
    /// </summary>
    /// <param name="request">Password change request containing current and new passwords</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Confirmation of successful password change</returns>
    [Authorize]
    [HttpPost("change-password")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (!Guid.TryParse(userIdClaim, out Guid guid))
        {
            return Unauthorized(new Result<object>(HttpStatusCode.Unauthorized, "Invalid user"));
        }

        Result<bool> result = await authService.ChangePasswordAsync(guid, request, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Confirms a user's email address using a confirmation token.
    /// </summary>
    /// <param name="request">Email confirmation request containing email and token</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Confirmation of successful email confirmation</returns>
    [HttpPost("confirm-email")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest request, CancellationToken cancellationToken)
    {
        Result<bool> result = await authService.ConfirmEmailAndSetPasswordAsync(request.Email, request.Token, request.Password, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Retrieves the current authenticated user's profile information.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Current user's profile data including roles and permissions</returns>
    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetCurrentUser(CancellationToken cancellationToken)
    {
        string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (!Guid.TryParse(userIdClaim, out Guid guid))
        {
            return Unauthorized(new Result<UserResponse?>(HttpStatusCode.Unauthorized, "Invalid user"));
        }

        Result<UserResponse> result = await authService.GetUserByIdAsync(guid, cancellationToken);
        return this.ToActionResult(result);
    }
}