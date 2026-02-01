/**
 * NestJS Backend DTOs
 * Type definitions that match NestJS backend Data Transfer Objects
 *
 * Note: Update these types based on your actual NestJS backend DTOs
 * You can auto-generate these from Swagger/OpenAPI spec if available
 */

import type { UserRole, UserStatus, User, AuthTokens } from '@/types/auth';

/**
 * ============================================
 * Common DTOs
 * ============================================
 */

/**
 * Standard API Response from NestJS
 */
export interface NestJSResponse<T = unknown> {
    success: boolean;
    message?: string;
    data: T;
    timestamp?: string;
}

/**
 * Paginated Response from NestJS
 */
export interface NestJSPaginatedResponse<T = unknown> {
    data: T[];
    meta: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

/**
 * Error Response from NestJS
 */
export interface NestJSErrorResponse {
    success: false;
    message: string;
    error?: string;
    statusCode: number;
    timestamp: string;
    path?: string;
    errors?: Array<{
        field: string;
        message: string;
        constraint?: string;
    }>;
}

/**
 * ============================================
 * Authentication DTOs
 * ============================================
 */

/**
 * Login Request DTO
 */
export interface LoginDto {
    email: string;
    password: string;
    rememberMe?: boolean;
}

/**
 * Login Response DTO
 */
export interface LoginResponseDto {
    user: UserDto;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

/**
 * Register Request DTO
 */
export interface RegisterDto {
    email: string;
    username: string;
    password: string;
    passwordConfirmation?: string;
    firstName: string;
    lastName: string;
    agreeToTerms?: boolean;
}

/**
 * Register Response DTO
 */
export interface RegisterResponseDto {
    user: UserDto;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

/**
 * Refresh Token Request DTO
 */
export interface RefreshTokenDto {
    refreshToken: string;
}

/**
 * Refresh Token Response DTO
 */
export interface RefreshTokenResponseDto {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

/**
 * Forgot Password Request DTO
 */
export interface ForgotPasswordDto {
    email: string;
}

/**
 * Reset Password Request DTO
 */
export interface ResetPasswordDto {
    token: string;
    password: string;
    passwordConfirmation?: string;
}

/**
 * Change Password Request DTO
 */
export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirmation?: string;
}

/**
 * Verify Email Request DTO
 */
export interface VerifyEmailDto {
    token: string;
}

/**
 * ============================================
 * User DTOs
 * ============================================
 */

/**
 * User DTO from backend
 */
export interface UserDto {
    id: string | number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    isEmailVerified: boolean;
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Create User Request DTO
 */
export interface CreateUserDto {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    status?: UserStatus;
}

/**
 * Update User Request DTO
 */
export interface UpdateUserDto {
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    role?: UserRole;
    status?: UserStatus;
}

/**
 * User Query/Filter DTO
 */
export interface UserQueryDto {
    page?: number;
    perPage?: number;
    search?: string;
    role?: UserRole;
    status?: UserStatus;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * ============================================
 * File Upload DTOs
 * ============================================
 */

/**
 * File Upload Response DTO
 */
export interface FileUploadResponseDto {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
    path: string;
}

/**
 * ============================================
 * Notification DTOs
 * ============================================
 */

/**
 * Notification DTO
 */
export interface NotificationDto {
    id: string | number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    createdAt: string;
    readAt?: string;
}

/**
 * Create Notification Request DTO
 */
export interface CreateNotificationDto {
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    userId?: string | number;
}

/**
 * ============================================
 * Type Mappers/Converters
 * ============================================
 */

/**
 * Convert NestJS UserDto to Frontend User type
 */
export const mapUserDtoToUser = (dto: UserDto): User => ({
    id: dto.id,
    email: dto.email,
    username: dto.username,
    firstName: dto.firstName,
    lastName: dto.lastName,
    fullName: dto.fullName ?? `${dto.firstName} ${dto.lastName}`,
    ...(dto.avatar && { avatar: dto.avatar }),
    role: dto.role,
    status: dto.status,
    emailVerified: dto.isEmailVerified,
    ...(dto.lastLoginAt && { lastLoginAt: dto.lastLoginAt }),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
});

/**
 * Convert NestJS LoginResponse to Frontend AuthTokens
 */
export const mapLoginResponseToAuth = (
    dto: LoginResponseDto
): { user: User; tokens: AuthTokens } => ({
    user: mapUserDtoToUser(dto.user),
    tokens: {
        accessToken: dto.accessToken,
        refreshToken: dto.refreshToken,
        tokenType: 'Bearer',
        expiresIn: dto.expiresIn,
    },
});
