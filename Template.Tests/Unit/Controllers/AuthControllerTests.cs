namespace Template.Tests.Unit.Controllers;

public class AuthControllerTests : BaseUnitTest
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _authServiceMock = CreateMock<IAuthService>();
        _controller = new AuthController(_authServiceMock.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsOk()
    {
        // Arrange
        var request = TestDataBuilder.CreateLoginRequest("test@example.com", "Password123!");
        var authResponse = new AuthResponse
        {
            User = new UserResponse { Id = Guid.NewGuid(), Email = "test@example.com" },
            Token = "test-token",
            ExpiresAt = DateTime.UtcNow.AddHours(8)
        };
        var result = ResultHelpers.Ok(authResponse);

        _authServiceMock
            .Setup(x => x.LoginAsync(request, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.Login(request, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(authResponse);
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ReturnsUnauthorized()
    {
        // Arrange
        var request = TestDataBuilder.CreateLoginRequest("test@example.com", "WrongPassword");
        var result = ResultHelpers.Unauthorized<AuthResponse>("Invalid credentials");

        _authServiceMock
            .Setup(x => x.LoginAsync(request, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.Login(request, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(401);
        objectResult.Value.Should().Be("Invalid credentials");
    }

    [Fact]
    public async Task Logout_WithValidToken_ReturnsOk()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var tokenId = Guid.NewGuid().ToString();
        var expiresAt = DateTime.UtcNow.AddHours(8);

        SetupUserClaims(userId, tokenId, expiresAt);

        var result = ResultHelpers.Ok(true);
        // Use It.IsAny for DateTime since it's converted from Unix timestamp and may have precision differences
        _authServiceMock
            .Setup(x => x.LogoutAsync(tokenId, userId, It.IsAny<DateTime>(), CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.Logout(CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().Be(true);
    }

    [Fact]
    public async Task Logout_WithInvalidToken_ReturnsUnauthorized()
    {
        // Arrange
        _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal();

        // Act
        var response = await _controller.Logout(CancellationToken);

        // Assert
        response.Should().BeOfType<UnauthorizedObjectResult>();
    }

    [Fact]
    public async Task RefreshToken_WithValidUser_ReturnsOk()
    {
        // Arrange
        var userId = Guid.NewGuid();
        SetupUserClaims(userId, null, null);

        var authResponse = new AuthResponse
        {
            User = new UserResponse { Id = userId, Email = "test@example.com" },
            Token = "new-token",
            ExpiresAt = DateTime.UtcNow.AddHours(8)
        };
        var result = ResultHelpers.Ok(authResponse);

        _authServiceMock
            .Setup(x => x.RefreshTokenAsync(userId, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.RefreshToken(CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(authResponse);
    }

    [Fact]
    public async Task RefreshToken_WithInvalidUser_ReturnsUnauthorized()
    {
        // Arrange
        _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal();

        // Act
        var response = await _controller.RefreshToken(CancellationToken);

        // Assert
        response.Should().BeOfType<UnauthorizedObjectResult>();
    }

    [Fact]
    public async Task ForgotPassword_WithValidEmail_ReturnsOk()
    {
        // Arrange
        var request = new ForgotPasswordRequest { Email = "test@example.com" };
        var result = ResultHelpers.Ok(true);

        _authServiceMock
            .Setup(x => x.ForgotPasswordAsync(request.Email, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.ForgotPassword(request, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().Be(true);
    }

    [Fact]
    public async Task ResetPassword_WithValidRequest_ReturnsOk()
    {
        // Arrange
        var request = new ResetPasswordRequest
        {
            Email = "test@example.com",
            Token = "reset-token",
            NewPassword = "NewPassword123!"
        };
        var result = ResultHelpers.Ok(true);

        _authServiceMock
            .Setup(x => x.ResetPasswordAsync(request, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.ResetPassword(request, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().Be(true);
    }

    [Fact]
    public async Task ChangePassword_WithValidRequest_ReturnsOk()
    {
        // Arrange
        var userId = Guid.NewGuid();
        SetupUserClaims(userId, null, null);

        var request = new ChangePasswordRequest
        {
            CurrentPassword = "OldPassword123!",
            NewPassword = "NewPassword123!",
            ConfirmPassword = "NewPassword123!"
        };
        var result = ResultHelpers.Ok(true);

        _authServiceMock
            .Setup(x => x.ChangePasswordAsync(userId, request, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.ChangePassword(request, CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().Be(true);
    }

    [Fact]
    public async Task GetCurrentUser_WithValidUser_ReturnsOk()
    {
        // Arrange
        var userId = Guid.NewGuid();
        SetupUserClaims(userId, null, null);

        var userResponse = new UserResponse
        {
            Id = userId,
            Email = "test@example.com",
            FirstName = "Test",
            LastName = "User"
        };
        var result = ResultHelpers.Ok(userResponse);

        _authServiceMock
            .Setup(x => x.GetUserByIdAsync(userId, CancellationToken))
            .ReturnsAsync(result);

        // Act
        var response = await _controller.GetCurrentUser(CancellationToken);

        // Assert
        response.Should().BeOfType<ObjectResult>();
        var objectResult = response as ObjectResult;
        objectResult!.StatusCode.Should().Be(200);
        objectResult.Value.Should().BeEquivalentTo(userResponse);
    }

    private void SetupUserClaims(Guid userId, string? tokenId, DateTime? expiresAt)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(JwtRegisteredClaimNames.Sub, userId.ToString())
        };

        if (!string.IsNullOrEmpty(tokenId))
        {
            claims.Add(new Claim(JwtRegisteredClaimNames.Jti, tokenId));
        }

        if (expiresAt.HasValue)
        {
            var expUnix = ((DateTimeOffset)expiresAt.Value).ToUnixTimeSeconds();
            claims.Add(new Claim(JwtRegisteredClaimNames.Exp, expUnix.ToString()));
        }

        var identity = new ClaimsIdentity(claims, "Test");
        _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(identity);
    }
}
