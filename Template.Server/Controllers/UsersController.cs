namespace Template.Server.Controllers;

/// <summary>
/// Controller for managing user accounts, including CRUD operations, user approval workflow, and profile management.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UsersController(IUsersService usersService) : ControllerBase
{
    /// <summary>
    /// Retrieves a paginated list of users with optional filtering and sorting capabilities.
    /// </summary>
    /// <param name="params">Pagination and filtering parameters</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Paginated list of users with their roles and permissions</returns>
    [Authorize(Policy = PermissionKeys.Users.View)]
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<UserResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetUsers([FromQuery] PagedResultParams @params, CancellationToken cancellationToken)
    {

        Result<PagedResult<UserResponse>> result = await usersService.GetUsersAsync(@params, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Retrieves a specific user by their unique identifier.
    /// </summary>
    /// <param name="id">Unique identifier of the user</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>User details including role and permissions</returns>
    [Authorize(Policy = PermissionKeys.Users.View)]
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetUserById(Guid id, CancellationToken cancellationToken)
    {
        Result<UserResponse> result = await usersService.GetUserByIdAsync(id, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Creates a new user account and sends a password setup email.
    /// </summary>
    /// <param name="request">User creation data including email, name, and role assignment</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Created user details with generated password setup token</returns>
    [Authorize(Policy = PermissionKeys.Users.Create)]
    [HttpPost]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request, CancellationToken cancellationToken)
    {
        Result<UserResponse> result = await usersService.CreateUserAsync(request, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Updates an existing user's information including role and permissions.
    /// </summary>
    /// <param name="id">Unique identifier of the user to update</param>
    /// <param name="request">Updated user data</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Updated user details</returns>
    [Authorize(Policy = PermissionKeys.Users.Edit)]
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request, CancellationToken cancellationToken)
    {
        Result<UserResponse> result = await usersService.UpdateUserAsync(id, request, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Permanently deletes a user account from the system.
    /// </summary>
    /// <param name="id">Unique identifier of the user to delete</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Confirmation of successful deletion</returns>
    [Authorize(Policy = PermissionKeys.Users.Delete)]
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteUser(Guid id, CancellationToken cancellationToken)
    {
        Result<Guid> result = await usersService.DeleteUserAsync(id, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Approves a pending user account and assigns them to a specific role.
    /// </summary>
    /// <param name="id">Unique identifier of the user to approve</param>
    /// <param name="request">Approval data containing the role to assign</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Approved user details with updated status</returns>
    [Authorize(Policy = PermissionKeys.Users.Approve)]
    [HttpPost("{id}/approve")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ApproveUser(Guid id, [FromBody] ApproveUserRequest request, CancellationToken cancellationToken)
    {
        Result<UserResponse> result = await usersService.ApproveUserAsync(id, request, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Rejects a pending user account, marking them as inactive.
    /// </summary>
    /// <param name="id">Unique identifier of the user to reject</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Confirmation of user rejection</returns>
    [Authorize(Policy = PermissionKeys.Users.Approve)]
    [HttpPost("{id}/reject")]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RejectUser(Guid id, CancellationToken cancellationToken)
    {
        Result<Guid> result = await usersService.RejectUserAsync(id, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Updates the current authenticated user's profile information (name and avatar only).
    /// </summary>
    /// <param name="request">Profile update data</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Updated profile information</returns>
    [Authorize]
    [HttpPut("profile")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserRequest request, CancellationToken cancellationToken)
    {
        string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (!Guid.TryParse(userIdClaim, out Guid guid))
        {
            return Unauthorized(new Result<object>(HttpStatusCode.Unauthorized, "Invalid user"));
        }

        request.Status = null;
        request.RoleId = null;
        request.PermissionKeys = null;

        Result<UserResponse> result = await usersService.UpdateUserAsync(guid, request, cancellationToken);
        return this.ToActionResult(result);
    }
}
