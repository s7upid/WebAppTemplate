namespace Template.Server.ExtensionMethods;

public static class InitializationExtensions
{
    extension(WebApplication app)
    {
        public async Task InitializeApplicationAsync()
        {
            await using AsyncServiceScope scope = app.Services.CreateAsyncScope();
            IServiceProvider services = scope.ServiceProvider;

            ApplicationDbContext db = services.GetRequiredService<ApplicationDbContext>();
            UserManager<User> userManager = services.GetRequiredService<UserManager<User>>();
            RoleManager<Role> roleManager = services.GetRequiredService<RoleManager<Role>>();

            if (db.Database.IsRelational())
            {
                await db.Database.MigrateAsync();
            }

            if (!app.Environment.IsEnvironment("Testing"))
            {
                await DefaultDataSeeder.SeedAsync(db, userManager, roleManager);
            }
        }
    }
}
