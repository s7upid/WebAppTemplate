namespace Template.Server.Services.UsersManager.Interfaces;

public interface IPermissionService
{
    Task<Result<PagedResult<PermissionResponse>>> GetPermissionsAsync(PagedResultParams @params, CancellationToken cancellationToken);
}
