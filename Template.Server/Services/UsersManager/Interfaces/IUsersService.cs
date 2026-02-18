namespace Template.Server.Services.UsersManager.Interfaces;

public interface IUsersService
{
    Task<Result<PagedResult<UserResponse>>> GetUsersAsync(PagedResultParams @params, CancellationToken cancellationToken);
    Task<Result<UserResponse>> GetUserByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Result<UserResponse>> CreateUserAsync(CreateUserRequest request, CancellationToken cancellationToken);
    Task<Result<UserResponse>> UpdateUserAsync(Guid id, UpdateUserRequest request, CancellationToken cancellationToken);
    Task<Result<Guid>> DeleteUserAsync(Guid id, CancellationToken cancellationToken);
    Task<Result<UserResponse>> ApproveUserAsync(Guid id, ApproveUserRequest request, CancellationToken cancellationToken);
    Task<Result<Guid>> RejectUserAsync(Guid id, CancellationToken cancellationToken);
}
