namespace Template.Server.Services.Auth;

public class AuthService(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    IEmailService emailService,
    IAuditService auditService,
    IJwtTokenService jwtTokenService,
    IPermissionResolver permissionResolver,
    ApplicationDbContext dbContext,
    IRevokedTokenService revokedTokenService
) : IAuthService
{
    public async Task<Result<AuthResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        User? user = await LoadUserWithPermissionsAsync(u => u.Email == request.Email, cancellationToken);
        if (user == null)
        {
            string errorMsg = "User not found";
            await auditService.LogEventAsync(
                 AuditEventType.FailedLogin,
                 $"Failed login attempt for email: {request.Email}",
                 success: false,
                 errorMessage: errorMsg,
                 cancellationToken: cancellationToken);

            return Unauthorized<AuthResponse>(errorMsg);
        }

        if (user.Status != UserStatus.Active)
        {
            string errorMsg = "User not active. Please contact administrator.";
            await auditService.LogEventAsync(
                 AuditEventType.FailedLogin,
                 $"Failed login attempt for email: {request.Email}",
                 success: false,
                 errorMessage: errorMsg,
                 cancellationToken: cancellationToken);

            return Unauthorized<AuthResponse>(errorMsg);
        }

        bool isLockedOut = user.LockoutEnabled && (user.LockoutEnd == null || user.LockoutEnd > DateTimeOffset.UtcNow);
        if (isLockedOut)
        {
            string errorMsg = "Account locked. Please contact administrator.";
            await auditService.LogEventAsync(
                 AuditEventType.FailedLogin,
                 $"Failed login attempt for locked user: {request.Email}",
                 user.Id,
                 success: false,
                 errorMessage: errorMsg,
                 cancellationToken: cancellationToken);

            return Unauthorized<AuthResponse>(errorMsg);
        }

        var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);
        if (!result.Succeeded)
        {
            string errorMsg = result.IsLockedOut ? "Account locked" : "Invalid credentials";
            await auditService.LogEventAsync(
                AuditEventType.FailedLogin,
                $"Failed login attempt for user: {user.Email}",
                user.Id,
                success: false,
                errorMessage: errorMsg,
                cancellationToken: cancellationToken);

            return Unauthorized<AuthResponse>(errorMsg);
        }

        user.LastLogin = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);

        AuthResponse authResponse = await jwtTokenService.GenerateTokenAsync(user);
        await LogAuditAsync(
            AuditEventType.Login,
            $"Successful login for user: {user.Email}",
            user.Id,
            cancellationToken);

        return Ok(authResponse);
    }

    public async Task<Result<AuthResponse>> RefreshTokenAsync(Guid userId, CancellationToken cancellationToken)
    {
        User? user = await LoadUserWithPermissionsAsync(u => u.Id == userId, cancellationToken);
        if (user == null)
        {
            string errorMsg = "User not found";
            await auditService.LogEventAsync(
                AuditEventType.TokenRefresh,
                $"Token refresh failed for user ID: {userId}",
                userId,
                success: false,
                errorMessage: errorMsg,
                cancellationToken: cancellationToken);

            return Unauthorized<AuthResponse>(errorMsg);
        }

        bool isLockedOut = user.LockoutEnabled && (user.LockoutEnd == null || user.LockoutEnd > DateTimeOffset.UtcNow);
        if (isLockedOut)
        {
            string errorMsg = "Account locked";
            await auditService.LogEventAsync(
                AuditEventType.TokenRefresh,
                $"Token refresh failed - account locked for user: {user.Email}",
                userId,
                success: false,
                errorMessage: errorMsg,
                cancellationToken: cancellationToken);

            return Unauthorized<AuthResponse>(errorMsg);
        }

        if (user.Status != UserStatus.Active)
        {
            string errorMsg = "User not active";
            await auditService.LogEventAsync(
                AuditEventType.TokenRefresh,
                $"Token refresh failed - user not active: {user.Email}",
                userId,
                success: false,
                errorMessage: errorMsg,
                cancellationToken: cancellationToken);

            return Unauthorized<AuthResponse>(errorMsg);
        }

        AuthResponse authResponse = await jwtTokenService.GenerateTokenAsync(user);
        await LogAuditAsync(
            AuditEventType.TokenRefresh,
            $"Token refreshed successfully for user: {user.Email}",
            user.Id,
            cancellationToken);

        return Ok(authResponse);
    }

    public async Task<Result<bool>> LogoutAsync(string tokenId, Guid userId, DateTime tokenExpiresAt, CancellationToken cancellationToken)
    {
        // Revoke user tokens for the remaining token lifetime
        var ttl = tokenExpiresAt - DateTime.UtcNow;
        if (ttl > TimeSpan.Zero)
        {
            revokedTokenService.RevokeUser(userId, ttl);
        }

        await LogAuditAsync(
            AuditEventType.Logout,
            "User logged out successfully",
            userId,
            cancellationToken);

        return Ok(true);
    }

    public async Task<Result<bool>> ForgotPasswordAsync(string email, CancellationToken cancellationToken)
    {
        User? user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return Ok(true);
        }

        string token = await userManager.GeneratePasswordResetTokenAsync(user);
        string resetLink = $"https://yourclient.example/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(email)}";

        await emailService.SendAsync(
            user.Email!,
            "Password Reset Request",
            PasswordResetEmailService.GenerateHtml(user.FirstName, user.LastName, resetLink),
            PasswordResetEmailService.GeneratePlainText(user.FirstName, user.LastName, resetLink));

        await LogAuditAsync(
            AuditEventType.PasswordResetRequested,
            $"Password reset requested for user: {user.Email}",
            user.Id,
            cancellationToken);

        return Ok(true);
    }

    public async Task<Result<bool>> ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        User? user = await userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return BadRequest<bool>("Invalid email or token");
        }

        IdentityResult result = await userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        if (!result.Succeeded)
        {
            return BadRequest<bool>(string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        user.UpdatedAt = DateTime.UtcNow;
        await userManager.UpdateAsync(user);

        await LogAuditAsync(
            AuditEventType.PasswordReset,
            $"Password reset successfully for user: {user.Email}",
            user.Id,
            cancellationToken);

        return Ok(true);
    }

    public async Task<Result<bool>> ChangePasswordAsync(Guid userId, ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        User? user = await LoadUserWithPermissionsAsync(u => u.Id == userId, cancellationToken);
        if (user == null)
        {
            return Unauthorized<bool>("User not found");
        }

        if (request.NewPassword != request.ConfirmPassword)
        {
            return BadRequest<bool>("Passwords don't match");
        }

        IdentityResult result = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded)
        {
            return BadRequest<bool>(string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        user.UpdatedAt = DateTime.UtcNow;
        await userManager.UpdateAsync(user);

        return Ok(true);
    }

    public async Task<Result<bool>> ConfirmEmailAndSetPasswordAsync(string email, string token, string password, CancellationToken cancellationToken)
    {
        User? user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return BadRequest<bool>("Invalid email or token");
        }

        IdentityResult confirmResult = await userManager.ConfirmEmailAsync(user, token);
        if (!confirmResult.Succeeded)
        {
            return BadRequest<bool>(string.Join(", ", confirmResult.Errors.Select(e => e.Description)));
        }

        string resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
        IdentityResult passwordResult = await userManager.ResetPasswordAsync(user, resetToken, password);
        if (!passwordResult.Succeeded)
        {
            return BadRequest<bool>(string.Join(", ", passwordResult.Errors.Select(e => e.Description)));
        }

        user.UpdatedAt = DateTime.UtcNow;
        await userManager.UpdateAsync(user);

        await LogAuditAsync(
            AuditEventType.EmailConfirmed,
            $"Email confirmed and password set successfully for user: {user.Email}",
            user.Id,
            cancellationToken);

        return Ok(true);
    }

    public async Task<Result<UserResponse>> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        User? user = await LoadUserWithPermissionsAsync(u => u.Id == userId, cancellationToken);
        if (user == null)
        {
            return NotFound<UserResponse>("User not found");
        }

        return Ok(UserResponse.Map(user));
    }

    #region Helpers

    private async Task<User?> LoadUserWithPermissionsAsync(Expression<Func<User, bool>> predicate, CancellationToken cancellationToken = default)
    {
        User? user = await dbContext.Users
            .Where(predicate)
            .Include(x => x.UserRoles)
                .ThenInclude(x => x.Role)
                    .ThenInclude(r => r.Permissions)
            .Include(x => x.Permissions)
            .AsSplitQuery()
            .FirstOrDefaultAsync(cancellationToken: cancellationToken);

        if (user == null)
        {
            return null;
        }

        user.PermissionKeys = permissionResolver.GetEffectivePermissions(user);
        return user;
    }

    private async Task LogAuditAsync(AuditEventType eventType, string description, Guid? userId, CancellationToken cancellationToken)
    {
        await auditService.LogEventAsync(eventType, description, userId, cancellationToken: cancellationToken);
    }

    #endregion
}
