/**
 * Axios HTTP Client with interceptors
 * Provides centralized API communication with error handling, retry logic, and request/response transformation
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiResponse } from '@/types/common';
import { ApiErrorResponse, type ApiError } from '@/types/common';
import { config } from '@/config';
import { HTTP_STATUS, ERROR_CODES, STORAGE_KEYS } from '@/constants';
import { csrfTokenManager } from '@/utils/security';
import { secureStorage } from '@/services/storage';

/**
 * Extended Axios config with custom metadata
 */
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
  enableLogging?: boolean;
}

/**
 * Create Axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request interceptor
 * Add authentication token and other headers to outgoing requests
 *
 * SECURITY NOTE: Currently using localStorage for tokens.
 * TODO: Migrate to HttpOnly cookies for production (prevent XSS token theft)
 * See: docs/SECURITY.md for implementation guide
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const customConfig = config as CustomAxiosRequestConfig;

    // Get token from secure storage (same storage as AuthService uses)
    const token = secureStorage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);

    // Add authorization header if token exists
    if (token && customConfig.headers) {
      customConfig.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token for state-changing requests
    if (['post', 'put', 'patch', 'delete'].includes(customConfig.method?.toLowerCase() ?? '')) {
      if (customConfig.headers) {
        customConfig.headers['X-CSRF-Token'] = csrfTokenManager.getToken();
      }
    }

    // Add request timestamp for logging
    customConfig.metadata = { startTime: new Date().getTime() };

    // Log request in development
    if (customConfig.enableLogging) {
      console.log('📤 API Request:', {
        method: customConfig.method?.toUpperCase(),
        url: customConfig.url,
        params: customConfig.params,
        data: customConfig.data,
      });
    }

    return customConfig;
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handle responses and errors globally
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const customConfig = response.config as CustomAxiosRequestConfig;
    // Calculate request duration
    const duration = new Date().getTime() - (customConfig.metadata?.startTime ?? 0);

    // Log response in development
    if (config.enableLogging) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        duration: `${duration}ms`,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError<ApiError>): Promise<never> => {
    // Handle network errors
    if (!error.response) {
      const networkError = new ApiErrorResponse(
        'Network error. Please check your internet connection.',
        ERROR_CODES.NETWORK_ERROR,
        0
      );
      console.error('❌ Network Error:', networkError);
      return Promise.reject(networkError as Error);
    }

    const { response } = error;
    const apiError = new ApiErrorResponse(
      response.data?.message ?? 'An error occurred',
      response.data?.code ?? ERROR_CODES.UNKNOWN_ERROR,
      response.status,
      response.data?.errors
    );

    // Handle specific HTTP status codes
    switch (response.status) {
      case HTTP_STATUS.UNAUTHORIZED:
        // Handle token expiration and refresh
        await handleUnauthorized();
        break;

      case HTTP_STATUS.FORBIDDEN:
        apiError.message = 'You do not have permission to perform this action.';
        break;

      case HTTP_STATUS.NOT_FOUND:
        apiError.message = 'The requested resource was not found.';
        break;

      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        apiError.message = 'Validation failed. Please check your input.';
        break;

      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        apiError.message = 'Server error. Please try again later.';
        break;

      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        apiError.message = 'Service is temporarily unavailable.';
        break;
    }

    // Log error
    if (config.enableLogging) {
      console.error('❌ API Error:', {
        status: response.status,
        url: error.config?.url,
        message: apiError.message,
        errors: apiError.errors,
      });
    }

    return Promise.reject(apiError as Error);
  }
);

/**
 * Handle unauthorized access (401)
 * Attempt to refresh token or redirect to login
 */
async function handleUnauthorized(): Promise<void> {
  const refreshToken = localStorage.getItem(`${import.meta.env['VITE_STORAGE_PREFIX']}refresh_token`);

  if (!refreshToken) {
    // No refresh token available, redirect to login
    clearAuthData();
    window.location.href = '/auth/signin';
    return;
  }

  try {
    // Attempt to refresh the access token
    const response = await axios.post(`${config.apiBaseUrl}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    // Store new tokens
    localStorage.setItem(`${import.meta.env['VITE_STORAGE_PREFIX']}access_token`, accessToken);
    if (newRefreshToken) {
      localStorage.setItem(`${import.meta.env['VITE_STORAGE_PREFIX']}refresh_token`, newRefreshToken);
    }

    // Retry the original request
    // This is handled by axios-retry in production
  } catch (_refreshError) {
    // Refresh failed, clear auth data and redirect
    clearAuthData();
    window.location.href = '/auth/signin';
  }
}

/**
 * Clear authentication data from storage
 */
function clearAuthData(): void {
  localStorage.removeItem(`${import.meta.env['VITE_STORAGE_PREFIX']}access_token`);
  localStorage.removeItem(`${import.meta.env['VITE_STORAGE_PREFIX']}refresh_token`);
  localStorage.removeItem(`${import.meta.env['VITE_STORAGE_PREFIX']}user`);
}

/**
 * API service with typed methods
 */
export class ApiService {
  /**
   * GET request
   */
  static async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  static async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  static async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  static async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  static async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * Upload file with progress
   */
  static async upload<T = unknown>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  }

  /**
   * Download file
   */
  static async download(url: string, filename: string): Promise<void> {
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
}

/**
 * Export axios instance for advanced usage
 */
export { apiClient };

/**
 * Export default
 */
export default ApiService;
