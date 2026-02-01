/**
 * Organization Types
 * Data types for campus organizations module
 */

/**
 * Organization entity
 */
export interface Organization {
    id: string;
    namaInstansi: string;
    daerahInstansi: string;
    namaOrganisasi: string;
    kontak: string;
    jenisOrganisasi: string;
    bidangOrganisasi: string;
    tahunBerdiri: number;
    penjelasanSingkat?: string;
    proker?: string[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Create organization DTO
 */
export interface CreateOrganizationDto {
    namaInstansi: string;
    daerahInstansi: string;
    namaOrganisasi: string;
    kontak: string;
    jenisOrganisasi: string;
    bidangOrganisasi: string;
    tahunBerdiri: number;
    penjelasanSingkat?: string;
    proker?: string[];
}

/**
 * Update organization DTO
 */
export type UpdateOrganizationDto = Partial<CreateOrganizationDto>;

/**
 * Organization filters for query
 */
export interface OrganizationFilters {
    search?: string;
    namaInstansi?: string;
    daerahInstansi?: string;
    jenisOrganisasi?: string[];
    bidangOrganisasi?: string[];
    tahunMin?: number;
    tahunMax?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

/**
 * Pagination meta from backend
 */
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

/**
 * Organization list response
 */
export interface OrganizationListResponse {
    success: boolean;
    data: Organization[];
    meta: PaginationMeta;
}

/**
 * Single organization response
 */
export interface OrganizationResponse {
    success: boolean;
    data: Organization;
    message?: string;
}

/**
 * Organization statistics
 */
export interface OrganizationStats {
    totalOrganizations: number;
    byJenis: Record<string, number>;
    byBidang: Record<string, number>;
    byInstansi: Record<string, number>;
    recentOrganizations?: Organization[];
}

/**
 * Filter options for dropdowns
 */
export interface OrganizationFilterOptions {
    namaInstansi: string[];
    daerahInstansi: string[];
    jenisOrganisasi: string[];
    bidangOrganisasi: string[];
}

/**
 * CSV import result
 */
export interface CSVImportResult {
    success: boolean;
    successCount: number;
    failedCount: number;
    errors: CSVImportError[];
}

/**
 * CSV import error detail
 */
export interface CSVImportError {
    row: number;
    field: string;
    message: string;
}

/**
 * Bulk delete request
 */
export interface BulkDeleteRequest {
    ids: string[];
}

/**
 * Bulk delete response
 */
export interface BulkDeleteResponse {
    success: boolean;
    deletedCount: number;
}

/**
 * Color mapping for badges
 */
export const JENIS_COLORS: Record<string, string> = {
    UKM: 'primary',
    BEM: 'secondary',
    HIMA: 'accent',
    ORMAWA: 'positive',
    MPM: 'info',
    DPM: 'warning',
    default: 'grey',
};

export const BIDANG_COLORS: Record<string, string> = {
    Olahraga: 'blue',
    Seni: 'purple',
    Akademik: 'green',
    Sosial: 'orange',
    Keagamaan: 'teal',
    Teknologi: 'indigo',
    default: 'grey',
};

/**
 * Get color for jenis badge
 */
export function getJenisColor(jenis: string): string {
    return JENIS_COLORS[jenis] ?? JENIS_COLORS['default'] ?? 'grey';
}

/**
 * Get color for bidang badge
 */
export function getBidangColor(bidang: string): string {
    return BIDANG_COLORS[bidang] ?? BIDANG_COLORS['default'] ?? 'grey';
}
