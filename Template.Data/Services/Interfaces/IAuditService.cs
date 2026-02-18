namespace Template.Data.Services.Interfaces;

public interface IAuditService
{
    Task LogEventAsync(AuditEventType eventType, string description, Guid? userId = null, string? ipAddress = null, string? userAgent = null, bool success = true, string? errorMessage = null, CancellationToken cancellationToken = default);
    Task<Result<PagedResult<AuditLog>>> GetLogsAsync(PagedResultParams @params, CancellationToken cancellationToken);
}
