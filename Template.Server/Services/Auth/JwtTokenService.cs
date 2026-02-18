namespace Template.Server.Services.Auth;

public class JwtTokenService(IOptions<JwtSettings> jwtOptions, UserManager<User> userManager) : IJwtTokenService
{
    private readonly JwtSettings _jwtSettings = jwtOptions?.Value ?? throw new ArgumentNullException(nameof(jwtOptions));

    public async Task<AuthResponse> GenerateTokenAsync(User user)
    {
        ArgumentNullException.ThrowIfNull(user);

        DateTime now = DateTime.UtcNow;
        DateTime expires = now.AddHours(_jwtSettings.ExpiryHours);

        List<Claim> claims = await BuildClaimsAsync(user);

        SymmetricSecurityKey signingKey = new(Encoding.UTF8.GetBytes(_jwtSettings.SigningKey));
        SigningCredentials signingCredentials = new(signingKey, SecurityAlgorithms.HmacSha256);

        JwtSecurityToken token = new(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            notBefore: now,
            expires: expires,
            signingCredentials: signingCredentials
        );

        return new AuthResponse
        {
            User = UserResponse.Map(user),
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            ExpiresAt = expires
        };
    }

    private async Task<List<Claim>> BuildClaimsAsync(User user)
    {
        List<Claim> claims =
        [
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Email ?? string.Empty),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        ];

        IList<string> roles = await userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        if (user.PermissionKeys != null)
        {
            claims.AddRange(user.PermissionKeys.Select(p => new Claim("perm", p)));
        }

        return claims;
    }
}