/**
 * Global Error Handler Service
 * Provides centralized error handling and logging
 */

import type { ApiError } from '@/types/common';
import { config } from '@/config';
import { ERROR_CODES } from '@/constants';

/**
 * Error handler class
 */
export class ErrorHandler {
    /**
     * Handle API error
     */
    static handleApiError(error: ApiError): string {
        let userMessage = 'An error occurred. Please try again.';

        switch (error.code) {
            case ERROR_CODES.NETWORK_ERROR:
                userMessage = 'Network error. Please check your connection.';
                break;

            case ERROR_CODES.TIMEOUT_ERROR:
                userMessage = 'Request timed out. Please try again.';
                break;

            case ERROR_CODES.UNAUTHORIZED:
                userMessage = 'Please login to continue.';
                break;

            case ERROR_CODES.FORBIDDEN:
                userMessage = 'You do not have permission to perform this action.';
                break;

            case ERROR_CODES.NOT_FOUND:
                userMessage = 'The requested resource was not found.';
                break;

            case ERROR_CODES.VALIDATION_ERROR:
                userMessage = error.message || 'Validation failed. Please check your input.';
                break;

            case ERROR_CODES.SERVER_ERROR:
                userMessage = 'Server error. Please try again later.';
                break;

            default:
                userMessage = error.message || userMessage;
        }

        this.logError(error);

        return userMessage;
    }

    /**
     * Handle generic JavaScript error
     */
    static handleError(error: Error): string {
        this.logError(error);

        return error.message || 'An unexpected error occurred.';
    }

    /**
     * Log error to console (development) or external service (production)
     */
    static logError(error: Error | ApiError): void {
        if (config.enableLogging) {
            console.error('❌ Error:', {
                message: error.message,
                ...(error as ApiError).code && { code: (error as ApiError).code },
                ...(error as ApiError).statusCode && { statusCode: (error as ApiError).statusCode },
                ...(error as ApiError).errors && { errors: (error as ApiError).errors },
                stack: error.stack,
                timestamp: new Date().toISOString(),
            });
        }

        // In production, you would send this to an error tracking service
        // like Sentry, LogRocket, or your own logging service
        if (config.env === 'production') {
            // Example: Sentry.captureException(error);
        }
    }

    /**
     * Get validation errors as array of messages
     */
    static getValidationErrors(error: ApiError): string[] {
        if (!error.errors) return [];

        const messages: string[] = [];

        for (const [field, fieldErrors] of Object.entries(error.errors)) {
            if (Array.isArray(fieldErrors)) {
                fieldErrors.forEach((err) => {
                    messages.push(`${field}: ${err}`);
                });
            }
        }

        return messages;
    }
}

/**
 * Vue error handler
 * Can be registered as global error handler in main.ts
 */
export const vueErrorHandler = (err: unknown, instance: unknown, info: string): void => {
    console.error('Vue Error:', err);
    console.error('Component:', instance);
    console.error('Error Info:', info);

    ErrorHandler.logError(err as Error);
};

/**
 * Promise rejection handler
 */
export const unhandledRejectionHandler = (event: PromiseRejectionEvent): void => {
    console.error('Unhandled Promise Rejection:', event.reason);

    ErrorHandler.logError(event.reason as Error);

    // Prevent default browser handling
    event.preventDefault();
};

/**
 * Global error event handler
 */
export const globalErrorHandler = (event: ErrorEvent): void => {
    console.error('Global Error:', event.error);

    ErrorHandler.logError(event.error);

    // Prevent default browser handling
    event.preventDefault();
};

/**
 * Export default
 */
export default ErrorHandler;
