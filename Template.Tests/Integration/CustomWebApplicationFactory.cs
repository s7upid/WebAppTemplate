namespace Template.Tests.Integration;

public class CustomWebApplicationFactory<TProgram>(PostgreSqlFixture fixture) : WebApplicationFactory<TProgram>, IAsyncLifetime where TProgram : class
{
    private string? _connectionString;

    public async Task InitializeAsync()
    {
        _connectionString = await fixture.CreateDatabaseAsync();
    }

    Task IAsyncLifetime.DisposeAsync() => Task.CompletedTask;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            if (_connectionString is null)
                throw new InvalidOperationException("Database not initialized. Call InitializeAsync first.");

            ServiceDescriptor? dbContextDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(IDbContextOptionsConfiguration<ApplicationDbContext>));

            if (dbContextDescriptor != null)
                services.Remove(dbContextDescriptor);

            ServiceDescriptor? mainDbConnectionDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(ApplicationDbContext));

            if (mainDbConnectionDescriptor != null)
                services.Remove(mainDbConnectionDescriptor);

            var dbContextOptionsDescriptors = services
                .Where(d => d.ServiceType.IsGenericType && d.ServiceType.GetGenericTypeDefinition() == typeof(DbContextOptions<>))
                .ToList();

            foreach (var descriptor in dbContextOptionsDescriptors)
            {
                services.Remove(descriptor);
            }

            services.AddDbContext<ApplicationDbContext>((container, options) =>
            {
                options.UseNpgsql(_connectionString);
            });
        });
    }

    public void EnsureDatabaseCreated()
    {
        using var scope = Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        dbContext.Database.EnsureCreated();
    }

    public async Task SeedTestDataAsync()
    {
        using var scope = Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();

        await DefaultDataSeeder.SeedAsync(dbContext, userManager, roleManager);
    }
}
