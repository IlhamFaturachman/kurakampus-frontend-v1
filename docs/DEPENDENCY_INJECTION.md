# Dependency Injection Setup

This document explains the dependency injection pattern implementation in the KuraKampus frontend application.

## Overview

The application uses Vue's `provide/inject` API to implement dependency injection for services, making them available throughout the component tree with proper TypeScript typing.

## Architecture

### Boot File: `src/boot/services.ts`

The boot file initializes all services and makes them available via:

1. **Provide/Inject** - For Composition API components
2. **Global Properties** - For Options API components (backward compatibility)

### Injection Keys

Type-safe injection keys are defined for each service:

```typescript
export const API_SERVICE_KEY: InjectionKey<typeof ApiService> = Symbol('apiService');
export const AUTH_SERVICE_KEY: InjectionKey<typeof AuthService> = Symbol('authService');
// ... etc
```

### Services Container

All services are exported in a single container for easy access:

```typescript
export const services = {
  api: ApiService,
  auth: AuthService,
  localStorage,
  sessionStorage,
  secureStorage,
  errorHandler: ErrorHandler,
  logger: Logger,
} as const;
```

## Usage

### In Composition API Components

Use the `useInject` composable for type-safe service injection:

```vue
<script setup lang="ts">
  import { useApiService, useAuthService, useLogger } from '@/composables/useInject';

  // Inject individual services
  const api = useApiService();
  const auth = useAuthService();
  const logger = useLogger();

  // Or inject all services at once
  import { useServices } from '@/composables/useInject';
  const { api, auth, logger } = useServices();

  // Use services
  const fetchData = async () => {
    try {
      const response = await api.get('/data');
      logger.info('Data fetched successfully', response.data);
    } catch (error) {
      logger.error('Failed to fetch data', error);
    }
  };
</script>
```

### In Options API Components

Access services via `this`:

```vue
<script lang="ts">
  export default {
    methods: {
      async fetchData() {
        try {
          const response = await this.$api.get('/data');
          this.$logger.info('Data fetched successfully', response.data);
        } catch (error) {
          this.$logger.error('Failed to fetch data', error);
        }
      },
    },
  };
</script>
```

## Available Services

### API Service (`useApiService()`)

HTTP client with interceptors and error handling:

```typescript
const api = useApiService();

// Make API calls
await api.get('/users');
await api.post('/users', data);
await api.put('/users/:id', data);
await api.delete('/users/:id');
```

### Auth Service (`useAuthService()`)

Authentication and authorization:

```typescript
const auth = useAuthService();

// Authentication
await auth.login(credentials);
await auth.register(userData);
await auth.logout();

// Token management
const token = auth.getAccessToken();
const user = auth.getUser();
const isAuth = auth.isAuthenticated();
```

### Storage Services

Type-safe storage wrappers:

```typescript
const localStorage = useLocalStorage();
const sessionStorage = useSessionStorage();
const secureStorage = useSecureStorage();

// Store and retrieve data with type safety
localStorage.set('key', { data: 'value' });
const data = localStorage.get<{ data: string }>('key');
```

### Error Handler (`useErrorHandler()`)

Centralized error handling:

```typescript
const errorHandler = useErrorHandler();

try {
  // ... some code
} catch (error) {
  errorHandler.handleError(error);
}
```

### Logger (`useLogger()`)

Structured logging:

```typescript
const logger = useLogger();

logger.debug('Debug message', { context });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', error);
```

## Benefits

1. **Type Safety** - Full TypeScript support with proper typing
2. **Testability** - Easy to mock services in tests
3. **Maintainability** - Centralized service management
4. **Flexibility** - Easy to swap implementations
5. **Consistency** - Uniform access pattern across the app
6. **Tree-shaking** - Only import what you need

## Best Practices

1. **Always use injection** - Prefer inject over direct imports in components
2. **Use composables** - Use `useInject` composables for cleaner syntax
3. **Handle errors** - Always wrap service calls in try-catch
4. **Type everything** - Leverage TypeScript for type safety
5. **Log appropriately** - Use logger for debugging and monitoring

## Testing

Mock services in tests:

```typescript
import { vi } from 'vitest';
import { API_SERVICE_KEY } from '@/boot/services';

const mockApiService = {
  get: vi.fn(),
  post: vi.fn(),
  // ... etc
};

const wrapper = mount(Component, {
  global: {
    provide: {
      [API_SERVICE_KEY as symbol]: mockApiService,
    },
  },
});
```

## Configuration

The dependency injection is automatically configured in the Quasar boot file. To enable it:

1. Make sure `src/boot/services.ts` is listed in `quasar.config.ts`:

```typescript
boot: [
  'axios',
  'services', // Add this
];
```

2. The services will be automatically available in all components
