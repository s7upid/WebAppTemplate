namespace Template.Data.Services;

public class AuditContextProvider(IHttpContextAccessor accessor, UserManager<User> userManager) : IAuditContextProvider
{
    public Guid? GetCurrentUserId
    {
        get
        {
            var user = accessor.HttpContext?.User;
            if (user == null) return null;

            // Get the Identity user object
            var identityUser = userManager.GetUserAsync(user).GetAwaiter().GetResult();
            return identityUser?.Id;
        }
    }
}
