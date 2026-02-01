/**
 * usePagination Composable
 * Provides pagination state and logic
 */

import { ref, computed, type Ref } from 'vue';
import { PAGINATION } from '@/constants';

/**
 * Pagination options interface
 */
interface PaginationOptions {
    initialPage?: number;
    initialPerPage?: number;
    total?: number;
}

/**
 * usePagination return type
 */
interface UsePaginationReturn {
    currentPage: Ref<number>;
    perPage: Ref<number>;
    total: Ref<number>;
    totalPages: Ref<number>;
    from: Ref<number>;
    to: Ref<number>;
    hasNext: Ref<boolean>;
    hasPrev: Ref<boolean>;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
    setTotal: (total: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    firstPage: () => void;
    lastPage: () => void;
    reset: () => void;
}

/**
 * usePagination composable
 */
export const usePagination = (options: PaginationOptions = {}): UsePaginationReturn => {
    const {
        initialPage = PAGINATION.DEFAULT_PAGE,
        initialPerPage = PAGINATION.DEFAULT_PER_PAGE,
        total: initialTotal = 0,
    } = options;

    // State
    const currentPage = ref<number>(initialPage);
    const perPage = ref<number>(initialPerPage);
    const total = ref<number>(initialTotal);

    // Computed
    const totalPages = computed<number>(() => {
        return Math.ceil(total.value / perPage.value) || 1;
    });

    const from = computed<number>(() => {
        return (currentPage.value - 1) * perPage.value + 1;
    });

    const to = computed<number>(() => {
        return Math.min(currentPage.value * perPage.value, total.value);
    });

    const hasNext = computed<boolean>(() => {
        return currentPage.value < totalPages.value;
    });

    const hasPrev = computed<boolean>(() => {
        return currentPage.value > 1;
    });

    // Methods
    const setPage = (page: number): void => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page;
        }
    };

    const setPerPage = (newPerPage: number): void => {
        perPage.value = Math.min(newPerPage, PAGINATION.MAX_PER_PAGE);
        currentPage.value = 1; // Reset to first page
    };

    const setTotal = (newTotal: number): void => {
        total.value = newTotal;

        // Adjust current page if necessary
        if (currentPage.value > totalPages.value) {
            currentPage.value = totalPages.value;
        }
    };

    const nextPage = (): void => {
        if (hasNext.value) {
            currentPage.value++;
        }
    };

    const prevPage = (): void => {
        if (hasPrev.value) {
            currentPage.value--;
        }
    };

    const firstPage = (): void => {
        currentPage.value = 1;
    };

    const lastPage = (): void => {
        currentPage.value = totalPages.value;
    };

    const reset = (): void => {
        currentPage.value = initialPage;
        perPage.value = initialPerPage;
        total.value = initialTotal;
    };

    return {
        currentPage,
        perPage,
        total,
        totalPages,
        from,
        to,
        hasNext,
        hasPrev,
        setPage,
        setPerPage,
        setTotal,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
        reset,
    };
};
