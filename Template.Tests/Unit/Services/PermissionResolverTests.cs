namespace Template.Tests.Unit.Services;

public class PermissionResolverTests : BaseUnitTest
{
    private readonly PermissionResolver _permissionResolver;

    public PermissionResolverTests()
    {
        _permissionResolver = new PermissionResolver();
    }

    [Fact]
    public void GetEffectivePermissions_WithRolePermissions_ReturnsRolePermissions()
    {
        // Arrange
        var role = TestDataBuilder.CreateRole("Admin");
        var permission1 = TestDataBuilder.CreatePermission("users:view");
        role.Permissions = [permission1];

        var user = TestDataBuilder.CreateUser();
        user.UserRoles =
        [
            new() { UserId = user.Id, RoleId = role.Id, Role = role }
        ];
        user.Permissions = [];

        // Act
        var result = _permissionResolver.GetEffectivePermissions(user);

        // Assert
        result.Should().HaveCount(1);
        result.Should().Contain("users:view");
    }

    [Fact]
    public void GetEffectivePermissions_WithUserPermissions_ReturnsUserPermissions()
    {
        // Arrange
        var user = TestDataBuilder.CreateUser();
        var permission1 = TestDataBuilder.CreatePermission("users:delete");
        user.Permissions = [permission1];
        user.UserRoles = [];

        // Act
        var result = _permissionResolver.GetEffectivePermissions(user);

        // Assert
        result.Should().HaveCount(1);
        result.Should().Contain("users:delete");
    }

    [Fact]
    public void GetEffectivePermissions_WithBothRoleAndUserPermissions_ReturnsUnion()
    {
        // Arrange
        var role = TestDataBuilder.CreateRole("Admin");
        var rolePermission = TestDataBuilder.CreatePermission("users:view");
        role.Permissions = [rolePermission];

        var user = TestDataBuilder.CreateUser();
        var userPermission = TestDataBuilder.CreatePermission("users:delete");
        user.Permissions = [userPermission];
        user.UserRoles =
        [
            new() { UserId = user.Id, RoleId = role.Id, Role = role }
        ];

        // Act
        var result = _permissionResolver.GetEffectivePermissions(user);

        // Assert
        result.Should().HaveCount(2);
        result.Should().Contain("users:view");
        result.Should().Contain("users:delete");
    }

    [Fact]
    public void GetEffectivePermissions_WithDuplicatePermissions_ReturnsDistinct()
    {
        // Arrange
        var role = TestDataBuilder.CreateRole("Admin");
        var permission = TestDataBuilder.CreatePermission("users:view");
        role.Permissions = [permission];

        var user = TestDataBuilder.CreateUser();
        user.Permissions = [permission]; // Same permission
        user.UserRoles =
        [
            new() { UserId = user.Id, RoleId = role.Id, Role = role }
        ];

        // Act
        var result = _permissionResolver.GetEffectivePermissions(user);

        // Assert
        result.Should().HaveCount(1);
        result.Should().Contain("users:view");
    }

    [Fact]
    public void GetEffectivePermissions_WithNoPermissions_ReturnsEmpty()
    {
        // Arrange
        var user = TestDataBuilder.CreateUser();
        user.Permissions = [];
        user.UserRoles = [];

        // Act
        var result = _permissionResolver.GetEffectivePermissions(user);

        // Assert
        result.Should().BeEmpty();
    }
}
