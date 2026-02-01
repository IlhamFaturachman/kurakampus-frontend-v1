import { defineStore } from 'pinia'
import { api } from '@/boot/axios'
import { jwtDecode } from 'jwt-decode'
import type { AuthState, LoginCredentials } from '@/dependencies/types/auth'
import type { User } from '@/dependencies/types/user'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: localStorage.getItem('accessToken') ?? null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.accessToken,
    getUser: (state): User | null => state.user,
  },

  actions: {
    async login(credentials: LoginCredentials): Promise<boolean> {
      try {
        const response = await api.post<{ accessToken: string }>('/api/login', credentials)
        this.accessToken = response.data.accessToken
        if (this.accessToken) {
          localStorage.setItem('accessToken', this.accessToken)
          this.user = jwtDecode<User>(this.accessToken)
        }
        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },

    logout(): void {
      this.accessToken = null
      this.user = null
      localStorage.removeItem('accessToken')
    },

    initAuth(): void {
      if (this.accessToken) {
        try {
          this.user = jwtDecode<User>(this.accessToken)
        } catch {
          this.logout()
        }
      }
    }
  }
})
