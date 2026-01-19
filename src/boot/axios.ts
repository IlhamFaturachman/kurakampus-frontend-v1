import { boot } from 'quasar/wrappers'
import type { AxiosInstance } from 'axios';
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth'

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $api: AxiosInstance
  }
}

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
})

export default boot(({ app, router }) => {
  // Request interceptor - inject token
  api.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore()
      if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error instanceof Error ? error : new Error(String(error)))
    }
  )

  // Response interceptor - handle errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
        void router.push({ name: 'login' })
      }
      return Promise.reject(error instanceof Error ? error : new Error(String(error)))
    }
  )

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
