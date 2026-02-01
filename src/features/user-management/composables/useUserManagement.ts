/**
 * useUserManagement Composable
 * Feature-specific composable for user management
 */

import { computed } from 'vue';
import { useUserManagementStore } from '../stores/userManagement.store';
import { useAppStore } from '@/stores/appStore';
import type { UserManagement, UserFilterCriteria } from '../types';

/**
 * User management composable
 */
export const useUserManagement = () => {
    const userStore = useUserManagementStore();
    const appStore = useAppStore();

    // Computed
    const users = computed(() => userStore.users);
    const selectedUser = computed(() => userStore.selectedUser);
    const loading = computed(() => userStore.loading);
    const error = computed(() => userStore.error);
    const pagination = computed(() => userStore.pagination);
    const hasUsers = computed(() => userStore.hasUsers);

    /**
     * Load users
     */
    const loadUsers = async (): Promise<void> => {
        try {
            await userStore.fetchUsers();
        } catch (err) {
            appStore.showError('Failed to load users');
            throw err;
        }
    };

    /**
     * Load single user
     */
    const loadUser = async (id: string | number): Promise<void> => {
        try {
            await userStore.fetchUser(id);
        } catch (err) {
            appStore.showError('Failed to load user');
            throw err;
        }
    };

    /**
     * Create user
     */
    const createUser = async (data: UserManagement): Promise<void> => {
        try {
            await userStore.createUser(data);
            appStore.showSuccess('User created successfully');
        } catch (err) {
            appStore.showError('Failed to create user');
            throw err;
        }
    };

    /**
     * Update user
     */
    const updateUser = async (id: string | number, data: Partial<UserManagement>): Promise<void> => {
        try {
            await userStore.updateUser(id, data);
            appStore.showSuccess('User updated successfully');
        } catch (err) {
            appStore.showError('Failed to update user');
            throw err;
        }
    };

    /**
     * Delete user
     */
    const deleteUser = async (id: string | number): Promise<void> => {
        try {
            await userStore.deleteUser(id);
            appStore.showSuccess('User deleted successfully');
        } catch (err) {
            appStore.showError('Failed to delete user');
            throw err;
        }
    };

    /**
     * Apply filters
     */
    const applyFilters = async (filters: UserFilterCriteria): Promise<void> => {
        userStore.setFilters(filters);
        await loadUsers();
    };

    /**
     * Change page
     */
    const changePage = async (page: number): Promise<void> => {
        userStore.setPage(page);
        await loadUsers();
    };

    return {
        // State
        users,
        selectedUser,
        loading,
        error,
        pagination,
        hasUsers,

        // Methods
        loadUsers,
        loadUser,
        createUser,
        updateUser,
        deleteUser,
        applyFilters,
        changePage,
    };
};
