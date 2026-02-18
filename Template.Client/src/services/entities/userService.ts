import { USERS_MODULE } from "@/config/modules";
import { BaseService } from "../base/baseService";
import { mockUser } from "@/mock";
import { ApiResponse } from "@/models/shared/api";
import {
  UserResponse,
  PagedResult,
  PageQuery,
  QueryBuilder,
  CreateUserRequest,
  UpdateUserRequest,
  ApproveUserRequest,
} from "@/models";

const API = USERS_MODULE.routes.api;

class UserService extends BaseService {
  constructor() {
    super("users");
  }

  async getUsers(
    query: PageQuery
  ): Promise<ApiResponse<PagedResult<UserResponse>>> {
    if (this.useMockData) return mockUser.getUsers(query);

    const params = QueryBuilder.create(query).buildQueryParams();
    return this.request<PagedResult<UserResponse>>(API.list(params));
  }

  async getUserById(id: string): Promise<ApiResponse<UserResponse>> {
    if (this.useMockData) return mockUser.getUserById(id);

    return await this.request<UserResponse>(API.byId!(id));
  }

  async createUser(
    data: CreateUserRequest
  ): Promise<ApiResponse<UserResponse>> {
    if (this.useMockData) return mockUser.createUser(data);

    return this.request<UserResponse>(API.create as string, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUser(
    id: string,
    data: UpdateUserRequest
  ): Promise<ApiResponse<UserResponse>> {
    if (this.useMockData) return mockUser.updateUser(id, data);

    return this.request<UserResponse>(API.update!(id), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<string>> {
    if (this.useMockData) return mockUser.deleteUser(id);

    return this.request<string>(API.remove!(id), {
      method: "DELETE",
    });
  }

  async approveUser(
    userId: string,
    request: ApproveUserRequest
  ): Promise<ApiResponse<UserResponse>> {
    if (this.useMockData) return mockUser.approveUser(userId, request.roleId);

    return this.request<UserResponse>(
      (API.approve as (id: string) => string)(userId),
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    );
  }

  async rejectUser(userId: string): Promise<ApiResponse<string>> {
    if (this.useMockData) return mockUser.rejectUser(userId);

    return this.request<string>(
      (API.reject as (id: string) => string)(userId),
      {
        method: "POST",
      }
    );
  }

  async updateProfile(
    data: UpdateUserRequest
  ): Promise<ApiResponse<UserResponse>> {
    if (this.useMockData) return mockUser.updateProfile(data);

    return this.request<UserResponse>(API.profile as string, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

export const userService = new UserService();
