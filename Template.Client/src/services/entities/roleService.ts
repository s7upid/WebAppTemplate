import { ROLES_MODULE } from "@/config/modules";
import { BaseService } from "../base/baseService";
import { mockRole, mockPermissions } from "@/mock";
import {
  RoleResponse,
  PermissionResponse,
  PageQuery,
  PagedResult,
  QueryBuilder,
  UpdateRoleRequest,
  CreateRoleRequest,
} from "@/models";

const API = ROLES_MODULE.routes.api;

class RoleService extends BaseService {
  constructor() {
    super("roles");
  }

  async getRoles(query: PageQuery) {
    if (this.useMockData) return mockRole.getRoles(query);

    const params = QueryBuilder.create(query).buildQueryParams();
    return this.request<PagedResult<RoleResponse>>(API.list(params));
  }

  async getRoleById(id: string) {
    if (this.useMockData) return mockRole.getRoleById(id);
    return this.request<RoleResponse>(API.byId!(id));
  }

  async createRole(data: CreateRoleRequest) {
    if (this.useMockData) return mockRole.createRole(data);
    return this.request<RoleResponse>(API.create!, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateRole(id: string, data: UpdateRoleRequest) {
    if (this.useMockData) return mockRole.updateRole({ id, ...data });
    return this.request<RoleResponse>(API.update!(id), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteRole(id: string) {
    if (this.useMockData) return mockRole.deleteRole(id);
    return this.request<string>(API.remove!(id), { method: "DELETE" });
  }

  async updateRolePermissions(id: string, permissions: string[]) {
    if (this.useMockData) {
      const permissionObjects = permissions
        .map((key) => mockPermissions.find((p) => p.key === key))
        .filter(Boolean);
      return mockRole.updateRolePermissions(id, permissionObjects as PermissionResponse[]);
    }

    return this.request<RoleResponse>(`${API.byId!(id)}/permissions`, {
      method: "PUT",
      body: JSON.stringify({ permissions }),
    });
  }
}

export const roleService = new RoleService();
