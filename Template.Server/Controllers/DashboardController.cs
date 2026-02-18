namespace Template.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(IAuditService auditService) : ControllerBase
{
    /// <summary>
    /// Retrieves audit logs with optional pagination and filtering capabilities.
    /// If no pagination parameters are provided, returns recent logs (default: 100).
    /// </summary>
    /// <param name="cancellationToken">Cancellation token for the operation</param>
    /// <returns>Paginated list of audit logs or recent logs if no pagination</returns>
    [Authorize(Roles = RoleNames.Administrator)]
    [HttpGet("recent-logs")]
    [ProducesResponseType(typeof(AuditLog), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLogs(CancellationToken cancellationToken)
    {
        PagedResultParams @params = new()
        {
            Page = 1,
            PageSize = 10,
            Ascending = false,
            SortColumn = "Timestamp"
        };

        Result<PagedResult<AuditLog>> result = await auditService.GetLogsAsync(@params, cancellationToken);
        return this.ToActionResult(result);
    }
}