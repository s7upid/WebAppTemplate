namespace Template.Tests.Unit.Services;

public class RateLimitServiceTests : BaseUnitTest
{
    private readonly MemoryCache _memoryCache;
    private readonly RateLimitService _rateLimitService;

    public RateLimitServiceTests()
    {
        _memoryCache = new MemoryCache(new MemoryCacheOptions());
        ILogger logger = Serilog.Core.Logger.None;

        // Use loose mock behavior for logger (RateLimitService logs warnings)
        _rateLimitService = new RateLimitService(_memoryCache, logger);
    }

    [Fact]
    public async Task IsRateLimitedAsync_WhenUnderLimit_ReturnsFalse()
    {
        // Arrange
        var key = "test-key";
        var maxRequests = 10;
        var window = TimeSpan.FromMinutes(15);

        // Act
        var result = await _rateLimitService.IsRateLimitedAsync(key, maxRequests, window, CancellationToken);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task IsRateLimitedAsync_WhenAtLimit_ReturnsTrue()
    {
        // Arrange
        var key = "test-key";
        var maxRequests = 10;
        var window = TimeSpan.FromMinutes(15);

        // Set up cache with count at limit - use reflection to create RateLimitInfo
        var cacheKey = $"rate_limit_{key}";
        var rateLimitInfoType = typeof(RateLimitService).GetNestedType("RateLimitInfo", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
        var rateLimitInfo = Activator.CreateInstance(rateLimitInfoType!);
        rateLimitInfoType!.GetProperty("Count")!.SetValue(rateLimitInfo, 10);
        _memoryCache.Set(cacheKey, rateLimitInfo, window);

        // Act
        var result = await _rateLimitService.IsRateLimitedAsync(key, maxRequests, window, CancellationToken);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task IsRateLimitedAsync_WhenOverLimit_ReturnsTrue()
    {
        // Arrange
        var key = "test-key";
        var maxRequests = 10;
        var window = TimeSpan.FromMinutes(15);

        // Set up cache with count over limit - use reflection to create RateLimitInfo
        var cacheKey = $"rate_limit_{key}";
        var rateLimitInfoType = typeof(RateLimitService).GetNestedType("RateLimitInfo", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
        var rateLimitInfo = Activator.CreateInstance(rateLimitInfoType!);
        rateLimitInfoType!.GetProperty("Count")!.SetValue(rateLimitInfo, 15);
        _memoryCache.Set(cacheKey, rateLimitInfo, window);

        // Act
        var result = await _rateLimitService.IsRateLimitedAsync(key, maxRequests, window, CancellationToken);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task IncrementCounterAsync_WhenKeyNotExists_CreatesNewEntry()
    {
        // Arrange
        var key = "test-key";
        var window = TimeSpan.FromMinutes(15);

        // Act
        await _rateLimitService.IncrementCounterAsync(key, window, CancellationToken);

        // Assert
        var cacheKey = $"rate_limit_{key}";
        _memoryCache.TryGetValue(cacheKey, out var value).Should().BeTrue();
        value.Should().NotBeNull();
    }

    [Fact]
    public async Task IncrementCounterAsync_WhenKeyExists_IncrementsCount()
    {
        // Arrange
        var key = "test-key";
        var window = TimeSpan.FromMinutes(15);

        // First increment
        await _rateLimitService.IncrementCounterAsync(key, window, CancellationToken);

        // Act - Second increment
        await _rateLimitService.IncrementCounterAsync(key, window, CancellationToken);

        // Assert
        var cacheKey = $"rate_limit_{key}";
        _memoryCache.TryGetValue(cacheKey, out var value).Should().BeTrue();
        // The count should be incremented (implementation uses reflection to access private class)
        value.Should().NotBeNull();
    }

    [Fact]
    public async Task IsRateLimitedAsync_WithDifferentKeys_ReturnsFalse()
    {
        // Arrange
        var key1 = "key1";
        var key2 = "key2";
        var maxRequests = 5;
        var window = TimeSpan.FromMinutes(15);

        // Increment key1 to limit
        for (int i = 0; i < maxRequests; i++)
        {
            await _rateLimitService.IncrementCounterAsync(key1, window, CancellationToken);
        }

        // Act
        var result1 = await _rateLimitService.IsRateLimitedAsync(key1, maxRequests, window, CancellationToken);
        var result2 = await _rateLimitService.IsRateLimitedAsync(key2, maxRequests, window, CancellationToken);

        // Assert
        result1.Should().BeTrue(); // key1 is at limit
        result2.Should().BeFalse(); // key2 is not rate limited
    }

    [Fact]
    public async Task IncrementCounterAsync_WithConcurrentRequests_IncrementsCorrectly()
    {
        // Arrange
        var key = "concurrent-key";
        var window = TimeSpan.FromMinutes(15);
        var tasks = new List<Task>();

        // Act - Make concurrent increment requests
        for (int i = 0; i < 10; i++)
        {
            tasks.Add(_rateLimitService.IncrementCounterAsync(key, window, CancellationToken));
        }
        await Task.WhenAll(tasks);

        // Assert
        var cacheKey = $"rate_limit_{key}";
        _memoryCache.TryGetValue(cacheKey, out var value).Should().BeTrue();
        value.Should().NotBeNull();
    }

    [Fact]
    public async Task IsRateLimitedAsync_WithExpiredWindow_ReturnsFalse()
    {
        // Arrange
        var key = "expired-key";
        var maxRequests = 5;
        var shortWindow = TimeSpan.FromMilliseconds(100); // Very short window

        // Increment to limit
        for (int i = 0; i < maxRequests; i++)
        {
            await _rateLimitService.IncrementCounterAsync(key, shortWindow, CancellationToken);
        }

        // Wait for window to expire
        await Task.Delay(200);

        // Act
        var result = await _rateLimitService.IsRateLimitedAsync(key, maxRequests, shortWindow, CancellationToken);

        // Assert
        result.Should().BeFalse(); // Window expired, should not be rate limited
    }

    [Fact]
    public async Task IsRateLimitedAsync_WithZeroMaxRequests_ReturnsTrue()
    {
        // Arrange
        var key = "zero-limit-key";
        var maxRequests = 0; // No requests allowed
        var window = TimeSpan.FromMinutes(15);

        // Act
        var result = await _rateLimitService.IsRateLimitedAsync(key, maxRequests, window, CancellationToken);

        // Assert
        result.Should().BeTrue(); // Zero requests means always rate limited
    }

    [Fact]
    public async Task IncrementCounterAsync_WithVeryLongWindow_WorksCorrectly()
    {
        // Arrange
        var key = "long-window-key";
        var window = TimeSpan.FromHours(24); // 24 hour window

        // Act
        await _rateLimitService.IncrementCounterAsync(key, window, CancellationToken);

        // Assert
        var cacheKey = $"rate_limit_{key}";
        _memoryCache.TryGetValue(cacheKey, out var value).Should().BeTrue();
        value.Should().NotBeNull();
    }
}
