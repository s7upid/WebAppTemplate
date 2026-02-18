namespace Template.Data.Services;

public class AuditService(ApplicationDbContext dbContext) : IAuditService
{
    public async Task LogEventAsync(
        AuditEventType eventType,
        string description,
        Guid? userId = null,
        string? ipAddress = null,
        string? userAgent = null,
        bool success = true,
        string? errorMessage = null,
        CancellationToken cancellationToken = default)
    {
        AuditLog auditLog = new()
        {
            EventType = eventType,
            Description = description,
            UserId = userId,
            UserAgent = userAgent,
            Success = success,
            ErrorMessage = errorMessage,
            Timestamp = DateTime.UtcNow,

        };

        dbContext.AuditLogs.Add(auditLog);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<Result<PagedResult<AuditLog>>> GetLogsAsync(PagedResultParams @params, CancellationToken cancellationToken)
    {
        IQueryable<AuditLog> query = dbContext.AuditLogs.Include(a => a.User);
        PagedResult<AuditLog> pagedUsers = await FetchSortedPagedResults<AuditLog>.GetSortedPagedResult(@params, query, cancellationToken);
        return new(HttpStatusCode.OK, Data: pagedUsers);
    }
}
