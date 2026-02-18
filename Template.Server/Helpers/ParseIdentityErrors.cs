namespace Template.Server.Helpers;

public static class ParseIdentityErrors
{
    public static Dictionary<string, string[]> ParseErrors(IdentityResult result)
    {
        var errors = new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase);

        foreach (var e in result.Errors)
        {
            var key = string.IsNullOrWhiteSpace(e.Code) ? "General" : e.Code;

            if (!errors.TryGetValue(key, out string[]? value))
            {
                errors[key] = [e.Description];
            }
            else
            {
                errors[key] = [.. value, e.Description];
            }
        }

        return errors;
    }
}
