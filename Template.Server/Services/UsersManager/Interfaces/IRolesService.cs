namespace Template.Server.Services.UsersManager.Interfaces;

public interface IRolesService
{
    Task<Result<PagedResult<RoleResponse>>> GetRolesAsync(PagedResultParams @params, CancellationToken cancellationToken);
    Task<Result<RoleResponse>> GetRoleByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Result<RoleResponse>> CreateRoleAsync(CreateRoleRequest request, CancellationToken cancellationToken);
    Task<Result<RoleResponse>> UpdateRoleAsync(Guid id, UpdateRoleRequest request, CancellationToken cancellationToken);
    Task<Result<Guid>> DeleteRoleAsync(Guid id, CancellationToken cancellationToken);
}
