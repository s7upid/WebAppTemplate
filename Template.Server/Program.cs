// Only create bootstrap logger if not already configured (prevents test isolation issues)
if (Log.Logger.GetType().Name == "SilentLogger")
{
    Log.Logger = new LoggerConfiguration().WriteTo.Console().CreateBootstrapLogger();
}

try
{
    WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

    builder.AddSerilog();
    builder.AddDatabaseServices();
    builder.AddIdentityServices();
    builder.AddApplicationServices();
    builder.AddAuthenticationServices();
    builder.AddCorsServices();
    builder.AddWebServices();

    WebApplication app = builder.Build();

    await app.InitializeApplicationAsync();

    app.ConfigureMiddleware();
    app.ConfigureEndpoints();

    app.Run();
}
catch (Exception ex) when (ex is not HostAbortedException)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
    throw;
}
finally
{
    Log.CloseAndFlush();
}
