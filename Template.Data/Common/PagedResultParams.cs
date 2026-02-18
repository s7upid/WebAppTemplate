namespace Template.Data.Common;

public class PagedResultParams
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortColumn { get; set; }
    public bool Ascending { get; set; } = true;
    public string? SearchTerm { get; set; }
    public List<LambdaExpression>? Filters { get; set; }
    public Dictionary<string, string>? Filter { get; set; }
}
