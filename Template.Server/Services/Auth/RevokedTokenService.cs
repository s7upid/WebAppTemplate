namespace Template.Server.Services.Auth;

public sealed class RevokedTokenService : IRevokedTokenService
{
    private readonly ConcurrentDictionary<Guid, DateTimeOffset> _revokedUsers = new();

    public void RevokeUser(Guid userId, TimeSpan ttl)
    {
        DateTimeOffset expiresAt = DateTimeOffset.UtcNow.Add(ttl);
        _revokedUsers[userId] = expiresAt;
        CleanupExpired();
    }

    public bool IsUserRevoked(Guid userId)
    {
        if (_revokedUsers.TryGetValue(userId, out DateTimeOffset expiresAt))
        {
            if (expiresAt > DateTimeOffset.UtcNow) return true;
            _revokedUsers.TryRemove(userId, out _);
        }
        return false;
    }

    private void CleanupExpired()
    {
        DateTimeOffset now = DateTimeOffset.UtcNow;
        foreach (KeyValuePair<Guid, DateTimeOffset> kvp in _revokedUsers)
        {
            if (kvp.Value <= now)
            {
                _revokedUsers.TryRemove(kvp.Key, out _);
            }
        }
    }
}