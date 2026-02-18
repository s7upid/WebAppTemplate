namespace Template.Server.Services.Auth;

public class RateLimitService(IMemoryCache cache, ILogger logger) : IRateLimitService
{
    private static readonly Lock _lock = new();

    public Task<bool> IsRateLimitedAsync(string key, int maxRequests, TimeSpan window, CancellationToken cancellationToken = default)
    {
        // If maxRequests is 0, no requests are allowed
        if (maxRequests <= 0)
        {
            return Task.FromResult(true);
        }

        string cacheKey = $"rate_limit_{key}";

        if (cache.TryGetValue(cacheKey, out RateLimitInfo? info))
        {
            if (info?.Count >= maxRequests)
            {
                logger.Warning("Rate limit exceeded for key: {Key}. Count: {Count}, Max: {Max}", key, info.Count, maxRequests);
                return Task.FromResult(true);
            }
        }

        return Task.FromResult(false);
    }

    public Task IncrementCounterAsync(string key, TimeSpan window, CancellationToken cancellationToken = default)
    {
        string cacheKey = $"rate_limit_{key}";

        lock (_lock)
        {
            if (cache.TryGetValue(cacheKey, out RateLimitInfo? info))
            {
                info!.Count++;
            }
            else
            {
                info = new RateLimitInfo { Count = 1 };
                MemoryCacheEntryOptions options = new()
                {
                    AbsoluteExpirationRelativeToNow = window
                };
                cache.Set(cacheKey, info, options);
            }
        }

        return Task.CompletedTask;
    }

    private class RateLimitInfo
    {
        public int Count { get; set; }
    }
}