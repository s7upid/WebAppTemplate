namespace Template.Data.Data;

using System.Linq.Dynamic.Core;

public static class FetchSortedPagedResults<T>
{
    public static async Task<Template.Data.Common.PagedResult<T>> GetSortedPagedResult(
        PagedResultParams pageParams,
        IQueryable<T> query,
        CancellationToken token)
    {
        bool isEfQuery = query.Provider.GetType().Namespace?.StartsWith("Microsoft.EntityFrameworkCore.Query") == true;
        query = AddSearch(pageParams, query);
        query = AddFilters(pageParams, query);

        int totalCount = isEfQuery
            ? await query.CountAsync(token)
            : query.Count();

        if (string.IsNullOrEmpty(pageParams.SortColumn))
        {
            pageParams.SortColumn = typeof(T).GetProperties().FirstOrDefault()?.Name;
        }

        string sortExpression = pageParams.Ascending
            ? pageParams.SortColumn!
            : $"{pageParams.SortColumn} descending";

        query = (IQueryable<T>)query
            .OrderBy(sortExpression)
            .Skip((pageParams.Page - 1) * pageParams.PageSize)
            .Take(pageParams.PageSize);

        List<T> results = isEfQuery
            ? await query.ToListAsync(token)
            : [.. query];

        return new Template.Data.Common.PagedResult<T>
        {
            Items = results,
            TotalCount = totalCount,
            PageNumber = pageParams.Page,
            PageSize = pageParams.PageSize
        };
    }

    private static IQueryable<T> AddFilters(PagedResultParams pageParams, IQueryable<T> query)
    {
        if (pageParams.Filters != null && pageParams.Filters.Count > 0)
        {
            foreach (LambdaExpression lambda in pageParams.Filters)
            {
                query = query.Where((Expression<Func<T, bool>>)lambda);
            }
        }

        if (pageParams.Filter != null && pageParams.Filter.Count > 0)
        {
            foreach (var filter in pageParams.Filter)
            {
                string key = filter.Key;
                string value = filter.Value;

                PropertyInfo? prop = typeof(T).GetProperty(key, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                if (prop == null || string.IsNullOrWhiteSpace(value)) continue;

                ParameterExpression parameter = Expression.Parameter(typeof(T), "x");
                MemberExpression member = Expression.Property(parameter, prop);
                Expression body;

                if (prop.PropertyType == typeof(string))
                {
                    MethodInfo toLowerMethod = typeof(string).GetMethod("ToLower", Type.EmptyTypes)!;
                    var memberToLower = Expression.Call(member, toLowerMethod);
                    var valueExpr = Expression.Constant(value.ToLower());
                    MethodInfo containsMethod = typeof(string).GetMethod("Contains", [typeof(string)])!;
                    body = Expression.Call(memberToLower, containsMethod, valueExpr);
                }
                else if (prop.PropertyType.IsEnum)
                {
                    if (!Enum.TryParse(prop.PropertyType, value, ignoreCase: true, out object? enumValue))
                    {
                        continue;
                    }
                    body = Expression.Equal(member, Expression.Constant(enumValue));
                }
                else
                {
                    try
                    {
                        object typedValue = Convert.ChangeType(value, prop.PropertyType)!;
                        body = Expression.Equal(member, Expression.Constant(typedValue));
                    }
                    catch
                    {
                        continue;
                    }
                }

                var lambda = Expression.Lambda<Func<T, bool>>(body, parameter);
                query = query.Where(lambda);
            }
        }

        return query;
    }

    private static IQueryable<T> AddSearch(PagedResultParams pageParams, IQueryable<T> query)
    {
        if (!string.IsNullOrWhiteSpace(pageParams.SearchTerm))
        {
            string search = pageParams.SearchTerm.Trim();
            ParameterExpression parameter = Expression.Parameter(typeof(T), "x");
            Expression? combined = null;

            void AddContainsExpression(PropertyInfo prop, Expression parent)
            {
                bool isSearchable = prop.GetCustomAttribute<SearchableAttribute>() != null;
                if (!isSearchable) return;

                if (prop.PropertyType == typeof(string))
                {
                    MemberExpression member = Expression.Property(parent, prop);
                    MethodInfo? method = typeof(string).GetMethod("Contains", [typeof(string)]);
                    MethodCallExpression call = Expression.Call(member, method!, Expression.Constant(search));
                    combined = combined == null ? call : Expression.OrElse(combined, call);
                }
                else if (!prop.PropertyType.IsValueType && prop.PropertyType != typeof(string))
                {

                    foreach (PropertyInfo nestedProp in prop.PropertyType.GetProperties())
                    {
                        AddContainsExpression(nestedProp, Expression.Property(parent, prop));
                    }
                }
            }

            foreach (PropertyInfo prop in typeof(T).GetProperties())
            {
                AddContainsExpression(prop, parameter);
            }

            if (combined != null)
            {
                Expression<Func<T, bool>> lambda = Expression.Lambda<Func<T, bool>>(combined, parameter);
                query = query.Where(lambda);
            }
        }

        return query;
    }
}
