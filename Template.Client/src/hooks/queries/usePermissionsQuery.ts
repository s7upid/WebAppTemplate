import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import { permissionService } from "@/services/entities/permissionService";
import { queryKeys } from "@/config/queryClient";
import {
  PageQuery,
  QueryBuilder,
  PermissionResponse,
  PagedResult,
  ApiResponse,
} from "@/models";

const DEFAULT_PAGE_SIZE = 100;

export const usePermissionsQuery = (initialQuery?: PageQuery) => {
  const [query, setQuery] = useState<PageQuery>(
    initialQuery ?? { page: 1, pageSize: DEFAULT_PAGE_SIZE },
  );

  /* ---------- Permissions List Query ---------- */
  const listQuery = useQuery<
    ApiResponse<PagedResult<PermissionResponse>>,
    Error
  >({
    queryKey: queryKeys.permissions.list(query),
    queryFn: () => permissionService.getPermissions(query),
    staleTime: 10 * 60 * 1000,
    keepPreviousData: true,
  } as UseQueryOptions<ApiResponse<PagedResult<PermissionResponse>>, Error>);

  /* ---------- Pagination / Filters ---------- */
  const changePage = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  }, []);

  const changePageSize = useCallback((pageSize: number) => {
    setQuery({ page: 1, pageSize });
  }, []);

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

      params.filters &&
        Object.entries(params.filters).forEach(([k, v]) => {
          if (v && v !== "all") qb = qb.filter(k, v);
        });

      if (params.sortColumn) {
        qb = qb.sort(params.sortColumn, params.ascending ? "asc" : "desc");
      }

      setQuery(qb.build());
    },
    [query.pageSize],
  );

  const clearFilters = useCallback(() => {
    setQuery({ page: 1, pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE });
  }, [query.pageSize]);

  /* ---------- Derived State ---------- */
  const paginationResult = listQuery.data?.data ?? {
    items: [] as PermissionResponse[],
    totalCount: 0,
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 0,
  };

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

  /* ---------- Public API ---------- */
  return useMemo(
    () => ({
      permissions: paginationResult.items,
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

/* ---------- Hook for fetching all permissions at once ---------- */
export const useAllPermissions = () => {
  const { data, isLoading, error } = useQuery<
    ApiResponse<PagedResult<PermissionResponse>>,
    Error
  >({
    queryKey: queryKeys.permissions.list({ page: 1, pageSize: 1000 }),
    queryFn: () =>
      permissionService.getPermissions({ page: 1, pageSize: 1000 }),
    staleTime: 10 * 60 * 1000,
  } as UseQueryOptions<ApiResponse<PagedResult<PermissionResponse>>, Error>);

  return useMemo(
    () => ({
      permissions: data?.data?.items ?? [],
      isLoading,
      error: error?.message ?? null,
    }),
    [data?.data?.items, isLoading, error?.message],
  );
};
