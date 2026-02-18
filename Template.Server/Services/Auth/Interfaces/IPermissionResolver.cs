namespace Template.Server.Services.Auth.Interfaces;

public interface IPermissionResolver
{
    List<string> GetEffectivePermissions(User user);
}
