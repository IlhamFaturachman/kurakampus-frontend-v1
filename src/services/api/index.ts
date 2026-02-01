/**
 * API service entry point
 * Re-exports all API related services
 */

export { ApiService, apiClient } from './client';
export { default } from './client';
export { API_ENDPOINTS, AUTH_ENDPOINTS, USER_ENDPOINTS, buildEndpoint } from './endpoints';
export { ApiHealthService } from './health';
export type { HealthCheckResponse, VersionInfo } from './health';
