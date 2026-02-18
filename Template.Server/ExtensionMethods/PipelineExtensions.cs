namespace Template.Server.ExtensionMethods;

public static class PipelineExtensions
{
    extension(WebApplication app)
    {
        public void ConfigureMiddleware()
        {
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference(options =>
                {
                    options.WithTitle("API")
                           .WithTheme(ScalarTheme.Mars)
                           .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
                });
            }

            app.UseCors("SpaCors");
            app.UseAuthentication();
            app.UseAuthorization();
        }

        public void ConfigureEndpoints()
        {
            app.MapControllers();
        }
    }
}
