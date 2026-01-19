<template>
  <q-page padding>
    <h1 class="text-h4">Dashboard</h1>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-subtitle1">
          Polling Status:
          <q-badge :color="isPolling ? 'positive' : 'grey'">
            {{ isPolling ? 'Active' : 'Stopped' }}
          </q-badge>
        </div>
      </q-card-section>

      <q-card-section v-if="loading">
        <q-spinner color="primary" size="3em" />
      </q-card-section>

      <q-card-section v-else-if="data">
        <pre class="text-caption">{{ data }}</pre>
      </q-card-section>

      <q-card-section v-else>
        <p class="text-grey">No data available</p>
      </q-card-section>

      <q-card-actions>
        <q-btn @click="startPolling" color="primary" label="Start Polling" :disable="isPolling" />
        <q-btn @click="stopPolling" color="negative" label="Stop Polling" :disable="!isPolling" />
        <q-btn @click="fetchDataManually" color="secondary" label="Fetch Now" :loading="loading" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePolling } from 'src/composables/usePolling';
import ApiService from 'src/services/api.service';

interface DataResponse {
  id: number;
  name: string;
  timestamp: string;
  [key: string]: unknown;
}

const data = ref<DataResponse | null>(null);
const loading = ref(false);

const fetchData = async (): Promise<void> => {
  try {
    loading.value = true;
    data.value = await ApiService.get<DataResponse>('/data');
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    loading.value = false;
  }
};

const fetchDataManually = async (): Promise<void> => {
  await fetchData();
};

const { isPolling, startPolling, stopPolling } = usePolling(fetchData, {
  interval: 5000,
  immediate: true,
});
</script>
