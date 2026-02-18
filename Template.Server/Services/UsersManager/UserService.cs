namespace Template.Server.Services.UsersManager;

public class UsersService(
    ApplicationDbContext db,
    IEmailService emailService,
    UserManager<User> userManager,
    IRevokedTokenService revokedTokenService,
    IOptions<JwtSettings> jwtOptions) : IUsersService
{
    private readonly JwtSettings _jwt = jwtOptions.Value;

    #region Get Users

    public async Task<Result<PagedResult<UserResponse>>> GetUsersAsync(
        PagedResultParams @params,
        CancellationToken cancellationToken)
    {
        IQueryable<User> query = db.Users
            .AsNoTracking()
            .Include(u => u.UserRoles)
                .ThenInclude(u => u.Role)
            .Include(u => u.Permissions)
            .AsSplitQuery();

        PagedResult<User> pagedUsers = await FetchSortedPagedResults<User>.GetSortedPagedResult(@params, query, cancellationToken);

        return Ok(new PagedResult<UserResponse>
        {
            Items = [.. pagedUsers.Items.Select(UserResponse.Map)],
            TotalCount = pagedUsers.TotalCount,
            PageNumber = pagedUsers.PageNumber,
            PageSize = pagedUsers.PageSize
        });
    }

    public async Task<Result<UserResponse>> GetUserByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        User? user = await db.Users
            .Where(u => u.Id == id)
            .AsNoTracking()
            .Include(u => u.UserRoles)
                .ThenInclude(u => u.Role)
                    .ThenInclude(r => r.Permissions)
            .Include(u => u.Permissions)
            .AsSplitQuery()
            .FirstOrDefaultAsync(cancellationToken);

        if (user == null)
        {
            return NotFound<UserResponse>("User not found");
        }

        return Ok(UserResponse.Map(user));
    }

    #endregion

    #region User Creation & Updates

    public async Task<Result<UserResponse>> CreateUserAsync(CreateUserRequest request, CancellationToken cancellationToken)
    {
        User user = new()
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            UserName = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Status = (UserStatus)request.Status,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            UserRoles = []
        };

        IdentityResult result = await userManager.CreateAsync(user, "TempPassword123!");
        if (!result.Succeeded)
        {
            return new Result<UserResponse>(
                HttpStatusCode.BadRequest,
                FieldErrors: new Dictionary<string, string[]>
                {
                    { nameof(User.Email), new[] { $"User witn email '{request.Email}' already exists." } }
                });
        }

        await UpdateUserRoleAsync(user, request.RoleId, cancellationToken);
        await SendConfirmationEmailAsync(user);

        return Ok(UserResponse.Map(user));
    }

    public async Task<Result<UserResponse>> UpdateUserAsync(Guid id, UpdateUserRequest request, CancellationToken cancellationToken)
    {
        User? user = await db.Users
            .Where(u => u.Id == id)
            .Include(u => u.Permissions)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .AsSplitQuery()
            .FirstOrDefaultAsync(cancellationToken);

        if (user == null)
        {
            return NotFound<UserResponse>("User not found");
        }

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Avatar = request.Avatar;
        user.UpdatedAt = DateTime.UtcNow;

        if (request.Status.HasValue)
        {
            user.Status = (UserStatus)request.Status.Value;
        }

        if (request.RoleId.HasValue && user.UserRoles.FirstOrDefault()?.RoleId != request.RoleId.Value)
        {
            Role? role = await UpdateUserRoleAsync(user, request.RoleId, cancellationToken);
            if (role == null)
            {
                return NotFound<UserResponse>("Role not found");
            }
        }

        if (request.PermissionKeys != null)
        {
            user.Permissions.Clear();
            List<Permission> perms = await db.Permissions
                .Where(p => request.PermissionKeys.Contains(p.Key))
                .ToListAsync(cancellationToken);

            foreach (Permission p in perms)
            {
                user.Permissions.Add(p);
            }
        }

        IdentityResult updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            return BadRequest<UserResponse>(string.Join(", ", updateResult.Errors.Select(e => e.Description)));
        }

        await db.SaveChangesAsync(cancellationToken);

        return Ok(UserResponse.Map(user));
    }

    #endregion

    #region Approve / Reject / Delete Users

    public async Task<Result<UserResponse>> ApproveUserAsync(Guid id, ApproveUserRequest request, CancellationToken cancellationToken)
    {
        User? user = await db.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user == null)
        {
            return NotFound<UserResponse>("User not found");
        }

        user.Status = UserStatus.Active;
        user.EmailConfirmed = true;
        user.UpdatedAt = DateTime.UtcNow;

        Role? role = await UpdateUserRoleAsync(user, request.RoleId, cancellationToken);
        if (role == null)
        {
            return NotFound<UserResponse>("Role not found");
        }

        await userManager.UpdateAsync(user);
        await db.SaveChangesAsync(cancellationToken);

        return Ok(UserResponse.Map(user));
    }

    public async Task<Result<Guid>> RejectUserAsync(Guid id, CancellationToken cancellationToken)
    {
        User? user = await db.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user == null)
        {
            return NotFound<Guid>("User not found");
        }

        user.Status = UserStatus.Inactive;
        user.UpdatedAt = DateTime.UtcNow;

        await userManager.UpdateAsync(user);
        await db.SaveChangesAsync(cancellationToken);

        return Ok(id);
    }

    public async Task<Result<Guid>> DeleteUserAsync(Guid id, CancellationToken cancellationToken)
    {
        User? user = await db.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user == null)
        {
            return NotFound<Guid>("User not found");
        }

        await userManager.DeleteAsync(user);
        revokedTokenService.RevokeUser(id, TimeSpan.FromHours(_jwt.ExpiryHours));
        await db.SaveChangesAsync(cancellationToken);

        return Ok(id);
    }

    #endregion

    #region Helpers

    private async Task<Role?> UpdateUserRoleAsync(User user, Guid? roleId, CancellationToken cancellationToken)
    {
        Role? role = await db.Roles.FirstOrDefaultAsync(r => r.Id == roleId, cancellationToken);
        if (role == null)
        {
            return null;
        }

        IList<string> currentRoles = await userManager.GetRolesAsync(user);
        await userManager.RemoveFromRolesAsync(user, currentRoles);

        string roleNameToAdd = !string.IsNullOrEmpty(role.NormalizedName)
            ? role.NormalizedName
            : role.Name!.ToUpperInvariant();

        await userManager.AddToRoleAsync(user, roleNameToAdd);
        return role;
    }

    private async Task SendConfirmationEmailAsync(User user)
    {
        string token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        string link = $"https://yourclient.example/confirm-email?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(user.Email!)}";

        await emailService.SendAsync(
            user.Email!,
            "Welcome! Confirm your email",
            PasswordResetEmailService.ConfirmationHtml(user.FirstName, user.LastName, link),
            PasswordResetEmailService.ConfirmationPlainText(user.FirstName, user.LastName, link));
    }

    #endregion
}
