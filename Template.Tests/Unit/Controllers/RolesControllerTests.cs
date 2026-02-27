namespace Template.Tests.Unit.Controllers;

public class RolesControllerTests : BaseUnitTest
{
    private readonly Mock<IRolesService> _rolesServiceMock;
    private readonly RolesController _controller;

    public RolesControllerTests()
    {
        _rolesServiceMock = CreateMock<IRolesService>();
        _controller = new RolesController(_rolesServiceMock.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };
    }

    [Fact]
    public async Task GetRoles_WithValidParams_ReturnsOk()
    {
        // Arrange
        var @params = new PagedResultParams { Page = 1, PageSize = 10 };
        var roles = new List<RoleResponse>
        {
            new() { Id = Guid.NewGuid(), Name = "Admin" },
            new() { Id = Guid.NewGuid(), Name = "User" }
        };
        var pagedResult = new Template.Data.Common.PagedResult<RoleResponse>
        {
            Items = roles,
            TotalCount = 2,
            PageNumber = 1,
            PageSize = 10
        };
        var result = ResultHelpers.Ok(pagedResult);

        _rolesServiceMock
            .Setup(x => x.GetRolesAsync(@params, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.GetRoles(@params, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(pagedResult);
    }

    [Fact]
    public async Task GetRoleById_WithValidId_ReturnsOk()
    {
        // Arrange
        var roleId = Guid.NewGuid();
        var roleResponse = new RoleResponse
        {
            Id = roleId,
            Name = "Admin",
            Description = "Administrator role"
        };
        var result = ResultHelpers.Ok(roleResponse);

        _rolesServiceMock
            .Setup(x => x.GetRoleByIdAsync(roleId, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.GetRoleById(roleId, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(roleResponse);
    }

    [Fact]
    public async Task GetRoleById_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var roleId = Guid.NewGuid();
        var result = ResultHelpers.NotFound<RoleResponse>("Role not found");

        _rolesServiceMock
            .Setup(x => x.GetRoleByIdAsync(roleId, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.GetRoleById(roleId, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(404);
        objectResult.Value.Should().Be("Role not found");
    }

    [Fact]
    public async Task CreateRole_WithValidRequest_ReturnsOk()
    {
        // Arrange
        var request = TestDataBuilder.CreateRoleRequest("NewRole", "New Role Description");
        var roleResponse = new RoleResponse
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description
        };
        var result = ResultHelpers.Ok(roleResponse);

        _rolesServiceMock
            .Setup(x => x.CreateRoleAsync(request, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.CreateRole(request, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(roleResponse);
    }

    [Fact]
    public async Task UpdateRole_WithValidRequest_ReturnsOk()
    {
        // Arrange
        var roleId = Guid.NewGuid();
        var request = TestDataBuilder.CreateUpdateRoleRequest("UpdatedRole", "Updated Description");
        var roleResponse = new RoleResponse
        {
            Id = roleId,
            Name = request.Name,
            Description = request.Description
        };
        var result = ResultHelpers.Ok(roleResponse);

        _rolesServiceMock
            .Setup(x => x.UpdateRoleAsync(roleId, request, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.UpdateRole(roleId, request, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(roleResponse);
    }

    [Fact]
    public async Task DeleteRole_WithValidId_ReturnsOk()
    {
        // Arrange
        var roleId = Guid.NewGuid();
        var result = ResultHelpers.Ok(roleId);

        _rolesServiceMock
            .Setup(x => x.DeleteRoleAsync(roleId, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.DeleteRole(roleId, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().Be(roleId);
    }

    [Fact]
    public async Task DeleteRole_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var roleId = Guid.NewGuid();
        var result = ResultHelpers.NotFound<Guid>("Role not found");

        _rolesServiceMock
            .Setup(x => x.DeleteRoleAsync(roleId, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.DeleteRole(roleId, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(404);
        objectResult.Value.Should().Be("Role not found");
    }
}
