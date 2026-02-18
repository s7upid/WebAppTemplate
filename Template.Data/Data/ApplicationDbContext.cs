namespace Template.Data.Data;

public class ApplicationDbContext(
    DbContextOptions<ApplicationDbContext> options,
    IHttpContextAccessor accessor) : IdentityDbContext<User, Role, Guid, IdentityUserClaim<Guid>, UserRole, IdentityUserLogin<Guid>, IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>(options)
{
    public string? CurrentUserId => accessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    public DbSet<Permission> Permissions { get; set; } = null!;

    public DbSet<AuditLog> AuditLogs { get; set; } = null!;

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        List<AuditLog> changes = TrackChanges();

        if (changes.Count > 0)
        {
            await AuditLogs.AddRangeAsync(changes, cancellationToken);
        }

        return await base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // USER <-> ROLE (many-to-many)
        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired();

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId)
            .IsRequired();

        // USER <-> PERMISSIONS (many-to-many)
        modelBuilder.Entity<User>()
            .HasMany(u => u.Permissions)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "UserPermissions",
                j => j.HasOne<Permission>().WithMany().HasForeignKey("PermissionId").OnDelete(DeleteBehavior.Cascade),
                j => j.HasOne<User>().WithMany().HasForeignKey("UserId").OnDelete(DeleteBehavior.Cascade),
                j => j.ToTable("UserPermissions").HasKey("UserId", "PermissionId"));

        // ROLE <-> PERMISSIONS (many-to-many)
        modelBuilder.Entity<Role>()
            .HasMany(r => r.Permissions)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "RolePermissions",
                j => j.HasOne<Permission>().WithMany().HasForeignKey("PermissionId").OnDelete(DeleteBehavior.Cascade),
                j => j.HasOne<Role>().WithMany().HasForeignKey("RoleId").OnDelete(DeleteBehavior.Cascade),
                j => j.ToTable("RolePermissions").HasKey("RoleId", "PermissionId"));
    }

    private List<AuditLog> TrackChanges()
    {
        var states = new HashSet<EntityState> { EntityState.Added, EntityState.Modified, EntityState.Deleted };

        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity != null && states.Contains(e.State))
            .ToList();

        var changes = new List<AuditLog>();
        foreach (var entry in entries)
        {
            if (entry.Entity is AuditLog)
            {
                continue;
            }

            string entityName = entry.Entity.GetType().Name;

            var before = new Dictionary<string, object?>();
            var after = new Dictionary<string, object?>();

            var primaryKey = entry.Metadata.FindPrimaryKey();
            string primaryKeyValueString = "N/A";

            if (primaryKey != null)
            {
                var keyValues = primaryKey.Properties
                    .Select(p => entry.Property(p.Name).CurrentValue ?? entry.Property(p.Name).OriginalValue)
                    .Select(v => v?.ToString());

                primaryKeyValueString = string.Join(", ", keyValues);
            }

            string description = $"{entry.State} {entityName} Id: {primaryKeyValueString}";

            try
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        after = entry.Properties.ToDictionary(p => p.Metadata.Name, p => p.CurrentValue);
                        break;

                    case EntityState.Modified:
                        var modifiedProperties = entry.Properties
                            .Where(p => p.IsModified && !Equals(p.OriginalValue, p.CurrentValue));

                        before = modifiedProperties.ToDictionary(p => p.Metadata.Name, p => p.OriginalValue);
                        after = modifiedProperties.ToDictionary(p => p.Metadata.Name, p => p.CurrentValue);
                        break;

                    case EntityState.Deleted:
                        before = entry.Properties.ToDictionary(p => p.Metadata.Name, p => p.OriginalValue);
                        break;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error processing entity {entityName}: {e}");
                continue;
            }

            _ = Guid.TryParse(CurrentUserId, out var userId);

            var sanitizedBefore = SanitizeAuditDictionary(before);
            var sanitizedAfter = SanitizeAuditDictionary(after);

            if (sanitizedBefore.Count != 0 || sanitizedAfter.Count != 0)
            {
                var mappedEventType = entry.State switch
                {
                    EntityState.Added => AuditEventType.Created,
                    EntityState.Modified => AuditEventType.Updated,
                    EntityState.Deleted => AuditEventType.Deleted,
                    _ => AuditEventType.Updated
                };

                var auditLog = new AuditLog
                {
                    Timestamp = DateTime.UtcNow,
                    UserId = userId == Guid.Empty ? null : userId,
                    Description = description,
                    EventType = mappedEventType,
                    Success = true,
                    PreChangeValue = sanitizedBefore.Count != 0 ? JsonConvert.SerializeObject(sanitizedBefore) : null,
                    PostChangeValue = sanitizedAfter.Count != 0 ? JsonConvert.SerializeObject(sanitizedAfter) : null,
                };

                changes.Add(auditLog);
            }
        }

        return changes;
    }

    private static readonly HashSet<string> IgnoredAuditProperties = new(StringComparer.OrdinalIgnoreCase)
    {
        // Identity framework/generated noise
        "ConcurrencyStamp",
        "SecurityStamp",
        "NormalizedEmail",
        "NormalizedUserName",
        "NormalizedName",
        "UpdatedAt",
        // Low-signal auth state
        "AccessFailedCount",
        "LockoutEnabled",
        "LockoutEnd",
        "TwoFactorEnabled",
        "PhoneNumberConfirmed",
        "EmailConfirmed",
        // Sensitive
        "PasswordHash"
    };

    private static Dictionary<string, object?> SanitizeAuditDictionary(Dictionary<string, object?> source)
    {
        if (source.Count == 0) return source;
        var result = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);

        foreach (var kvp in source)
        {
            if (IgnoredAuditProperties.Contains(kvp.Key))
            {
                continue;
            }

            result[kvp.Key] = kvp.Value;
        }

        return result;
    }
}