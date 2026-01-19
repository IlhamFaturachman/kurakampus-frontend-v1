import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth'

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Navigation guard
  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const requiresAuth = to.meta.requiresAuth !== false
    const isAuthPage = to.name === 'login' || to.name === 'signup'

    if (requiresAuth && !authStore.isAuthenticated) {
      // Redirect to login if trying to access protected route
      next({ name: 'login' })
    } else if (isAuthPage && authStore.isAuthenticated) {
      // Redirect to dashboard if already authenticated
      next({ name: 'dashboard' })
    } else {
      next()
    }
  })

  return Router
})
