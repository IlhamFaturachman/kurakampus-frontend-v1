<template>
  <q-page padding>
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <!-- Not Found -->
    <div v-else-if="!organization" class="text-center q-pa-xl">
      <q-icon name="search_off" size="4em" color="grey-5" />
      <div class="text-h6 text-grey-7 q-mt-md">Organisasi tidak ditemukan</div>
      <q-btn flat color="primary" label="Kembali ke Daftar" @click="goBack" class="q-mt-md" />
    </div>

    <!-- Detail Content -->
    <template v-else>
      <!-- Header -->
      <div class="row items-center q-mb-lg">
        <q-btn flat round icon="arrow_back" @click="goBack" class="q-mr-md" />
        <div class="col">
          <h1 class="text-h4 q-ma-none">{{ organization.namaOrganisasi }}</h1>
          <div class="text-grey-7">
            {{ organization.namaInstansi }} - {{ organization.daerahInstansi }}
          </div>
        </div>
        <div class="col-auto">
          <q-btn color="primary" icon="edit" label="Edit" @click="openEditDialog" class="q-mr-sm" />
          <q-btn color="negative" icon="delete" label="Hapus" @click="confirmDelete" />
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <!-- Main Info Card -->
        <div class="col-12 col-md-8">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6 q-mb-md">Informasi Organisasi</div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Nama Organisasi</div>
                  <div class="text-body1">{{ organization.namaOrganisasi }}</div>
                </div>

                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Nama Instansi</div>
                  <div class="text-body1">{{ organization.namaInstansi }}</div>
                </div>

                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Daerah Instansi</div>
                  <div class="text-body1">{{ organization.daerahInstansi }}</div>
                </div>

                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Kontak</div>
                  <div class="text-body1">{{ organization.kontak }}</div>
                </div>

                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Jenis Organisasi</div>
                  <q-badge :color="getJenisColor(organization.jenisOrganisasi)" class="q-mt-xs">
                    {{ organization.jenisOrganisasi }}
                  </q-badge>
                </div>

                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Bidang Organisasi</div>
                  <q-badge
                    :color="getBidangColor(organization.bidangOrganisasi)"
                    outline
                    class="q-mt-xs"
                  >
                    {{ organization.bidangOrganisasi }}
                  </q-badge>
                </div>

                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-7">Tahun Berdiri</div>
                  <div class="text-body1">{{ organization.tahunBerdiri }}</div>
                </div>

                <div class="col-12" v-if="organization.penjelasanSingkat">
                  <div class="text-caption text-grey-7">Penjelasan Singkat</div>
                  <div class="text-body1">{{ organization.penjelasanSingkat }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Program Kerja -->
          <q-card flat bordered class="q-mt-md" v-if="organization.proker?.length">
            <q-card-section>
              <div class="text-h6 q-mb-md">Program Kerja</div>
              <q-list bordered separator>
                <q-item v-for="(proker, index) in organization.proker" :key="index">
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" size="sm">
                      {{ index + 1 }}
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>{{ proker }}</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Sidebar -->
        <div class="col-12 col-md-4">
          <!-- Quick Info -->
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6 q-mb-md">Info Tambahan</div>

              <q-list dense>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="calendar_today" color="grey-7" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>Dibuat</q-item-label>
                    <q-item-label>{{ formatDate(organization.createdAt) }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="update" color="grey-7" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>Terakhir Diperbarui</q-item-label>
                    <q-item-label>{{ formatDate(organization.updatedAt) }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="fingerprint" color="grey-7" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>ID</q-item-label>
                    <q-item-label class="text-caption">{{ organization.id }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <!-- Quick Actions -->
          <q-card flat bordered class="q-mt-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">Aksi Cepat</div>

              <q-btn
                unelevated
                color="primary"
                icon="edit"
                label="Edit Organisasi"
                class="full-width q-mb-sm"
                @click="openEditDialog"
              />
              <q-btn
                outline
                color="negative"
                icon="delete"
                label="Hapus Organisasi"
                class="full-width"
                @click="confirmDelete"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </template>

    <!-- Edit Dialog -->
    <OrganizationFormDialog
      v-model="showFormDialog"
      :organization="organization"
      :filter-options="filterOptions"
      @save="handleSave"
    />
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useOrganizations } from '@/composables/useOrganizations';
  import { getJenisColor, getBidangColor } from '@/types/organization';
  import type { UpdateOrganizationDto } from '@/types/organization';
  import OrganizationFormDialog from '@/components/organizations/OrganizationFormDialog.vue';

  const route = useRoute();
  const router = useRouter();
  const $q = useQuasar();

  const {
    selectedOrganization: organization,
    filterOptions,
    loading,
    fetchOrganizationById,
    fetchFilterOptions,
    updateOrganization,
    deleteOrganization,
  } = useOrganizations();

  const showFormDialog = ref(false);

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function goBack() {
    void router.push({ name: 'organizations' });
  }

  function openEditDialog() {
    showFormDialog.value = true;
  }

  async function handleSave(data: UpdateOrganizationDto) {
    if (organization.value) {
      await updateOrganization(organization.value.id, data);
      showFormDialog.value = false;
      // Refresh data
      await fetchOrganizationById(organization.value.id);
    }
  }

  function confirmDelete() {
    if (!organization.value) return;

    $q.dialog({
      title: 'Konfirmasi Hapus',
      message: `Apakah Anda yakin ingin menghapus organisasi "${organization.value.namaOrganisasi}"?`,
      cancel: true,
      persistent: true,
    }).onOk(() => {
      if (organization.value) {
        void deleteOrganization(organization.value.id).then((success) => {
          if (success) {
            goBack();
          }
        });
      }
    });
  }

  onMounted(async () => {
    const id = route.params['id'] as string;
    await Promise.all([fetchOrganizationById(id), fetchFilterOptions()]);
  });
</script>
