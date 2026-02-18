namespace Template.Tests.Unit.Controllers;

public class PermissionsControllerTests : BaseUnitTest
{
    private readonly Mock<IPermissionService> _permissionServiceMock;
    private readonly PermissionsController _controller;

    public PermissionsControllerTests()
    {
        _permissionServiceMock = CreateMock<IPermissionService>();
        _controller = new PermissionsController(_permissionServiceMock.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };
    }

    [Fact]
    public async Task GetPermissions_WithValidParams_ReturnsOk()
    {
        // Arrange
        var @params = new PagedResultParams { Page = 1, PageSize = 10 };
        var permissions = new List<PermissionResponse>
        {
            new() { Id = Guid.NewGuid(), Key = "users:view", Name = "View Users" },
            new() { Id = Guid.NewGuid(), Key = "users:create", Name = "Create Users" }
        };
        var pagedResult = new PagedResult<PermissionResponse>
        {
            Items = permissions,
            TotalCount = 2,
            PageNumber = 1,
            PageSize = 10
        };
        var result = ResultHelpers.Ok(pagedResult);

        _permissionServiceMock
            .Setup(x => x.GetPermissionsAsync(@params, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.GetPermissions(@params, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(pagedResult);
    }

    [Fact]
    public async Task GetPermissions_WithEmptyResult_ReturnsOk()
    {
        // Arrange
        var @params = new PagedResultParams { Page = 1, PageSize = 10 };
        var pagedResult = new PagedResult<PermissionResponse>
        {
            Items = [],
            TotalCount = 0,
            PageNumber = 1,
            PageSize = 10
        };
        var result = ResultHelpers.Ok(pagedResult);

        _permissionServiceMock
            .Setup(x => x.GetPermissionsAsync(@params, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.GetPermissions(@params, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(pagedResult);
    }
}
