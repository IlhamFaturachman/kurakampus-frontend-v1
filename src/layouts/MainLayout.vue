<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>KuraKampus</q-toolbar-title>

        <q-space />

        <!-- User Menu -->
        <q-btn flat round dense icon="notifications">
          <q-badge color="red" floating>3</q-badge>
          <q-menu>
            <q-list style="min-width: 300px">
              <q-item-label header>Notifications</q-item-label>
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="info" color="info" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>New update available</q-item-label>
                  <q-item-label caption>2 minutes ago</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="person_add" color="positive" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>New member joined</q-item-label>
                  <q-item-label caption>1 hour ago</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn flat round dense>
          <q-avatar size="32px">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
          <q-menu>
            <q-list style="min-width: 200px">
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>
                <q-item-section>Settings</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <!-- Drawer Header -->
      <div class="q-pa-md bg-primary text-white">
        <div class="text-h6">KuraKampus</div>
        <div class="text-caption">Dashboard Organisasi Kampus</div>
      </div>

      <!-- Navigation Menu -->
      <q-list padding>
        <q-item
          clickable
          v-ripple
          :active="$route.name === 'dashboard'"
          active-class="bg-primary text-white"
          @click="navigateTo('dashboard')"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
            <q-item-label caption>Overview & Statistics</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item-label header>Database Organisasi</q-item-label>

        <q-item
          clickable
          v-ripple
          :active="$route.name === 'organizations'"
          active-class="bg-primary text-white"
          @click="navigateTo('organizations')"
        >
          <q-item-section avatar>
            <q-icon name="business" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Organisasi Kampus</q-item-label>
            <q-item-label caption>Kelola data organisasi</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :active="$route.path === '/members'"
          active-class="bg-primary text-white"
          @click="navigateTo('members')"
        >
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Anggota</q-item-label>
            <q-item-label caption>Data anggota organisasi</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :active="$route.path === '/events'"
          active-class="bg-primary text-white"
          @click="navigateTo('events')"
        >
          <q-item-section avatar>
            <q-icon name="event" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Kegiatan</q-item-label>
            <q-item-label caption>Event & aktivitas</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { Notify } from 'quasar';

  const router = useRouter();
  const authStore = useAuthStore();
  const leftDrawerOpen = ref(false);

  function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
  }

  function navigateTo(name: string) {
    void router.push({ name });
  }

  async function handleLogout() {
    try {
      await authStore.logout();
      Notify.create({
        type: 'positive',
        message: 'Logged out successfully',
        position: 'top',
        timeout: 2000,
      });
      void router.push({ name: 'login' });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: 'Logout failed',
        position: 'top',
        timeout: 3000,
      });
    }
  }
</script>

<style scoped lang="scss">
  .q-item {
    border-radius: 8px;
    margin: 4px 8px;
  }
</style>
