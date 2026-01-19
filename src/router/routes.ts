import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // Main App Routes (Protected)
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/home/IndexPage.vue'),
        meta: { title: 'Home' }
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('pages/dashboard/DashboardPage.vue'),
        meta: { title: 'Dashboard' }
      }
    ]
  },

  // Authentication Routes (Public)
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/auth/LoginPage.vue'),
        meta: { title: 'Login' }
      },
      {
        path: 'signup',
        name: 'signup',
        component: () => import('pages/auth/SignupPage.vue'),
        meta: { title: 'Sign Up' }
      }
    ]
  },

  // Error Pages
  {
    path: '/:catchAll(.*)*',
    name: 'error-404',
    component: () => import('pages/errors/ErrorNotFound.vue'),
    meta: { title: 'Page Not Found' }
  }
]

export default routes
