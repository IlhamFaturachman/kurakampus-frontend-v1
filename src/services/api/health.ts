/**
 * API Health Check Service
 * Test backend connection and monitor API health
 */

import { ApiService } from './client';
import { HEALTH_ENDPOINTS } from './endpoints';
import { Logger } from '@/services/logger';

/**
 * Health check response interface
 */
export interface HealthCheckResponse {
    status: 'ok' | 'error';
    timestamp: string;
    uptime?: number;
    database?: {
        status: 'connected' | 'disconnected';
    };
    memory?: {
        used: number;
        total: number;
    };
}

/**
 * Version info response interface
 */
export interface VersionInfo {
    version: string;
    name: string;
    environment: string;
}

/**
 * API Health Service
 */
export class ApiHealthService {
    /**
     * Check if backend API is reachable
     */
    static async checkHealth(): Promise<HealthCheckResponse> {
        try {
            const response = await ApiService.get<HealthCheckResponse>(HEALTH_ENDPOINTS.HEALTH);
            Logger.info('✅ Backend API is healthy', response.data);
            return response.data;
        } catch (error) {
            Logger.error('❌ Backend API health check failed', error);
            throw error;
        }
    }

    /**
     * Simple ping test
     */
    static async ping(): Promise<boolean> {
        try {
            await ApiService.get(HEALTH_ENDPOINTS.PING);
            Logger.info('✅ Backend API ping successful');
            return true;
        } catch (error) {
            Logger.error('❌ Backend API ping failed', error);
            return false;
        }
    }

    /**
     * Get backend version info
     */
    static async getVersion(): Promise<VersionInfo> {
        try {
            const response = await ApiService.get<VersionInfo>(HEALTH_ENDPOINTS.VERSION);
            Logger.info('📋 Backend version info:', response.data);
            return response.data;
        } catch (error) {
            Logger.error('❌ Failed to get backend version', error);
            throw error;
        }
    }

    /**
     * Test backend connection with comprehensive check
     */
    static async testConnection(): Promise<{
        connected: boolean;
        health?: HealthCheckResponse;
        version?: VersionInfo;
        latency?: number;
    }> {
        const startTime = Date.now();

        try {
            // Test ping first (fastest)
            const pingSuccess = await this.ping();
            if (!pingSuccess) {
                return { connected: false };
            }

            // Get health and version info in parallel
            const [health, version] = await Promise.all([
                this.checkHealth().catch(() => undefined),
                this.getVersion().catch(() => undefined),
            ]);

            const latency = Date.now() - startTime;

            Logger.info('✅ Backend connection test successful', {
                latency: `${latency}ms`,
                health,
                version,
            });

            return {
                connected: true,
                ...(health && { health }),
                ...(version && { version }),
                latency,
            };
        } catch (error) {
            Logger.error('❌ Backend connection test failed', error);
            return { connected: false };
        }
    }
}

export default ApiHealthService;
