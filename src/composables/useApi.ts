/**
 * useApi Composable
 * Provides type-safe API calling with loading and error handling
 */

import { ref, type Ref } from 'vue';
import type { ApiResponse, ApiError } from '@/types/common';

/**
 * API composable state interface
 */
interface UseApiState<T> {
  data: Ref<T | null>;
  loading: Ref<boolean>;
  error: Ref<ApiError | null>;
}

/**
 * API composable return type
 */
interface UseApiReturn<T> extends UseApiState<T> {
  execute: () => Promise<void>;
  reset: () => void;
}

/**
 * useApi composable
 */
export const useApi = <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  immediate: boolean = false
): UseApiReturn<T> => {
  const data = ref<T | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<ApiError | null>(null);

  /**
   * Execute API call
   */
  const execute = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await apiCall();
      data.value = response.data;
    } catch (err) {
      error.value = err as ApiError;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Reset state
   */
  const reset = (): void => {
    data.value = null;
    loading.value = false;
    error.value = null;
  };

  // Execute immediately if requested
  if (immediate) {
    void execute();
  }

  return {
    data: data as Ref<T | null>,
    loading,
    error,
    execute,
    reset,
  };
};

/**
 * useApiMutation composable for POST, PUT, DELETE operations
 */
export const useApiMutation = <T, D = unknown>(
  apiCall: (data: D) => Promise<ApiResponse<T>>
) => {
  const data = ref<T | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<ApiError | null>(null);

  /**
   * Execute mutation
   */
  const mutate = async (payload: D): Promise<T> => {
    try {
      loading.value = true;
      error.value = null;

      const response = await apiCall(payload);
      data.value = response.data;

      return response.data;
    } catch (err) {
      error.value = err as ApiError;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Reset state
   */
  const reset = (): void => {
    data.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    data: data as Ref<T | null>,
    loading,
    error,
    mutate,
    reset,
  };
};
