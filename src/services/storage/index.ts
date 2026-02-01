/**
 * Storage Service
 * Provides type-safe LocalStorage and SessionStorage with encryption support
 */

import { config } from '@/config';

/**
 * Storage type enumeration
 */
export enum StorageType {
    LOCAL = 'local',
    SESSION = 'session',
}

/**
 * Storage options interface
 */
interface StorageOptions {
    type?: StorageType;
    encrypt?: boolean;
    prefix?: string;
}

/**
 * Storage service class
 */
export class StorageService {
    private storage: Storage;
    private prefix: string;
    private encrypt: boolean;

    /**
     * Constructor
     */
    constructor(options: StorageOptions = {}) {
        const { type = StorageType.LOCAL, encrypt = false, prefix = config.storagePrefix } = options;

        this.storage = type === StorageType.LOCAL ? globalThis.localStorage : globalThis.sessionStorage;
        this.prefix = prefix;
        this.encrypt = encrypt;
    }

    /**
     * Get prefixed key
     */
    private getPrefixedKey(key: string): string {
        return `${this.prefix}${key}`;
    }

    /**
     * Encrypt data (placeholder for actual encryption)
     * In production, use a proper encryption library like crypto-js
     */
    private encryptData(data: string): string {
        if (!this.encrypt) return data;
        // TODO: Implement actual encryption
        return btoa(data);
    }

    /**
     * Decrypt data (placeholder for actual decryption)
     */
    private decryptData(data: string): string {
        if (!this.encrypt) return data;
        // TODO: Implement actual decryption
        try {
            return atob(data);
        } catch {
            return data;
        }
    }

    /**
     * Set item in storage
     */
    set<T>(key: string, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            const encryptedValue = this.encryptData(serializedValue);
            this.storage.setItem(this.getPrefixedKey(key), encryptedValue);
        } catch (error) {
            console.error(`Error setting item ${key}:`, error);
        }
    }

    /**
     * Get item from storage
     */
    get<T>(key: string): T | null {
        try {
            const item = this.storage.getItem(this.getPrefixedKey(key));
            if (!item) return null;

            const decryptedValue = this.decryptData(item);
            return JSON.parse(decryptedValue) as T;
        } catch (error) {
            console.error(`Error getting item ${key}:`, error);
            return null;
        }
    }

    /**
     * Remove item from storage
     */
    remove(key: string): void {
        try {
            this.storage.removeItem(this.getPrefixedKey(key));
        } catch (error) {
            console.error(`Error removing item ${key}:`, error);
        }
    }

    /**
     * Clear all items with prefix
     */
    clear(): void {
        try {
            const keys = Object.keys(this.storage);
            keys.forEach((key) => {
                if (key.startsWith(this.prefix)) {
                    this.storage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }

    /**
     * Check if key exists
     */
    has(key: string): boolean {
        return this.storage.getItem(this.getPrefixedKey(key)) !== null;
    }

    /**
     * Get all keys with prefix
     */
    keys(): string[] {
        const allKeys = Object.keys(this.storage);
        return allKeys
            .filter((key) => key.startsWith(this.prefix))
            .map((key) => key.replace(this.prefix, ''));
    }

    /**
     * Get storage size (approximate in bytes)
     */
    getSize(): number {
        let size = 0;
        for (const key in this.storage) {
            if (Object.prototype.hasOwnProperty.call(this.storage, key) && key.startsWith(this.prefix)) {
                size += this.storage[key].length + key.length;
            }
        }
        return size;
    }
}

/**
 * Default storage instances
 */
export const localStorage = new StorageService({ type: StorageType.LOCAL });
export const sessionStorage = new StorageService({ type: StorageType.SESSION });

/**
 * Secure storage with encryption
 */
export const secureStorage = new StorageService({
    type: StorageType.LOCAL,
    encrypt: true,
});

/**
 * Export default
 */
export default StorageService;
