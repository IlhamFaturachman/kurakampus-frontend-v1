/**
 * Authentication routes
 */

import type { AppRoute } from '@/types/router';
import { ROUTE_NAMES } from '@/constants';

export const authRoutes: AppRoute[] = [
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: {
      requiresAuth: false,
      layout: 'auth',
    },
    children: [
      {
        path: 'signin',
        name: ROUTE_NAMES.LOGIN,
        component: () => import('@/pages/page-auth-signin.vue'),
        meta: {
          title: 'Sign In',
          requiresAuth: false,
        },
      },
      {
        path: 'signup',
        name: ROUTE_NAMES.REGISTER,
        component: () => import('@/pages/page-auth-signup.vue'),
        meta: {
          title: 'Sign Up',
          requiresAuth: false,
        },
      },
      {
        path: 'forgot-password',
        name: ROUTE_NAMES.FORGOT_PASSWORD,
        component: () => import('@/pages/page-auth-forgot-password.vue'),
        meta: {
          title: 'Forgot Password',
          requiresAuth: false,
        },
      },
      {
        path: 'reset-password',
        name: ROUTE_NAMES.RESET_PASSWORD,
        component: () => import('@/pages/page-auth-reset-password.vue'),
        meta: {
          title: 'Reset Password',
          requiresAuth: false,
        },
      },
    ],
  },
];
