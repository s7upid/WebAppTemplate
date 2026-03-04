export interface PageQuery {
  page: number;
  pageSize: number;
  sortColumn?: string;
  ascending?: boolean;
  filters?: FilterExpression[];
  searchTerm?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

/** Empty paged result for loading/fallback state. */
export function createEmptyPagedResult<T>(pageSize = 10): PagedResult<T> {
  return {
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize,
    totalPages: 0,
  };
}

export interface FilterExpression {
  property: string;
  operator:
    | "equals"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "greaterThan"
    | "lessThan"
    | "greaterThanOrEqual"
    | "lessThanOrEqual"
    | "in";
  value: string | number | boolean | string[] | number[];
}

export class QueryBuilder {
  private readonly query: PageQuery;

  private constructor(query?: PageQuery) {
    const defaults = { page: 1, pageSize: 10, filters: [] };
    this.query = query ? { ...defaults, ...query } : defaults;
  }

  public static create(initial?: PageQuery): QueryBuilder {
    return new QueryBuilder(initial);
  }

  page(page: number): QueryBuilder {
    return new QueryBuilder({ ...this.query, page });
  }

  pageSize(pageSize: number): QueryBuilder {
    return new QueryBuilder({ ...this.query, page: 1, pageSize });
  }

  search(searchTerm?: string): QueryBuilder {
    const term = searchTerm?.trim();
    return new QueryBuilder({ ...this.query, page: 1, searchTerm: term });
  }

  filter(
    key: string,
    value: FilterExpression["value"],
    operator: FilterExpression["operator"] = "equals"
  ): QueryBuilder {
    const otherFilters =
      this.query.filters?.filter((f) => f.property !== key) || [];
    const newFilters = [...otherFilters, { property: key, operator, value }];
    return new QueryBuilder({ ...this.query, page: 1, filters: newFilters });
  }

  removeFilter(key: string): QueryBuilder {
    const newFilters =
      this.query.filters?.filter((f) => f.property !== key) || [];
    return new QueryBuilder({ ...this.query, filters: newFilters });
  }

  clearFilters(): QueryBuilder {
    return new QueryBuilder({ ...this.query, filters: [] });
  }

  sort(field: string, direction: "asc" | "desc" = "asc"): QueryBuilder {
    return new QueryBuilder({
      ...this.query,
      sortColumn: field,
      ascending: direction === "asc",
    });
  }

  reset(): QueryBuilder {
    return new QueryBuilder();
  }

  build(): PageQuery {
    return { ...this.query };
  }

  buildQueryParams(): string {
    const params = new URLSearchParams();

    params.append("page", this.query.page.toString());
    params.append("pageSize", this.query.pageSize.toString());

    if (this.query.searchTerm?.trim()) {
      params.append("searchTerm", encodeURIComponent(this.query.searchTerm.trim()));
    }

    if (this.query.sortColumn) {
      params.append("sortColumn", encodeURIComponent(this.query.sortColumn));
      params.append("ascending", this.query.ascending ? "true" : "false");
    }

    if (this.query.filters?.length) {
      this.query.filters.forEach((f) => {
        const key =
          f.operator === "equals"
            ? `filter[${encodeURIComponent(f.property)}]`
            : `filter[${encodeURIComponent(f.property)}][${encodeURIComponent(
                f.operator
              )}]`;

        let value: string;
        if (Array.isArray(f.value)) {
          value = f.value.map((v) => encodeURIComponent(String(v))).join(",");
        } else {
          value = encodeURIComponent(String(f.value));
        }

        params.append(key, value);
      });
    }

    return params.toString();
  }
}

