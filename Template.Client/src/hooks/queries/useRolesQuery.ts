import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import { roleService } from "@/services/entities/roleService";
import { queryKeys } from "@/config/queryClient";
import {
  PageQuery,
  QueryBuilder,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleResponse,
} from "@/models";

/* ------------------ Roles List Hook ------------------ */
export const useRolesQuery = (initialQuery?: PageQuery) => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState<PageQuery>(
    initialQuery ?? { page: 1, pageSize: 10 },
  );

  /* ---------- Roles List Query ---------- */
  const listQuery = useQuery({
    queryKey: queryKeys.roles.list(query),
    queryFn: () => roleService.getRoles(query),
  });

  /* ---------- Mutations ---------- */
  const createMutation = useMutation({
    mutationFn: (data: CreateRoleRequest) => roleService.createRole(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) =>
      roleService.updateRole(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.detail(id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => roleService.deleteRole(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() }),
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: ({
      roleId,
      permissionIds,
    }: {
      roleId: string;
      permissionIds: string[];
    }) => roleService.updateRolePermissions(roleId, permissionIds),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.detail(roleId),
      });
    },
  });

  /* ---------- Pagination ---------- */
  const changePage = useCallback(
    (newPage: number) => setQuery((q) => ({ ...q, page: newPage })),
    [],
  );
  const changePageSize = useCallback(
    (pageSize: number) => setQuery((q) => ({ ...q, page: 1, pageSize })),
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
        .pageSize(query.pageSize ?? 10);
      if (params.searchTerm) qb = qb.search(params.searchTerm);
      params.filters &&
        Object.entries(params.filters).forEach(([k, v]) => {
          if (v && v !== "all" && v !== "") qb = qb.filter(k, v);
        });
      if (params.sortColumn)
        qb = qb.sort(params.sortColumn, params.ascending ? "asc" : "desc");
      setQuery(qb.build());
    },
    [query.pageSize],
  );
  const clearFilters = useCallback(
    () => setQuery({ page: 1, pageSize: query.pageSize ?? 10 }),
    [query.pageSize],
  );
  const refreshWithCurrentFilters = listQuery.refetch;

  /* ---------- Derived Data ---------- */
  const paginationResult = listQuery.data?.data ?? {
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
  };
  const isLoading =
    listQuery.isLoading ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    updatePermissionsMutation.isPending;

  const error =
    listQuery.error?.message ??
    createMutation.error?.message ??
    updateMutation.error?.message ??
    deleteMutation.error?.message ??
    null;

  /* ---------- CRUD Handlers ---------- */
  const add = useCallback(
    async (data: CreateRoleRequest) => {
      const result = await createMutation.mutateAsync(data);
      return {
        success: result.success,
        data: result.data,
        error: result.message,
      };
    },
    [createMutation],
  );

  const edit = useCallback(
    async ({ id, data }: { id: string; data: UpdateRoleRequest }) => {
      const result = await updateMutation.mutateAsync({ id, data });
      return {
        success: result.success,
        data: result.data,
        error: result.message,
      };
    },
    [updateMutation],
  );

  const remove = useCallback(
    async (id: string) => {
      const result = await deleteMutation.mutateAsync(id);
      return { success: result.success, error: result.message };
    },
    [deleteMutation],
  );

  const updatePermissions = useCallback(
    async (roleId: string, permissionIds: string[]) => {
      const result = await updatePermissionsMutation.mutateAsync({
        roleId,
        permissionIds,
      });
      return {
        success: result.success,
        data: result.data,
        error: result.message,
      };
    },
    [updatePermissionsMutation],
  );

  /* ---------- Memoized Handlers & Mutations ---------- */
  const paginationHandlers = useMemo(
    () => ({
      changePage,
      changePageSize,
      clearAll: clearFilters,
      refreshWithCurrentFilters,
      refreshWithParams,
    }),
    [
      changePage,
      changePageSize,
      clearFilters,
      refreshWithCurrentFilters,
      refreshWithParams,
    ],
  );

  const mutations = useMemo(
    () => ({
      create: createMutation,
      update: updateMutation,
      delete: deleteMutation,
      updatePermissions: updatePermissionsMutation,
    }),
    [createMutation, updateMutation, deleteMutation, updatePermissionsMutation],
  );

  /* ---------- Return API ---------- */
  return useMemo(
    () => ({
      roles: paginationResult.items as RoleResponse[],
      paginationResult,
      isLoading,
      error,
      add,
      edit,
      remove,
      updatePermissions,
      paginationHandlers,
      mutations,
      refetch: refreshWithCurrentFilters,
    }),
    [
      paginationResult,
      isLoading,
      error,
      add,
      edit,
      remove,
      updatePermissions,
      paginationHandlers,
      mutations,
      refreshWithCurrentFilters,
    ],
  );
};

/* ------------------ Single Role Hook ------------------ */
export const useRoleQuery = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: id
      ? queryKeys.roles.detail(id)
      : ["roles", "detail", "undefined"],
    queryFn: () => roleService.getRoleById(id!),
    enabled: !!id,
  });

  const setRole = useCallback(
    (role: RoleResponse) => {
      queryClient.setQueryData(queryKeys.roles.detail(role.id), {
        success: true,
        data: role,
      });
    },
    [queryClient],
  );

  return useMemo(
    () => ({
      role: data?.data as RoleResponse | undefined,
      isLoading,
      error: error?.message ?? null,
      refetch,
      setRole,
    }),
    [data?.data, isLoading, error?.message, refetch, setRole],
  );
};
