<template>
  <q-layout view="lHh lpr lFf" class="auth-layout">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          <div class="row items-center justify-center">
            <q-icon name="school" size="sm" class="q-mr-sm" />
            <span class="text-weight-bold">KuraKampus</span>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-2 text-grey-8 text-center">
      <div class="q-pa-md">
        <div class="text-caption">© {{ currentYear }} KuraKampus. All rights reserved.</div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped lang="scss">
.auth-layout {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  :deep(.q-page-container) {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 100px);
  }
}
</style>
