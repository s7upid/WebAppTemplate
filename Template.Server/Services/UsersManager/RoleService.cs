namespace Template.Server.Services.UsersManager;

public class RolesService(ApplicationDbContext db, RoleManager<Role> roleManager) : IRolesService
{
    #region Get Roles

    public async Task<Result<PagedResult<RoleResponse>>> GetRolesAsync(PagedResultParams @params, CancellationToken cancellationToken)
    {
        IQueryable<Role> query = db.Roles
            .AsNoTracking()
            .Include(r => r.Permissions)
            .Include(r => r.UserRoles)
                .ThenInclude(r => r.User)
            .AsSplitQuery();

        PagedResult<Role> pagedResult = await FetchSortedPagedResults<Role>.GetSortedPagedResult(@params, query, cancellationToken);

        PagedResult<RoleResponse> result = new()
        {
            Items = [.. pagedResult.Items.Select(RoleResponse.Map)],
            TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
            PageSize = pagedResult.PageSize
        };

        return Ok(result);
    }

    public async Task<Result<RoleResponse>> GetRoleByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        Role? role = await db.Roles
            .Where(r => r.Id == id)
            .AsNoTracking()
            .Include(r => r.Permissions)
            .Include(r => r.UserRoles)
                .ThenInclude(r => r.User)
            .AsSplitQuery()
            .FirstOrDefaultAsync(cancellationToken);

        if (role == null)
        {
            return NotFound<RoleResponse>("Role not found");
        }

        return Ok(RoleResponse.Map(role));
    }

    #endregion

    #region Create / Update / Delete Roles

    public async Task<Result<RoleResponse>> CreateRoleAsync(CreateRoleRequest request, CancellationToken cancellationToken)
    {
        if (await roleManager.RoleExistsAsync(request.Name))
        {
            return new Result<RoleResponse>(
                HttpStatusCode.BadRequest,
                FieldErrors: new Dictionary<string, string[]>
                {
                    { nameof(Role.Name), new[] { $"Role '{request.Name}' already exists." } }
                });
        }

        List<Permission> permissions = await db.Permissions
            .Where(p => request.PermissionKeys.Contains(p.Key))
            .ToListAsync(cancellationToken);

        Role role = new()
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Permissions = permissions,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        IdentityResult result = await roleManager.CreateAsync(role);
        if (!result.Succeeded)
        {
            var fieldErrors = ParseIdentityErrors.ParseErrors(result);
            return new Result<RoleResponse>(
                HttpStatusCode.BadRequest,
                FieldErrors: fieldErrors
            );
        }

        Role createdRole = await db.Roles
            .Where(r => r.Id == role.Id)
            .Include(r => r.UserRoles)
            .AsSplitQuery()
            .FirstAsync(cancellationToken);

        return Ok(RoleResponse.Map(createdRole));

    }

    public async Task<Result<RoleResponse>> UpdateRoleAsync(Guid id, UpdateRoleRequest request, CancellationToken cancellationToken)
    {
        Role? role = await db.Roles
            .Where(r => r.Id == id)
            .Include(r => r.Permissions)
            .FirstOrDefaultAsync(cancellationToken);

        if (role == null)
        {
            return NotFound<RoleResponse>("Role not found");
        }

        if (role.Name != request.Name)
        {
            bool roleExists = await roleManager.RoleExistsAsync(request.Name);
            if (roleExists)
            {
                return new Result<RoleResponse>(
                    HttpStatusCode.BadRequest,
                    FieldErrors: new Dictionary<string, string[]>
                    {
                    { nameof(Role.Name), new[] { $"Role '{request.Name}' already exists." } }
                    });
            }
        }

        role.Name = request.Name;
        role.Description = request.Description;
        role.UpdatedAt = DateTime.UtcNow;

        if (request.PermissionKeys != null)
        {
            role.Permissions = await db.Permissions
                .Where(p => request.PermissionKeys.Contains(p.Key))
                .ToListAsync(cancellationToken);
        }

        await roleManager.UpdateAsync(role);
        await db.SaveChangesAsync(cancellationToken);

        Role updatedRole = await db.Roles
            .Where(r => r.Id == id)
            .Include(r => r.UserRoles)
                .ThenInclude(r => r.User)
            .Include(r => r.Permissions)
            .AsSplitQuery()
            .FirstAsync(cancellationToken);

        return Ok(RoleResponse.Map(updatedRole));

    }

    public async Task<Result<Guid>> DeleteRoleAsync(Guid id, CancellationToken cancellationToken)
    {
        Role? role = await db.Roles.FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

        if (role == null)
        {
            return NotFound<Guid>("Role not found");
        }

        if (role.IsSystem)
        {
            return BadRequest<Guid>("Cannot delete a system role");
        }

        IdentityResult result = await roleManager.DeleteAsync(role);
        if (!result.Succeeded)
        {
            return BadRequest<Guid>(string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        await db.SaveChangesAsync(cancellationToken);
        return Ok(id);
    }

    #endregion
}
