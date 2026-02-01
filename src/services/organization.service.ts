/**
 * Organization Service
 * API service for campus organizations CRUD operations
 */

import { ApiService } from '@/services/api';
import { ORGANIZATION_ENDPOINTS } from '@/services/api/endpoints';
import type {
    Organization,
    CreateOrganizationDto,
    UpdateOrganizationDto,
    OrganizationFilters,
    OrganizationListResponse,
    OrganizationResponse,
    OrganizationStats,
    OrganizationFilterOptions,
    CSVImportResult,
    BulkDeleteResponse,
} from '@/types/organization';

/**
 * Build query string from filters
 */
function buildQueryParams(filters: OrganizationFilters): string {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.namaInstansi) params.append('namaInstansi', filters.namaInstansi);
    if (filters.daerahInstansi) params.append('daerahInstansi', filters.daerahInstansi);
    if (filters.tahunMin) params.append('tahunMin', filters.tahunMin.toString());
    if (filters.tahunMax) params.append('tahunMax', filters.tahunMax.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    // Handle array params
    if (filters.jenisOrganisasi?.length) {
        filters.jenisOrganisasi.forEach((jenis) => {
            params.append('jenisOrganisasi', jenis);
        });
    }
    if (filters.bidangOrganisasi?.length) {
        filters.bidangOrganisasi.forEach((bidang) => {
            params.append('bidangOrganisasi', bidang);
        });
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
}

/**
 * Organization Service Class
 */
export class OrganizationService {
    /**
     * Get all organizations with filters and pagination
     */
    static async getAll(filters: OrganizationFilters = {}): Promise<OrganizationListResponse> {
        const queryString = buildQueryParams(filters);
        const response = await ApiService.get<OrganizationListResponse>(
            `${ORGANIZATION_ENDPOINTS.BASE}${queryString}`
        );
        // ApiService returns data directly
        return response as unknown as OrganizationListResponse;
    }

    /**
     * Get organization by ID
     */
    static async getById(id: string): Promise<Organization> {
        const response = await ApiService.get<OrganizationResponse>(
            ORGANIZATION_ENDPOINTS.BY_ID(id)
        );
        const data = response as unknown as OrganizationResponse;
        return data.data;
    }

    /**
     * Create new organization
     */
    static async create(data: CreateOrganizationDto): Promise<Organization> {
        const response = await ApiService.post<OrganizationResponse>(
            ORGANIZATION_ENDPOINTS.BASE,
            data
        );
        const result = response as unknown as OrganizationResponse;
        return result.data;
    }

    /**
     * Update organization
     */
    static async update(id: string, data: UpdateOrganizationDto): Promise<Organization> {
        const response = await ApiService.patch<OrganizationResponse>(
            ORGANIZATION_ENDPOINTS.BY_ID(id),
            data
        );
        const result = response as unknown as OrganizationResponse;
        return result.data;
    }

    /**
     * Delete organization
     */
    static async delete(id: string): Promise<void> {
        await ApiService.delete(ORGANIZATION_ENDPOINTS.BY_ID(id));
    }

    /**
     * Bulk delete organizations
     */
    static async bulkDelete(ids: string[]): Promise<BulkDeleteResponse> {
        const response = await ApiService.post<BulkDeleteResponse>(
            ORGANIZATION_ENDPOINTS.BULK_DELETE,
            { ids }
        );
        return response as unknown as BulkDeleteResponse;
    }

    /**
     * Import organizations from CSV
     */
    static async importCSV(file: File): Promise<CSVImportResult> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await ApiService.post<CSVImportResult>(
            ORGANIZATION_ENDPOINTS.IMPORT_CSV,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response as unknown as CSVImportResult;
    }

    /**
     * Export organizations to CSV
     */
    static async exportCSV(filters: OrganizationFilters = {}): Promise<Blob> {
        const queryString = buildQueryParams(filters);
        const response = await ApiService.get<Blob>(
            `${ORGANIZATION_ENDPOINTS.EXPORT_CSV}${queryString}`,
            {
                responseType: 'blob',
            }
        );
        return response as unknown as Blob;
    }

    /**
     * Download CSV template
     */
    static async getCSVTemplate(): Promise<Blob> {
        const response = await ApiService.get<Blob>(
            ORGANIZATION_ENDPOINTS.CSV_TEMPLATE,
            {
                responseType: 'blob',
            }
        );
        return response as unknown as Blob;
    }

    /**
     * Get filter options for dropdowns
     */
    static async getFilterOptions(): Promise<OrganizationFilterOptions> {
        const response = await ApiService.get<{ success: boolean; data: OrganizationFilterOptions }>(
            ORGANIZATION_ENDPOINTS.FILTER_OPTIONS
        );
        const result = response as unknown as { success: boolean; data: OrganizationFilterOptions };
        return result.data;
    }

    /**
     * Get organization statistics
     */
    static async getStats(): Promise<OrganizationStats> {
        const response = await ApiService.get<{ success: boolean; data: OrganizationStats }>(
            ORGANIZATION_ENDPOINTS.STATS
        );
        const result = response as unknown as { success: boolean; data: OrganizationStats };
        return result.data;
    }

    /**
     * Trigger browser download for blob
     */
    static downloadBlob(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}

export default OrganizationService;
