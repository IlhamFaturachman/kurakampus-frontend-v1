/** * LoadingSpinner Component * Reusable loading indicator */

<template>
  <div :class="containerClasses">
    <q-spinner :color="color" :size="size" :thickness="thickness" />
    <div v-if="message" class="q-mt-md text-center">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  /**
   * Props interface
   */
  interface Props {
    color?: string;
    size?: string | number;
    thickness?: number;
    message?: string;
    fullscreen?: boolean;
    centered?: boolean;
  }

  /**
   * Props with defaults
   */
  const props = withDefaults(defineProps<Props>(), {
    color: 'primary',
    size: '50px',
    thickness: 2,
    fullscreen: false,
    centered: true,
  });

  /**
   * Computed classes
   */
  const containerClasses = computed(() => {
    const classes: string[] = [];

    if (props.fullscreen) {
      classes.push('fixed-center', 'full-width', 'full-height');
    } else if (props.centered) {
      classes.push('flex', 'flex-center', 'q-pa-md');
    }

    return classes.join(' ');
  });
</script>

<style scoped>
  .fixed-center {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
  }
</style>
