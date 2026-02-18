namespace Template.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditController(IAuditService auditService) : ControllerBase
{
    /// <summary>
    /// Retrieves audit logs with optional pagination and filtering capabilities.
    /// </summary>
    /// <param name="params">Pagination and filtering parameters (optional)</param>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Paginated list of audit logs or recent logs if no pagination</returns>
    [Authorize(Roles = RoleNames.Administrator)]
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<AuditLog>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLogs([FromQuery] PagedResultParams @params, CancellationToken cancellationToken)
    {
        Result<PagedResult<AuditLog>> result = await auditService.GetLogsAsync(@params, cancellationToken);
        return this.ToActionResult(result);
    }
}