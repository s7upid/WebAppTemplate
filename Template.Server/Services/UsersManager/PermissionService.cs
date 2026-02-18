namespace Template.Server.Services.UsersManager;

public class PermissionService(ApplicationDbContext db) : IPermissionService
{
    public async Task<Result<PagedResult<PermissionResponse>>> GetPermissionsAsync(PagedResultParams @params, CancellationToken cancellationToken)
    {
        IQueryable<Permission> query = db.Permissions
            .AsNoTracking()
            .AsQueryable();

        PagedResult<Permission> pagedResult = await FetchSortedPagedResults<Permission>.GetSortedPagedResult(@params, query, cancellationToken);

        PagedResult<PermissionResponse> result = new()
        {
            Items = [.. pagedResult.Items.Select(PermissionResponse.Map)],
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };

        return Ok(result);
    }
}
