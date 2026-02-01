/**
 * Router related TypeScript types and interfaces
 */

import type { RouteRecordRaw } from 'vue-router';
import type { UserRole } from './auth';

/**
 * Route meta information
 */
export interface RouteMeta {
  title?: string;
  requiresAuth?: boolean;
  roles?: UserRole[];
  layout?: string;
  icon?: string;
  hidden?: boolean;
  breadcrumb?: boolean;
  cache?: boolean;
}

/**
 * Extended route record with typed meta
 */
export interface AppRoute extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  meta?: RouteMeta;
  children?: AppRoute[];
}

/**
 * Navigation guard context
 */
export interface GuardContext {
  isAuthenticated: boolean;
  userRole?: UserRole;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  name: string;
  path: string;
  meta?: RouteMeta;
}
