namespace Template.Tests.Base;

/// <summary>
/// Base class for unit tests providing common setup and utilities
/// </summary>
public abstract class BaseUnitTest : IDisposable
{
    protected readonly CancellationToken CancellationToken = CancellationToken.None;
    protected readonly MockRepository MockRepository;

    protected BaseUnitTest()
    {
        MockRepository = new MockRepository(MockBehavior.Strict);
    }

    /// <summary>
    /// Creates a mock of the specified type
    /// </summary>
    protected Mock<T> CreateMock<T>() where T : class
    {
        return MockRepository.Create<T>();
    }

    /// <summary>
    /// Verifies all mock setups
    /// </summary>
    protected void VerifyAll()
    {
        MockRepository.VerifyAll();
    }

    /// <summary>
    /// Verifies all mock setups and allows loose behavior
    /// </summary>
    protected void VerifyAllLoose()
    {
        MockRepository.Verify();
    }

    /// <summary>
    /// Clears all data from the database. Override this if you need custom cleanup.
    /// </summary>
    protected virtual void ClearDatabase(ApplicationDbContext? dbContext)
    {
        if (dbContext == null) return;

        // Clear change tracker to avoid validation issues when removing entities
        dbContext.ChangeTracker.Clear();

        // Remove all entities
        dbContext.Users.RemoveRange(dbContext.Users);
        dbContext.Roles.RemoveRange(dbContext.Roles);
        dbContext.Permissions.RemoveRange(dbContext.Permissions);
        dbContext.AuditLogs.RemoveRange(dbContext.AuditLogs);
        dbContext.SaveChanges();
    }

    /// <summary>
    /// Clears all data from the database asynchronously. Override this if you need custom cleanup.
    /// </summary>
    protected virtual async Task ClearDatabaseAsync(ApplicationDbContext? dbContext)
    {
        if (dbContext == null) return;

        dbContext.ChangeTracker.Clear();

        dbContext.Users.RemoveRange(dbContext.Users);
        dbContext.Roles.RemoveRange(dbContext.Roles);
        dbContext.Permissions.RemoveRange(dbContext.Permissions);
        dbContext.AuditLogs.RemoveRange(dbContext.AuditLogs);
        
        // Save changes without validation for deletions
        await dbContext.SaveChangesAsync();
    }

    public virtual void Dispose()
    {
        MockRepository.VerifyAll();
        GC.SuppressFinalize(this);
    }
}

