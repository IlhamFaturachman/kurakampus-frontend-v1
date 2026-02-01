/**
 * Data formatters utilities
 * Provides functions to format various types of data for display
 */

import { DATE_FORMATS } from '@/constants';

/**
 * Format date to string
 */
export const formatDate = (
    date: string | Date | number,
    format: string = DATE_FORMATS.DATE
): string => {
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';

        const pad = (num: number): string => num.toString().padStart(2, '0');

        const tokens: Record<string, string> = {
            YYYY: d.getFullYear().toString(),
            MM: pad(d.getMonth() + 1),
            DD: pad(d.getDate()),
            HH: pad(d.getHours()),
            mm: pad(d.getMinutes()),
            ss: pad(d.getSeconds()),
        };

        return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => tokens[match] ?? match);
    } catch {
        return '';
    }
};

/**
 * Format date time to string
 */
export const formatDateTime = (date: string | Date | number): string => {
    return formatDate(date, DATE_FORMATS.DATE_TIME);
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date | number): string => {
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';

        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (seconds < 60) return 'just now';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
        return `${years} year${years > 1 ? 's' : ''} ago`;
    } catch {
        return '';
    }
};

/**
 * Format currency
 */
export const formatCurrency = (
    amount: number,
    currency: string = 'IDR',
    locale: string = 'id-ID'
): string => {
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
        }).format(amount);
    } catch {
        return amount.toString();
    }
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (num: number, locale: string = 'id-ID'): string => {
    try {
        return new Intl.NumberFormat(locale).format(num);
    } catch {
        return num.toString();
    }
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
    try {
        return `${value.toFixed(decimals)}%`;
    } catch {
        return '0%';
    }
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Format based on length
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return phone;
};

/**
 * Format credit card number
 */
export const formatCreditCard = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cardNumber;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalize each word
 */
export const capitalizeWords = (str: string): string => {
    if (!str) return '';
    return str
        .split(' ')
        .map((word) => capitalize(word))
        .join(' ');
};

/**
 * Truncate string
 */
export const truncate = (str: string, maxLength: number, suffix: string = '...'): string => {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Format initials from name
 */
export const formatInitials = (name: string, maxChars: number = 2): string => {
    if (!name) return '';

    const words = name.trim().split(/\s+/);
    const initials = words
        .map((word) => word.charAt(0).toUpperCase())
        .slice(0, maxChars)
        .join('');

    return initials;
};

/**
 * Format slug from string
 */
export const formatSlug = (str: string): string => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * Format JSON with indentation
 */
export const formatJSON = (obj: unknown, indent: number = 2): string => {
    try {
        return JSON.stringify(obj, null, indent);
    } catch {
        return '';
    }
};

/**
 * Format boolean to Yes/No
 */
export const formatBoolean = (value: boolean): string => {
    return value ? 'Yes' : 'No';
};

/**
 * Format array to comma-separated string
 */
export const formatArray = (arr: unknown[], separator: string = ', '): string => {
    return arr.join(separator);
};
