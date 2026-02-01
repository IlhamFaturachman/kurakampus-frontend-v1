/**
 * Authentication Pinia Store
 * Manages authentication state and actions with TypeScript type safety
 */

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { AuthService } from '@/services/auth';
import type {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
} from '@/types/auth';
import type { ApiError } from '@/types/common';

/**
 * Authentication store
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const tokens = ref<AuthTokens | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<ApiError | null>(null);

  // Getters
  const isAuthenticated = computed<boolean>(() => {
    return !!tokens.value && AuthService.isAuthenticated();
  });

  const currentUser = computed<User | null>(() => user.value);

  const userRole = computed<string | undefined>(() => user.value?.role);

  const userFullName = computed<string>(() => {
    if (!user.value) return '';
    return `${user.value.firstName} ${user.value.lastName}`.trim();
  });

  // Actions
  /**
   * Login user
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await AuthService.login(credentials);

      user.value = response.user;
      tokens.value = response.tokens;
    } catch (err) {
      error.value = err as ApiError;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterData): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await AuthService.register(data);

      user.value = response.user;
      tokens.value = response.tokens;
    } catch (err) {
      error.value = err as ApiError;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      await AuthService.logout();

      user.value = null;
      tokens.value = null;
    } catch (err) {
      error.value = err as ApiError;
      // Clear state even if API call fails
      user.value = null;
      tokens.value = null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Refresh authentication token
   */
  const refreshToken = async (): Promise<void> => {
    try {
      const newTokens = await AuthService.refreshToken();
      tokens.value = newTokens;
    } catch (err) {
      error.value = err as ApiError;
      // Clear state if refresh fails
      user.value = null;
      tokens.value = null;
      throw err;
    }
  };

  /**
   * Fetch current user profile
   */
  const fetchUser = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      const userData = await AuthService.getCurrentUser();
      user.value = userData;
    } catch (err) {
      error.value = err as ApiError;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Initialize auth state from storage
   */
  const initialize = (): void => {
    const storedUser = AuthService.getUser();
    const storedToken = AuthService.getAccessToken();

    if (storedUser && storedToken && AuthService.isAuthenticated()) {
      user.value = storedUser;
      tokens.value = {
        accessToken: storedToken,
        refreshToken: AuthService.getRefreshToken() ?? '',
        tokenType: 'Bearer',
        expiresIn: 0,
      };
    }
  };

  /**
   * Clear error state
   */
  const clearError = (): void => {
    error.value = null;
  };

  /**
   * Update user profile
   */
  const updateUser = (updatedUser: User): void => {
    user.value = updatedUser;
    AuthService.setUser(updatedUser);
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role: string): boolean => {
    return (user.value?.role as string) === role;
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roles: string[]): boolean => {
    return user.value ? roles.includes(user.value.role) : false;
  };

  // Initialize store
  initialize();

  return {
    // State
    user,
    tokens,
    loading,
    error,

    // Getters
    isAuthenticated,
    currentUser,
    userRole,
    userFullName,

    // Actions
    login,
    register,
    logout,
    refreshToken,
    fetchUser,
    initialize,
    clearError,
    updateUser,
    hasRole,
    hasAnyRole,
  };
});

/**
 * Export type for use in components
 */
export type AuthStoreType = ReturnType<typeof useAuthStore>;
