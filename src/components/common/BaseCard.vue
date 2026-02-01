/** * BaseCard Component * Atomic design - Molecule level */

<template>
  <q-card :class="cardClasses" :flat="flat" :bordered="bordered">
    <q-card-section v-if="title || $slots['header']" class="q-pb-none">
      <div class="text-h6">{{ title }}</div>
      <slot name="header" />
    </q-card-section>

    <q-card-section>
      <slot />
    </q-card-section>

    <q-card-actions v-if="$slots['actions']" align="right">
      <slot name="actions" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  /**
   * Props interface
   */
  interface Props {
    title?: string;
    flat?: boolean;
    bordered?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
  }

  /**
   * Props with defaults
   */
  const props = withDefaults(defineProps<Props>(), {
    flat: false,
    bordered: true,
    padding: 'md',
  });

  /**
   * Computed classes
   */
  const cardClasses = computed(() => {
    const classes: string[] = [];

    switch (props.padding) {
      case 'none':
        classes.push('q-pa-none');
        break;
      case 'sm':
        classes.push('q-pa-sm');
        break;
      case 'lg':
        classes.push('q-pa-lg');
        break;
      default:
        classes.push('q-pa-md');
    }

    return classes.join(' ');
  });
</script>
