/**
 * Logger Service
 * Provides structured logging with different levels
 */

import { config } from '@/config';

/**
 * Log levels
 */
export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

/**
 * Logger class
 */
export class Logger {
    private static isEnabled = config.enableLogging;

    /**
     * Debug log
     */
    static debug(message: string, ...args: unknown[]): void {
        if (!this.isEnabled) return;

        console.debug(`[DEBUG] ${message}`, ...args);
    }

    /**
     * Info log
     */
    static info(message: string, ...args: unknown[]): void {
        if (!this.isEnabled) return;

        console.info(`[INFO] ${message}`, ...args);
    }

    /**
     * Warning log
     */
    static warn(message: string, ...args: unknown[]): void {
        if (!this.isEnabled) return;

        console.warn(`[WARN] ${message}`, ...args);
    }

    /**
     * Error log
     */
    static error(message: string, ...args: unknown[]): void {
        if (!this.isEnabled) return;

        console.error(`[ERROR] ${message}`, ...args);
    }

    /**
     * Log with custom level
     */
    static log(level: LogLevel, message: string, ...args: unknown[]): void {
        switch (level) {
            case LogLevel.DEBUG:
                this.debug(message, ...args);
                break;
            case LogLevel.INFO:
                this.info(message, ...args);
                break;
            case LogLevel.WARN:
                this.warn(message, ...args);
                break;
            case LogLevel.ERROR:
                this.error(message, ...args);
                break;
        }
    }

    /**
     * Enable logging
     */
    static enable(): void {
        this.isEnabled = true;
    }

    /**
     * Disable logging
     */
    static disable(): void {
        this.isEnabled = false;
    }
}

/**
 * Export default
 */
export default Logger;
