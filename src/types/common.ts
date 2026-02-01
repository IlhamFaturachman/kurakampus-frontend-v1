/**
 * Common TypeScript types and interfaces used across the application
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
    status: 'success' | 'error';
    timestamp?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T = unknown> {
    data: T[];
    pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
    };
}

/**
 * API error response structure
 */
export interface ApiError {
    message: string;
    code: string;
    statusCode: number;
    errors?: Record<string, string[]> | undefined;
    stack?: string;
}

/**
 * API Error class for proper error handling
 */
export class ApiErrorResponse extends Error implements ApiError {
    code: string;
    statusCode: number;
    errors?: Record<string, string[]> | undefined;

    constructor(message: string, code: string, statusCode: number, errors?: Record<string, string[]>) {
        super(message);
        this.name = 'ApiErrorResponse';
        this.code = code;
        this.statusCode = statusCode;
        this.errors = errors;
        Object.setPrototypeOf(this, ApiErrorResponse.prototype);
    }
}

/**
 * Base entity interface with common fields
 */
export interface BaseEntity {
    id: string | number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

/**
 * Request state for API calls
 */
export interface RequestState {
    loading: boolean;
    error: ApiError | null;
    success: boolean;
}

/**
 * Form validation error
 */
export interface ValidationError {
    field: string;
    message: string;
}

/**
 * HTTP methods type
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Query parameters type
 */
export type QueryParams = Record<string, string | number | boolean | undefined>;

/**
 * Generic object type
 */
export type GenericObject = Record<string, unknown>;

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * Optional type helper
 */
export type Optional<T> = T | undefined;

/**
 * Deep partial type helper
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make specific properties required
 */
export type RequireProperties<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific properties optional
 */
export type OptionalProperties<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
