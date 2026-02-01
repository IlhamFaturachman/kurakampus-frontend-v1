/**
 * Global UI/App Pinia Store
 * Manages application-wide UI state
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

/**
 * Loading state interface
 */
interface LoadingState {
    [key: string]: boolean;
}

/**
 * Notification interface
 */
export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

/**
 * App/UI store
 */
export const useAppStore = defineStore('app', () => {
    // State
    const darkMode = ref<boolean>(false);
    const sidebarCollapsed = ref<boolean>(false);
    const loading = ref<LoadingState>({});
    const notifications = ref<Notification[]>([]);
    const pageTitle = ref<string>('');

    // Getters
    const isDarkMode = computed<boolean>(() => darkMode.value);
    const isSidebarCollapsed = computed<boolean>(() => sidebarCollapsed.value);
    const isLoading = computed<boolean>(() => Object.values(loading.value).some((v) => v));
    const hasNotifications = computed<boolean>(() => notifications.value.length > 0);

    // Actions
    /**
     * Toggle dark mode
     */
    const toggleDarkMode = (): void => {
        darkMode.value = !darkMode.value;
        localStorage.setItem('darkMode', darkMode.value.toString());

        // Apply dark mode class to body
        if (darkMode.value) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    };

    /**
     * Set dark mode
     */
    const setDarkMode = (value: boolean): void => {
        darkMode.value = value;
        localStorage.setItem('darkMode', value.toString());

        if (value) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    };

    /**
     * Toggle sidebar
     */
    const toggleSidebar = (): void => {
        sidebarCollapsed.value = !sidebarCollapsed.value;
        localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString());
    };

    /**
     * Set sidebar state
     */
    const setSidebarCollapsed = (value: boolean): void => {
        sidebarCollapsed.value = value;
        localStorage.setItem('sidebarCollapsed', value.toString());
    };

    /**
     * Start loading for a specific key
     */
    const startLoading = (key: string = 'global'): void => {
        loading.value[key] = true;
    };

    /**
     * Stop loading for a specific key
     */
    const stopLoading = (key: string = 'global'): void => {
        loading.value[key] = false;
    };

    /**
     * Check if specific key is loading
     */
    const isLoadingKey = (key: string): boolean => {
        return loading.value[key] ?? false;
    };

    /**
     * Add notification
     */
    const addNotification = (notification: Omit<Notification, 'id'>): void => {
        const id = `notification-${Date.now()}-${Math.random()}`;
        const newNotification: Notification = {
            id,
            ...notification,
            duration: notification.duration ?? 3000,
        };

        notifications.value.push(newNotification);

        // Auto remove after duration
        if (newNotification.duration) {
            setTimeout(() => {
                removeNotification(id);
            }, newNotification.duration);
        }
    };

    /**
     * Remove notification
     */
    const removeNotification = (id: string): void => {
        const index = notifications.value.findIndex((n) => n.id === id);
        if (index > -1) {
            notifications.value.splice(index, 1);
        }
    };

    /**
     * Clear all notifications
     */
    const clearNotifications = (): void => {
        notifications.value = [];
    };

    /**
     * Show success notification
     */
    const showSuccess = (message: string, duration?: number): void => {
        addNotification({ type: 'success', message, ...(duration !== undefined && { duration }) });
    };

    /**
     * Show error notification
     */
    const showError = (message: string, duration?: number): void => {
        addNotification({ type: 'error', message, ...(duration !== undefined && { duration }) });
    };

    /**
     * Show warning notification
     */
    const showWarning = (message: string, duration?: number): void => {
        addNotification({ type: 'warning', message, ...(duration !== undefined && { duration }) });
    };

    /**
     * Show info notification
     */
    const showInfo = (message: string, duration?: number): void => {
        addNotification({ type: 'info', message, ...(duration !== undefined && { duration }) });
    };

    /**
     * Set page title
     */
    const setPageTitle = (title: string): void => {
        pageTitle.value = title;
    };

    /**
     * Initialize store from localStorage
     */
    const initialize = (): void => {
        const storedDarkMode = localStorage.getItem('darkMode');
        if (storedDarkMode) {
            setDarkMode(storedDarkMode === 'true');
        }

        const storedSidebarCollapsed = localStorage.getItem('sidebarCollapsed');
        if (storedSidebarCollapsed) {
            sidebarCollapsed.value = storedSidebarCollapsed === 'true';
        }
    };

    // Initialize
    initialize();

    return {
        // State
        darkMode,
        sidebarCollapsed,
        loading,
        notifications,
        pageTitle,

        // Getters
        isDarkMode,
        isSidebarCollapsed,
        isLoading,
        hasNotifications,

        // Actions
        toggleDarkMode,
        setDarkMode,
        toggleSidebar,
        setSidebarCollapsed,
        startLoading,
        stopLoading,
        isLoadingKey,
        addNotification,
        removeNotification,
        clearNotifications,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        setPageTitle,
        initialize,
    };
});

/**
 * Export type for use in components
 */
export type AppStoreType = ReturnType<typeof useAppStore>;
