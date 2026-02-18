namespace Template.Server.Controllers;

/// <summary>
/// Controller for managing system permissions and access control definitions.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PermissionsController(IPermissionService permissionService) : ControllerBase
{
    /// <summary>
    /// Retrieves a paginated list of permissions with optional filtering and sorting capabilities.
    /// </summary>
    /// <param name="params">Pagination and filtering parameters</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Paginated list of available permissions</returns>
    [Authorize(Policy = PermissionKeys.Permissions.View)]
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<PermissionResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetPermissions([FromQuery] PagedResultParams @params, CancellationToken cancellationToken)
    {
        Result<PagedResult<PermissionResponse>> result = await permissionService.GetPermissionsAsync(@params, cancellationToken);
        return this.ToActionResult(result);
    }
}
