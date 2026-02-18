import {
  ApiResponse,
  PagedResult,
  RoleResponse,
  PageQuery,
  CreateRoleRequest,
  UpdateRoleRequest,
  Permission,
  FilterExpression,
} from "@/models";
import {
  mockRoles,
  mockPermissions,
  createSuccessResponse,
  paginateData,
} from "@/mock";

export class MockRole {
  async getRoles(
    query: PageQuery
  ): Promise<ApiResponse<PagedResult<RoleResponse>>> {
    const { page, pageSize, filters } = query;

    const filterParams: Record<string, unknown> = {};
    if (filters && filters.length > 0) {
      filters.forEach((filter: FilterExpression) => {
        if (filter.property === "isSystem") {
          filterParams.isSystem = filter.value;
        } else if (filter.property === "type") {
          const val = String(filter.value).toLowerCase();
          if (val === "system") filterParams.isSystem = true;
          else if (val === "custom") filterParams.isSystem = false;
        } else if (filter.property === "hasUsers") {
          const v = String(filter.value).toLowerCase();
          filterParams.hasUsers = v === "true" || v === "yes" || v === "with";
        } else if (filter.property === "search") {
          filterParams.search = filter.value;
        }
      });
    }

    let roles = [...mockRoles];

    const effectiveSearch = (
      query.searchTerm ?? (filterParams.search as string | undefined)
    )
      ?.toString()
      .toLowerCase();
    if (effectiveSearch && effectiveSearch.trim()) {
      const s = effectiveSearch.trim();
      roles = roles.filter(
        (r) =>
          r.name!.toLowerCase().includes(s) ||
          (r.description || "").toLowerCase().includes(s)
      );
    }

    if (typeof filterParams.isSystem === "boolean") {
      roles = roles.filter((r) => r.isSystem === filterParams.isSystem);
    }

    if (typeof filterParams.hasUsers === "boolean") {
      roles = roles.filter(
        (r) => (r.users?.length || 0) > 0 === filterParams.hasUsers
      );
    }

    let sorted = roles;
    const sort = (query as any).sort as
      | { property?: string; direction?: string }
      | undefined;
    const sortProperty = sort?.property || (query as any).sortColumn;
    const sortDirection =
      (sort?.direction as string | undefined) ||
      ((query as any).ascending ? "asc" : "desc");
    if (sortProperty) {
      const dir = sortDirection === "asc" ? 1 : -1;
      sorted = [...roles].sort((a, b) => {
        const prop = sortProperty as keyof RoleResponse;
        if (prop === ("permissionsCount" as any)) {
          const av = (a as any).permissions?.length || 0;
          const bv = (b as any).permissions?.length || 0;
          return av === bv ? 0 : av > bv ? dir : -dir;
        }
        let av: any = (a as any)[prop];
        let bv: any = (b as any)[prop];
        if (prop === ("createdAt" as any) || prop === ("updatedAt" as any)) {
          const aTime =
            av instanceof Date ? av.getTime() : new Date(av).getTime();
          const bTime =
            bv instanceof Date ? bv.getTime() : new Date(bv).getTime();
          if (aTime === bTime) return 0;
          return aTime > bTime ? dir : -dir;
        }
        if (typeof av === "string") av = av.toLowerCase();
        if (typeof bv === "string") bv = bv.toLowerCase();
        if (av === bv) return 0;
        return av > bv ? dir : -dir;
      });
    }

    const paginatedResult = paginateData(sorted, page, pageSize);

    return createSuccessResponse(
      paginatedResult,
      "Roles retrieved successfully"
    );
  }

  async getRoleById(id: string): Promise<ApiResponse<RoleResponse>> {
    const role = mockRoles.find((r) => r.id === id);
    if (!role) throw new Error("Role not found");

    return createSuccessResponse(role, "Role retrieved successfully");
  }

  async createRole(
    roleData: CreateRoleRequest
  ): Promise<ApiResponse<RoleResponse>> {
    const newRole: RoleResponse = {
      id: `role-${Date.now()}`,
      name: roleData.name,
      description: roleData.description || "",
      permissions:
        (roleData.permissionKeys
          ?.map((key) => mockPermissions.find((p) => p.key === key))
          .filter(Boolean) as Permission[]) || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isSystem: true,
      users: [],
    };

    mockRoles.push(newRole);

    return createSuccessResponse(newRole, "Role created successfully");
  }

  async updateRole(
    roleData: UpdateRoleRequest & { id: string }
  ): Promise<ApiResponse<RoleResponse>> {
    const { id, ...data } = roleData;
    const index = mockRoles.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Role not found");

    const updatedRole = {
      ...mockRoles[index],
      ...data,
      updatedAt: new Date(),
    };

    mockRoles[index] = updatedRole;

    return createSuccessResponse(updatedRole, "Role updated successfully");
  }

  async deleteRole(id: string): Promise<ApiResponse<string>> {
    const index = mockRoles.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Role not found");
    if (mockRoles[index].isSystem) throw new Error("Cannot delete system role");

    mockRoles.splice(index, 1);

    return createSuccessResponse(id, "Role deleted successfully");
  }

  async getAllPermissions(): Promise<ApiResponse<Permission[]>> {
    return createSuccessResponse(
      mockPermissions,
      "Permissions retrieved successfully"
    );
  }

  async getRolePermissions(id: string): Promise<ApiResponse<Permission[]>> {
    const role = mockRoles.find((r) => r.id === id);
    if (!role) throw new Error("Role not found");

    return createSuccessResponse(
      role.permissions!,
      "Role permissions retrieved successfully"
    );
  }

  async updateRolePermissions(
    id: string,
    permissions: Permission[]
  ): Promise<ApiResponse<RoleResponse>> {
    const role = mockRoles.find((r) => r.id === id);
    if (!role) throw new Error("Role not found");

    role.permissions = permissions;
    role.updatedAt = new Date();

    return createSuccessResponse(role, "Role permissions updated successfully");
  }
}

export const mockRole = new MockRole();
