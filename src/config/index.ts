/**
 * Environment-based configuration
 */

/**
 * Environment types
 */
export type Environment = 'development' | 'staging' | 'production' | 'test';

/**
 * Application configuration interface
 */
interface AppConfig {
  env: Environment;
  apiBaseUrl: string;
  apiTimeout: number;
  enableLogging: boolean;
  enableMocking: boolean;
  storagePrefix: string;
  appName: string;
  appVersion: string;
}

/**
 * Get current environment
 */
export const getEnvironment = (): Environment => {
  const env = import.meta.env.MODE;
  if (env === 'production') return 'production';
  if (env === 'staging') return 'staging';
  if (env === 'test') return 'test';
  return 'development';
};

/**
 * Check if running in development mode
 */
export const isDevelopment = (): boolean => getEnvironment() === 'development';

/**
 * Check if running in production mode
 */
export const isProduction = (): boolean => getEnvironment() === 'production';

/**
 * Check if running in test mode
 */
export const isTest = (): boolean => getEnvironment() === 'test';

/**
 * Application configuration object
 */
export const config: AppConfig = {
  env: getEnvironment(),
  apiBaseUrl: import.meta.env['VITE_API_BASE_URL'] ?? 'http://localhost:3000/api',
  apiTimeout: Number(import.meta.env['VITE_API_TIMEOUT']) || 30000,
  enableLogging: import.meta.env['VITE_ENABLE_LOGGING'] === 'true' || isDevelopment(),
  enableMocking: import.meta.env['VITE_ENABLE_MOCKING'] === 'true' || false,
  storagePrefix: import.meta.env['VITE_STORAGE_PREFIX'] ?? 'kurakampus_',
  appName: import.meta.env['VITE_APP_NAME'] ?? 'KuraKampus',
  appVersion: import.meta.env['VITE_APP_VERSION'] ?? '1.0.0',
};

/**
 * Export configuration as default
 */
export default config;
