/**
 * Example Composable Test: useAuth
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuth } from '@/composables/useAuth';
import { useAuthStore } from '@/stores/authStore';

// Mock router
const mockRouter = {
    push: vi.fn(),
};

vi.mock('vue-router', () => ({
    useRouter: () => mockRouter,
}));

// Mock Quasar notify
vi.mock('quasar', () => ({
    useQuasar: () => ({
        notify: vi.fn(),
    }),
}));

describe('useAuth', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        mockRouter.push.mockClear();
    });

    it('exposes authentication methods', () => {
        const auth = useAuth();

        expect(auth.login).toBeDefined();
        expect(auth.register).toBeDefined();
        expect(auth.logout).toBeDefined();
        expect(auth.hasRole).toBeDefined();
        expect(auth.user).toBeDefined();
    });

    it('login method calls store login', async () => {
        const authStore = useAuthStore();
        const loginSpy = vi.spyOn(authStore, 'login').mockResolvedValue();

        const auth = useAuth();
        const credentials = {
            email: 'test@example.com',
            password: 'password123',
        };

        await auth.login(credentials);

        expect(loginSpy).toHaveBeenCalledWith(credentials);
        expect(mockRouter.push).toHaveBeenCalledWith({ name: 'dashboard' });
    });

    it('logout method calls store logout', async () => {
        const authStore = useAuthStore();
        const logoutSpy = vi.spyOn(authStore, 'logout').mockResolvedValue();

        const auth = useAuth();
        await auth.logout();

        expect(logoutSpy).toHaveBeenCalled();
        expect(mockRouter.push).toHaveBeenCalledWith({ name: 'login' });
    });

    it('hasRole checks user role correctly', () => {
        const authStore = useAuthStore();
        const hasRoleSpy = vi.spyOn(authStore, 'hasRole').mockReturnValue(true);

        const auth = useAuth();
        const result = auth.hasRole('admin');

        expect(hasRoleSpy).toHaveBeenCalledWith('admin');
        expect(result).toBe(true);
    });
});
