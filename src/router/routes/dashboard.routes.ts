/**
 * Dashboard routes
 */

import type { AppRoute } from '@/types/router';
import { ROUTE_NAMES } from '@/constants';
import { organizationRoutes } from './organization.routes';

export const dashboardRoutes: AppRoute[] = [
  // Landing page - no layout wrapper (has its own navbar)
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: () => import('@/pages/IndexPage.vue'),
    meta: {
      title: 'Home',
      requiresAuth: false,
    },
  },
  // Dashboard routes with MainLayout
  {
    path: '/app',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true,
      layout: 'main',
    },
    children: [
      {
        path: '',
        name: ROUTE_NAMES.DASHBOARD,
        component: () => import('@/pages/DashboardPage.vue'),
        meta: {
          title: 'Dashboard',
          requiresAuth: true,
          breadcrumb: true,
        },
      },
      // Organization routes
      ...organizationRoutes,
      // TODO: Create these pages
      // {
      //     path: 'profile',
      //     name: ROUTE_NAMES.PROFILE,
      //     component: () => import('@/pages/page-profile.vue'),
      //     meta: {
      //         title: 'Profile',
      //         requiresAuth: true,
      //         breadcrumb: true,
      //     },
      // },
      // {
      //     path: 'settings',
      //     name: ROUTE_NAMES.SETTINGS,
      //     component: () => import('@/pages/page-settings.vue'),
      //     meta: {
      //         title: 'Settings',
      //         requiresAuth: true,
      //         roles: [UserRole.ADMIN, UserRole.USER],
      //         breadcrumb: true,
      //     },
      // },
    ],
  },
];
