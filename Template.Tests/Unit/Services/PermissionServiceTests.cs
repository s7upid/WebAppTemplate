namespace Template.Tests.Unit.Services;

public class PermissionServiceTests : BaseUnitTest, IDisposable, IAsyncLifetime
{
    private readonly ApplicationDbContext _dbContext;
    private readonly PermissionService _permissionService;

    public PermissionServiceTests()
    {
        var contextAccessorMock = new Mock<IHttpContextAccessor>();
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}")
            .Options;
        _dbContext = new ApplicationDbContext(options, contextAccessorMock.Object);
        _dbContext.Database.EnsureCreated();
        
        _permissionService = new PermissionService(_dbContext);
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
    public async Task GetPermissionsAsync_WithValidParams_ReturnsPermissions()
    {
        // Arrange
        var @params = new PagedResultParams { Page = 1, PageSize = 10 };
        var permissions = new List<Permission>
        {
            TestDataBuilder.CreatePermission("users:view", "View Users"),
            TestDataBuilder.CreatePermission("users:create", "Create Users")
        };

        _dbContext.Permissions.AddRange(permissions);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _permissionService.GetPermissionsAsync(@params, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Items.Should().HaveCount(2);
        result.Data.TotalCount.Should().Be(2);
    }

    [Fact]
    public async Task GetPermissionsAsync_WithEmptyResult_ReturnsEmptyList()
    {
        // Arrange
        var @params = new PagedResultParams { Page = 1, PageSize = 10 };
        // Database is already cleared by InitializeAsync

        // Act
        var result = await _permissionService.GetPermissionsAsync(@params, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Items.Should().BeEmpty();
        result.Data.TotalCount.Should().Be(0);
    }
}
