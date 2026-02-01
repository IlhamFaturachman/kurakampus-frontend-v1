/**
 * Route middleware for logging
 */

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { config } from '@/config';

/**
 * Log navigation
 */
export const loggerMiddleware = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
): void => {
    if (config.enableLogging) {
        console.log('🚀 Navigating:', {
            from: from.fullPath,
            to: to.fullPath,
            name: to.name,
            params: to.params,
            query: to.query,
        });
    }

    next();
};

/**
 * Set page title
 */
export const titleMiddleware = (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
): void => {
    const title = to.meta['title'] as string | undefined;

    if (title) {
        document.title = `${title} | ${config.appName}`;
    } else {
        document.title = config.appName;
    }

    next();
};

/**
 * Progress bar middleware (can be used with loading indicator)
 */
export const progressMiddleware = (
    _to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
): void => {
    // Start loading indicator
    // You can integrate with your loading store/component here

    next();

    // Stop loading indicator after navigation
    // This would typically be done in router.afterEach
};
