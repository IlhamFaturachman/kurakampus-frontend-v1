/**
 * Routes entry point
 * Combines all route modules
 */

import type { AppRoute } from '@/types/router';
import { authRoutes } from './auth.routes';
import { dashboardRoutes } from './dashboard.routes';
import { ROUTE_NAMES } from '@/constants';

/**
 * All application routes
 */
export const routes: AppRoute[] = [
    // Auth routes should come first as they have specific paths
    ...authRoutes,
    // Dashboard routes (includes root '/')
    ...dashboardRoutes,

    // 404 Not Found - Always keep this as the last route
    {
        path: '/:pathMatch(.*)*',
        name: ROUTE_NAMES.NOT_FOUND,
        component: () => import('@/pages/ErrorNotFound.vue'),
        meta: {
            title: 'Page Not Found',
            requiresAuth: false,
        },
    },
];

export default routes;
