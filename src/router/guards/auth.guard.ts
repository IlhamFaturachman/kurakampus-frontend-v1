/**
 * Authentication route guard
 * Checks if user is authenticated before accessing protected routes
 */

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { AuthService } from '@/services/auth';
import { ROUTE_NAMES } from '@/constants';

/**
 * Authentication guard
 */
export const authGuard = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const requiresAuth = to.matched.some((record) => record.meta?.['requiresAuth']);
  const isAuthenticated = AuthService.isAuthenticated();

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if route requires authentication and user is not authenticated
    next({
      name: ROUTE_NAMES.LOGIN,
      query: { redirect: to.fullPath },
    });
  } else if (!requiresAuth && isAuthenticated && to.name === ROUTE_NAMES.LOGIN) {
    // Redirect authenticated users away from login page
    next({ name: ROUTE_NAMES.DASHBOARD });
  } else {
    next();
  }
};

/**
 * Role-based authorization guard
 */
export const roleGuard = (allowedRoles: string[]) => {
  return (
    _to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void => {
    const user = AuthService.getUser();

    if (!user) {
      next({ name: ROUTE_NAMES.LOGIN });
      return;
    }

    if (allowedRoles.includes(user.role)) {
      next();
    } else {
      // User doesn't have required role, redirect to dashboard or error page
      next({ name: ROUTE_NAMES.DASHBOARD });
    }
  };
};

/**
 * Guest guard (only for non-authenticated users)
 */
export const guestGuard = (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const isAuthenticated = AuthService.isAuthenticated();

  if (isAuthenticated) {
    // Redirect authenticated users to dashboard
    next({ name: ROUTE_NAMES.DASHBOARD });
  } else {
    next();
  }
};

/**
 * Email verification guard
 */
export const emailVerifiedGuard = (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const user = AuthService.getUser();

  if (!user) {
    next({ name: ROUTE_NAMES.LOGIN });
    return;
  }

  if (!user.emailVerified) {
    // Redirect to email verification page
    next({ name: 'verify-email' });
  } else {
    next();
  }
};
