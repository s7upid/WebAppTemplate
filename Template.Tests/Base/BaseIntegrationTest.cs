using Microsoft.Extensions.Logging;
using Serilog;

namespace Template.Tests.Base;

/// <summary>
/// Base class for integration tests providing in-memory database and test web application factory
/// </summary>
public abstract class BaseIntegrationTest : IDisposable, IAsyncLifetime
{
    protected readonly WebApplicationFactory<Program> Factory;
    protected readonly HttpClient Client;
    protected readonly ApplicationDbContext DbContext;
    protected readonly IServiceScope ServiceScope;
    protected readonly string DatabaseName;

    /// <summary>
    /// JSON serializer options configured to match the backend settings (case-insensitive, enum as strings)
    /// </summary>
    protected static JsonSerializerOptions JsonOptions => new()
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter() }
    };

    protected BaseIntegrationTest()
    {
        DatabaseName = $"TestDb_{Guid.NewGuid()}";

        Factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("Testing");

            builder.ConfigureAppConfiguration((context, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    { "ConnectionStrings:DbConnectionString", "DummyConnectionStringForTesting" }
                });
            });

            builder.ConfigureServices(services =>
            {
                var dbContextDescriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));
                if (dbContextDescriptor != null)
                {
                    services.Remove(dbContextDescriptor);
                }

                var dbContextServiceDescriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(ApplicationDbContext));
                if (dbContextServiceDescriptor != null)
                {
                    services.Remove(dbContextServiceDescriptor);
                }

                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseInMemoryDatabase(DatabaseName);
                });
            });
        });

        Client = Factory.CreateClient();
        ServiceScope = Factory.Services.CreateScope();
        DbContext = ServiceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        if (DbContext.Database.IsRelational())
        {
            throw new InvalidOperationException(
                "Test is not using in-memory database! This could cause data corruption in the real database.");
        }

        DbContext.Database.EnsureCreated();
    }

    /// <summary>
    /// Called before each test. Clears the database and seeds test data.
    /// </summary>
    public virtual async Task InitializeAsync()
    {
        await ClearDatabaseAsync();
        await SeedDatabaseAsync();
    }

    /// <summary>
    /// Called after each test. Cleans up the database.
    /// </summary>
    public virtual async Task DisposeAsync()
    {
        await CleanupDatabaseAsync();
    }

    /// <summary>
    /// Seeds test data into the in-memory database. Override this to seed specific test data.
    /// </summary>
    protected virtual async Task SeedDatabaseAsync()
    {
        await Task.CompletedTask;
    }

    /// <summary>
    /// Clears all data from the database. Called before each test.
    /// </summary>
    protected virtual async Task ClearDatabaseAsync()
    {
        DbContext.ChangeTracker.Clear();

        DbContext.Users.RemoveRange(DbContext.Users);
        DbContext.Roles.RemoveRange(DbContext.Roles);
        DbContext.Permissions.RemoveRange(DbContext.Permissions);
        DbContext.AuditLogs.RemoveRange(DbContext.AuditLogs);
        await DbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Cleans up the database after each test. Called after each test.
    /// </summary>
    protected virtual async Task CleanupDatabaseAsync()
    {
        DbContext.ChangeTracker.Clear();

        DbContext.Users.RemoveRange(DbContext.Users);
        DbContext.Roles.RemoveRange(DbContext.Roles);
        DbContext.Permissions.RemoveRange(DbContext.Permissions);
        DbContext.AuditLogs.RemoveRange(DbContext.AuditLogs);
        await DbContext.SaveChangesAsync();
    }

    public virtual void Dispose()
    {
        DbContext?.Database.EnsureDeleted();
        ServiceScope?.Dispose();
        Client?.Dispose();
        Factory?.Dispose();
        GC.SuppressFinalize(this);
    }
}

