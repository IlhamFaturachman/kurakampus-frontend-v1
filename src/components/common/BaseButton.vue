/** * BaseButton Component * Atomic design - Atom level */

<template>
  <q-btn
    :label="label"
    :color="color"
    :size="size"
    :loading="loading"
    :disable="disable"
    :type="type"
    :flat="flat"
    :outline="outline"
    :rounded="rounded"
    :dense="dense"
    :icon="icon"
    :icon-right="iconRight"
    @click="handleClick"
    v-bind="$attrs"
  >
    <slot />
  </q-btn>
</template>

<script setup lang="ts">
  /**
   * Props interface
   */
  interface Props {
    label?: string;
    color?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    disable?: boolean;
    type?: 'button' | 'submit' | 'reset';
    flat?: boolean;
    outline?: boolean;
    rounded?: boolean;
    dense?: boolean;
    icon?: string;
    iconRight?: string;
  }

  /**
   * Props with defaults
   */
  const props = withDefaults(defineProps<Props>(), {
    color: 'primary',
    size: 'md',
    type: 'button',
    loading: false,
    disable: false,
    flat: false,
    outline: false,
    rounded: false,
    dense: false,
  });

  /**
   * Emits
   */
  const emit = defineEmits<{
    click: [event: Event];
  }>();

  /**
   * Handle click event
   */
  const handleClick = (event: Event): void => {
    if (!props.loading && !props.disable) {
      emit('click', event);
    }
  };
</script>
