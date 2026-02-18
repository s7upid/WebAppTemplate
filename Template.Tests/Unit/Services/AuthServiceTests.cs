namespace Template.Tests.Unit.Services;

public class AuthServiceTests : BaseUnitTest, IDisposable, IAsyncLifetime
{
    private readonly Mock<UserManager<User>> _userManagerMock;
    private readonly Mock<SignInManager<User>> _signInManagerMock;
    private readonly Mock<IEmailService> _emailServiceMock;
    private readonly Mock<IAuditService> _auditServiceMock;
    private readonly Mock<IJwtTokenService> _jwtTokenServiceMock;
    private readonly Mock<IPermissionResolver> _permissionResolverMock;
    private readonly ApplicationDbContext _dbContext;
    private readonly Mock<IRevokedTokenService> _revokedTokenServiceMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        var userStoreMock = new Mock<IUserStore<User>>();
        _userManagerMock = new Mock<UserManager<User>>(
            userStoreMock.Object,
            null!, null!, null!, null!, null!, null!, null!, null!);

        var contextAccessorMock = new Mock<IHttpContextAccessor>();
        var claimsFactoryMock = new Mock<IUserClaimsPrincipalFactory<User>>();
        var optionsAccessorMock = new Mock<IOptions<IdentityOptions>>();
        // Use NullLogger - this satisfies the ILogger<T> interface without actual logging
        // The app uses Serilog at runtime, but for tests we just need a compatible interface
        var nullLogger = Microsoft.Extensions.Logging.Abstractions.NullLogger<SignInManager<User>>.Instance;
        var schemesMock = new Mock<IAuthenticationSchemeProvider>();
        var confirmationMock = new Mock<IUserConfirmation<User>>();

        _signInManagerMock = new Mock<SignInManager<User>>(
            _userManagerMock.Object,
            contextAccessorMock.Object,
            claimsFactoryMock.Object,
            optionsAccessorMock.Object,
            nullLogger,
            schemesMock.Object,
            confirmationMock.Object);

        _emailServiceMock = CreateMock<IEmailService>();
        _auditServiceMock = CreateMock<IAuditService>();
        _jwtTokenServiceMock = CreateMock<IJwtTokenService>();
        _permissionResolverMock = CreateMock<IPermissionResolver>();

        // Use in-memory database instead of mock (ApplicationDbContext requires constructor parameters)
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}")
            .Options;
        _dbContext = new ApplicationDbContext(options, contextAccessorMock.Object);
        _dbContext.Database.EnsureCreated();

        _revokedTokenServiceMock = CreateMock<IRevokedTokenService>();

        _authService = new AuthService(
            _userManagerMock.Object,
            _signInManagerMock.Object,
            _emailServiceMock.Object,
            _auditServiceMock.Object,
            _jwtTokenServiceMock.Object,
            _permissionResolverMock.Object,
            _dbContext,
            _revokedTokenServiceMock.Object);
    }

    /// <summary>
    /// Called before each test. Clears the database.
    /// </summary>
    public async Task InitializeAsync()
    {
        await ClearDatabaseAsync(_dbContext);
    }

    /// <summary>
    /// Called after each test. Cleans up the database.
    /// </summary>
    public async Task DisposeAsync()
    {
        await ClearDatabaseAsync(_dbContext);
    }

    public override void Dispose()
    {
        _dbContext?.Database.EnsureDeleted();
        _dbContext?.Dispose();
        base.Dispose();
        GC.SuppressFinalize(this);
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsSuccess()
    {
        // Arrange
        var request = TestDataBuilder.CreateLoginRequest("test@example.com", "Password123!");
        var user = TestDataBuilder.CreateUser(request.Email, "Test", "User", UserStatus.Active);
        user.PermissionKeys = ["users:view"];

        var authResponse = new AuthResponse
        {
            User = UserResponse.Map(user),
            Token = "test-token",
            ExpiresAt = DateTime.UtcNow.AddHours(8)
        };

        await SetupUserManagerFindByEmailAsync(user);
        SetupSignInManagerCheckPassword(Microsoft.AspNetCore.Identity.SignInResult.Success);
        SetupPermissionResolver(user);
        SetupJwtTokenService(authResponse);
        SetupAuditService();

        // Act
        var result = await _authService.LoginAsync(request, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Token.Should().Be(authResponse.Token);
        _auditServiceMock.Verify(x => x.LogEventAsync(
            AuditEventType.Login,
            It.IsAny<string>(),
            user.Id,
            It.IsAny<string>(),
            It.IsAny<string>(),
            true,
            null,
            CancellationToken), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_WithInvalidEmail_ReturnsUnauthorized()
    {
        // Arrange
        var request = TestDataBuilder.CreateLoginRequest("nonexistent@example.com", "Password123!");

        SetupAuditService();

        // Act
        var result = await _authService.LoginAsync(request, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeFalse();
        result.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        _auditServiceMock.Verify(x => x.LogEventAsync(
            AuditEventType.FailedLogin,
            It.IsAny<string>(),
            null,
            It.IsAny<string>(),
            It.IsAny<string>(),
            false,
            It.IsAny<string>(),
            CancellationToken), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_WithInactiveUser_ReturnsUnauthorized()
    {
        // Arrange
        var request = TestDataBuilder.CreateLoginRequest("test@example.com", "Password123!");
        var user = TestDataBuilder.CreateUser(request.Email, "Test", "User", UserStatus.Inactive);

        await SetupUserManagerFindByEmailAsync(user);
        SetupPermissionResolver(user); // LoadUserWithPermissionsAsync calls this
        SetupAuditService();

        // Act
        var result = await _authService.LoginAsync(request, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeFalse();
        result.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        result.ErrorMessage.Should().Contain("not active");
    }

    [Fact]
    public async Task LoginAsync_WithInvalidPassword_ReturnsUnauthorized()
    {
        // Arrange
        var request = TestDataBuilder.CreateLoginRequest("test@example.com", "WrongPassword");
        var user = TestDataBuilder.CreateUser(request.Email, "Test", "User", UserStatus.Active);

        await SetupUserManagerFindByEmailAsync(user);
        SetupPermissionResolver(user); // LoadUserWithPermissionsAsync calls this
        SetupSignInManagerCheckPassword(Microsoft.AspNetCore.Identity.SignInResult.Failed);
        SetupAuditService();

        // Act
        var result = await _authService.LoginAsync(request, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeFalse();
        result.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        result.ErrorMessage.Should().Contain("Invalid credentials");
    }

    [Fact]
    public async Task RefreshTokenAsync_WithValidUser_ReturnsSuccess()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = TestDataBuilder.CreateUser("test@example.com", "Test", "User");
        user.Id = userId;
        user.PermissionKeys = ["users:view"];

        var authResponse = new AuthResponse
        {
            User = UserResponse.Map(user),
            Token = "new-token",
            ExpiresAt = DateTime.UtcNow.AddHours(8)
        };

        await SetupUserManagerFindByIdAsync(user);
        SetupPermissionResolver(user);
        SetupJwtTokenService(authResponse);
        SetupAuditService();

        // Act
        var result = await _authService.RefreshTokenAsync(userId, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Token.Should().Be(authResponse.Token);
    }

    [Fact]
    public async Task ForgotPasswordAsync_WithValidEmail_SendsEmail()
    {
        // Arrange
        var email = "test@example.com";
        var user = TestDataBuilder.CreateUser(email, "Test", "User");

        _userManagerMock
            .Setup(x => x.FindByEmailAsync(email))
            .ReturnsAsync(user);

        _userManagerMock
            .Setup(x => x.GeneratePasswordResetTokenAsync(user))
            .ReturnsAsync("reset-token");

        _emailServiceMock
            .Setup(x => x.SendAsync(
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>()))
            .Returns(Task.CompletedTask);

        SetupAuditService();

        // Act
        var result = await _authService.ForgotPasswordAsync(email, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeTrue();
        result.Data.Should().BeTrue();
        _emailServiceMock.Verify(x => x.SendAsync(
            email,
            It.IsAny<string>(),
            It.IsAny<string>(),
            It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task ForgotPasswordAsync_WithInvalidEmail_ReturnsOk()
    {
        // Arrange
        var email = "nonexistent@example.com";

        _userManagerMock
            .Setup(x => x.FindByEmailAsync(email))
            .ReturnsAsync((User?)null);

        // Act
        var result = await _authService.ForgotPasswordAsync(email, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeTrue();
        result.Data.Should().BeTrue();
    }

    private async Task SetupUserManagerFindByEmailAsync(User user)
    {
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();
    }

    private async Task SetupUserManagerFindByIdAsync(User user)
    {
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();
    }

    private void SetupSignInManagerCheckPassword(Microsoft.AspNetCore.Identity.SignInResult result)
    {
        _signInManagerMock
            .Setup(x => x.CheckPasswordSignInAsync(
                It.IsAny<User>(),
                It.IsAny<string>(),
                It.IsAny<bool>()))
            .ReturnsAsync(result);
    }

    private void SetupPermissionResolver(User user)
    {
        _permissionResolverMock
            .Setup(x => x.GetEffectivePermissions(It.IsAny<User>()))
            .Returns(user.PermissionKeys ?? []);
    }

    private void SetupJwtTokenService(AuthResponse response)
    {
        _jwtTokenServiceMock
            .Setup(x => x.GenerateTokenAsync(It.IsAny<User>()))
            .ReturnsAsync(response);
    }

    private void SetupAuditService()
    {
        _auditServiceMock
            .Setup(x => x.LogEventAsync(
                It.IsAny<AuditEventType>(),
                It.IsAny<string>(),
                It.IsAny<Guid?>(),
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<bool>(),
                It.IsAny<string>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);
    }
}

public static class QueryableExtensions
{
    public static IQueryable<T> BuildMock<T>(this IQueryable<T> source) where T : class
    {
        return source;
    }
}
