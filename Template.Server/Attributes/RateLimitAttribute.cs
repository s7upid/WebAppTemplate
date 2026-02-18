namespace Template.Server.Attributes;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public class RateLimitAttribute(int maxRequests, int windowMinutes, string? keyGenerator = null) : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        IRateLimitService rateLimitService = context.HttpContext.RequestServices.GetRequiredService<IRateLimitService>();
        ILogger<RateLimitAttribute> logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<RateLimitAttribute>>();

        string key = GenerateKey(context);

        // Await async call
        if (await rateLimitService.IsRateLimitedAsync(key, maxRequests, TimeSpan.FromMinutes(windowMinutes), context.HttpContext.RequestAborted))
        {
            string ip = GetClientIpAddress(context.HttpContext);

            logger.LogWarning("Rate limit exceeded for key {Key} from IP {IpAddress}", key, ip);

            context.Result = new ObjectResult(new
            {
                success = false,
                message = $"Rate limit exceeded. Maximum {maxRequests} requests per {windowMinutes} minutes."
            })
            {
                StatusCode = 429
            };
            return;
        }

        await rateLimitService.IncrementCounterAsync(key, TimeSpan.FromMinutes(windowMinutes), context.HttpContext.RequestAborted);

        await next();
    }

    private string GenerateKey(ActionExecutingContext context)
    {
        if (!string.IsNullOrEmpty(keyGenerator))
        {
            return keyGenerator!;
        }

        string ipAddress = GetClientIpAddress(context.HttpContext);
        string? userId = context.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier) ??
                     context.HttpContext.User?.FindFirstValue(JwtRegisteredClaimNames.Sub);

        return string.IsNullOrEmpty(userId) ? ipAddress : $"{ipAddress}_{userId}";
    }

    private static string GetClientIpAddress(HttpContext context)
    {
        return context.Request.Headers["X-Forwarded-For"].FirstOrDefault() ??
               context.Request.Headers["X-Real-IP"].FirstOrDefault() ??
               context.Connection.RemoteIpAddress?.ToString() ??
               "unknown";
    }
}
