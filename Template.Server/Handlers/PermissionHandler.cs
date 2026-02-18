namespace Template.Server.Handlers;

public class PermissionHandler(ApplicationDbContext dbContext, IPermissionResolver permissionResolver) : AuthorizationHandler<PermissionRequirement>
{
    private readonly ApplicationDbContext _dbContext = dbContext;

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        if (context.User.Identity?.IsAuthenticated != true)
        {
            context.Fail();
            return;
        }


        HashSet<string> permissionClaims = [.. context.User.FindAll("perm").Select(c => c.Value)];
        if (permissionClaims.Count > 0)
        {
            if (permissionClaims.Contains(requirement.PermissionKey))
            {
                context.Succeed(requirement);
            }
            else
            {
                context.Fail();
            }
            return;
        }


        string? userId = context.User.FindFirst("sub")?.Value ?? context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(userId))
        {
            context.Fail();
            return;
        }

        Guid userGuid = Guid.TryParse(userId, out Guid g) ? g : default;
        User? user = await _dbContext.Users
            .Include(u => u.Permissions)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                    .ThenInclude(r => r.Permissions)
            .AsSplitQuery()
            .FirstOrDefaultAsync(u => u.Id == userGuid);
        if (user == null)
        {
            context.Fail();
            return;
        }

        List<string> effectivePermissions = permissionResolver.GetEffectivePermissions(user);

        if (effectivePermissions.Contains(requirement.PermissionKey))
        {
            context.Succeed(requirement);
        }
        else
        {
            context.Fail();
        }
    }
}