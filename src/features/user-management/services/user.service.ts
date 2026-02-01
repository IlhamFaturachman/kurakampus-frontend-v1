/**
 * User Management Service
 * Handles API calls for user management feature
 */

import { ApiService } from '@/services/api';
import { USER_ENDPOINTS } from '@/services/api/endpoints';
import type { ApiResponse, PaginatedResponse } from '@/types/common';
import type { UserManagement, UserFilterCriteria, UserFormData } from '../types';

/**
 * User management service class
 */
export class UserManagementService {
  /**
   * Get paginated list of users
   */
  static async getUsers(
    page: number = 1,
    perPage: number = 10,
    filters?: UserFilterCriteria
  ): Promise<PaginatedResponse<UserManagement>> {
    const params = {
      page,
      perPage,
      ...filters,
    };

    const response = await ApiService.get<PaginatedResponse<UserManagement>>(
      USER_ENDPOINTS.BASE,
      { params }
    );

    return response.data;
  }

  /**
   * Get single user by ID
   */
  static async getUser(id: string | number): Promise<UserManagement> {
    const response = await ApiService.get<UserManagement>(USER_ENDPOINTS.BY_ID(id));
    return response.data;
  }

  /**
   * Create new user
   */
  static async createUser(data: UserFormData): Promise<UserManagement> {
    const response = await ApiService.post<UserManagement>(USER_ENDPOINTS.BASE, data);
    return response.data;
  }

  /**
   * Update existing user
   */
  static async updateUser(id: string | number, data: Partial<UserFormData>): Promise<UserManagement> {
    const response = await ApiService.put<UserManagement>(USER_ENDPOINTS.BY_ID(id), data);
    return response.data;
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string | number): Promise<ApiResponse> {
    return await ApiService.delete(USER_ENDPOINTS.DELETE(id));
  }

  /**
   * Activate user
   */
  static async activateUser(id: string | number): Promise<UserManagement> {
    const response = await ApiService.post<UserManagement>(USER_ENDPOINTS.ACTIVATE(id));
    return response.data;
  }

  /**
   * Deactivate user
   */
  static async deactivateUser(id: string | number): Promise<UserManagement> {
    const response = await ApiService.post<UserManagement>(USER_ENDPOINTS.DEACTIVATE(id));
    return response.data;
  }

  /**
   * Reset user password
   */
  static async resetUserPassword(id: string | number): Promise<ApiResponse> {
    return await ApiService.post(`/users/${id}/reset-password`);
  }
}

export default UserManagementService;
