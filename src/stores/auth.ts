import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { jwtDecode } from 'jwt-decode'

interface User {
  id: string | number
  email: string
  name: string
  [key: string]: unknown
}

interface LoginCredentials {
  email: string
  password: string
}

interface AuthState {
  token: string | null
  user: User | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token,
    getUser: (state): User | null => state.user,
  },

  actions: {
    async login(credentials: LoginCredentials): Promise<boolean> {
      try {
        const response = await api.post<{ token: string }>('/api/login', credentials)
        this.token = response.data.token
        localStorage.setItem('token', this.token)
        this.user = jwtDecode<User>(this.token)
        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },

    logout(): void {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },

    initAuth(): void {
      if (this.token) {
        try {
          this.user = jwtDecode<User>(this.token)
        } catch {
          this.logout()
        }
      }
    }
  }
})
