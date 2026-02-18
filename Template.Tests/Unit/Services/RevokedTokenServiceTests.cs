namespace Template.Tests.Unit.Services;

public class RevokedTokenServiceTests : BaseUnitTest
{
    private readonly RevokedTokenService _revokedTokenService;

    public RevokedTokenServiceTests()
    {
        _revokedTokenService = new RevokedTokenService();
    }

    [Fact]
    public void RevokeUser_WithValidUserId_RevokesAllUserTokens()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var expiryWindow = TimeSpan.FromHours(8);

        // Act
        _revokedTokenService.RevokeUser(userId, expiryWindow);

        // Assert
        var isRevoked = _revokedTokenService.IsUserRevoked(userId);
        isRevoked.Should().BeTrue();
    }

    [Fact]
    public void IsUserRevoked_WithNonRevokedUser_ReturnsFalse()
    {
        // Arrange
        var userId = Guid.NewGuid();

        // Act
        var result = _revokedTokenService.IsUserRevoked(userId);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void IsUserRevoked_WithRevokedUser_ReturnsTrue()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var expiryWindow = TimeSpan.FromHours(8);
        _revokedTokenService.RevokeUser(userId, expiryWindow);

        // Act
        var result = _revokedTokenService.IsUserRevoked(userId);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void IsUserRevoked_WithExpiredRevokedUser_ReturnsFalse()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var expiryWindow = TimeSpan.FromMilliseconds(10); // Very short expiry
        _revokedTokenService.RevokeUser(userId, expiryWindow);

        // Wait for expiry
        Thread.Sleep(100);

        // Act
        var result = _revokedTokenService.IsUserRevoked(userId);

        // Assert
        // The service should clean up expired users, so this should return false
        result.Should().BeFalse();
    }

    [Fact]
    public void RevokeUser_MultipleUsers_RevokesEachIndependently()
    {
        // Arrange
        var userId1 = Guid.NewGuid();
        var userId2 = Guid.NewGuid();
        var expiryWindow = TimeSpan.FromHours(8);

        // Act
        _revokedTokenService.RevokeUser(userId1, expiryWindow);
        _revokedTokenService.RevokeUser(userId2, expiryWindow);

        // Assert
        _revokedTokenService.IsUserRevoked(userId1).Should().BeTrue();
        _revokedTokenService.IsUserRevoked(userId2).Should().BeTrue();
    }

    [Fact]
    public void RevokeUser_RevokingSameUserTwice_StillRevoked()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var expiryWindow = TimeSpan.FromHours(8);

        // Act
        _revokedTokenService.RevokeUser(userId, expiryWindow);
        _revokedTokenService.RevokeUser(userId, expiryWindow); // Revoke again

        // Assert
        _revokedTokenService.IsUserRevoked(userId).Should().BeTrue();
    }

    [Fact]
    public void IsUserRevoked_WithEmptyGuid_ReturnsFalse()
    {
        // Arrange
        var emptyUserId = Guid.Empty;

        // Act
        var result = _revokedTokenService.IsUserRevoked(emptyUserId);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void RevokeUser_WithVeryShortExpiry_ExpiresQuickly()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var veryShortExpiry = TimeSpan.FromMilliseconds(50);

        // Act
        _revokedTokenService.RevokeUser(userId, veryShortExpiry);

        // Assert - Should be revoked immediately
        _revokedTokenService.IsUserRevoked(userId).Should().BeTrue();

        // Wait for expiry
        Thread.Sleep(100);

        // Should no longer be revoked
        _revokedTokenService.IsUserRevoked(userId).Should().BeFalse();
    }

    [Fact]
    public void RevokeUser_WithVeryLongExpiry_StaysRevoked()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var veryLongExpiry = TimeSpan.FromDays(365); // 1 year

        // Act
        _revokedTokenService.RevokeUser(userId, veryLongExpiry);

        // Assert
        _revokedTokenService.IsUserRevoked(userId).Should().BeTrue();
    }

    [Fact]
    public void IsUserRevoked_WithManyRevokedUsers_HandlesCorrectly()
    {
        // Arrange
        var userIds = Enumerable.Range(0, 100).Select(_ => Guid.NewGuid()).ToList();
        var expiryWindow = TimeSpan.FromHours(8);

        // Act
        foreach (var userId in userIds)
        {
            _revokedTokenService.RevokeUser(userId, expiryWindow);
        }

        // Assert
        foreach (var userId in userIds)
        {
            _revokedTokenService.IsUserRevoked(userId).Should().BeTrue();
        }

        // Non-revoked user should return false
        var nonRevokedUserId = Guid.NewGuid();
        _revokedTokenService.IsUserRevoked(nonRevokedUserId).Should().BeFalse();
    }

    [Fact]
    public void RevokeUser_ConcurrentRevocations_HandlesCorrectly()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var expiryWindow = TimeSpan.FromHours(8);
        var tasks = new List<Thread>();

        // Act - Concurrent revocations
        for (int i = 0; i < 10; i++)
        {
            var thread = new Thread(() => _revokedTokenService.RevokeUser(userId, expiryWindow));
            thread.Start();
            tasks.Add(thread);
        }

        // Wait for all threads
        foreach (var thread in tasks)
        {
            thread.Join();
        }

        // Assert
        _revokedTokenService.IsUserRevoked(userId).Should().BeTrue();
    }
}
