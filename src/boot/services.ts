/**
 * Dependency Injection Boot File
 * Provides services and utilities globally using provide/inject pattern
 */

import { boot } from 'quasar/wrappers';
import type { InjectionKey } from 'vue';
import { ApiService } from '@/services/api';
import { AuthService } from '@/services/auth';
import { localStorage, sessionStorage, secureStorage } from '@/services/storage';
import { ErrorHandler } from '@/services/error';
import { Logger } from '@/services/logger';

/**
 * Injection keys with TypeScript typing
 */
export const API_SERVICE_KEY: InjectionKey<typeof ApiService> = Symbol('apiService');
export const AUTH_SERVICE_KEY: InjectionKey<typeof AuthService> = Symbol('authService');
export const LOCAL_STORAGE_KEY: InjectionKey<typeof localStorage> = Symbol('localStorage');
export const SESSION_STORAGE_KEY: InjectionKey<typeof sessionStorage> = Symbol('sessionStorage');
export const SECURE_STORAGE_KEY: InjectionKey<typeof secureStorage> = Symbol('secureStorage');
export const ERROR_HANDLER_KEY: InjectionKey<typeof ErrorHandler> = Symbol('errorHandler');
export const LOGGER_KEY: InjectionKey<typeof Logger> = Symbol('logger');

/**
 * Service container
 */
export const services = {
    api: ApiService,
    auth: AuthService,
    localStorage,
    sessionStorage,
    secureStorage,
    errorHandler: ErrorHandler,
    logger: Logger,
} as const;

/**
 * Boot function to setup dependency injection
 */
export default boot(({ app }) => {
    // Provide services globally
    app.provide(API_SERVICE_KEY, ApiService);
    app.provide(AUTH_SERVICE_KEY, AuthService);
    app.provide(LOCAL_STORAGE_KEY, localStorage);
    app.provide(SESSION_STORAGE_KEY, sessionStorage);
    app.provide(SECURE_STORAGE_KEY, secureStorage);
    app.provide(ERROR_HANDLER_KEY, ErrorHandler);
    app.provide(LOGGER_KEY, Logger);

    // Make services available on globalProperties for Options API compatibility
    // Note: $api is already defined in axios.ts, using $apiService here
    app.config.globalProperties['$apiService'] = ApiService;
    app.config.globalProperties['$auth'] = AuthService;
    app.config.globalProperties['$localStorage'] = localStorage;
    app.config.globalProperties['$sessionStorage'] = sessionStorage;
    app.config.globalProperties['$secureStorage'] = secureStorage;
    app.config.globalProperties['$errorHandler'] = ErrorHandler;
    app.config.globalProperties['$logger'] = Logger;
});

/**
 * TypeScript augmentation for global properties
 */
declare module 'vue' {
    interface ComponentCustomProperties {
        // $api is already declared in axios.ts as AxiosInstance
        $apiService: typeof ApiService;
        $auth: typeof AuthService;
        $localStorage: typeof localStorage;
        $sessionStorage: typeof sessionStorage;
        $secureStorage: typeof secureStorage;
        $errorHandler: typeof ErrorHandler;
        $logger: typeof Logger;
    }
}
