/**
 * Organization routes
 */

import type { AppRoute } from '@/types/router';
import { ROUTE_NAMES } from '@/constants';

export const organizationRoutes: AppRoute[] = [
    {
        path: 'organizations',
        name: ROUTE_NAMES.ORGANIZATIONS,
        component: () => import('@/pages/organizations/OrganizationListPage.vue'),
        meta: {
            title: 'Database Organisasi',
            requiresAuth: true,
            breadcrumb: true,
        },
    },
    {
        path: 'organizations/:id',
        name: ROUTE_NAMES.ORGANIZATION_DETAIL,
        component: () => import('@/pages/organizations/OrganizationDetailPage.vue'),
        meta: {
            title: 'Detail Organisasi',
            requiresAuth: true,
            breadcrumb: true,
        },
        props: true,
    },
];
