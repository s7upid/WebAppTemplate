using Template.Data.Constants;

namespace Template.Data.Data.Seeds;

public static class DefaultDataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, UserManager<User> userManager, RoleManager<Role> roleManager)
    {
        if (!context.Permissions.Any())
        {
            List<Permission> permissions =
            [
                // Dashboard
                CreatePermission(PermissionKeys.Dashboard.View, "Dashboard View", "Dashboard", "view", "dashboard"),
                
                // Users
                CreatePermission(PermissionKeys.Users.View, "Users View", "Users", "view", "users"),
                CreatePermission(PermissionKeys.Users.Create, "Users Create", "Users", "create", "users"),
                CreatePermission(PermissionKeys.Users.Edit, "Users Edit", "Users", "edit", "users"),
                CreatePermission(PermissionKeys.Users.Delete, "Users Delete", "Users", "delete", "users"),
                CreatePermission(PermissionKeys.Users.AssignRole, "Users Assign Role", "Users", "assign-role", "users"),
                CreatePermission(PermissionKeys.Users.Approve, "Users Approve", "Users", "approve", "users"),
                
                // Roles
                CreatePermission(PermissionKeys.Roles.View, "Roles View", "Roles", "view", "roles"),
                CreatePermission(PermissionKeys.Roles.Create, "Roles Create", "Roles", "create", "roles"),
                CreatePermission(PermissionKeys.Roles.Edit, "Roles Edit", "Roles", "edit", "roles"),
                CreatePermission(PermissionKeys.Roles.Delete, "Roles Delete", "Roles", "delete", "roles"),
                
                // Permissions
                CreatePermission(PermissionKeys.Permissions.View, "Permissions View", "Permissions", "view", "permissions"),
                CreatePermission(PermissionKeys.Permissions.Assign, "Permissions Assign", "Permissions", "assign", "permissions"),
                
                // Settings
                CreatePermission(PermissionKeys.Settings.View, "Settings View", "Settings", "view", "settings"),
                CreatePermission(PermissionKeys.Settings.Edit, "Settings Edit", "Settings", "edit", "settings"),
                
                // Reports
                CreatePermission(PermissionKeys.Reports.View, "Reports View", "Reports", "view", "reports"),
                CreatePermission(PermissionKeys.Reports.Export, "Reports Export", "Reports", "export", "reports"),
            ];

            await context.Permissions.AddRangeAsync(permissions);
            await context.SaveChangesAsync();
        }

        List<Permission> allPermissions = await context.Permissions.ToListAsync();

        List<(string Name, string Description, List<Permission> Permissions, bool IsSystem)> defaultRoles =
        [
            (RoleNames.Administrator, "Full system access with all permissions", allPermissions, true),
            (RoleNames.Support, "Customer support access with user assistance and reporting", allPermissions.Where(p => p.Category != "Settings").ToList(), true),
            (RoleNames.Regulator, "Regulatory oversight with audit and compliance access", allPermissions.Where(p => p.Category is "Reports" or "Users").ToList(), true),
            (RoleNames.Operator, "Operational access with limited user management", allPermissions.Where(p => p.Category is "Users" or "Dashboard").ToList(), false),
        ];

        foreach ((string name, string description, List<Permission> permissions, bool isSystem) in defaultRoles)
        {
            Role? existingIdentityRole = await roleManager.FindByNameAsync(name);
            if (existingIdentityRole is null)
            {
                Role newRole = new()
                {
                    Name = name,
                    Description = description,
                    IsSystem = isSystem,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                IdentityResult created = await roleManager.CreateAsync(newRole);
                if (!created.Succeeded)
                {
                    continue;
                }
                existingIdentityRole = newRole;
            }

            Role? trackedRole = await context.Roles
                .Include(r => r.Permissions)
                .FirstOrDefaultAsync(r => r.Id == existingIdentityRole.Id);

            if (trackedRole is not null)
            {
                trackedRole.Name = name;
                trackedRole.NormalizedName = roleManager.NormalizeKey(name);
                trackedRole.Description = description;
                trackedRole.IsSystem = isSystem;
                trackedRole.Permissions = permissions;
                trackedRole.UpdatedAt = DateTime.UtcNow;
            }
        }

        await context.SaveChangesAsync();

        const string adminEmail = "admin@admin.com";
        const string adminPassword = "Admin123!";

        Role? identityRole = await roleManager.FindByNameAsync(RoleNames.Administrator);
        if (identityRole is null)
        {
            identityRole = new Role
            {
                Name = RoleNames.Administrator,
                Description = "Full system access with all permissions",
                IsSystem = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await roleManager.CreateAsync(identityRole);
        }

        User? existingAdmin = await userManager.FindByEmailAsync(adminEmail);
        if (existingAdmin is null)
        {
            User adminUser = new()
            {
                Id = Guid.NewGuid(),
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                FirstName = "Admin",
                LastName = "User",
                Status = UserStatus.Active,
                LockoutEnabled = false,
                CreatedAt = DateTime.UtcNow
            };

            IdentityResult createResult = await userManager.CreateAsync(adminUser, adminPassword);
            if (createResult.Succeeded)
            {
                await userManager.SetLockoutEnabledAsync(adminUser, false);
                if (!await userManager.IsInRoleAsync(adminUser, RoleNames.Administrator))
                {
                    await userManager.AddToRoleAsync(adminUser, RoleNames.Administrator);
                }
            }
        }
        else
        {
            await userManager.SetLockoutEnabledAsync(existingAdmin, false);
        }
    }

    private static Permission CreatePermission(string key, string name, string category, string action, string resource) => new()
    {
        Key = key,
        Name = name,
        Description = name,
        Category = category,
        Action = action,
        Resource = resource
    };
}
