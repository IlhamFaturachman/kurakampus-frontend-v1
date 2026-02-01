/**
 * Vue Router configuration
 * Main router setup with guards and middlewares
 */

import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import routes from './routes';
import { authGuard } from './guards';
import { loggerMiddleware, titleMiddleware } from './middlewares';
import type { Router } from 'vue-router';

/**
 * Create and configure router instance
 */
export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env['SERVER']
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router: Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes: routes as unknown as RouteRecordRaw[],
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  /**
   * Global before each guard
   * Execute middlewares and guards in order
   */
  Router.beforeEach((to, from, next) => {
    // Execute middlewares
    loggerMiddleware(to, from, () => { });
    titleMiddleware(to, from, () => { });

    // Execute authentication guard
    authGuard(to, from, next);
  });

  /**
   * Global after each hook
   * Cleanup and post-navigation tasks
   */
  Router.afterEach((_to, _from) => {
    // Scroll to top
    window.scrollTo(0, 0);

    // You can add analytics tracking here
    // trackPageView(to.fullPath);
  });

  /**
   * Global error handler
   */
  Router.onError((error) => {
    console.error('Router error:', error);
  });

  return Router;
});
