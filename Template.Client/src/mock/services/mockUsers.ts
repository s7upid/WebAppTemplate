import {
  ApiResponse,
  PagedResult,
  UserResponse,
  PageQuery,
  CreateUserRequest,
  UpdateUserRequest,
  Role,
  UserStatus,
} from "@/models";
import {
  mockUsers,
  mockRoles,
  createSuccessResponse,
  paginateData,
} from "@/mock";

export class MockUsers {
  private normalizeUser(u: UserResponse): UserResponse {
    return { ...u, role: u.role } as UserResponse;
  }

  private convertToUserResponse(u: UserResponse): UserResponse {
    return {
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      customPermissionsCount: u.permissions?.length || 0,
      isActive: u.isActive,
      userStatus: u.userStatus,
      lastLogin: u.lastLogin,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      avatar: u.avatar,
      permissionKeys: u.permissionKeys,
      permissions: u.permissions,
      role: u.role,
    };
  }
  async getUsers(
    query: PageQuery
  ): Promise<ApiResponse<PagedResult<UserResponse>>> {

    const { searchTerm, filters, sortColumn, ascending } = query as any;
    const page = (query as any).page ?? (query as any).pageNumber ?? 1;
    const pageSize = (query as any).pageSize ?? (query as any).size ?? 10;

    let roleFilter: unknown | undefined;
    let statusFilter: unknown | undefined;
    let effectiveSearch: string | undefined = searchTerm as string | undefined;
    if (filters?.length) {
      for (const filter of filters) {
        if (filter.property === "role") roleFilter = filter.value;
        if (filter.property === "status") statusFilter = filter.value;
        if (!effectiveSearch && filter.property === "search") {
          effectiveSearch = String(filter.value || "");
        }
      }
    }

    let items = [...mockUsers];

    if (statusFilter && statusFilter !== "all") {
      items = items.filter((u) => u.userStatus === statusFilter);
    }

    if (roleFilter && roleFilter !== "all") {
      items = items.filter(
        (u) =>
          (u as any).role?.id === roleFilter ||
          (u as any).role?.name === roleFilter
      );
    }

    if (effectiveSearch && effectiveSearch.trim()) {
      const s = effectiveSearch.trim().toLowerCase();
      items = items.filter(
        (u) =>
          u.firstName?.toLowerCase().includes(s) ||
          u.lastName?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s) ||
          (u as any).role?.name?.toLowerCase().includes(s)
      );
    }

    const effectiveSortColumn = sortColumn || undefined;
    const effectiveAscending =
      typeof ascending === "boolean" ? ascending : true;

    if (effectiveSortColumn) {
      const dir = effectiveAscending ? 1 : -1;
      items = [...items].sort((a: any, b: any) => {
        if (effectiveSortColumn === "lastName") {
          const an = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
          const bn = `${b.firstName || ""} ${b.lastName || ""}`.toLowerCase();
          if (an === bn) return 0;
          return an > bn ? dir : -dir;
        }

        const av = effectiveSortColumn.includes(".")
          ? effectiveSortColumn
              .split(".")
              .reduce((acc: any, key: string) => acc?.[key], a)
          : (a as any)[effectiveSortColumn];
        const bv = effectiveSortColumn.includes(".")
          ? effectiveSortColumn
              .split(".")
              .reduce((acc: any, key: string) => acc?.[key], b)
          : (b as any)[effectiveSortColumn];

        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;

        if (typeof av === "string" && typeof bv === "string") {
          const as = av.toLowerCase();
          const bs = bv.toLowerCase();
          if (as === bs) return 0;
          return as > bs ? dir : -dir;
        }
        const at = av instanceof Date ? av.getTime() : new Date(av).getTime();
        const bt = bv instanceof Date ? bv.getTime() : new Date(bv).getTime();
        if (!isNaN(at) && !isNaN(bt)) return (at - bt) * dir;
        return (av > bv ? 1 : av < bv ? -1 : 0) * dir;
      });
    }

    const paginatedResult = paginateData(items, page, pageSize);
    paginatedResult.items = paginatedResult.items.map((u) =>
      this.convertToUserResponse(u as UserResponse)
    ) as any;

    return createSuccessResponse(
      paginatedResult as PagedResult<UserResponse>,
      "Users retrieved successfully"
    );
  }

  async getUserById(id: string): Promise<ApiResponse<UserResponse>> {
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      return { success: false, data: null as never, message: "User not found" };
    }
    return createSuccessResponse(
      this.normalizeUser(user as UserResponse),
      "User retrieved successfully"
    );
  }

  async createUser(
    userData: CreateUserRequest
  ): Promise<ApiResponse<UserResponse>> {

    const newUser: UserResponse = {
      id: `user-${Date.now()}`,
      customPermissionsCount: 0,
      isActive: true,
      userStatus: UserStatus.Active,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
      avatar: undefined,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      permissionKeys: [],
      permissions: [],
      role: undefined,
    };

    mockUsers.push(newUser as any);
    return createSuccessResponse(newUser, "User created successfully");
  }

  async updateUser(
    id: string,
    userData: UpdateUserRequest
  ): Promise<ApiResponse<UserResponse>> {

    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return { success: false, data: null as never, message: "User not found" };
    }

    const updatedUser: UserResponse = {
      ...mockUsers[userIndex],
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatar: userData.avatar,
      permissionKeys: userData.permissionKeys,
      userStatus:
        userData.status !== undefined
          ? (userData.status as any)
          : mockUsers[userIndex].userStatus,
      updatedAt: new Date(),
    };

    mockUsers[userIndex] = updatedUser as any;

    return createSuccessResponse(updatedUser, "User updated successfully");
  }

  async deleteUser(id: string): Promise<ApiResponse<string>> {

    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return { success: false, data: null as never, message: "User not found" };
    }

    const user = mockUsers[userIndex];
    const userRole = mockRoles.find((r) => r.name === (user as any).role?.name);
    if (userRole?.isSystem) {
      return {
        success: false,
        data: null as never,
        message: "Cannot delete user with system role",
      };
    }

    mockUsers.splice(userIndex, 1);
    return createSuccessResponse(id, "User deleted successfully");
  }

  async getPendingUsers(): Promise<ApiResponse<UserResponse[]>> {

    const pendingUsers = mockUsers.filter(
      (user) => user.userStatus === UserStatus.Pending
    );

    const userResponses = pendingUsers.map((u) =>
      this.convertToUserResponse(u as UserResponse)
    );

    return createSuccessResponse(
      userResponses,
      "Pending users retrieved successfully"
    );
  }

  async approveUser(
    userId: string,
    roleId?: string
  ): Promise<ApiResponse<UserResponse>> {

    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return { success: false, data: null as never, message: "User not found" };
    }

    const user = mockUsers[userIndex];
    if (user.userStatus !== UserStatus.Pending) {
      return {
        success: false,
        data: null as never,
        message: "User is not pending approval",
      };
    }

    const role = mockRoles.find((r) => r.id === roleId) || (user as any).role;
    mockUsers[userIndex] = {
      ...user,
      userStatus: "active",
      role: role as Role,
      updatedAt: new Date(),
    } as any;

    const userResponse = this.convertToUserResponse(
      mockUsers[userIndex] as UserResponse
    );

    return createSuccessResponse(userResponse, "User approved successfully");
  }

  async rejectUser(userId: string): Promise<ApiResponse<string>> {

    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return { success: false, data: null as never, message: "User not found" };
    }

    const user = mockUsers[userIndex];
    if (user.userStatus !== UserStatus.Pending) {
      return {
        success: false,
        data: null as never,
        message: "User is not pending approval",
      };
    }

    mockUsers.splice(userIndex, 1);

    return createSuccessResponse(userId, "User rejected successfully");
  }

  async updateProfile(
    data: UpdateUserRequest
  ): Promise<ApiResponse<UserResponse>> {
    const user = mockUsers[0];
    const updated: UserResponse = {
      ...(user as any),
      firstName: data.firstName,
      lastName: data.lastName,
      avatar: data.avatar ?? (user as any).avatar,
      updatedAt: new Date(),
    };
    mockUsers[0] = updated;

    const userResponse = this.convertToUserResponse(updated);
    return createSuccessResponse(userResponse, "Profile updated successfully");
  }
}

export const mockUsersService = new MockUsers();
