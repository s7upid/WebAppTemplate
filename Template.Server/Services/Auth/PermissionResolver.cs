namespace Template.Server.Services.Auth;

public sealed class PermissionResolver() : IPermissionResolver
{
    public List<string> GetEffectivePermissions(User user)
    {
        List<string> rolePermissionKeys = [.. user.UserRoles
            .Select(ur => ur.Role)
            .SelectMany(ur => ur.Permissions)
            .Select(p => p.Key)];

        List<string> userPermissionKeys = [.. user.Permissions.Select(p => p.Key)];

        List<string> effectivePerms = [.. rolePermissionKeys
            .Union(userPermissionKeys)
            .Distinct()];

        return effectivePerms;
    }
}