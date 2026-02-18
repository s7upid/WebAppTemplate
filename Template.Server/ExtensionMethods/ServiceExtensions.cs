namespace Template.Server.ExtensionMethods;

public static class ServiceExtensions
{
    extension(WebApplicationBuilder builder)
    {
        public void AddSerilog()
        {
            if (builder.Environment.IsEnvironment("Testing"))
            {
                // In testing, just register a simple logger without UseSerilog host integration
                // to prevent "logger is already frozen" errors
                var logger = new LoggerConfiguration()
                    .MinimumLevel.Warning()
                    .WriteTo.Console()
                    .CreateLogger();
                builder.Services.AddSingleton<Serilog.ILogger>(logger);
            }
            else
            {
                builder.Host.UseSerilog((context, services, config) =>
                    config.ReadFrom.Configuration(context.Configuration)
                          .ReadFrom.Services(services));
            }
        }

        public void AddDatabaseServices()
        {
            builder.Services.AddDbContext<ApplicationDbContext>((sp, options) =>
            {
                string? connectionString = builder.Configuration.GetConnectionString("DbConnectionString");
                if (string.IsNullOrEmpty(connectionString))
                    throw new InvalidOperationException("Database connection string is missing!");

                options.UseNpgsql(connectionString, pg =>
                    pg.EnableRetryOnFailure(8, TimeSpan.FromSeconds(10), []));
            });

            builder.Services.AddMemoryCache();
        }

        public void AddIdentityServices()
        {
            builder.Services.AddIdentityCore<User>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 8;
                options.User.RequireUniqueEmail = true;
                options.SignIn.RequireConfirmedEmail = true;
            })
            .AddRoles<Role>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddSignInManager<SignInManager<User>>()
            .AddDefaultTokenProviders();
        }

        public void AddApplicationServices()
        {
            builder.Services.AddScoped<IAuditService, AuditService>();
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddScoped<IAuditContextProvider, AuditContextProvider>();
            builder.Services.AddScoped<IRateLimitService, RateLimitService>();
            builder.Services.AddSingleton<IRevokedTokenService, RevokedTokenService>();
            builder.Services.AddTransient<IAuthService, AuthService>();
            builder.Services.AddTransient<IEmailService, EmailService>();
            builder.Services.AddTransient<IPermissionService, PermissionService>();
            builder.Services.AddTransient<IPermissionResolver, PermissionResolver>();
            builder.Services.AddTransient<IRolesService, RolesService>();
            builder.Services.AddTransient<IUsersService, UsersService>();
            builder.Services.AddTransient<IJwtTokenService, JwtTokenService>();
            builder.Services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
            builder.Services.AddPermissionPolicies();
        }

        public void AddAuthenticationServices()
        {
            var jwtSection = builder.Configuration.GetSection("Jwt");
            builder.Services.Configure<JwtSettings>(jwtSection);
            JwtSettings? jwtSettings = jwtSection.Get<JwtSettings>();
            if (jwtSettings == null || string.IsNullOrEmpty(jwtSettings.SigningKey))
                throw new InvalidOperationException("JWT settings are missing or invalid!");

            builder.Services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = jwtSettings.Issuer,
                        ValidateAudience = true,
                        ValidAudience = jwtSettings.Audience,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SigningKey)),
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.FromMinutes(2)
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnTokenValidated = async context =>
                        {
                            try
                            {
                                var revokedTokenService = context.HttpContext.RequestServices
                                    .GetRequiredService<IRevokedTokenService>();

                                var userIdClaim = context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier)
                                    ?? context.Principal?.FindFirstValue(JwtRegisteredClaimNames.Sub);

                                if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out Guid userId))
                                {
                                    if (revokedTokenService.IsUserRevoked(userId))
                                    {
                                        context.Fail("User token has been revoked. Please log in again.");
                                        return;
                                    }

                                    var userManager = context.HttpContext.RequestServices
                                        .GetRequiredService<UserManager<User>>();
                                    var user = await userManager.FindByIdAsync(userId.ToString());

                                    if (user == null)
                                    {
                                        context.Fail("User not found.");
                                        return;
                                    }

                                    bool isLockedOut = user.LockoutEnabled &&
                                        (user.LockoutEnd == null || user.LockoutEnd > DateTimeOffset.UtcNow);
                                    if (isLockedOut)
                                    {
                                        context.Fail("User account is locked.");
                                        return;
                                    }

                                    if (user.Status != UserStatus.Active)
                                    {
                                        context.Fail("User account is not active.");
                                        return;
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                var log = context.HttpContext.RequestServices.GetService<ILogger<Program>>();
                                log?.LogError(ex, "Error during token validation");
                                context.Fail("Authentication error. Please try again.");
                            }
                        }
                    };
                });
        }

        public void AddCorsServices()
        {
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("SpaCors", policy =>
                {
                    policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });
        }

        public void AddWebServices()
        {
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                });

            builder.Services.AddOpenApi("v1", options =>
            {
                options.AddDocumentTransformer((document, context, cancellationToken) =>
                {
                    document.Info.Title = "API";
                    document.Info.Version = "1.0.0";
                    document.Info.Description = "Administration and management API.";

                    return Task.CompletedTask;
                });
            });
            builder.Services.AddOpenApiDocument();
        }
    }
}
