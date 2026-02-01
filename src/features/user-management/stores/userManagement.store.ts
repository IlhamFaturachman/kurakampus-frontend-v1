/**
 * User Management Store
 * Feature-specific Pinia store
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { UserManagementService } from '../services/user.service';
import type { UserManagement, UserFilterCriteria } from '../types';
import type { ApiError, PaginatedResponse } from '@/types/common';

/**
 * User management store
 */
export const useUserManagementStore = defineStore('userManagement', () => {
    // State
    const users = ref<UserManagement[]>([]);
    const selectedUser = ref<UserManagement | null>(null);
    const loading = ref<boolean>(false);
    const error = ref<ApiError | null>(null);
    const pagination = ref({
        page: 1,
        perPage: 10,
        total: 0,
        totalPages: 0,
    });
    const filters = ref<UserFilterCriteria>({});

    // Getters
    const totalUsers = computed<number>(() => pagination.value.total);
    const hasUsers = computed<boolean>(() => users.value.length > 0);
    const currentPage = computed<number>(() => pagination.value.page);

    // Actions
    /**
     * Fetch users list
     */
    const fetchUsers = async (): Promise<void> => {
        try {
            loading.value = true;
            error.value = null;

            const response: PaginatedResponse<UserManagement> = await UserManagementService.getUsers(
                pagination.value.page,
                pagination.value.perPage,
                filters.value
            );

            users.value = response.data;
            pagination.value = response.pagination;
        } catch (err) {
            error.value = err as ApiError;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetch single user
     */
    const fetchUser = async (id: string | number): Promise<void> => {
        try {
            loading.value = true;
            error.value = null;

            const user = await UserManagementService.getUser(id);
            selectedUser.value = user;
        } catch (err) {
            error.value = err as ApiError;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Create new user
     */
    const createUser = async (data: UserManagement): Promise<void> => {
        try {
            loading.value = true;
            error.value = null;

            const newUser = await UserManagementService.createUser(data);
            users.value.unshift(newUser);
            pagination.value.total++;
        } catch (err) {
            error.value = err as ApiError;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Update user
     */
    const updateUser = async (id: string | number, data: Partial<UserManagement>): Promise<void> => {
        try {
            loading.value = true;
            error.value = null;

            const updatedUser = await UserManagementService.updateUser(id, data);

            const index = users.value.findIndex((u) => u.id === id);
            if (index !== -1) {
                users.value[index] = updatedUser;
            }

            if (selectedUser.value?.id === id) {
                selectedUser.value = updatedUser;
            }
        } catch (err) {
            error.value = err as ApiError;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Delete user
     */
    const deleteUser = async (id: string | number): Promise<void> => {
        try {
            loading.value = true;
            error.value = null;

            await UserManagementService.deleteUser(id);

            users.value = users.value.filter((u) => u.id !== id);
            pagination.value.total--;

            if (selectedUser.value?.id === id) {
                selectedUser.value = null;
            }
        } catch (err) {
            error.value = err as ApiError;
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Set filters
     */
    const setFilters = (newFilters: UserFilterCriteria): void => {
        filters.value = newFilters;
        pagination.value.page = 1; // Reset to first page
    };

    /**
     * Set page
     */
    const setPage = (page: number): void => {
        pagination.value.page = page;
    };

    /**
     * Reset state
     */
    const reset = (): void => {
        users.value = [];
        selectedUser.value = null;
        loading.value = false;
        error.value = null;
        pagination.value = {
            page: 1,
            perPage: 10,
            total: 0,
            totalPages: 0,
        };
        filters.value = {};
    };

    return {
        // State
        users,
        selectedUser,
        loading,
        error,
        pagination,
        filters,

        // Getters
        totalUsers,
        hasUsers,
        currentPage,

        // Actions
        fetchUsers,
        fetchUser,
        createUser,
        updateUser,
        deleteUser,
        setFilters,
        setPage,
        reset,
    };
});
