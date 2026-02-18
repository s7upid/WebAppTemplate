namespace Template.Server.Services.Auth.Interfaces;

public interface IRevokedTokenService
{
    void RevokeUser(Guid userId, TimeSpan ttl);
    bool IsUserRevoked(Guid userId);
}
