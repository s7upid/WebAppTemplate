namespace Template.Data.Common;

public record Result<T>(
    HttpStatusCode StatusCode,
    string? ErrorMessage = null,
    T? Data = default,
    Dictionary<string, string[]>? FieldErrors = null)
{
    public bool IsSuccessful => (int)StatusCode >= 200 && (int)StatusCode < 300;
}
