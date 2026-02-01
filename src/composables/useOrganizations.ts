/**
 * useOrganizations Composable
 * State management and business logic for organizations module
 */

import { ref, computed, watch } from 'vue';
import { OrganizationService } from '@/services/organization.service';
import type {
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationFilters,
  OrganizationStats,
  OrganizationFilterOptions,
  PaginationMeta,
  CSVImportResult,
} from '@/types/organization';
import { Notify, Loading } from 'quasar';
import { debounce } from 'quasar';

// Default pagination
const DEFAULT_LIMIT = 20;

/**
 * Organizations composable
 */
export function useOrganizations() {
  // State
  const organizations = ref<Organization[]>([]);
  const selectedOrganization = ref<Organization | null>(null);
  const selectedIds = ref<string[]>([]);
  const stats = ref<OrganizationStats | null>(null);
  const filterOptions = ref<OrganizationFilterOptions | null>(null);
  const meta = ref<PaginationMeta>({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Filters
  const filters = ref<OrganizationFilters>({
    search: '',
    jenisOrganisasi: [],
    bidangOrganisasi: [],
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: DEFAULT_LIMIT,
  });

  // Loading states
  const loading = ref(false);
  const loadingStats = ref(false);
  const loadingOptions = ref(false);

  // Computed
  const hasSelection = computed(() => selectedIds.value.length > 0);
  const selectionCount = computed(() => selectedIds.value.length);
  const hasFiltersApplied = computed(() => {
    const f = filters.value;
    const hasSearch = f.search !== undefined && f.search !== '';
    const hasInstansi = f.namaInstansi !== undefined && f.namaInstansi !== '';
    const hasDaerah = f.daerahInstansi !== undefined && f.daerahInstansi !== '';
    const hasJenis = f.jenisOrganisasi !== undefined && f.jenisOrganisasi.length > 0;
    const hasBidang = f.bidangOrganisasi !== undefined && f.bidangOrganisasi.length > 0;
    const hasTahunMin = f.tahunMin !== undefined;
    const hasTahunMax = f.tahunMax !== undefined;

    return hasSearch || hasInstansi || hasDaerah || hasJenis || hasBidang || hasTahunMin || hasTahunMax;
  });

  /**
   * Fetch organizations with current filters
   */
  async function fetchOrganizations(): Promise<void> {
    loading.value = true;
    try {
      const response = await OrganizationService.getAll(filters.value);
      organizations.value = response.data;
      meta.value = response.meta;
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      Notify.create({
        type: 'negative',
        message: 'Gagal memuat data organisasi',
        position: 'top',
      });
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch organization by ID
   */
  async function fetchOrganizationById(id: string): Promise<Organization | null> {
    loading.value = true;
    try {
      const org = await OrganizationService.getById(id);
      selectedOrganization.value = org;
      return org;
    } catch (error) {
      console.error('Failed to fetch organization:', error);
      Notify.create({
        type: 'negative',
        message: 'Gagal memuat detail organisasi',
        position: 'top',
      });
      return null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch statistics
   */
  async function fetchStats(): Promise<void> {
    loadingStats.value = true;
    try {
      stats.value = await OrganizationService.getStats();
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      loadingStats.value = false;
    }
  }

  /**
   * Fetch filter options
   */
  async function fetchFilterOptions(): Promise<void> {
    loadingOptions.value = true;
    try {
      filterOptions.value = await OrganizationService.getFilterOptions();
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    } finally {
      loadingOptions.value = false;
    }
  }

  /**
   * Create organization
   */
  async function createOrganization(data: CreateOrganizationDto): Promise<Organization | null> {
    Loading.show({ message: 'Menyimpan data...' });
    try {
      const org = await OrganizationService.create(data);
      Notify.create({
        type: 'positive',
        message: 'Organisasi berhasil ditambahkan',
        position: 'top',
      });
      await fetchOrganizations();
      await fetchStats();
      return org;
    } catch (error) {
      console.error('Failed to create organization:', error);
      Notify.create({
        type: 'negative',
        message: 'Gagal menambahkan organisasi',
        position: 'top',
      });
      return null;
    } finally {
      Loading.hide();
    }
  }

  /**
   * Update organization
   */
  async function updateOrganization(
    id: string,
    data: UpdateOrganizationDto
  ): Promise<Organization | null> {
    Loading.show({ message: 'Menyimpan perubahan...' });
    try {
      const org = await OrganizationService.update(id, data);
      Notify.create({
        type: 'positive',
        message: 'Organisasi berhasil diperbarui',
        position: 'top',
      });
      await fetchOrganizations();
      return org;
    } catch (error) {
      console.error('Failed to update organization:', error);
      Notify.create({
        type: 'negative',
        message: 'Gagal memperbarui organisasi',
        position: 'top',
      });
      return null;
    } finally {
      Loading.hide();
    }
  }

  /**
   * Delete organization
   */
  async function deleteOrganization(id: string): Promise<boolean> {
    Loading.show({ message: 'Menghapus data...' });
    try {
      await OrganizationService.delete(id);
      Notify.create({
        type: 'positive',
        message: 'Organisasi berhasil dihapus',
        position: 'top',
      });
      await fetchOrganizations();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Failed to delete organization:', error);
      Notify.create({
        type: 'negative',
        message: 'Gagal menghapus organisasi',
        position: 'top',
      });
      return false;
    } finally {
      Loading.hide();
    }
  }

  /**
   * Bulk delete organizations
   */
  async function bulkDeleteOrganizations(): Promise<boolean> {
    if (selectedIds.value.length === 0) return false;

    Loading.show({ message: `Menghapus ${selectedIds.value.length} data...` });
    try {
      const result = await OrganizationService.bulkDelete(selectedIds.value);
      Notify.create({
        type: 'positive',
        message: `${result.deletedCount} organisasi berhasil dihapus`,
        position: 'top',
      });
      selectedIds.value = [];
      await fetchOrganizations();
      await fetchStats();
      return true;
    } catch (error) {
      console.error('Failed to bulk delete:', error);
      Notify.create({
        type: 'negative',
        message: 'Gagal menghapus organisasi',
        position: 'top',
      });
      return false;
    } finally {
      Loading.hide();
    }
  }

  /**
   * Import CSV
   */
  async function importCSV(file: File): Promise<CSVImportResult | null> {
    Loading.show({ message: 'Mengimpor data CSV...' });
    try {
      const result = await OrganizationService.importCSV(file);
      if (result.successCount > 0) {
        Notify.create({
          type: 'positive',
          message: `${result.successCount} data berhasil diimpor`,
          position: 'top',
        });
        await fetchOrganizations();
        await fetchStats();
        await fetchFilterOptions();
      }
      if (result.failedCount > 0) {
        Notify.create({
          type: 'warning',
          message: `${result.failedCount} data gagal diimpor`,
          position: 'top',
        });
      }
      return result;
    } catch (error) {
      console.error('Failed to import CSV:', error);
      Notify.create({
        type: 'negative',
        message: 'Gagal mengimpor data CSV',
        position: 'top',
      });
      return null;
    } finally {
      Loading.hide();
    }
  }

  /**
   * Export CSV
   */
  async function exportCSV(): Promise<void> {
    Loading.show({ message: 'Mengekspor data...' });
    try {
      const blob = await OrganizationService.exportCSV(filters.value);
      const filename = `organisasi_${new Date().toISOString().split('T')[0]}.csv`;
      OrganizationService.downloadBlob(blob, filename);
      Notify.create({
        type: 'positive',
        message: 'Data berhasil diekspor',
        position: 'top',
      });
    } catch (error) {
      console.error('Failed to export CSV:', error);
      Notify.create({
        type: 'negative',
        message: 'Gagal mengekspor data',
        position: 'top',
      });
    } finally {
      Loading.hide();
    }
  }

  /**
   * Download CSV template
   */
  async function downloadTemplate(): Promise<void> {
    try {
      const blob = await OrganizationService.getCSVTemplate();
      OrganizationService.downloadBlob(blob, 'template_organisasi.csv');
      Notify.create({
        type: 'positive',
        message: 'Template berhasil diunduh',
        position: 'top',
      });
    } catch (error) {
      console.error('Failed to download template:', error);
      Notify.create({
        type: 'negative',
        message: 'Gagal mengunduh template',
        position: 'top',
      });
    }
  }

  /**
   * Toggle selection
   */
  function toggleSelection(id: string): void {
    const index = selectedIds.value.indexOf(id);
    if (index === -1) {
      selectedIds.value.push(id);
    } else {
      selectedIds.value.splice(index, 1);
    }
  }

  /**
   * Select all visible items
   */
  function selectAll(): void {
    selectedIds.value = organizations.value.map((org) => org.id);
  }

  /**
   * Clear selection
   */
  function clearSelection(): void {
    selectedIds.value = [];
  }

  /**
   * Check if item is selected
   */
  function isSelected(id: string): boolean {
    return selectedIds.value.includes(id);
  }

  /**
   * Set page
   */
  function setPage(page: number): void {
    filters.value.page = page;
  }

  /**
   * Set page size
   */
  function setPageSize(limit: number): void {
    filters.value.limit = limit;
    filters.value.page = 1;
  }

  /**
   * Reset filters
   */
  function resetFilters(): void {
    filters.value = {
      search: '',
      jenisOrganisasi: [],
      bidangOrganisasi: [],
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: DEFAULT_LIMIT,
    };
    // Clear optional properties by deleting them
    delete filters.value.namaInstansi;
    delete filters.value.daerahInstansi;
    delete filters.value.tahunMin;
    delete filters.value.tahunMax;
  }

  /**
   * Apply filters (debounced)
   */
  const applyFilters = debounce(() => {
    filters.value.page = 1; // Reset to first page
    void fetchOrganizations();
  }, 300);

  /**
   * Handle search (debounced)
   */
  const handleSearch = debounce((searchTerm: string) => {
    filters.value.search = searchTerm;
    filters.value.page = 1;
    void fetchOrganizations();
  }, 300);

  /**
   * Set sort
   */
  function setSort(sortBy: string, sortOrder: 'asc' | 'desc' = 'asc'): void {
    filters.value.sortBy = sortBy;
    filters.value.sortOrder = sortOrder;
    void fetchOrganizations();
  }

  // Watch filters and auto-fetch
  watch(
    () => filters.value.page,
    () => {
      void fetchOrganizations();
    }
  );

  return {
    // State
    organizations,
    selectedOrganization,
    selectedIds,
    stats,
    filterOptions,
    meta,
    filters,
    loading,
    loadingStats,
    loadingOptions,

    // Computed
    hasSelection,
    selectionCount,
    hasFiltersApplied,

    // Methods
    fetchOrganizations,
    fetchOrganizationById,
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
    selectAll,
    clearSelection,
    isSelected,
    setPage,
    setPageSize,
    resetFilters,
    applyFilters,
    handleSearch,
    setSort,
  };
}

export default useOrganizations;
