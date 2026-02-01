<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card style="width: 700px; max-width: 90vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ isEditing ? 'Edit Organisasi' : 'Tambah Organisasi' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="handleSubmit" ref="formRef">
        <q-card-section class="q-pt-md" style="max-height: 70vh; overflow-y: auto">
          <div class="row q-col-gutter-md">
            <!-- Nama Organisasi -->
            <div class="col-12">
              <q-input
                v-model="form.namaOrganisasi"
                label="Nama Organisasi *"
                outlined
                dense
                :rules="[(val) => !!val || 'Nama organisasi wajib diisi']"
              />
            </div>

            <!-- Nama Instansi -->
            <div class="col-12 col-sm-6">
              <q-select
                v-model="form.namaInstansi"
                :options="filterOptions?.namaInstansi ?? []"
                label="Nama Instansi *"
                outlined
                dense
                use-input
                new-value-mode="add-unique"
                :rules="[(val) => !!val || 'Nama instansi wajib diisi']"
                hint="Pilih atau ketik nama baru"
              />
            </div>

            <!-- Daerah Instansi -->
            <div class="col-12 col-sm-6">
              <q-select
                v-model="form.daerahInstansi"
                :options="filterOptions?.daerahInstansi ?? []"
                label="Daerah Instansi *"
                outlined
                dense
                use-input
                new-value-mode="add-unique"
                :rules="[(val) => !!val || 'Daerah instansi wajib diisi']"
                hint="Pilih atau ketik daerah baru"
              />
            </div>

            <!-- Kontak -->
            <div class="col-12">
              <q-input
                v-model="form.kontak"
                label="Kontak *"
                outlined
                dense
                :rules="[(val) => !!val || 'Kontak wajib diisi']"
                hint="Nomor telepon, email, atau media sosial"
              />
            </div>

            <!-- Jenis Organisasi -->
            <div class="col-12 col-sm-6">
              <q-select
                v-model="form.jenisOrganisasi"
                :options="
                  filterOptions?.jenisOrganisasi ?? [
                    'UKM',
                    'BEM',
                    'HIMA',
                    'ORMAWA',
                    'MPM',
                    'DPM',
                    'Lainnya',
                  ]
                "
                label="Jenis Organisasi *"
                outlined
                dense
                use-input
                new-value-mode="add-unique"
                :rules="[(val) => !!val || 'Jenis organisasi wajib diisi']"
              />
            </div>

            <!-- Bidang Organisasi -->
            <div class="col-12 col-sm-6">
              <q-select
                v-model="form.bidangOrganisasi"
                :options="
                  filterOptions?.bidangOrganisasi ?? [
                    'Olahraga',
                    'Seni',
                    'Akademik',
                    'Sosial',
                    'Keagamaan',
                    'Teknologi',
                    'Lainnya',
                  ]
                "
                label="Bidang Organisasi *"
                outlined
                dense
                use-input
                new-value-mode="add-unique"
                :rules="[(val) => !!val || 'Bidang organisasi wajib diisi']"
              />
            </div>

            <!-- Tahun Berdiri -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model.number="form.tahunBerdiri"
                type="number"
                label="Tahun Berdiri *"
                outlined
                dense
                :rules="[
                  (val) => !!val || 'Tahun berdiri wajib diisi',
                  (val) => val >= 1900 || 'Tahun minimal 1900',
                  (val) => val <= currentYear || `Tahun maksimal ${currentYear}`,
                ]"
              />
            </div>

            <!-- Penjelasan Singkat -->
            <div class="col-12">
              <q-input
                v-model="form.penjelasanSingkat"
                type="textarea"
                label="Penjelasan Singkat"
                outlined
                dense
                autogrow
                hint="Opsional"
              />
            </div>

            <!-- Program Kerja -->
            <div class="col-12">
              <div class="text-subtitle2 q-mb-sm">Program Kerja (Opsional)</div>

              <div
                v-for="(_proker, index) in form.proker"
                :key="index"
                class="row q-col-gutter-sm q-mb-sm"
              >
                <div class="col">
                  <q-input
                    v-model="form.proker![index]"
                    :label="`Program Kerja ${index + 1}`"
                    outlined
                    dense
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    flat
                    round
                    dense
                    icon="remove"
                    color="negative"
                    @click="removeProker(index)"
                  />
                </div>
              </div>

              <q-btn
                flat
                color="primary"
                icon="add"
                label="Tambah Program Kerja"
                @click="addProker"
                size="sm"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Batal" v-close-popup />
          <q-btn color="primary" label="Simpan" type="submit" :loading="saving" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue';
  import type { QForm } from 'quasar';
  import type {
    Organization,
    CreateOrganizationDto,
    OrganizationFilterOptions,
  } from '@/types/organization';

  interface Props {
    modelValue: boolean;
    organization?: Organization | null;
    filterOptions?: OrganizationFilterOptions | null;
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void;
    (e: 'save', data: CreateOrganizationDto): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const formRef = ref<QForm | null>(null);
  const saving = ref(false);
  const currentYear = new Date().getFullYear();

  const isEditing = computed(() => !!props.organization);

  // Form data
  const form = ref<CreateOrganizationDto>({
    namaOrganisasi: '',
    namaInstansi: '',
    daerahInstansi: '',
    kontak: '',
    jenisOrganisasi: '',
    bidangOrganisasi: '',
    tahunBerdiri: currentYear,
    penjelasanSingkat: '',
    proker: [],
  });

  // Watch for organization prop changes (edit mode)
  watch(
    () => props.organization,
    (org) => {
      if (org) {
        form.value = {
          namaOrganisasi: org.namaOrganisasi,
          namaInstansi: org.namaInstansi,
          daerahInstansi: org.daerahInstansi,
          kontak: org.kontak,
          jenisOrganisasi: org.jenisOrganisasi,
          bidangOrganisasi: org.bidangOrganisasi,
          tahunBerdiri: org.tahunBerdiri,
          penjelasanSingkat: org.penjelasanSingkat ?? '',
          proker: org.proker ? [...org.proker] : [],
        };
      } else {
        resetForm();
      }
    },
    { immediate: true }
  );

  // Reset form when dialog closes
  watch(
    () => props.modelValue,
    (isOpen) => {
      if (!isOpen && !props.organization) {
        resetForm();
      }
    }
  );

  function resetForm() {
    form.value = {
      namaOrganisasi: '',
      namaInstansi: '',
      daerahInstansi: '',
      kontak: '',
      jenisOrganisasi: '',
      bidangOrganisasi: '',
      tahunBerdiri: currentYear,
      penjelasanSingkat: '',
      proker: [],
    };
    formRef.value?.resetValidation();
  }

  function addProker() {
    form.value.proker ??= [];
    form.value.proker.push('');
  }

  function removeProker(index: number) {
    form.value.proker?.splice(index, 1);
  }

  async function handleSubmit() {
    const valid = await formRef.value?.validate();
    if (!valid) return;

    saving.value = true;
    try {
      // Filter out empty proker items
      const data: CreateOrganizationDto = {
        ...form.value,
        proker: form.value.proker?.filter((p) => p.trim()) ?? [],
      };

      emit('save', data);
    } finally {
      saving.value = false;
    }
  }
</script>
