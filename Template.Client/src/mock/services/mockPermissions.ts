import { mockPermissions, mockRoles } from "@/mock";

import {
  PagedResult,
  ApiResponse,
  PermissionResponse,
  PageQuery,
  RoleResponse,
} from "@/models";
import { paginateData, createSuccessResponse } from "@/mock";

export class MockPermission {
  async getPermissions(
    query: PageQuery
  ): Promise<ApiResponse<PagedResult<PermissionResponse>>> {
    const { page, pageSize, filters } = query;

    const filterParams: Record<string, unknown> = {};
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.property === "category") {
          filterParams.category = filter.value;
        } else if (filter.property === "resource") {
          filterParams.resource = filter.value;
        } else if (filter.property === "action") {
          filterParams.action = filter.value;
        } else if (filter.property === "search") {
          filterParams.search = filter.value;
        }
      });
    }

    let permissions = mockPermissions.map((p) => ({
      id: p.key,
      key: p.key,
      name: p.name,
      description: p.description,
      resource: p.resource,
      action: p.action,
      category: p.category,
      isSystem: p.isSystem || false,
      createdAt: p.createdAt,
    }));

    const effectiveSearch = (
      query.searchTerm ?? (filterParams.search as string | undefined)
    )
      ?.toString()
      .toLowerCase();
    if (effectiveSearch && effectiveSearch.trim()) {
      const searchTerm = effectiveSearch.trim();
      permissions = permissions.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchTerm) ||
          p.description?.toLowerCase().includes(searchTerm) ||
          p.key?.toLowerCase().includes(searchTerm) ||
          p.resource?.toLowerCase().includes(searchTerm) ||
          p.action?.toLowerCase().includes(searchTerm)
      );
    }

    if (filterParams.category && filterParams.category !== "all") {
      const rawCategory = String(filterParams.category).toLowerCase();

      const mapCategory = (val: string): string | undefined => {
        if (["users", "user", "user management"].includes(val))
          return "User Management";
        if (["roles", "role"].includes(val)) return "Roles";
        if (["permissions", "permission"].includes(val)) return "Permissions";
        if (["reports", "report"].includes(val)) return "Reports";
        if (["general", "dashboard"].includes(val)) return "General";
        return undefined;
      };

      const canonical = mapCategory(rawCategory);

      permissions = permissions.filter((p) => {
        const matchesCategory = canonical
          ? p.category === canonical
          : p.category?.toLowerCase() === rawCategory;
        const matchesResource = rawCategory === p.resource?.toLowerCase();
        return matchesCategory || matchesResource;
      });
    }

    if (filterParams.resource && filterParams.resource !== "all") {
      permissions = permissions.filter(
        (p) => p.resource === filterParams.resource
      );
    }

    if (filterParams.action && filterParams.action !== "all") {
      permissions = permissions.filter((p) => p.action === filterParams.action);
    }

    const sort = (query as any).sort as
      | { property?: string; direction?: string }
      | undefined;

    const sortProperty = sort?.property || (query as any).sortColumn;
    const sortDirection =
      (sort?.direction as string | undefined) ||
      ((query as any).ascending ? "asc" : "desc");
    if (sortProperty) {
      const dir = sortDirection === "asc" ? 1 : -1;
      permissions = [...permissions].sort((a, b) => {
        const prop = sortProperty as keyof PermissionResponse;
        let av = (a as any)[prop];
        let bv = (b as any)[prop];

        if (prop === ("createdAt" as any)) {
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

    const paginatedResult = paginateData(permissions, page, pageSize);
    return createSuccessResponse(
      paginatedResult,
      "Permissions retrieved successfully"
    );
  }

  getAllPermissions(): PermissionResponse[] {
    return mockPermissions;
  }

  getPermission(key: string): PermissionResponse {
    return mockPermissions.find((p) => p.key === key)!;
  }

  getPermissionsByCategory(category: string): PermissionResponse[] {
    return mockPermissions.filter((p) => p.category === category);
  }

  getPermissionsByResource(resource: string): PermissionResponse[] {
    return mockPermissions.filter((p) => p.resource === resource);
  }

  getPermissionCategories(): string[] {
    const set = new Set(mockPermissions.map((p) => p.category).filter((cat): cat is string => Boolean(cat)));
    return Array.from(set);
  }

  validatePermissions(permissions: string[]): {
    valid: string[];
    invalid: string[];
  } {
    const keys = new Set(mockPermissions.map((p) => p.key));
    const valid: string[] = [];
    const invalid: string[] = [];
    permissions.forEach((k) => (keys.has(k) ? valid.push(k) : invalid.push(k)));
    return { valid, invalid };
  }

  getAllRoles(): RoleResponse[] {
    return mockRoles;
  }

  getRole(roleId: string): RoleResponse {
    return mockRoles.find((r) => r.id === roleId || r.name === roleId)!;
  }

  getSystemRoles(): RoleResponse[] {
    return mockRoles.filter((r) => r.isSystem);
  }

  getDefaultRoles(): RoleResponse[] {
    return mockRoles.filter((r) => !r.isSystem);
  }

  getRolePermissions(roleId: string): string[] {
    const role = this.getRole(roleId);
    return role?.permissions?.map((p) => p.key).filter((key): key is string => Boolean(key)) || [];
  }

  validateRolePermissions(roleId: string): {
    valid: string[];
    invalid: string[];
  } {
    const keys = this.getRolePermissions(roleId);
    return this.validatePermissions(keys);
  }

  hasPermission(
    userPermissions: string[],
    rolePermissions: string[],
    permission: string
  ): boolean {
    return (
      userPermissions.includes(permission) ||
      rolePermissions.includes(permission)
    );
  }

  hasAnyPermission(
    userPermissions: string[],
    rolePermissions: string[],
    permissions: string[]
  ): boolean {
    return permissions.some((p) =>
      this.hasPermission(userPermissions, rolePermissions, p)
    );
  }

  hasAllPermissions(
    userPermissions: string[],
    rolePermissions: string[],
    permissions: string[]
  ): boolean {
    return permissions.every((p) =>
      this.hasPermission(userPermissions, rolePermissions, p)
    );
  }

  groupPermissionsByCategory(
    permissions: string[]
  ): Record<string, PermissionResponse[]> {
    const grouped: Record<string, PermissionResponse[]> = {};
    permissions.forEach((key) => {
      const perm = this.getPermission(key);
      if (perm) {
        grouped[perm.category || ""] = grouped[perm.category || ""] || [];
        grouped[perm.category || ""].push(perm);
      }
    });
    return grouped;
  }

  groupPermissionsByResource(
    permissions: string[]
  ): Record<string, PermissionResponse[]> {
    const grouped: Record<string, PermissionResponse[]> = {};
    permissions.forEach((key) => {
      const perm = this.getPermission(key);
      if (perm && perm.resource) {
        grouped[perm.resource] = grouped[perm.resource] || [];
        grouped[perm.resource].push(perm);
      }
    });
    return grouped;
  }

  generatePermissionsForResource(
    resource: string,
    actions: string[]
  ): PermissionResponse[] {
    return actions.map((action) => ({
      key: `${resource}:${action}`,
      name: `${action.charAt(0).toUpperCase() + action.slice(1)} ${
        resource.charAt(0).toUpperCase() + resource.slice(1)
      }`,
      description: `${
        action.charAt(0).toUpperCase() + action.slice(1)
      } ${resource}`,
      resource,
      action,
      category: resource,
      isSystem: false,
      createdAt: new Date(),
      id: `${resource}:${action}`,
    }));
  }

  analyzeUserPermissions(userPermissions: string[], rolePermissions: string[]) {
    const allPermissions = [
      ...new Set([...userPermissions, ...rolePermissions]),
    ];
    const rolePerms = rolePermissions.length;
    const customPerms = userPermissions.filter(
      (p) => !rolePermissions.includes(p)
    ).length;

    const byCategory = this.groupPermissionsByCategory(allPermissions);
    const byResource = this.groupPermissionsByResource(allPermissions);

    return {
      totalPermissions: allPermissions.length,
      rolePermissions: rolePerms,
      customPermissions: customPerms,
      permissionsByCategory: Object.fromEntries(
        Object.entries(byCategory).map(([k, v]) => [k, v.length])
      ),
      permissionsByResource: Object.fromEntries(
        Object.entries(byResource).map(([k, v]) => [k, v.length])
      ),
    };
  }

  exportPermissionConfig(): string {
    const categories = Array.from(
      new Set(mockPermissions.map((p) => p.category))
    );
    return JSON.stringify(
      {
        permissions: mockPermissions,
        categories,
        roles: mockRoles,
      },
      null,
      2
    );
  }

  importPermissionConfig(config: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(config);
      if (!data.permissions || !Array.isArray(data.permissions))
        return { success: false, error: "Invalid permissions configuration" };
      if (!data.categories || !Array.isArray(data.categories))
        return { success: false, error: "Invalid categories configuration" };
      if (!data.roles || !Array.isArray(data.roles))
        return { success: false, error: "Invalid roles configuration" };
      return { success: true };
    } catch {
      return { success: false, error: "Invalid JSON format" };
    }
  }
}

export const mockPermission = new MockPermission();
