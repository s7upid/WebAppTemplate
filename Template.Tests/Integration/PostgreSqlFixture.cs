namespace Template.Tests.Integration;

public class PostgreSqlFixture : IAsyncLifetime
{
    private readonly PostgreSqlContainer _container = new PostgreSqlBuilder("postgres:16-alpine")
        .WithDatabase("postgres")
        .WithUsername("testuser")
        .WithPassword("testpassword")
        .Build();

    public string BaseConnectionString => _container.GetConnectionString();

    public async Task<string> CreateDatabaseAsync()
    {
        string databaseName = $"test_{Guid.NewGuid():N}";

        var builder = new NpgsqlConnectionStringBuilder(BaseConnectionString)
        {
            Database = "postgres"
        };

        await using var connection = new NpgsqlConnection(builder.ConnectionString);
        await connection.OpenAsync();

        await using var command = connection.CreateCommand();
        command.CommandText = $"CREATE DATABASE \"{databaseName}\"";
        await command.ExecuteNonQueryAsync();

        builder.Database = databaseName;
        return builder.ConnectionString;
    }

    public async Task InitializeAsync()
    {
        await _container.StartAsync();
    }

    public async Task DisposeAsync()
    {
        await _container.DisposeAsync();
    }
}

[CollectionDefinition("PostgreSql")]
public class PostgreSqlCollection : ICollectionFixture<PostgreSqlFixture>
{
}
