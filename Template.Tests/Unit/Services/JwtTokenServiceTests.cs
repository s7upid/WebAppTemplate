namespace Template.Tests.Unit.Services;

public class JwtTokenServiceTests : BaseUnitTest
{
    private readonly Mock<UserManager<User>> _userManagerMock;
    private readonly Mock<IOptions<JwtSettings>> _jwtOptionsMock;
    private readonly JwtTokenService _jwtTokenService;

    public JwtTokenServiceTests()
    {
        var userStoreMock = new Mock<IUserStore<User>>();
        _userManagerMock = new Mock<UserManager<User>>(
            userStoreMock.Object,
            null!, null!, null!, null!, null!, null!, null!, null!);

        _jwtOptionsMock = CreateMock<IOptions<JwtSettings>>();

        var jwtSettings = new JwtSettings
        {
            Issuer = "TestIssuer",
            Audience = "TestAudience",
            SigningKey = "TestSigningKeyThatIsAtLeast32CharactersLong!",
            ExpiryHours = 8
        };

        _jwtOptionsMock.Setup(x => x.Value).Returns(jwtSettings);

        _jwtTokenService = new JwtTokenService(_jwtOptionsMock.Object, _userManagerMock.Object);
    }

    [Fact]
    public async Task GenerateTokenAsync_WithValidUser_ReturnsAuthResponse()
    {
        // Arrange
        var user = TestDataBuilder.CreateUser("test@example.com", "Test", "User");
        user.Id = Guid.NewGuid();
        user.PermissionKeys = ["users:view"];

        _userManagerMock
            .Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync(["Admin"]);

        // Act
        var result = await _jwtTokenService.GenerateTokenAsync(user);

        // Assert
        result.Should().NotBeNull();
        result.Token.Should().NotBeNullOrEmpty();
        result.User.Should().NotBeNull();
        result.User.Id.Should().Be(user.Id);
        result.ExpiresAt.Should().BeAfter(DateTime.UtcNow);
    }

    [Fact]
    public async Task GenerateTokenAsync_WithNullUser_ThrowsException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<ArgumentNullException>(() =>
            _jwtTokenService.GenerateTokenAsync(null!));
    }

    [Fact]
    public async Task GenerateTokenAsync_WithUserRoles_IncludesRolesInToken()
    {
        // Arrange
        var user = TestDataBuilder.CreateUser("test@example.com", "Test", "User");
        user.Id = Guid.NewGuid();

        _userManagerMock
            .Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync(["Admin", "User"]);

        // Act
        var result = await _jwtTokenService.GenerateTokenAsync(user);

        // Assert
        result.Should().NotBeNull();
        result.Token.Should().NotBeNullOrEmpty();

        // Verify token can be decoded and contains roles
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(result.Token);
        var roleClaims = token.Claims.Where(c => c.Type == ClaimTypes.Role).ToList();
        roleClaims.Should().HaveCount(2);
    }

    [Fact]
    public async Task GenerateTokenAsync_WithUserPermissions_IncludesPermissionsInToken()
    {
        // Arrange
        var user = TestDataBuilder.CreateUser("test@example.com", "Test", "User");
        user.Id = Guid.NewGuid();
        user.PermissionKeys = ["users:view", "users:create"];

        _userManagerMock
            .Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync([]);

        // Act
        var result = await _jwtTokenService.GenerateTokenAsync(user);

        // Assert
        result.Should().NotBeNull();
        result.Token.Should().NotBeNullOrEmpty();

        // Verify token contains permissions
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(result.Token);
        var permClaims = token.Claims.Where(c => c.Type == "perm").ToList();
        permClaims.Should().HaveCount(2);
    }
}
