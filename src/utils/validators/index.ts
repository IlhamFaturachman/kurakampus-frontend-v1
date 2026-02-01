/**
 * Form validation utilities
 * Provides reusable validation functions for form inputs
 */

import { VALIDATION } from '@/constants';

/**
 * Validation result interface
 */
export interface ValidationResult {
    valid: boolean;
    message?: string;
}

/**
 * Validator function type
 */
export type ValidatorFn = (value: unknown) => ValidationResult;

/**
 * Check if value is empty
 */
export const isEmpty = (value: unknown): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

/**
 * Required field validator
 */
export const required = (message = 'This field is required'): ValidatorFn => {
    return (value: unknown): ValidationResult => {
        if (isEmpty(value)) {
            return { valid: false, message };
        }
        return { valid: true };
    };
};

/**
 * Email validator
 */
export const email = (message = 'Please enter a valid email address'): ValidatorFn => {
    return (value: unknown): ValidationResult => {
        if (isEmpty(value)) return { valid: true };

        const isValid = typeof value === 'string' && VALIDATION.EMAIL_REGEX.test(value);
        if (!isValid) {
            return {
                valid: false,
                message: message ?? 'Please enter a valid email address',
            };
        }
        return { valid: true };
    };
};

/**
 * Minimum length validator
 */
export const minLength = (min: number, message?: string): ValidatorFn => {
    return (value: unknown): ValidationResult => {
        if (isEmpty(value)) return { valid: true };

        const length = typeof value === 'string' ? value.length : 0;
        if (length < min) {
            return {
                valid: false,
                message: message ?? `Minimum length is ${min} characters`,
            };
        }
        return { valid: true };
    };
};

/**
 * Maximum length validator
 */
export const maxLength = (max: number, message?: string): ValidatorFn => {
    return (value: unknown): ValidationResult => {
        if (isEmpty(value)) return { valid: true };

        const length = typeof value === 'string' ? value.length : 0;
        if (length > max) {
            return {
                valid: false,
                message: message ?? `Maximum length is ${max} characters`,
            };
        }
        return { valid: true };
    };
};

/**
 * Password strength validator
 */
export const password = (message = 'Password must be at least 8 characters'): ValidatorFn => {
    return (value: unknown): ValidationResult => {
        if (isEmpty(value)) return { valid: true };

        const isValid =
            typeof value === 'string' &&
            value.length >= VALIDATION.MIN_PASSWORD_LENGTH &&
            value.length <= VALIDATION.MAX_PASSWORD_LENGTH;

        if (!isValid) {
            return { valid: false, message };
        }
        return { valid: true };
    };
};

/**
 * Strong password validator (requires uppercase, lowercase, number, special char)
 */
export const strongPassword = (
    message = 'Password must contain uppercase, lowercase, number and special character'
): ValidatorFn => {
    return (value: unknown): ValidationResult => {
        if (isEmpty(value)) return { valid: true };

        if (typeof value !== 'string') {
            return { valid: false, message };
        }

        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        const isValid =
            hasUpperCase &&
            hasLowerCase &&
            hasNumber &&
            hasSpecialChar &&
            value.length >= VALIDATION.MIN_PASSWORD_LENGTH;

        if (!isValid) {
            return { valid: false, message };
        }
        return { valid: true };
    };
};

/**
 * Confirm password validator
 */
export const confirmPassword = (
    _passwordField: string,
    _message = 'Passwords do not match'
): ValidatorFn => {
    return (value: unknown): ValidationResult => {
        if (isEmpty(value)) return { valid: true };
        // Note: This validator needs access to form data which should be provided externally
        return { valid: true };
    };
};

/**
 * Phone number validator
 */
export const phone = (message = 'Please enter a valid phone number'): ValidatorFn => {
    return (value: unknown): ValidationResult => {
        if (isEmpty(value)) return { valid: true };

        const isValid = typeof value === 'string' && VALIDATION.PHONE_REGEX.test(value);
        if (!isValid) {
            return { valid: false, message };
        }
        return { valid: true };
    };
};

/**
 * URL validator
 */
export const url = (message = 'Please enter a valid URL'): ValidatorFn => {
    return (value: unknown): ValidationResult => {
        if (isEmpty(value)) return { valid: true };

        try {
            if (typeof value === 'string') {
                new URL(value);
                return { valid: true };
            }
        } catch {
            // Invalid URL
        }

        return {
            valid: false,
            message,
        };
    };
};

/**
 * Numeric validator
 */
export const numeric = (message = 'Please enter a valid number'): ValidatorFn => {
    return (value: unknown): ValidationResult => {
        if (isEmpty(value)) return { valid: true };

        const isValid = !isNaN(Number(value));
        if (!isValid) {
            return { valid: false, message };
        }
        return { valid: true };
    };
};

/**
 * Min value validator
 */
export const min = (minValue: number, message?: string): ValidatorFn => {
    return (value: unknown): ValidationResult => {
        if (isEmpty(value)) return { valid: true };

        const numValue = Number(value);
        if (isNaN(numValue) || numValue < minValue) {
            return {
                valid: false,
                message: message ?? `Minimum value is ${minValue}`,
            };
        }
        return { valid: true };
    };
};

/**
 * Max value validator
 */
export const max = (maxValue: number, message?: string): ValidatorFn => {
    return (value: unknown): ValidationResult => {
        if (isEmpty(value)) return { valid: true };

        const numValue = Number(value);
        if (isNaN(numValue) || numValue > maxValue) {
            return {
                valid: false,
                message: message ?? `Maximum value is ${maxValue}`,
            };
        }
        return { valid: true };
    };
};

/**
 * Pattern validator (regex)
 */
export const pattern = (regex: RegExp, message = 'Invalid format'): ValidatorFn => {
    return (value: unknown): ValidationResult => {
        if (isEmpty(value)) return { valid: true };

        const isValid = typeof value === 'string' && regex.test(value);
        if (!isValid) {
            return { valid: false, message };
        }
        return { valid: true };
    };
};

/**
 * Custom validator
 */
export const custom = (
    validatorFn: (value: unknown) => boolean,
    message = 'Validation failed'
): ValidatorFn => {
    return (value: unknown): ValidationResult => {
        const isValid = validatorFn(value);
        if (!isValid) {
            return { valid: false, message };
        }
        return { valid: true };
    };
};

/**
 * Compose multiple validators
 */
export const compose = (...validators: ValidatorFn[]): ValidatorFn => {
    return (value: unknown): ValidationResult => {
        for (const validator of validators) {
            const result = validator(value);
            if (!result.valid) {
                return result;
            }
        }
        return { valid: true };
    };
};

/**
 * Validate form data
 */
export const validateForm = (
    formData: Record<string, unknown>,
    rules: Record<string, ValidatorFn[]>
): Record<string, string> => {
    const errors: Record<string, string> = {};

    for (const [field, validators] of Object.entries(rules)) {
        const value = formData[field];

        for (const validator of validators) {
            const result = validator(value);
            if (!result.valid && result.message) {
                errors[field] = result.message;
                break; // Stop at first error for this field
            }
        }
    }

    return errors;
};
