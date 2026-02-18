namespace Template.Data.Services.Interfaces;

public interface IAuditContextProvider
{
    Guid? GetCurrentUserId { get; }
}
