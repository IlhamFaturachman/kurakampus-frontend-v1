<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card style="width: 600px; max-width: 90vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Import CSV</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup :disable="uploading" />
      </q-card-section>

      <q-card-section>
        <!-- Instructions -->
        <q-banner class="bg-blue-1 q-mb-md" rounded>
          <template v-slot:avatar>
            <q-icon name="info" color="blue" />
          </template>
          <div class="text-caption">
            <p class="q-mb-xs">Pastikan file CSV mengikuti format template yang disediakan.</p>
            <p class="q-mb-none">
              Kolom wajib: namaOrganisasi, namaInstansi, daerahInstansi, kontak, jenisOrganisasi,
              bidangOrganisasi, tahunBerdiri
            </p>
          </div>
        </q-banner>

        <!-- Download Template Button -->
        <div class="q-mb-lg">
          <q-btn
            outline
            color="primary"
            icon="download"
            label="Download Template CSV"
            @click="downloadTemplate"
            :loading="downloadingTemplate"
          />
        </div>

        <!-- File Upload -->
        <q-file
          v-model="file"
          label="Pilih file CSV"
          accept=".csv"
          outlined
          :disable="uploading"
          :rules="[(val) => !!val || 'File wajib dipilih']"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
          <template v-slot:append>
            <q-icon
              v-if="file"
              name="close"
              class="cursor-pointer"
              @click.stop.prevent="file = null"
            />
          </template>
        </q-file>

        <!-- Import Result -->
        <div v-if="importResult" class="q-mt-lg">
          <q-banner :class="importResult.failedCount > 0 ? 'bg-orange-1' : 'bg-green-1'" rounded>
            <template v-slot:avatar>
              <q-icon
                :name="importResult.failedCount > 0 ? 'warning' : 'check_circle'"
                :color="importResult.failedCount > 0 ? 'orange' : 'green'"
              />
            </template>
            <div>
              <p class="text-subtitle2 q-mb-sm">Hasil Import</p>
              <div class="row q-col-gutter-md">
                <div class="col-4">
                  <div class="text-caption text-grey-7">Total</div>
                  <div class="text-subtitle1">
                    {{ importResult.successCount + importResult.failedCount }}
                  </div>
                </div>
                <div class="col-4">
                  <div class="text-caption text-grey-7">Berhasil</div>
                  <div class="text-subtitle1 text-green">{{ importResult.successCount }}</div>
                </div>
                <div class="col-4">
                  <div class="text-caption text-grey-7">Gagal</div>
                  <div class="text-subtitle1 text-red">{{ importResult.failedCount }}</div>
                </div>
              </div>
            </div>
          </q-banner>

          <!-- Error Details -->
          <div v-if="importResult.errors && importResult.errors.length > 0" class="q-mt-md">
            <q-expansion-item label="Detail Error" icon="error_outline" header-class="text-red">
              <q-list bordered separator class="rounded-borders">
                <q-item v-for="(error, idx) in importResult.errors" :key="idx">
                  <q-item-section>
                    <q-item-label>Baris {{ error.row }}</q-item-label>
                    <q-item-label caption class="text-red">{{ error.message }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Tutup" v-close-popup :disable="uploading" />
        <q-btn
          v-if="!importResult"
          color="primary"
          label="Import"
          :loading="uploading"
          :disable="!file"
          @click="handleImport"
        />
        <q-btn v-else color="primary" label="Import Lagi" @click="resetState" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import type { CSVImportResult } from '@/types/organization';

  interface Props {
    modelValue: boolean;
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void;
    (e: 'import', file: File): Promise<CSVImportResult>;
    (e: 'downloadTemplate'): Promise<void>;
    (e: 'imported'): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const file = ref<File | null>(null);
  const uploading = ref(false);
  const downloadingTemplate = ref(false);
  const importResult = ref<CSVImportResult | null>(null);

  // Reset state when dialog closes
  watch(
    () => props.modelValue,
    (isOpen) => {
      if (!isOpen) {
        resetState();
      }
    }
  );

  function resetState() {
    file.value = null;
    importResult.value = null;
  }

  function downloadTemplate() {
    downloadingTemplate.value = true;
    void Promise.resolve(emit('downloadTemplate')).finally(() => {
      downloadingTemplate.value = false;
    });
  }

  function handleImport() {
    if (!file.value) return;
    uploading.value = true;
    // Emit the import event - parent will call setImportResult with result
    void Promise.resolve(emit('import', file.value));
  }

  // Expose method for parent to set result
  function setImportResult(result: CSVImportResult) {
    importResult.value = result;
    uploading.value = false;
    if (result.successCount > 0) {
      emit('imported');
    }
  }

  function setUploading(value: boolean) {
    uploading.value = value;
  }

  defineExpose({
    setImportResult,
    setUploading,
  });
</script>
