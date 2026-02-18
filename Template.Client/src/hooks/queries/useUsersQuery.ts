import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useState } from "react";
import { userService } from "@/services/entities/userService";
import { queryKeys } from "@/config/queryClient";
import {
  PageQuery,
  QueryBuilder,
  CreateUserRequest,
  UpdateUserRequest,
  ApproveUserRequest,
  UserResponse,
  PagedResult,
  ApiResponse,
} from "@/models";

export const useUsersQuery = (initialQuery?: PageQuery) => {
  const queryClient = useQueryClient();

  const [query, setQuery] = useState<PageQuery>(
    initialQuery ?? { page: 1, pageSize: 10 },
  );

  /* ---------- Users List Query ---------- */

  const listQuery = useQuery<ApiResponse<PagedResult<UserResponse>>, Error>({
    queryKey: queryKeys.users.list(query),
    queryFn: () => userService.getUsers(query),
    keepPreviousData: true,
  } as UseQueryOptions<ApiResponse<PagedResult<UserResponse>>, Error>);

  /* ---------- Mutations ---------- */

  const createMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userService.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() }),
  });

  const approveMutation = useMutation({
    mutationFn: ({
      userId,
      request,
    }: {
      userId: string;
      request: ApproveUserRequest;
    }) => userService.approveUser(userId, request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() }),
  });

  const rejectMutation = useMutation({
    mutationFn: userService.rejectUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() }),
  });

  const updateProfileMutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() }),
  });

  /* ---------- Pagination / Filters ---------- */

  const changePage = (page: number) => setQuery((q) => ({ ...q, page }));

  const changePageSize = (pageSize: number) => setQuery({ page: 1, pageSize });

  const refreshWithCurrentFilters = () => listQuery.refetch();

  const refreshWithParams = (params: {
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
        if (v && v !== "all") qb = qb.filter(k, v);
      });

    if (params.sortColumn) {
      qb = qb.sort(params.sortColumn, params.ascending ? "asc" : "desc");
    }

    setQuery(qb.build());
  };

  const clearFilters = () =>
    setQuery({ page: 1, pageSize: query.pageSize ?? 10 });

  /* ---------- Derived State ---------- */

  const paginationResult = listQuery.data?.data ?? {
    items: [] as UserResponse[],
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
    approveMutation.isPending ||
    rejectMutation.isPending ||
    updateProfileMutation.isPending;

  /* ---------- Actions ---------- */

  const add = (data: CreateUserRequest) => createMutation.mutateAsync(data);

  const edit = ({ id, data }: { id: string; data: UpdateUserRequest }) =>
    updateMutation.mutateAsync({ id, data });

  const remove = (id: string) => deleteMutation.mutateAsync(id);

  const approveUser = (userId: string, request: ApproveUserRequest) =>
    approveMutation.mutateAsync({ userId, request });

  const rejectUser = (userId: string) => rejectMutation.mutateAsync(userId);

  const updateProfile = (data: UpdateUserRequest) =>
    updateProfileMutation.mutateAsync(data);

  /* ---------- Public API ---------- */

  return {
    users: paginationResult.items,
    paginationResult,
    isLoading,
    error: listQuery.error ?? null,
    refetch: refreshWithCurrentFilters,

    add,
    edit,
    remove,
    approveUser,
    rejectUser,
    updateProfile,

    paginationHandlers: {
      changePage,
      changePageSize,
      clearAll: clearFilters,
      refreshWithCurrentFilters,
      refreshWithParams,
    },

    mutations: {
      create: createMutation,
      update: updateMutation,
      delete: deleteMutation,
      approve: approveMutation,
      reject: rejectMutation,
      updateProfile: updateProfileMutation,
    },
  };
};

/* ---------- Single User Query ---------- */

export const useUserQuery = (id?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<ApiResponse<UserResponse>, Error>({
    queryKey: id ? queryKeys.users.detail(id) : ["users", "detail", "empty"],
    queryFn: () => userService.getUserById(id!),
    enabled: !!id,
  } as UseQueryOptions<ApiResponse<UserResponse>, Error>);

  const setUser = (user: UserResponse) => {
    queryClient.setQueryData(queryKeys.users.detail(user.id), user);
  };

  return {
    user: query.data?.data,
    isLoading: query.isLoading,
    error: query.error ?? null,
    refetch: query.refetch,
    setUser,
  };
};
