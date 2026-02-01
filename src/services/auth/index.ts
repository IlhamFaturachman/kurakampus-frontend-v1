/**
 * Authentication Service
 * Handles JWT token management, login, logout, and token refresh
 */

import { ApiService } from '@/services/api';
import { AUTH_ENDPOINTS } from '@/services/api/endpoints';
import { localStorage, secureStorage } from '@/services/storage';
import { STORAGE_KEYS } from '@/constants';
import type {
  AuthTokens,
  LoginCredentials,
  RegisterData,
  User,
  PasswordResetRequest,
  PasswordResetConfirmation,
  ChangePasswordData,
  JwtPayload,
} from '@/types/auth';
import type { ApiResponse } from '@/types/common';

/**
 * Backend auth response type
 */
interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  tokens?: AuthTokens;
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Authentication Service Class
 */
export class AuthService {
  /**
   * Login user
   */
  static async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await ApiService.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);

    console.log('🔍 Login response:', response);

    // Backend returns data directly, cast to AuthResponse
    // ApiService returns response.data which is our AuthResponse
    const authData = response as unknown as AuthResponse;

    // Handle both token formats from backend
    const tokens: AuthTokens = authData.tokens ?? {
      accessToken: authData.accessToken ?? '',
      refreshToken: authData.refreshToken ?? '',
      tokenType: 'Bearer',
      expiresIn: 3600, // Default 1 hour
    };

    const user = authData.user;

    console.log('🔑 Tokens received:', tokens);
    console.log('👤 User received:', user);

    if (!user) {
      throw new Error('Invalid response: user data missing');
    }

    // Store tokens and user data
    if (tokens.accessToken) {
      console.log('💾 Storing tokens...');
      this.setTokens(tokens);
    } else {
      console.warn('⚠️ No access token received from backend!');
    }
    this.setUser(user);

    return { user, tokens };
  }

  /**
   * Register new user
   */
  static async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await ApiService.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, data);

    console.log('🔍 Register response:', response);

    // Backend returns data directly, cast to AuthResponse
    const authData = response as unknown as AuthResponse;

    // Handle both token formats from backend
    const tokens: AuthTokens = authData.tokens ?? {
      accessToken: authData.accessToken ?? '',
      refreshToken: authData.refreshToken ?? '',
      tokenType: 'Bearer',
      expiresIn: 3600, // Default 1 hour
    };

    const user = authData.user;

    if (!user) {
      throw new Error('Invalid response: user data missing');
    }

    // Store tokens and user data
    if (tokens.accessToken) {
      this.setTokens(tokens);
    }
    this.setUser(user);

    return { user, tokens };
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      // Call logout endpoint
      await ApiService.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call result
      this.clearAuthData();
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(): Promise<AuthTokens> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await ApiService.post<AuthTokens>(AUTH_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    });

    // Response is directly the tokens object
    const tokens = response as unknown as AuthTokens;
    this.setTokens(tokens);

    return tokens;
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    const response = await ApiService.get<{ user: User }>(AUTH_ENDPOINTS.ME);
    // Backend returns data directly
    const data = response as unknown as { user: User };
    const user = data.user ?? (data as unknown as User);

    // Update stored user data
    this.setUser(user);

    return user;
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(data: PasswordResetRequest): Promise<ApiResponse> {
    return await ApiService.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);
  }

  /**
   * Confirm password reset
   */
  static async confirmPasswordReset(data: PasswordResetConfirmation): Promise<ApiResponse> {
    return await ApiService.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
  }

  /**
   * Change password
   */
  static async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    return await ApiService.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, data);
  }

  /**
   * Verify email
   */
  static async verifyEmail(token: string): Promise<ApiResponse> {
    return await ApiService.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
  }

  /**
   * Resend verification email
   */
  static async resendVerificationEmail(): Promise<ApiResponse> {
    return await ApiService.post(AUTH_ENDPOINTS.RESEND_VERIFICATION);
  }

  /**
   * Store authentication tokens
   */
  static setTokens(tokens: AuthTokens): void {
    secureStorage.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    secureStorage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  }

  /**
   * Get access token
   */
  static getAccessToken(): string | null {
    return secureStorage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | null {
    return secureStorage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Store user data
   */
  static setUser(user: User): void {
    localStorage.set(STORAGE_KEYS.USER, user);
  }

  /**
   * Get stored user data
   */
  static getUser(): User | null {
    return localStorage.get<User>(STORAGE_KEYS.USER);
  }

  /**
   * Clear all authentication data
   */
  static clearAuthData(): void {
    secureStorage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    secureStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.remove(STORAGE_KEYS.USER);
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = this.decodeToken(token);
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  /**
   * Decode JWT token
   */
  static decodeToken(token: string): JwtPayload {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      throw new Error('Invalid token format');
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(): number | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = this.decodeToken(token);
      return payload.exp * 1000; // Convert to milliseconds
    } catch {
      return null;
    }
  }

  /**
   * Check if token is about to expire (within 5 minutes)
   */
  static isTokenExpiringSoon(): boolean {
    const expiration = this.getTokenExpiration();
    if (!expiration) return true;

    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() + fiveMinutes > expiration;
  }
}

/**
 * Export default
 */
export default AuthService;
