namespace Template.Tests.Unit.Services;

public class UserServiceTests : BaseUnitTest, IDisposable, IAsyncLifetime
{
    private readonly ApplicationDbContext _dbContext;
    private readonly Mock<UserManager<User>> _userManagerMock;
    private readonly Mock<IEmailService> _emailServiceMock;
    private readonly Mock<IRevokedTokenService> _revokedTokenServiceMock;
    private readonly Mock<IOptions<JwtSettings>> _jwtOptionsMock;
    private readonly UsersService _userService;

    public UserServiceTests()
    {
        var userStoreMock = new Mock<IUserStore<User>>();
        _userManagerMock = new Mock<UserManager<User>>(
            userStoreMock.Object,
            null!, null!, null!, null!, null!, null!, null!, null!);

        var contextAccessorMock = new Mock<IHttpContextAccessor>();
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}")
            .Options;
        _dbContext = new ApplicationDbContext(options, contextAccessorMock.Object);
        _dbContext.Database.EnsureCreated();

        _emailServiceMock = CreateMock<IEmailService>();
        _revokedTokenServiceMock = CreateMock<IRevokedTokenService>();
        _jwtOptionsMock = CreateMock<IOptions<JwtSettings>>();

        var jwtSettings = new JwtSettings { ExpiryHours = 8 };
        _jwtOptionsMock.Setup(x => x.Value).Returns(jwtSettings);

        _userService = new UsersService(
            _dbContext,
            _emailServiceMock.Object,
            _userManagerMock.Object,
            _revokedTokenServiceMock.Object,
            _jwtOptionsMock.Object);
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
    public async Task GetUserByIdAsync_WithValidId_ReturnsUser()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = TestDataBuilder.CreateUser("test@example.com", "Test", "User");
        user.Id = userId;

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _userService.GetUserByIdAsync(userId, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Id.Should().Be(userId);
    }

    [Fact]
    public async Task GetUserByIdAsync_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var userId = Guid.NewGuid();
        // Database is already cleared by InitializeAsync

        // Act
        var result = await _userService.GetUserByIdAsync(userId, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeFalse();
        result.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateUserAsync_WithValidRequest_ReturnsUser()
    {
        // Arrange
        var request = TestDataBuilder.CreateUserRequest("newuser@example.com", "New", "User");
        var roleId = Guid.NewGuid();
        request.RoleId = roleId;

        var role = TestDataBuilder.CreateRole("TestRole");
        role.Id = roleId;
        role.NormalizedName = "TESTROLE";

        _dbContext.Roles.Add(role);
        await _dbContext.SaveChangesAsync();

        _userManagerMock
            .Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        _userManagerMock
            .Setup(x => x.GetRolesAsync(It.IsAny<User>()))
            .ReturnsAsync([]);

        _userManagerMock
            .Setup(x => x.RemoveFromRolesAsync(It.IsAny<User>(), It.IsAny<IEnumerable<string>>()))
            .ReturnsAsync(IdentityResult.Success);

        _userManagerMock
            .Setup(x => x.AddToRoleAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        _userManagerMock
            .Setup(x => x.GenerateEmailConfirmationTokenAsync(It.IsAny<User>()))
            .ReturnsAsync("confirmation-token");

        _emailServiceMock
            .Setup(x => x.SendAsync(
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _userService.CreateUserAsync(request, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Email.Should().Be(request.Email);
    }

    [Fact]
    public async Task DeleteUserAsync_WithValidId_ReturnsSuccess()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = TestDataBuilder.CreateUser("test@example.com", "Test", "User");
        user.Id = userId;

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        _userManagerMock
            .Setup(x => x.DeleteAsync(It.IsAny<User>()))
            .ReturnsAsync(IdentityResult.Success);

        _revokedTokenServiceMock
            .Setup(x => x.RevokeUser(It.IsAny<Guid>(), It.IsAny<TimeSpan>()));

        // Act
        var result = await _userService.DeleteUserAsync(userId, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeTrue();
        result.Data.Should().Be(userId);
        _revokedTokenServiceMock.Verify(x => x.RevokeUser(userId, It.IsAny<TimeSpan>()), Times.Once);
    }
}

// Helper class for async enumerable
internal class TestAsyncEnumerator<T>(IEnumerator<T> inner) : IAsyncEnumerator<T>
{
    public T Current => inner.Current;

    public ValueTask<bool> MoveNextAsync()
    {
        return new ValueTask<bool>(inner.MoveNext());
    }

    public ValueTask DisposeAsync()
    {
        inner.Dispose();
        return ValueTask.CompletedTask;
    }
}
