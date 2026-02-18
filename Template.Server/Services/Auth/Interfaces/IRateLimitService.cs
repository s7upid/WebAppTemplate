namespace Template.Server.Services.Auth.Interfaces;

public interface IRateLimitService
{
    Task<bool> IsRateLimitedAsync(string key, int maxRequests, TimeSpan window, CancellationToken cancellationToken = default);
    Task IncrementCounterAsync(string key, TimeSpan window, CancellationToken cancellationToken = default);
}
