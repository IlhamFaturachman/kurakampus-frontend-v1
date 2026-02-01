/**
 * useForm Composable
 * Provides form state management and validation
 */

import { ref, reactive, computed, type Ref } from 'vue';
import type { ValidatorFn, ValidationResult } from '@/utils/validators';
import { validateForm } from '@/utils/validators';

// FormState interface removed - using reactive Record<string, unknown> instead
// FormField interface removed - not needed for current implementation

/**
 * useForm return type
 */
interface UseFormReturn<T extends Record<string, unknown>> {
    formData: T;
    errors: Ref<Record<string, string>>;
    touched: Ref<Record<string, boolean>>;
    isValid: Ref<boolean>;
    isDirty: Ref<boolean>;
    isSubmitting: Ref<boolean>;
    setFieldValue: (field: string, value: unknown) => void;
    setFieldTouched: (field: string, touched: boolean) => void;
    setFieldError: (field: string, error: string) => void;
    validateField: (field: string) => boolean;
    validate: () => boolean;
    reset: () => void;
    submit: (onSubmit: (data: T) => Promise<void>) => Promise<void>;
}

/**
 * useForm composable
 */
export const useForm = <T extends Record<string, unknown>>(
    initialValues: T,
    validationRules?: Record<string, ValidatorFn[]>
): UseFormReturn<T> => {
    // Form data
    const formData = reactive<T>({ ...initialValues });

    // Form state
    const errors = ref<Record<string, string>>({});
    const touched = ref<Record<string, boolean>>({});
    const isSubmitting = ref<boolean>(false);

    // Computed
    const isValid = computed<boolean>(() => {
        return Object.keys(errors.value).length === 0;
    });

    const isDirty = computed<boolean>(() => {
        return JSON.stringify(formData) !== JSON.stringify(initialValues);
    });

    /**
     * Set field value
     */
    const setFieldValue = (field: string, value: unknown): void => {
        (formData as Record<string, unknown>)[field] = value;

        // Validate field if it's been touched
        if (touched.value[field] && validationRules?.[field]) {
            validateField(field);
        }
    };

    /**
     * Set field touched state
     */
    const setFieldTouched = (field: string, isTouched: boolean = true): void => {
        touched.value[field] = isTouched;

        if (isTouched && validationRules?.[field]) {
            validateField(field);
        }
    };

    /**
     * Set field error
     */
    const setFieldError = (field: string, error: string): void => {
        if (error) {
            errors.value[field] = error;
        } else {
            delete errors.value[field];
        }
    };

    /**
     * Validate single field
     */
    const validateField = (field: string): boolean => {
        const validators = validationRules?.[field];

        if (!validators) {
            delete errors.value[field];
            return true;
        }

        const value = (formData as Record<string, unknown>)[field];

        for (const validator of validators) {
            const result: ValidationResult = validator(value);

            if (!result.valid && result.message) {
                setFieldError(field, result.message);
                return false;
            }
        }

        delete errors.value[field];
        return true;
    };

    /**
     * Validate all fields
     */
    const validate = (): boolean => {
        if (!validationRules) {
            return true;
        }

        const validationErrors = validateForm(
            formData as Record<string, unknown>,
            validationRules
        );

        errors.value = validationErrors;

        return Object.keys(validationErrors).length === 0;
    };

    /**
     * Reset form
     */
    const reset = (): void => {
        Object.assign(formData, initialValues);
        errors.value = {};
        touched.value = {};
        isSubmitting.value = false;
    };

    /**
     * Submit form
     */
    const submit = async (onSubmit: (data: T) => Promise<void>): Promise<void> => {
        // Mark all fields as touched
        Object.keys(formData).forEach((key) => {
            touched.value[key] = true;
        });

        // Validate form
        if (!validate()) {
            return;
        }

        try {
            isSubmitting.value = true;
            await onSubmit({ ...formData } as T);
        } finally {
            isSubmitting.value = false;
        }
    };

    return {
        formData: formData as T,
        errors,
        touched,
        isValid,
        isDirty,
        isSubmitting,
        setFieldValue,
        setFieldTouched,
        setFieldError,
        validateField,
        validate,
        reset,
        submit,
    };
};
