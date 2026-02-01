/**
 * Example Unit Test: Validators
 */

import { describe, it, expect } from 'vitest';
import {
    required,
    email,
    minLength,
    maxLength,
    password,
    confirmPassword,
    isEmpty,
} from '@/utils/validators';

describe('Validators', () => {
    describe('isEmpty', () => {
        it('returns true for null', () => {
            expect(isEmpty(null)).toBe(true);
        });

        it('returns true for undefined', () => {
            expect(isEmpty(undefined)).toBe(true);
        });

        it('returns true for empty string', () => {
            expect(isEmpty('')).toBe(true);
            expect(isEmpty('   ')).toBe(true);
        });

        it('returns true for empty array', () => {
            expect(isEmpty([])).toBe(true);
        });

        it('returns false for non-empty values', () => {
            expect(isEmpty('test')).toBe(false);
            expect(isEmpty(['item'])).toBe(false);
            expect(isEmpty({ key: 'value' })).toBe(false);
        });
    });

    describe('required', () => {
        it('validates non-empty values as valid', () => {
            const validator = required('Field is required');
            expect(validator('test').valid).toBe(true);
            expect(validator(123).valid).toBe(true);
        });

        it('validates empty values as invalid', () => {
            const validator = required('Field is required');
            const result = validator('');
            expect(result.valid).toBe(false);
            expect(result.message).toBe('Field is required');
        });

        it('uses default message when not provided', () => {
            const validator = required();
            const result = validator('');
            expect(result.message).toBe('This field is required');
        });
    });

    describe('email', () => {
        it('validates correct email addresses', () => {
            const validator = email();
            expect(validator('test@example.com').valid).toBe(true);
            expect(validator('user.name@domain.co.uk').valid).toBe(true);
        });

        it('invalidates incorrect email addresses', () => {
            const validator = email();
            expect(validator('invalid').valid).toBe(false);
            expect(validator('@example.com').valid).toBe(false);
            expect(validator('user@').valid).toBe(false);
        });

        it('allows empty values', () => {
            const validator = email();
            expect(validator('').valid).toBe(true);
        });
    });

    describe('minLength', () => {
        it('validates strings meeting minimum length', () => {
            const validator = minLength(5);
            expect(validator('12345').valid).toBe(true);
            expect(validator('123456').valid).toBe(true);
        });

        it('invalidates strings below minimum length', () => {
            const validator = minLength(5);
            const result = validator('1234');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('at least 5 characters');
        });
    });

    describe('maxLength', () => {
        it('validates strings within maximum length', () => {
            const validator = maxLength(10);
            expect(validator('12345').valid).toBe(true);
            expect(validator('1234567890').valid).toBe(true);
        });

        it('invalidates strings exceeding maximum length', () => {
            const validator = maxLength(10);
            const result = validator('12345678901');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('at most 10 characters');
        });
    });

    describe('password', () => {
        it('validates strong passwords', () => {
            const validator = password();
            expect(validator('Test123!').valid).toBe(true);
            expect(validator('SecureP@ss123').valid).toBe(true);
        });

        it('invalidates weak passwords', () => {
            const validator = password();
            expect(validator('test').valid).toBe(false);
            expect(validator('12345678').valid).toBe(false);
            expect(validator('password').valid).toBe(false);
        });
    });

    describe('confirmPassword', () => {
        it('validates matching passwords', () => {
            const validator = confirmPassword('password');
            const result = validator('test123', { password: 'test123' });
            expect(result.valid).toBe(true);
        });

        it('invalidates non-matching passwords', () => {
            const validator = confirmPassword('password');
            const result = validator('test123', { password: 'different' });
            expect(result.valid).toBe(false);
            expect(result.message).toContain('do not match');
        });
    });
});
