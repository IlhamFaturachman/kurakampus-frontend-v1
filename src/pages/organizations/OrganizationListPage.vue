<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="text-h4 q-ma-none">Database Organisasi Kampus</h1>
        <p class="text-grey-7 q-mb-none">Kelola data organisasi kampus</p>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Tambah Organisasi"
          @click="openCreateDialog"
          class="q-mr-sm"
        />
        <q-btn-dropdown color="secondary" label="CSV" icon="upload_file">
          <q-list>
            <q-item clickable v-close-popup @click="openImportDialog">
              <q-item-section avatar>
                <q-icon name="upload" />
              </q-item-section>
              <q-item-section>Import CSV</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleExport">
              <q-item-section avatar>
                <q-icon name="download" />
              </q-item-section>
              <q-item-section>Export CSV</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleDownloadTemplate">
              <q-item-section avatar>
                <q-icon name="description" />
              </q-item-section>
              <q-item-section>Download Template</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-overline text-grey-7">Total Organisasi</div>
                <div class="text-h4 text-weight-bold">{{ stats?.totalOrganizations ?? 0 }}</div>
              </div>
              <div class="col-auto">
                <q-avatar size="56px" color="primary" text-color="white" icon="business" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <template v-if="stats?.byJenis">
        <div
          v-for="(count, jenis) in limitedJenisStats"
          :key="jenis"
          class="col-12 col-sm-6 col-md-3"
        >
          <q-card flat bordered class="stat-card">
            <q-card-section>
              <div class="row items-center">
                <div class="col">
                  <div class="text-overline text-grey-7">{{ jenis }}</div>
                  <div class="text-h4 text-weight-bold">{{ count }}</div>
                </div>
                <div class="col-auto">
                  <q-avatar
                    size="56px"
                    :color="getJenisColor(jenis as string)"
                    text-color="white"
                    icon="groups"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </div>

    <!-- Search & Actions Bar -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md items-center">
          <!-- Search -->
          <div class="col-12 col-md-4">
            <q-input
              v-model="searchTerm"
              outlined
              dense
              placeholder="Cari organisasi..."
              @update:model-value="handleSearch"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:append v-if="searchTerm">
                <q-icon
                  name="close"
                  class="cursor-pointer"
                  @click="
                    searchTerm = '';
                    handleSearch('');
                  "
                />
              </template>
            </q-input>
          </div>

          <!-- Filter Toggle -->
          <div class="col-auto">
            <q-btn
              :color="showFilters ? 'primary' : 'grey-7'"
              flat
              icon="filter_list"
              :label="showFilters ? 'Hide Filters' : 'Filters'"
              @click="showFilters = !showFilters"
            >
              <q-badge v-if="hasFiltersApplied" color="red" floating rounded />
            </q-btn>
          </div>

          <!-- Reset Filters -->
          <div class="col-auto" v-if="hasFiltersApplied">
            <q-btn
              flat
              color="negative"
              icon="clear_all"
              label="Reset"
              @click="handleResetFilters"
            />
          </div>

          <q-space />

          <!-- Bulk Actions -->
          <div class="col-auto" v-if="hasSelection">
            <q-btn
              color="negative"
              icon="delete"
              :label="`Hapus (${selectionCount})`"
              @click="confirmBulkDelete"
            />
          </div>
        </div>

        <!-- Filter Panel -->
        <q-slide-transition>
          <div v-show="showFilters" class="q-mt-md">
            <div class="row q-col-gutter-md">
              <!-- Nama Instansi -->
              <div class="col-12 col-md-3">
                <q-select
                  v-model="filters.namaInstansi"
                  :options="filterOptions?.namaInstansi ?? []"
                  label="Nama Instansi"
                  outlined
                  dense
                  clearable
                  @update:model-value="applyFilters"
                />
              </div>

              <!-- Daerah Instansi -->
              <div class="col-12 col-md-3">
                <q-select
                  v-model="filters.daerahInstansi"
                  :options="filterOptions?.daerahInstansi ?? []"
                  label="Daerah Instansi"
                  outlined
                  dense
                  clearable
                  @update:model-value="applyFilters"
                />
              </div>

              <!-- Jenis Organisasi -->
              <div class="col-12 col-md-3">
                <q-select
                  v-model="filters.jenisOrganisasi"
                  :options="filterOptions?.jenisOrganisasi ?? []"
                  label="Jenis Organisasi"
                  outlined
                  dense
                  multiple
                  clearable
                  use-chips
                  @update:model-value="applyFilters"
                />
              </div>

              <!-- Bidang Organisasi -->
              <div class="col-12 col-md-3">
                <q-select
                  v-model="filters.bidangOrganisasi"
                  :options="filterOptions?.bidangOrganisasi ?? []"
                  label="Bidang Organisasi"
                  outlined
                  dense
                  multiple
                  clearable
                  use-chips
                  @update:model-value="applyFilters"
                />
              </div>

              <!-- Tahun Berdiri Range -->
              <div class="col-12 col-md-3">
                <q-input
                  v-model.number="filters.tahunMin"
                  type="number"
                  label="Tahun Min"
                  outlined
                  dense
                  :rules="[(val) => !val || val >= 1900 || 'Min 1900']"
                  @update:model-value="applyFilters"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-model.number="filters.tahunMax"
                  type="number"
                  label="Tahun Max"
                  outlined
                  dense
                  :rules="[(val) => !val || val <= currentYear || `Max ${currentYear}`]"
                  @update:model-value="applyFilters"
                />
              </div>
            </div>
          </div>
        </q-slide-transition>
      </q-card-section>
    </q-card>

    <!-- Data Table (Desktop) -->
    <q-card flat bordered class="gt-sm">
      <q-table
        :rows="organizations"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="tablePagination"
        @request="onTableRequest"
        flat
        bordered
        selection="multiple"
        v-model:selected="selectedRows"
      >
        <!-- Custom Cells -->
        <template v-slot:body-cell-namaOrganisasi="props">
          <q-td :props="props">
            <router-link
              :to="{ name: 'organization-detail', params: { id: props.row.id } }"
              class="text-primary text-weight-medium"
            >
              {{ props.row.namaOrganisasi }}
            </router-link>
          </q-td>
        </template>

        <template v-slot:body-cell-jenisOrganisasi="props">
          <q-td :props="props">
            <q-badge :color="getJenisColor(props.row.jenisOrganisasi)">
              {{ props.row.jenisOrganisasi }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-bidangOrganisasi="props">
          <q-td :props="props">
            <q-badge :color="getBidangColor(props.row.bidangOrganisasi)" outline>
              {{ props.row.bidangOrganisasi }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              dense
              icon="visibility"
              color="info"
              @click="viewDetail(props.row.id)"
            >
              <q-tooltip>Lihat Detail</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="edit" color="primary" @click="openEditDialog(props.row)">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>Hapus</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <!-- No Data -->
        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey-7 q-pa-lg">
            <q-icon name="inbox" size="3em" class="q-mr-md" />
            <span>Tidak ada data organisasi</span>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Card View (Mobile) -->
    <div class="lt-md">
      <q-card v-for="org in organizations" :key="org.id" flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row items-center q-mb-sm">
            <q-checkbox
              :model-value="isSelected(org.id)"
              @update:model-value="toggleSelection(org.id)"
            />
            <q-space />
            <q-badge :color="getJenisColor(org.jenisOrganisasi)">
              {{ org.jenisOrganisasi }}
            </q-badge>
          </div>

          <div class="text-h6 q-mb-xs">{{ org.namaOrganisasi }}</div>
          <div class="text-caption text-grey-7">
            {{ org.namaInstansi }} - {{ org.daerahInstansi }}
          </div>

          <q-separator class="q-my-sm" />

          <div class="row q-col-gutter-sm text-caption">
            <div class="col-6">
              <q-icon name="category" size="xs" class="q-mr-xs" />
              {{ org.bidangOrganisasi }}
            </div>
            <div class="col-6">
              <q-icon name="calendar_today" size="xs" class="q-mr-xs" />
              {{ org.tahunBerdiri }}
            </div>
            <div class="col-12">
              <q-icon name="phone" size="xs" class="q-mr-xs" />
              {{ org.kontak }}
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat dense color="info" label="Detail" @click="viewDetail(org.id)" />
          <q-btn flat dense color="primary" label="Edit" @click="openEditDialog(org)" />
          <q-btn flat dense color="negative" label="Hapus" @click="confirmDelete(org)" />
        </q-card-actions>
      </q-card>

      <!-- Mobile Pagination -->
      <div class="row justify-center q-mt-md" v-if="meta.totalPages > 1">
        <q-pagination
          :model-value="meta.page"
          :max="meta.totalPages"
          direction-links
          boundary-links
          @update:model-value="setPage"
        />
      </div>

      <!-- No Data Mobile -->
      <q-card v-if="!loading && organizations.length === 0" flat bordered>
        <q-card-section class="text-center text-grey-7 q-pa-xl">
          <q-icon name="inbox" size="4em" />
          <div class="q-mt-md">Tidak ada data organisasi</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading && organizations.length === 0" class="row q-col-gutter-md">
      <div v-for="n in 6" :key="n" class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <q-skeleton type="text" width="60%" />
            <q-skeleton type="text" width="40%" class="q-mt-sm" />
            <q-skeleton type="text" width="80%" class="q-mt-sm" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Form Dialog -->
    <OrganizationFormDialog
      v-model="showFormDialog"
      :organization="editingOrganization"
      :filter-options="filterOptions"
      @save="handleSave"
    />

    <!-- Import Dialog -->
    <CSVImportDialog
      v-model="showImportDialog"
      @import="handleImport"
      @download-template="handleDownloadTemplate"
    />
  </q-page>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useOrganizations } from '@/composables/useOrganizations';
  import { getJenisColor, getBidangColor } from '@/types/organization';
  import type {
    Organization,
    CreateOrganizationDto,
    UpdateOrganizationDto,
  } from '@/types/organization';
  import OrganizationFormDialog from '@/components/organizations/OrganizationFormDialog.vue';
  import CSVImportDialog from '@/components/organizations/CSVImportDialog.vue';

  const router = useRouter();
  const $q = useQuasar();

  const {
    organizations,
    stats,
    filterOptions,
    meta,
    filters,
    loading,
    hasSelection,
    selectionCount,
    selectedIds,
    hasFiltersApplied,
    fetchOrganizations,
    fetchStats,
    fetchFilterOptions,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    bulkDeleteOrganizations,
    importCSV,
    exportCSV,
    downloadTemplate,
    toggleSelection,
    isSelected,
    setPage,
    applyFilters,
    handleSearch: doSearch,
    resetFilters,
  } = useOrganizations();

  // Local state
  const searchTerm = ref('');
  const showFilters = ref(false);
  const showFormDialog = ref(false);
  const showImportDialog = ref(false);
  const editingOrganization = ref<Organization | null>(null);
  const selectedRows = ref<Organization[]>([]);
  const currentYear = new Date().getFullYear();

  // Computed
  const limitedJenisStats = computed(() => {
    if (!stats.value?.byJenis) return {};
    const entries = Object.entries(stats.value.byJenis);
    return Object.fromEntries(entries.slice(0, 3));
  });

  // Table config
  const columns = [
    {
      name: 'namaOrganisasi',
      label: 'Nama Organisasi',
      field: 'namaOrganisasi',
      sortable: true,
      align: 'left' as const,
    },
    {
      name: 'namaInstansi',
      label: 'Instansi',
      field: 'namaInstansi',
      sortable: true,
      align: 'left' as const,
    },
    {
      name: 'daerahInstansi',
      label: 'Daerah',
      field: 'daerahInstansi',
      sortable: true,
      align: 'left' as const,
    },
    {
      name: 'jenisOrganisasi',
      label: 'Jenis',
      field: 'jenisOrganisasi',
      sortable: true,
      align: 'center' as const,
    },
    {
      name: 'bidangOrganisasi',
      label: 'Bidang',
      field: 'bidangOrganisasi',
      sortable: true,
      align: 'center' as const,
    },
    {
      name: 'tahunBerdiri',
      label: 'Tahun',
      field: 'tahunBerdiri',
      sortable: true,
      align: 'center' as const,
    },
    { name: 'actions', label: 'Aksi', field: 'actions', align: 'center' as const },
  ];

  const tablePagination = computed(() => ({
    page: meta.value.page,
    rowsPerPage: meta.value.limit,
    rowsNumber: meta.value.total,
  }));

  // Sync selectedIds with selectedRows
  watch(selectedRows, (rows) => {
    // Keep selection in sync for bulk operations
    selectedIds.value = rows.map((r) => r.id);
  });

  // Methods
  function handleSearch(val: string | number | null) {
    doSearch(String(val ?? ''));
  }

  function handleResetFilters() {
    searchTerm.value = '';
    resetFilters();
    void fetchOrganizations();
  }

  function onTableRequest(props: {
    pagination: { page: number; rowsPerPage: number; sortBy?: string; descending?: boolean };
  }) {
    filters.value.page = props.pagination.page;
    filters.value.limit = props.pagination.rowsPerPage;
    if (props.pagination.sortBy) {
      filters.value.sortBy = props.pagination.sortBy;
      filters.value.sortOrder = props.pagination.descending ? 'desc' : 'asc';
    }
    void fetchOrganizations();
  }

  function viewDetail(id: string) {
    void router.push({ name: 'organization-detail', params: { id } });
  }

  function openCreateDialog() {
    editingOrganization.value = null;
    showFormDialog.value = true;
  }

  function openEditDialog(org: Organization) {
    editingOrganization.value = org;
    showFormDialog.value = true;
  }

  async function handleSave(data: CreateOrganizationDto | UpdateOrganizationDto) {
    if (editingOrganization.value) {
      await updateOrganization(editingOrganization.value.id, data as UpdateOrganizationDto);
    } else {
      await createOrganization(data as CreateOrganizationDto);
    }
    showFormDialog.value = false;
  }

  function confirmDelete(org: Organization) {
    $q.dialog({
      title: 'Konfirmasi Hapus',
      message: `Apakah Anda yakin ingin menghapus organisasi "${org.namaOrganisasi}"?`,
      cancel: true,
      persistent: true,
    }).onOk(() => {
      void deleteOrganization(org.id);
    });
  }

  function confirmBulkDelete() {
    $q.dialog({
      title: 'Konfirmasi Hapus',
      message: `Apakah Anda yakin ingin menghapus ${selectionCount.value} organisasi yang dipilih?`,
      cancel: true,
      persistent: true,
    }).onOk(() => {
      void bulkDeleteOrganizations().then(() => {
        selectedRows.value = [];
      });
    });
  }

  function openImportDialog() {
    showImportDialog.value = true;
  }

  async function handleImport(file: File) {
    await importCSV(file);
    showImportDialog.value = false;
  }

  async function handleExport() {
    await exportCSV();
  }

  async function handleDownloadTemplate() {
    await downloadTemplate();
  }

  // Init
  onMounted(async () => {
    await Promise.all([fetchOrganizations(), fetchStats(), fetchFilterOptions()]);
  });
</script>

<style scoped lang="scss">
  .stat-card {
    transition:
      transform 0.2s,
      box-shadow 0.2s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
</style>
