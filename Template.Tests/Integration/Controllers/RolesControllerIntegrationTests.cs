namespace Template.Tests.Integration.Controllers;

[Collection("PostgreSql")]
public class RolesControllerIntegrationTests(PostgreSqlFixture fixture) : IAsyncLifetime, IDisposable
{
    private readonly CustomWebApplicationFactory<Program> _factory = new(fixture);
    private HttpClient _client = null!;
    private string? _authToken;
    private Guid _testRoleId;

    private static JsonSerializerOptions JsonOptions => new()
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter() }
    };

    public async Task InitializeAsync()
    {
        await _factory.InitializeAsync();
        _factory.EnsureDatabaseCreated();
        await _factory.SeedTestDataAsync();
        await SeedTestDataAsync();

        _client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost")
        });
    }

    public Task DisposeAsync() => Task.CompletedTask;

    public void Dispose()
    {
        _client?.Dispose();
        _factory?.Dispose();
        GC.SuppressFinalize(this);
    }

    [Fact]
    public async Task GetRoles_WithAuthentication_ReturnsRoles()
    {
        await AuthenticateAsync();

        var request = new HttpRequestMessage(HttpMethod.Get, "/api/roles?page=1&pageSize=10");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);
        var response = await _client.SendAsync(request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task GetRoleById_WithValidId_ReturnsRole()
    {
        await AuthenticateAsync();

        var request = new HttpRequestMessage(HttpMethod.Get, $"/api/roles/{_testRoleId}");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);
        var response = await _client.SendAsync(request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadAsStringAsync();
        var role = JsonSerializer.Deserialize<RoleResponse>(content, JsonOptions);
        role.Should().NotBeNull();
        role!.Id.Should().Be(_testRoleId);
    }

    [Fact]
    public async Task CreateRole_WithValidRequest_ReturnsCreatedRole()
    {
        await AuthenticateAsync();
        var createRequest = TestDataBuilder.CreateRoleRequest(
            $"NewRole_{Guid.NewGuid():N}",
            "New Role Description");

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/roles")
        {
            Content = JsonContent.Create(createRequest)
        };
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _authToken);
        var response = await _client.SendAsync(request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var content = await response.Content.ReadAsStringAsync();
        var role = JsonSerializer.Deserialize<RoleResponse>(content, JsonOptions);
        role.Should().NotBeNull();
        role!.Name.Should().Be(createRequest.Name);
    }

    private async Task SeedTestDataAsync()
    {
        var scope = _factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var permissions = new[]
        {
            new Permission { Key = "roles:view", Name = "Roles View", Description = "View roles", Resource = "roles", Action = "view", Category = "Roles" },
            new Permission { Key = "roles:create", Name = "Roles Create", Description = "Create roles", Resource = "roles", Action = "create", Category = "Roles" },
            new Permission { Key = "roles:edit", Name = "Roles Edit", Description = "Edit roles", Resource = "roles", Action = "edit", Category = "Roles" },
            new Permission { Key = "roles:delete", Name = "Roles Delete", Description = "Delete roles", Resource = "roles", Action = "delete", Category = "Roles" },
            new Permission { Key = "users:view", Name = "Users View", Description = "View users", Resource = "users", Action = "view", Category = "Users" },
            new Permission { Key = "users:create", Name = "Users Create", Description = "Create users", Resource = "users", Action = "create", Category = "Users" },
            new Permission { Key = "users:edit", Name = "Users Edit", Description = "Edit users", Resource = "users", Action = "edit", Category = "Users" },
            new Permission { Key = "users:delete", Name = "Users Delete", Description = "Delete users", Resource = "users", Action = "delete", Category = "Users" },
        };

        foreach (var perm in permissions)
        {
            if (!await db.Permissions.AnyAsync(p => p.Key == perm.Key))
            {
                await db.Permissions.AddAsync(perm);
            }
        }
        await db.SaveChangesAsync();

        var existingRole = await roleManager.FindByNameAsync("Admin");
        Role adminRole;

        if (existingRole == null)
        {
            adminRole = TestDataBuilder.CreateRole("Admin", "Administrator");
            await roleManager.CreateAsync(adminRole);
        }
        else
        {
            adminRole = existingRole;
        }

        _testRoleId = adminRole.Id;

        var trackedRole = await db.Roles
            .Include(r => r.Permissions)
            .FirstOrDefaultAsync(r => r.Id == adminRole.Id);

        if (trackedRole != null)
        {
            var dbPermissions = await db.Permissions.ToListAsync();
            trackedRole.Permissions = [.. dbPermissions];
            await db.SaveChangesAsync();
        }

        var existingUser = await userManager.FindByEmailAsync("admin@example.com");
        User adminUser;

        if (existingUser == null)
        {
            adminUser = TestDataBuilder.CreateUser("admin@example.com", "Admin", "User", UserStatus.Active, lockoutEnabled: false);
            adminUser.EmailConfirmed = true;
            adminUser.LockoutEnabled = false;
            var result = await userManager.CreateAsync(adminUser, "AdminPassword123!");

            if (result.Succeeded)
            {
                await userManager.SetLockoutEnabledAsync(adminUser, false);
                if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
        }
        else
        {
            adminUser = existingUser;
            await userManager.SetLockoutEnabledAsync(adminUser, false);
            if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        await db.SaveChangesAsync();
    }

    private async Task AuthenticateAsync()
    {
        var loginRequest = new LoginRequest
        {
            Email = "admin@example.com",
            Password = "AdminPassword123!"
        };

        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            var authResponse = JsonSerializer.Deserialize<AuthResponse>(content, JsonOptions);
            _authToken = authResponse?.Token;
        }
    }
}
