/** * BaseInput Component * Atomic design - Atom level */

<template>
  <q-input
    :model-value="modelValue"
    :label="label"
    :type="type as any"
    :placeholder="placeholder"
    :error="hasError"
    :error-message="errorMessage"
    :hint="hint"
    :disable="disable"
    :readonly="readonly"
    :dense="dense"
    :outlined="outlined"
    :filled="filled"
    :standout="standout"
    :loading="loading"
    :clearable="clearable"
    @update:model-value="handleInput"
    @blur="(e: any) => handleBlur(e)"
    @focus="(e: any) => handleFocus(e)"
    v-bind="$attrs"
  >
    <template v-if="$slots['prepend']" #prepend>
      <slot name="prepend" />
    </template>

    <template v-if="$slots['append']" #append>
      <slot name="append" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  /**
   * Props interface
   */
  interface Props {
    modelValue?: string | number;
    label?: string;
    type?: string;
    placeholder?: string;
    error?: boolean;
    errorMessage?: string;
    hint?: string;
    disable?: boolean;
    readonly?: boolean;
    dense?: boolean;
    outlined?: boolean;
    filled?: boolean;
    standout?: boolean | string;
    loading?: boolean;
    clearable?: boolean;
  }

  /**
   * Props with defaults
   */
  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    outlined: true,
    error: false,
    disable: false,
    readonly: false,
    dense: false,
    filled: false,
    loading: false,
    clearable: false,
  });

  /**
   * Emits
   */
  const emit = defineEmits<{
    'update:modelValue': [value: string | number];
    blur: [event: FocusEvent];
    focus: [event: FocusEvent];
  }>();

  /**
   * Computed
   */
  const hasError = computed(() => props.error && !!props.errorMessage);

  /**
   * Handle input event
   */
  const handleInput = (value: string | number | null): void => {
    emit('update:modelValue', value ?? '');
  };

  /**
   * Handle blur event
   */
  const handleBlur = (event: FocusEvent): void => {
    emit('blur', event);
  };

  /**
   * Handle focus event
   */
  const handleFocus = (event: FocusEvent): void => {
    emit('focus', event);
  };
</script>
