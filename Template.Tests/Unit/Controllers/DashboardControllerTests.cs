namespace Template.Tests.Unit.Controllers;

public class DashboardControllerTests : BaseUnitTest
{
    private readonly Mock<IAuditService> _auditServiceMock;
    private readonly DashboardController _controller;

    public DashboardControllerTests()
    {
        _auditServiceMock = CreateMock<IAuditService>();
        _controller = new DashboardController(_auditServiceMock.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };
    }

    [Fact]
    public async Task GetLogs_ReturnsRecentLogs()
    {
        // Arrange
        var logs = new List<AuditLog>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Timestamp = DateTime.UtcNow,
                EventType = AuditEventType.Login,
                Description = "User logged in",
                Success = true
            }
        };
        var pagedResult = new PagedResult<AuditLog>
        {
            Items = logs,
            TotalCount = 1,
            PageNumber = 1,
            PageSize = 10
        };
        var result = ResultHelpers.Ok(pagedResult);

        _auditServiceMock
            .Setup(x => x.GetLogsAsync(
                It.Is<PagedResultParams>(p =>
                    p.Page == 1 &&
                    p.PageSize == 10 &&
                    p.SortColumn == "Timestamp" &&
                    p.Ascending == false),
                CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.GetLogs(CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(pagedResult);
    }
}
