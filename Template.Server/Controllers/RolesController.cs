namespace Template.Server.Controllers;

/// <summary>
/// Controller for managing user roles, including CRUD operations and permission assignments.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class RolesController(IRolesService rolesService) : ControllerBase
{
    /// <summary>
    /// Retrieves a paginated list of roles with optional filtering and sorting capabilities.
    /// </summary>
    /// <param name="params">Pagination and filtering parameters</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Paginated list of roles with their permissions</returns>
    [Authorize(Policy = PermissionKeys.Roles.View)]
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<RoleResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetRoles([FromQuery] PagedResultParams @params, CancellationToken cancellationToken)
    {
        Result<PagedResult<RoleResponse>> result = await rolesService.GetRolesAsync(@params, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Retrieves a specific role by its unique identifier.
    /// </summary>
    /// <param name="id">Unique identifier of the role</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Role details including assigned permissions</returns>
    [Authorize(Policy = PermissionKeys.Roles.View)]
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(RoleResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetRoleById(Guid id, CancellationToken cancellationToken)
    {
        Result<RoleResponse> result = await rolesService.GetRoleByIdAsync(id, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Creates a new role with specified permissions.
    /// </summary>
    /// <param name="request">Role creation data including name, description, and permissions</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Created role details</returns>
    [Authorize(Policy = PermissionKeys.Roles.Create)]
    [HttpPost]
    [ProducesResponseType(typeof(RoleResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateRole([FromBody] CreateRoleRequest request, CancellationToken cancellationToken)
    {
        Result<RoleResponse> result = await rolesService.CreateRoleAsync(request, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Updates an existing role's information and permissions.
    /// </summary>
    /// <param name="id">Unique identifier of the role to update</param>
    /// <param name="request">Updated role data</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Updated role details</returns>
    [Authorize(Policy = PermissionKeys.Roles.Edit)]
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(RoleResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UpdateRoleRequest request, CancellationToken cancellationToken)
    {
        Result<RoleResponse> result = await rolesService.UpdateRoleAsync(id, request, cancellationToken);
        return this.ToActionResult(result);
    }

    /// <summary>
    /// Permanently deletes a role from the system (non-system roles only).
    /// </summary>
    /// <param name="id">Unique identifier of the role to delete</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Confirmation of successful deletion</returns>
    [Authorize(Policy = PermissionKeys.Roles.Delete)]
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteRole(Guid id, CancellationToken cancellationToken)
    {
        Result<Guid> result = await rolesService.DeleteRoleAsync(id, cancellationToken);
        return this.ToActionResult(result);
    }
}
