namespace Template.Tests.Unit.Controllers;

public class AuditControllerTests : BaseUnitTest
{
    private readonly Mock<IAuditService> _auditServiceMock;
    private readonly AuditController _controller;

    public AuditControllerTests()
    {
        _auditServiceMock = CreateMock<IAuditService>();
        _controller = new AuditController(_auditServiceMock.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };
    }

    [Fact]
    public async Task GetLogs_WithValidParams_ReturnsOk()
    {
        // Arrange
        var @params = new PagedResultParams { Page = 1, PageSize = 10 };
        var logs = new List<AuditLog>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Timestamp = DateTime.UtcNow,
                EventType = AuditEventType.Login,
                Description = "User logged in",
                Success = true
            },
            new()
            {
                Id = Guid.NewGuid(),
                Timestamp = DateTime.UtcNow.AddMinutes(-5),
                EventType = AuditEventType.Logout,
                Description = "User logged out",
                Success = true
            }
        };
        var pagedResult = new PagedResult<AuditLog>
        {
            Items = logs,
            TotalCount = 2,
            PageNumber = 1,
            PageSize = 10
        };
        var result = ResultHelpers.Ok(pagedResult);

        _auditServiceMock
            .Setup(x => x.GetLogsAsync(@params, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.GetLogs(@params, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(pagedResult);
    }

    [Fact]
    public async Task GetLogs_WithEmptyParams_ReturnsOk()
    {
        // Arrange
        var @params = new PagedResultParams();
        var pagedResult = new PagedResult<AuditLog>
        {
            Items = [],
            TotalCount = 0,
            PageNumber = 1,
            PageSize = 10
        };
        var result = ResultHelpers.Ok(pagedResult);

        _auditServiceMock
            .Setup(x => x.GetLogsAsync(@params, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.GetLogs(@params, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
    }
}
