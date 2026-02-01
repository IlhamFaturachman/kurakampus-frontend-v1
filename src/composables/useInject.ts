/**
 * useInject Composable
 * Simplifies service injection with TypeScript typing
 */

import { inject } from 'vue';
import type { InjectionKey } from 'vue';
import {
    API_SERVICE_KEY,
    AUTH_SERVICE_KEY,
    LOCAL_STORAGE_KEY,
    SESSION_STORAGE_KEY,
    SECURE_STORAGE_KEY,
    ERROR_HANDLER_KEY,
    LOGGER_KEY,
} from '@/boot/services';
import { ApiService } from '@/services/api';
import { AuthService } from '@/services/auth';
import { localStorage, sessionStorage, secureStorage } from '@/services/storage';
import { ErrorHandler } from '@/services/error';
import { Logger } from '@/services/logger';

/**
 * Generic inject function with error handling
 */
function injectStrict<T>(key: InjectionKey<T>, fallback?: T): T {
    const resolved = inject(key, fallback);

    if (!resolved) {
        throw new Error(`Could not resolve ${key.description}`);
    }

    return resolved;
}

/**
 * Inject API service
 */
export function useApiService(): typeof ApiService {
    return injectStrict(API_SERVICE_KEY, ApiService);
}

/**
 * Inject Auth service
 */
export function useAuthService(): typeof AuthService {
    return injectStrict(AUTH_SERVICE_KEY, AuthService);
}

/**
 * Inject LocalStorage service
 */
export function useLocalStorage(): typeof localStorage {
    return injectStrict(LOCAL_STORAGE_KEY, localStorage);
}

/**
 * Inject SessionStorage service
 */
export function useSessionStorage(): typeof sessionStorage {
    return injectStrict(SESSION_STORAGE_KEY, sessionStorage);
}

/**
 * Inject SecureStorage service
 */
export function useSecureStorage(): typeof secureStorage {
    return injectStrict(SECURE_STORAGE_KEY, secureStorage);
}

/**
 * Inject ErrorHandler service
 */
export function useErrorHandler(): typeof ErrorHandler {
    return injectStrict(ERROR_HANDLER_KEY, ErrorHandler);
}

/**
 * Inject Logger service
 */
export function useLogger(): typeof Logger {
    return injectStrict(LOGGER_KEY, Logger);
}

/**
 * Inject all services at once
 */
export function useServices() {
    return {
        api: useApiService(),
        auth: useAuthService(),
        localStorage: useLocalStorage(),
        sessionStorage: useSessionStorage(),
        secureStorage: useSecureStorage(),
        errorHandler: useErrorHandler(),
        logger: useLogger(),
    };
}
