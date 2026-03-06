import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import { auditService } from "@/services/entities/auditService";
import { queryKeys } from "@/config/queryClient";
import {
  PageQuery,
  QueryBuilder,
  AuditLog,
  PagedResult,
  ApiResponse,
} from "@/models";

const DEFAULT_PAGE_SIZE = 10;

export const useAuditQuery = (initialQuery?: PageQuery) => {
  const [query, setQuery] = useState<PageQuery>(
    initialQuery ?? { page: 1, pageSize: DEFAULT_PAGE_SIZE },
  );

  /* ---------- Query ---------- */
  const listQuery = useQuery<ApiResponse<PagedResult<AuditLog>>, Error>({
    queryKey: queryKeys.audit.list(query),
    queryFn: async () => {
      const res = await auditService.getLogs(query);
      if (!res.success) {
        throw new Error(res.message || "Failed to load audit logs");
      }
      return res;
    },
    keepPreviousData: true,
  } as UseQueryOptions<ApiResponse<PagedResult<AuditLog>>, Error>);

  /* ---------- Pagination / Filters ---------- */
  const changePage = useCallback(
    (page: number) => setQuery((prev) => ({ ...prev, page })),
    [],
  );
  const changePageSize = useCallback(
    (pageSize: number) => setQuery({ page: 1, pageSize }),
    [],
  );

  const refreshWithParams = useCallback(
    (params: {
      searchTerm?: string;
      filters?: Record<string, string>;
      sortColumn?: string;
      ascending?: boolean;
    }) => {
      let qb = QueryBuilder.create()
        .page(1)
        .pageSize(query.pageSize ?? DEFAULT_PAGE_SIZE);

      if (params.searchTerm) qb = qb.search(params.searchTerm);
      if (params.filters) {
        Object.entries(params.filters).forEach(([k, v]) => {
          if (v && v !== "all") qb = qb.filter(k, v);
        });
      }
      if (params.sortColumn)
        qb = qb.sort(params.sortColumn, params.ascending ? "asc" : "desc");

      setQuery(qb.build());
    },
    [query.pageSize],
  );

  const clearFilters = useCallback(
    () => setQuery({ page: 1, pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE }),
    [query.pageSize],
  );

  /* ---------- Derived ---------- */
  const paginationResult = useMemo(
    () =>
      listQuery.data?.data ?? {
        items: [] as AuditLog[],
        totalCount: 0,
        pageNumber: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        totalPages: 0,
      },
    [listQuery.data?.data]
  );

  const paginationHandlers = useMemo(
    () => ({
      changePage,
      changePageSize,
      clearAll: clearFilters,
      refreshWithCurrentFilters: listQuery.refetch,
      refreshWithParams,
    }),
    [
      changePage,
      changePageSize,
      clearFilters,
      listQuery.refetch,
      refreshWithParams,
    ],
  );

  /* ---------- Return ---------- */
  return useMemo(
    () => ({
      auditLogs: paginationResult.items,
      paginationResult,
      isLoading: listQuery.isLoading,
      error: listQuery.error?.message ?? null,
      paginationHandlers,
      refetch: listQuery.refetch,
    }),
    [
      paginationResult,
      listQuery.isLoading,
      listQuery.error?.message,
      paginationHandlers,
      listQuery.refetch,
    ],
  );
};
