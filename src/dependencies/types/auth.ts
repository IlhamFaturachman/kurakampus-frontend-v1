import type { User } from './user'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  accessToken: string | null
  user: User | null
}
