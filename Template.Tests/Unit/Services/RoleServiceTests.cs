namespace Template.Tests.Unit.Services;

public class RoleServiceTests : BaseUnitTest, IDisposable, IAsyncLifetime
{
    private readonly ApplicationDbContext _dbContext;
    private readonly RoleManager<Role> _roleManager;
    private readonly RolesService _roleService;

    public RoleServiceTests()
    {
        var contextAccessorMock = new Mock<IHttpContextAccessor>();
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}")
            .Options;
        _dbContext = new ApplicationDbContext(options, contextAccessorMock.Object);
        _dbContext.Database.EnsureCreated();
        
        // Use real RoleManager with in-memory database
        var roleStore = new Microsoft.AspNetCore.Identity.EntityFrameworkCore.RoleStore<Role, ApplicationDbContext, Guid>(_dbContext);
        _roleManager = new RoleManager<Role>(
            roleStore,
            null!,
            null!,
            null!,
            null!);
        
        _roleService = new RolesService(_dbContext, _roleManager);
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
    public async Task GetRoleByIdAsync_WithValidId_ReturnsRole()
    {
        // Arrange
        var roleId = Guid.NewGuid();
        var role = TestDataBuilder.CreateRole("Admin", "Administrator role");
        role.Id = roleId;

        _dbContext.Roles.Add(role);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _roleService.GetRoleByIdAsync(roleId, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Id.Should().Be(roleId);
    }

    [Fact]
    public async Task GetRoleByIdAsync_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var roleId = Guid.NewGuid();
        // Database is already cleared by InitializeAsync

        // Act
        var result = await _roleService.GetRoleByIdAsync(roleId, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeFalse();
        result.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateRoleAsync_WithValidRequest_ReturnsRole()
    {
        // Arrange
        var request = TestDataBuilder.CreateRoleRequest("NewRole", "New Role Description");
        var permission = TestDataBuilder.CreatePermission("test.permission");
        request.PermissionKeys = [permission.Key];

        _dbContext.Permissions.Add(permission);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _roleService.CreateRoleAsync(request, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Name.Should().Be(request.Name);
    }

    [Fact]
    public async Task CreateRoleAsync_WithDuplicateName_ReturnsBadRequest()
    {
        // Arrange
        var request = TestDataBuilder.CreateRoleRequest("ExistingRole", "Description");
        
        // Create a role with the same name first using RoleManager (so it's properly normalized)
        var existingRole = TestDataBuilder.CreateRole("ExistingRole", "Existing Description");
        existingRole.NormalizedName = "EXISTINGROLE";
        var createResult = await _roleManager.CreateAsync(existingRole);
        if (!createResult.Succeeded)
        {
            throw new Exception($"Failed to create test role: {string.Join(", ", createResult.Errors.Select(e => e.Description))}");
        }

        // Act
        var result = await _roleService.CreateRoleAsync(request, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeFalse();
        result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        result.FieldErrors.Should().NotBeNull();
        result.FieldErrors!.Should().ContainKey(nameof(Role.Name));
    }

    [Fact]
    public async Task DeleteRoleAsync_WithSystemRole_ReturnsBadRequest()
    {
        // Arrange
        var roleId = Guid.NewGuid();
        var role = TestDataBuilder.CreateRole("SystemRole", "System Role", isSystem: true);
        role.Id = roleId;

        _dbContext.Roles.Add(role);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _roleService.DeleteRoleAsync(roleId, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeFalse();
        result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        result.ErrorMessage.Should().Contain("system role");
    }

    [Fact]
    public async Task DeleteRoleAsync_WithNonSystemRole_ReturnsSuccess()
    {
        // Arrange
        var roleId = Guid.NewGuid();
        var role = TestDataBuilder.CreateRole("RegularRole", "Regular Role", isSystem: false);
        role.Id = roleId;
        role.NormalizedName = "REGULARROLE";

        _dbContext.Roles.Add(role);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _roleService.DeleteRoleAsync(roleId, CancellationToken);

        // Assert
        result.IsSuccessful.Should().BeTrue();
        result.Data.Should().Be(roleId);
    }
}
