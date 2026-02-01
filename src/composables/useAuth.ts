/**
 * useAuth Composable
 * Provides authentication functionality with reactive state
 */

import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import type { LoginCredentials, RegisterData } from '@/types/auth';
import { ROUTE_NAMES } from '@/constants';

/**
 * Authentication composable
 */
export const useAuth = () => {
  const authStore = useAuthStore();
  const appStore = useAppStore();
  const router = useRouter();

  // Computed properties
  const user = computed(() => authStore.user);
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const loading = computed(() => authStore.loading);
  const error = computed(() => authStore.error);

  /**
   * Login user
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      await authStore.login(credentials);
      appStore.showSuccess('Login successful');

      // Redirect to dashboard or intended route
      const redirectPath = router.currentRoute.value.query['redirect'] as string;
      await router.push(redirectPath ?? `/${ROUTE_NAMES.DASHBOARD}`);
    } catch (err) {
      appStore.showError('Login failed. Please check your credentials.');
      throw err;
    }
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterData): Promise<void> => {
    try {
      await authStore.register(data);
      appStore.showSuccess('Registration successful');

      // Redirect to dashboard
      await router.push(`/${ROUTE_NAMES.DASHBOARD}`);
    } catch (err) {
      appStore.showError('Registration failed. Please try again.');
      throw err;
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    try {
      await authStore.logout();
      appStore.showInfo('You have been logged out');

      // Redirect to login
      await router.push(`/auth/${ROUTE_NAMES.LOGIN}`);
    } catch (err) {
      appStore.showError('Logout failed');
      throw err;
    }
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role: string): boolean => {
    return authStore.hasRole(role);
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roles: string[]): boolean => {
    return authStore.hasAnyRole(roles);
  };

  /**
   * Refresh user data
   */
  const refreshUser = async (): Promise<void> => {
    try {
      await authStore.fetchUser();
    } catch (err) {
      appStore.showError('Failed to refresh user data');
      throw err;
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,

    // Methods
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
    refreshUser,
  };
};
