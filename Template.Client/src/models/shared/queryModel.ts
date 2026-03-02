import { useCallback, useState, useMemo } from "react";

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

export const useQueryBuilder = (initial?: PageQuery) => {
  const [builder, setBuilder] = useState(() => QueryBuilder.create(initial));

  const setPage = useCallback(
    (page: number) => setBuilder((b) => b.page(page)),
    []
  );
  const setPageSize = useCallback(
    (size: number) => setBuilder((b) => b.pageSize(size)),
    []
  );
  const setSearch = useCallback(
    (term: string) => setBuilder((b) => b.search(term)),
    []
  );
  const setFilter = useCallback(
    (
      key: string,
      value: FilterExpression["value"],
      operator?: FilterExpression["operator"]
    ) => setBuilder((b) => b.filter(key, value, operator)),
    []
  );
  const removeFilter = useCallback(
    (key: string) => setBuilder((b) => b.removeFilter(key)),
    []
  );
  const clearFilters = useCallback(
    () => setBuilder((b) => b.clearFilters()),
    []
  );
  const setSort = useCallback(
    (field: string, direction: "asc" | "desc" = "asc") =>
      setBuilder((b) => b.sort(field, direction)),
    []
  );
  const reset = useCallback(() => setBuilder((b) => b.reset()), []);

  const query = useMemo(() => builder.build(), [builder]);
  const queryString = useMemo(() => builder.buildQueryParams(), [builder]);

  return {
    builder,
    query,
    queryString,
    setPage,
    setPageSize,
    setSearch,
    setFilter,
    removeFilter,
    clearFilters,
    setSort,
    reset,
  };
};

interface UserQueryOptions {
  role?: string;
  status?: string;
  isActive?: boolean;
}

export const createUserQuery = (options?: UserQueryOptions): QueryBuilder => {
  let qb = QueryBuilder.create();
  if (options?.role && options.role !== "all") {
    qb = qb.filter("role", options.role);
  }
  if (options?.status && options.status !== "all") {
    qb = qb.filter("status", options.status);
  }
  if (options?.isActive !== undefined) {
    qb = qb.filter("isActive", options.isActive);
  }
  return qb;
};

interface RoleQueryOptions {
  isSystem?: boolean;
  hasUsers?: boolean;
}

export const createRoleQuery = (options?: RoleQueryOptions): QueryBuilder => {
  let qb = QueryBuilder.create();
  if (options?.isSystem !== undefined) {
    qb = qb.filter("isSystem", options.isSystem);
  }
  if (options?.hasUsers !== undefined) {
    qb = qb.filter("hasUsers", options.hasUsers);
  }
  return qb;
};
