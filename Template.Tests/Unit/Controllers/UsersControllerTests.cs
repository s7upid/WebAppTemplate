namespace Template.Tests.Unit.Controllers;

public class UsersControllerTests : BaseUnitTest
{
    private readonly Mock<IUsersService> _usersServiceMock;
    private readonly UsersController _controller;

    public UsersControllerTests()
    {
        _usersServiceMock = CreateMock<IUsersService>();
        _controller = new UsersController(_usersServiceMock.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };
    }

    [Fact]
    public async Task GetUsers_WithValidParams_ReturnsOk()
    {
        // Arrange
        var @params = new PagedResultParams { Page = 1, PageSize = 10 };
        var users = new List<UserResponse>
        {
            new() { Id = Guid.NewGuid(), Email = "user1@example.com" },
            new() { Id = Guid.NewGuid(), Email = "user2@example.com" }
        };
        var pagedResult = new PagedResult<UserResponse>
        {
            Items = users,
            TotalCount = 2,
            PageNumber = 1,
            PageSize = 10
        };
        var result = ResultHelpers.Ok(pagedResult);

        _usersServiceMock
            .Setup(x => x.GetUsersAsync(@params, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.GetUsers(@params, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(pagedResult);
    }

    [Fact]
    public async Task GetUserById_WithValidId_ReturnsOk()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var userResponse = new UserResponse
        {
            Id = userId,
            Email = "test@example.com",
            FirstName = "Test",
            LastName = "User"
        };
        var result = ResultHelpers.Ok(userResponse);

        _usersServiceMock
            .Setup(x => x.GetUserByIdAsync(userId, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.GetUserById(userId, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(userResponse);
    }

    [Fact]
    public async Task GetUserById_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var result = ResultHelpers.NotFound<UserResponse>("User not found");

        _usersServiceMock
            .Setup(x => x.GetUserByIdAsync(userId, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.GetUserById(userId, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(404);
        objectResult.Value.Should().Be("User not found");
    }

    [Fact]
    public async Task CreateUser_WithValidRequest_ReturnsOk()
    {
        // Arrange
        var request = TestDataBuilder.CreateUserRequest("newuser@example.com", "New", "User");
        var userResponse = new UserResponse
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName
        };
        var result = ResultHelpers.Ok(userResponse);

        _usersServiceMock
            .Setup(x => x.CreateUserAsync(request, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.CreateUser(request, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(userResponse);
    }

    [Fact]
    public async Task UpdateUser_WithValidRequest_ReturnsOk()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var request = TestDataBuilder.CreateUpdateUserRequest("Updated", "User");
        var userResponse = new UserResponse
        {
            Id = userId,
            Email = "test@example.com",
            FirstName = request.FirstName,
            LastName = request.LastName
        };
        var result = ResultHelpers.Ok(userResponse);

        _usersServiceMock
            .Setup(x => x.UpdateUserAsync(userId, request, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.UpdateUser(userId, request, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(userResponse);
    }

    [Fact]
    public async Task DeleteUser_WithValidId_ReturnsOk()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var result = ResultHelpers.Ok(userId);

        _usersServiceMock
            .Setup(x => x.DeleteUserAsync(userId, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.DeleteUser(userId, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().Be(userId);
    }

    [Fact]
    public async Task ApproveUser_WithValidRequest_ReturnsOk()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var request = new ApproveUserRequest { RoleId = Guid.NewGuid() };
        var userResponse = new UserResponse
        {
            Id = userId,
            Email = "test@example.com",
            UserStatus = (int)UserStatus.Active
        };
        var result = ResultHelpers.Ok(userResponse);

        _usersServiceMock
            .Setup(x => x.ApproveUserAsync(userId, request, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.ApproveUser(userId, request, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(userResponse);
    }

    [Fact]
    public async Task RejectUser_WithValidId_ReturnsOk()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var result = ResultHelpers.Ok(userId);

        _usersServiceMock
            .Setup(x => x.RejectUserAsync(userId, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.RejectUser(userId, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().Be(userId);
    }

    [Fact]
    public async Task UpdateProfile_WithValidRequest_ReturnsOk()
    {
        // Arrange
        var userId = Guid.NewGuid();
        SetupUserClaims(userId);

        var request = TestDataBuilder.CreateUpdateUserRequest("Updated", "Profile");
        request.Status = null;
        request.RoleId = null;
        request.PermissionKeys = null;

        var userResponse = new UserResponse
        {
            Id = userId,
            Email = "test@example.com",
            FirstName = request.FirstName,
            LastName = request.LastName
        };
        var result = ResultHelpers.Ok(userResponse);

        _usersServiceMock
            .Setup(x => x.UpdateUserAsync(userId, It.Is<UpdateUserRequest>(r =>
                r.FirstName == request.FirstName &&
                r.LastName == request.LastName &&
                r.Status == null &&
                r.RoleId == null &&
                r.PermissionKeys == null), CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.UpdateProfile(request, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(userResponse);
    }

    private void SetupUserClaims(Guid userId)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(JwtRegisteredClaimNames.Sub, userId.ToString())
        };

        var identity = new ClaimsIdentity(claims, "Test");
        _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(identity);
    }
}
