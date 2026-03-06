import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUsersQuery, useUserQuery } from "./useUsersQuery";
import { userService } from "@/services/entities/userService";
import { UserResponse, UserStatus } from "@/models";

// Mock the userService
jest.mock("@/services/entities/userService", () => ({
  userService: {
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    approveUser: jest.fn(),
    rejectUser: jest.fn(),
    updateProfile: jest.fn(),
  },
}));

const mockUserService = userService as jest.Mocked<typeof userService>;

const mockUser: UserResponse = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  avatar: undefined,
  permissions: [],
  permissionKeys: [],
  customPermissionsCount: 0,
  isActive: true,
  userStatus: UserStatus.Active,
  role: undefined,
};

const mockPaginatedResponse = {
  success: true,
  data: {
    items: [mockUser],
    totalCount: 1,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
  },
  message: "",
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useUsersQuery", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("fetching users", () => {
    it("fetches users on mount", async () => {
      mockUserService.getUsers.mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useUsersQuery(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.users).toHaveLength(1);
      expect(result.current.users[0].firstName).toBe("John");
      expect(mockUserService.getUsers).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
      });
    });

    it("handles fetch error", async () => {
      mockUserService.getUsers.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useUsersQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.error?.message).toBe("Network error");
    });
  });

  describe("pagination", () => {
    it("changes page", async () => {
      mockUserService.getUsers.mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useUsersQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => result.current.paginationHandlers.changePage(2));

      await waitFor(() =>
        expect(mockUserService.getUsers).toHaveBeenCalledWith(
          expect.objectContaining({ page: 2 }),
        ),
      );
    });

    it("changes page size", async () => {
      mockUserService.getUsers.mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useUsersQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => result.current.paginationHandlers.changePageSize(25));

      await waitFor(() =>
        expect(mockUserService.getUsers).toHaveBeenCalledWith(
          expect.objectContaining({ pageSize: 25, page: 1 }),
        ),
      );
    });

    it("clears filters", async () => {
      mockUserService.getUsers.mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(
        () => useUsersQuery({ page: 2, pageSize: 10, searchTerm: "test" }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      act(() => result.current.paginationHandlers.clearAll());

      await waitFor(() =>
        expect(mockUserService.getUsers).toHaveBeenLastCalledWith(
          expect.objectContaining({ page: 1 }),
        ),
      );
    });
  });

  describe("mutations", () => {
    it("creates user", async () => {
      mockUserService.getUsers.mockResolvedValue(mockPaginatedResponse);
      mockUserService.createUser.mockResolvedValue({
        success: true,
        data: mockUser,
        message: "",
      });

      const { result } = renderHook(() => useUsersQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const createResult = await result.current.add({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        roleId: "role-1",
        status: 0,
      });

      expect(createResult.success).toBe(true);
      expect(mockUserService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: "Jane", lastName: "Doe" }),
      );
    });

    it("updates user", async () => {
      mockUserService.getUsers.mockResolvedValue(mockPaginatedResponse);
      mockUserService.updateUser.mockResolvedValue({
        success: true,
        data: { ...mockUser, firstName: "Updated" },
        message: "",
      });

      const { result } = renderHook(() => useUsersQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const updateResult = await result.current.edit({
        id: "1",
        data: {
          firstName: "Updated",
          lastName: "Doe",
          avatar: undefined,
          roleId: "role-1",
          permissionKeys: [],
          status: 0,
        },
      });

      expect(updateResult.success).toBe(true);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({ firstName: "Updated", lastName: "Doe" }),
      );
    });

    it("deletes user", async () => {
      mockUserService.getUsers.mockResolvedValue(mockPaginatedResponse);
      mockUserService.deleteUser.mockResolvedValue({
        success: true,
        data: "",
        message: "",
      });

      const { result } = renderHook(() => useUsersQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const deleteResult = await result.current.remove("1");

      expect(deleteResult.success).toBe(true);
      expect(mockUserService.deleteUser).toHaveBeenCalledWith("1");
    });

    it("approves user", async () => {
      mockUserService.getUsers.mockResolvedValue(mockPaginatedResponse);
      mockUserService.approveUser.mockResolvedValue({
        success: true,
        data: mockUser,
        message: "",
      });

      const { result } = renderHook(() => useUsersQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const approveResult = await result.current.approveUser("1", {
        roleId: "role-1",
      });

      expect(approveResult.success).toBe(true);
      expect(mockUserService.approveUser).toHaveBeenCalledWith(
        "1",
        { roleId: "role-1" },
      );
    });

    it("rejects user", async () => {
      mockUserService.getUsers.mockResolvedValue(mockPaginatedResponse);
      mockUserService.rejectUser.mockResolvedValue({
        success: true,
        data: "",
        message: "",
      });

      const { result } = renderHook(() => useUsersQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const rejectResult = await result.current.rejectUser("1");

      expect(rejectResult.success).toBe(true);
      expect(mockUserService.rejectUser).toHaveBeenCalledWith("1");
    });

    it("updateProfile succeeds", async () => {
      mockUserService.getUsers.mockResolvedValue(mockPaginatedResponse);
      mockUserService.updateProfile.mockResolvedValue({
        success: true,
        data: { ...mockUser, firstName: "Updated" },
        message: "",
      });

      const { result } = renderHook(() => useUsersQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const updateResult = await result.current.updateProfile({
        firstName: "Updated",
        lastName: "Doe",
        avatar: undefined,
        roleId: "role-1",
        permissionKeys: [],
        status: 0,
      });

      expect(updateResult.success).toBe(true);
      expect(mockUserService.updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: "Updated", lastName: "Doe" }),
      );
    });

    it("create user returns error on failure", async () => {
      mockUserService.getUsers.mockResolvedValue(mockPaginatedResponse);
      mockUserService.createUser.mockResolvedValue({
        success: false,
        data: null as unknown as UserResponse,
        message: "Email already exists",
      });

      const { result } = renderHook(() => useUsersQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const createResult = await result.current.add({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        roleId: "role-1",
        status: 0,
      });

      expect(createResult.success).toBe(false);
      expect(createResult.message).toBe("Email already exists");
      expect(mockUserService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ email: "jane@example.com" }),
      );
    });

    it("update user returns error on failure", async () => {
      mockUserService.getUsers.mockResolvedValue(mockPaginatedResponse);
      mockUserService.updateUser.mockResolvedValue({
        success: false,
        data: null as unknown as UserResponse,
        message: "User not found",
      });

      const { result } = renderHook(() => useUsersQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const updateResult = await result.current.edit({
        id: "999",
        data: {
          firstName: "Updated",
          lastName: "Doe",
          avatar: undefined,
          roleId: "role-1",
          permissionKeys: [],
          status: 0,
        },
      });

      expect(updateResult.success).toBe(false);
      expect(updateResult.message).toBe("User not found");
      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        "999",
        expect.objectContaining({ firstName: "Updated" }),
      );
    });

    it("delete user returns error on failure", async () => {
      mockUserService.getUsers.mockResolvedValue(mockPaginatedResponse);
      mockUserService.deleteUser.mockResolvedValue({
        success: false,
data: null as unknown as string,
          message: "Cannot delete user",
      });

      const { result } = renderHook(() => useUsersQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const deleteResult = await result.current.remove("1");

      expect(deleteResult.success).toBe(false);
      expect(deleteResult.message).toBe("Cannot delete user");
      expect(mockUserService.deleteUser).toHaveBeenCalledWith("1");
    });

    it("approve user returns error on failure", async () => {
      mockUserService.getUsers.mockResolvedValue(mockPaginatedResponse);
      mockUserService.approveUser.mockResolvedValue({
        success: false,
        data: null as unknown as UserResponse,
        message: "User already approved",
      });

      const { result } = renderHook(() => useUsersQuery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      const approveResult = await result.current.approveUser("1", {
        roleId: "role-1",
      });

      expect(approveResult.success).toBe(false);
      expect(approveResult.message).toBe("User already approved");
      expect(mockUserService.approveUser).toHaveBeenCalledWith("1", {
        roleId: "role-1",
      });
    });
  });
});

describe("useUserQuery", () => {
  beforeEach(() => jest.clearAllMocks());

  it("fetches single user by id", async () => {
    mockUserService.getUserById.mockResolvedValue({
      success: true,
      data: mockUser,
      message: "",
    });

    const { result } = renderHook(() => useUserQuery("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user?.firstName).toBe("John");
    expect(mockUserService.getUserById).toHaveBeenCalledWith("1");
  });

  it("does not fetch when id is undefined", async () => {
    const { result } = renderHook(() => useUserQuery(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockUserService.getUserById).not.toHaveBeenCalled();
  });

  it("handles fetch error", async () => {
    mockUserService.getUserById.mockRejectedValue(new Error("User not found"));

    const { result } = renderHook(() => useUserQuery("999"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error?.message).toBe("User not found");
  });
});
