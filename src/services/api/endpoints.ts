/**
 * API Endpoints Registry
 * Centralized configuration for all backend API endpoints
 * Matches NestJS backend route structure
 */

/**
 * Authentication endpoints
 */
export const AUTH_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  ME: '/auth/me',

  // Password Management
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',

  // Email Verification
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
} as const;

/**
 * User management endpoints
 */
export const USER_ENDPOINTS = {
  // User CRUD
  BASE: '/users',
  BY_ID: (id: string | number) => `/users/${id}`,
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',

  // User Actions
  ACTIVATE: (id: string | number) => `/users/${id}/activate`,
  DEACTIVATE: (id: string | number) => `/users/${id}/deactivate`,
  DELETE: (id: string | number) => `/users/${id}`,

  // Bulk Operations
  BULK_DELETE: '/users/bulk-delete',
  BULK_UPDATE: '/users/bulk-update',
} as const;

/**
 * Role & Permission endpoints
 */
export const ROLE_ENDPOINTS = {
  BASE: '/roles',
  BY_ID: (id: string | number) => `/roles/${id}`,
  PERMISSIONS: '/roles/permissions',
  ASSIGN_ROLE: (userId: string | number) => `/users/${userId}/roles`,
} as const;

/**
 * File upload endpoints
 */
export const UPLOAD_ENDPOINTS = {
  AVATAR: '/upload/avatar',
  DOCUMENT: '/upload/document',
  IMAGE: '/upload/image',
  FILE: '/upload/file',
} as const;

/**
 * Notification endpoints
 */
export const NOTIFICATION_ENDPOINTS = {
  BASE: '/notifications',
  BY_ID: (id: string | number) => `/notifications/${id}`,
  MARK_READ: (id: string | number) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/read-all',
  UNREAD_COUNT: '/notifications/unread-count',
} as const;

/**
 * Settings endpoints
 */
export const SETTINGS_ENDPOINTS = {
  BASE: '/settings',
  USER_PREFERENCES: '/settings/preferences',
  SYSTEM: '/settings/system',
} as const;

/**
 * Health check & monitoring endpoints
 */
export const HEALTH_ENDPOINTS = {
  HEALTH: '/health',
  PING: '/ping',
  VERSION: '/version',
} as const;

/**
 * Organization endpoints
 */
export const ORGANIZATION_ENDPOINTS = {
  // CRUD
  BASE: '/organizations',
  BY_ID: (id: string) => `/organizations/${id}`,

  // Bulk Operations
  BULK_DELETE: '/organizations/bulk-delete',

  // CSV Features
  IMPORT_CSV: '/organizations/import-csv',
  EXPORT_CSV: '/organizations/export-csv',
  CSV_TEMPLATE: '/organizations/csv-template',

  // Filter & Stats
  FILTER_OPTIONS: '/organizations/filters/options',
  STATS: '/organizations/stats',
} as const;

/**
 * All endpoints combined
 */
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  ROLE: ROLE_ENDPOINTS,
  UPLOAD: UPLOAD_ENDPOINTS,
  NOTIFICATION: NOTIFICATION_ENDPOINTS,
  SETTINGS: SETTINGS_ENDPOINTS,
  HEALTH: HEALTH_ENDPOINTS,
  ORGANIZATION: ORGANIZATION_ENDPOINTS,
} as const;

/**
 * Helper to build query string
 */
export const buildEndpoint = (base: string, params?: Record<string, unknown>): string => {
  if (!params) return base;

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return queryString ? `${base}?${queryString}` : base;
};

export default API_ENDPOINTS;
