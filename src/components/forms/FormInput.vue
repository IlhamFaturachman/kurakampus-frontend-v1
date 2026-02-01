/** * FormInput Component * Form-specific input with integrated validation */

<template>
  <BaseInput
    :model-value="modelValue ?? ''"
    :label="label ?? ''"
    :type="type"
    :placeholder="placeholder ?? ''"
    :error="hasError"
    :error-message="displayError"
    :hint="hint ?? ''"
    :disable="disable"
    :readonly="readonly"
    :dense="dense"
    :loading="loading"
    :clearable="clearable"
    @update:model-value="handleInput"
    @blur="handleBlur"
    v-bind="$attrs"
  >
    <template v-if="$slots['prepend']" #prepend>
      <slot name="prepend" />
    </template>

    <template v-if="$slots['append']" #append>
      <slot name="append" />
    </template>
  </BaseInput>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import BaseInput from '@/components/common/BaseInput.vue';
  import type { ValidatorFn } from '@/utils/validators';

  /**
   * Props interface
   */
  interface Props {
    modelValue?: string | number;
    label?: string;
    type?: string;
    placeholder?: string;
    hint?: string;
    disable?: boolean;
    readonly?: boolean;
    dense?: boolean;
    loading?: boolean;
    clearable?: boolean;
    validators?: ValidatorFn[];
    validateOnBlur?: boolean;
  }

  /**
   * Props with defaults
   */
  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    validateOnBlur: true,
    disable: false,
    readonly: false,
    dense: false,
    loading: false,
    clearable: false,
  });

  /**
   * Emits
   */
  const emit = defineEmits<{
    'update:modelValue': [value: string | number];
    blur: [event: FocusEvent];
    error: [error: string | null];
  }>();

  /**
   * State
   */
  const error = ref<string | null>(null);
  const touched = ref<boolean>(false);

  /**
   * Computed
   */
  const hasError = computed(() => touched.value && !!error.value);
  const displayError = computed(() => (touched.value ? error.value : null) ?? '');

  /**
   * Validate input
   */
  const validate = (): boolean => {
    if (!props.validators || props.validators.length === 0) {
      error.value = null;
      return true;
    }

    for (const validator of props.validators) {
      const result = validator(props.modelValue);

      if (!result.valid && result.message) {
        error.value = result.message;
        emit('error', result.message);
        return false;
      }
    }

    error.value = null;
    emit('error', null);
    return true;
  };

  /**
   * Handle input event
   */
  const handleInput = (value: string | number): void => {
    emit('update:modelValue', value);

    // Validate if field has been touched
    if (touched.value) {
      validate();
    }
  };

  /**
   * Handle blur event
   */
  const handleBlur = (event: FocusEvent): void => {
    touched.value = true;

    if (props.validateOnBlur) {
      validate();
    }

    emit('blur', event);
  };

  /**
   * Expose validate method
   */
  defineExpose({
    validate,
  });
</script>
