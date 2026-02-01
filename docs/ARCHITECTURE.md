# KuraKampus Frontend Architecture

Complete documentation of the KuraKampus frontend application architecture, design patterns, and best practices.

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Design Patterns](#design-patterns)
5. [State Management](#state-management)
6. [Routing](#routing)
7. [API Integration](#api-integration)
8. [Authentication](#authentication)
9. [Form Management](#form-management)
10. [Component Architecture](#component-architecture)
11. [Feature Modules](#feature-modules)
12. [Security](#security)
13. [Testing](#testing)
14. [Best Practices](#best-practices)

## Overview

KuraKampus is an enterprise-grade Vue 3 application built with TypeScript, Quasar Framework, and modern best practices. The architecture emphasizes:

- **Type Safety**: Full TypeScript implementation with strict mode
- **Modularity**: Feature-based organization with clear boundaries
- **Reusability**: Composables and utilities for common functionality
- **Maintainability**: Clean code with comprehensive documentation
- **Security**: XSS/CSRF protection and input sanitization
- **Performance**: Lazy loading, code splitting, and optimizations
- **Testability**: Dependency injection and mockable services

## Technology Stack

### Core

- **Vue 3.5.22** - Progressive JavaScript framework with Composition API
- **TypeScript 5.9.2** - Type-safe JavaScript with strict mode
- **Quasar 2.16.0** - Enterprise-ready UI framework
- **Vite** - Fast build tool and development server

### State Management

- **Pinia 3.0.1** - Intuitive, type-safe state management
- **Vue Router 4.0.12** - Official router with typed routes

### HTTP & API

- **Axios 1.2.1** - Promise-based HTTP client
- **JWT Decode 4.0.0** - JWT token parsing

### Code Quality

- **ESLint 9.14.0** - Linting with flat config
- **Prettier 3.3.3** - Code formatting
- **Husky** - Git hooks for quality gates
- **Commitlint** - Conventional commit messages
- **Lint-staged** - Run linters on staged files

## Project Structure

```
src/
├── assets/              # Static assets (images, fonts)
├── boot/                # Quasar boot files
│   ├── axios.ts        # Axios configuration
│   └── services.ts     # Dependency injection setup
├── components/          # Reusable components
│   ├── common/         # Atomic design components (Button, Input, Card)
│   ├── forms/          # Form-specific components
│   └── layouts/        # Layout components
├── composables/         # Composition API composables
│   ├── useAuth.ts      # Authentication composable
│   ├── useApi.ts       # API call composable
│   ├── useForm.ts      # Form management composable
│   ├── usePagination.ts # Pagination composable
│   ├── usePolling.ts   # Polling composable
│   └── useInject.ts    # Service injection composable
├── config/              # Application configuration
│   └── index.ts        # Environment-based config
├── constants/           # Global constants
│   └── index.ts        # App constants (routes, errors, etc.)
├── css/                 # Global styles
│   ├── app.scss        # Main stylesheet
│   └── quasar.variables.scss # Quasar customization
├── features/            # Feature modules (domain-driven design)
│   └── user-management/
│       ├── components/ # Feature-specific components
│       ├── composables/ # Feature composables
│       ├── services/   # Feature services
│       ├── stores/     # Feature stores
│       ├── types/      # Feature types
│       ├── utils/      # Feature utilities
│       └── README.md   # Feature documentation
├── layouts/             # Page layouts
│   ├── AuthLayout.vue  # Authentication pages layout
│   └── MainLayout.vue  # Main application layout
├── pages/               # Page components
│   ├── page-auth-signin.vue
│   ├── page-auth-signup.vue
│   └── DashboardPage.vue
├── router/              # Router configuration
│   ├── guards/         # Route guards
│   ├── middlewares/    # Route middlewares
│   ├── routes/         # Modular route definitions
│   └── index.ts        # Router instance
├── services/            # Global services
│   ├── api/            # API client
│   ├── auth/           # Authentication service
│   ├── storage/        # Storage service
│   ├── error/          # Error handling
│   └── logger/         # Logging service
├── stores/              # Pinia stores
│   ├── authStore.ts    # Authentication state
│   ├── appStore.ts     # Application state
│   └── index.ts        # Store exports
├── types/               # TypeScript type definitions
│   ├── common.ts       # Common types
│   ├── auth.ts         # Authentication types
│   └── router.ts       # Router types
├── utils/               # Utility functions
│   ├── validators/     # Form validators
│   ├── formatters/     # Data formatters
│   ├── helpers/        # Helper functions
│   └── security/       # Security utilities
├── App.vue              # Root component
└── env.d.ts            # Environment type declarations
```

## Design Patterns

### 1. Composition API Pattern

All components use Vue 3 Composition API with `<script setup>`:

```vue
<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { User } from '@/types/auth';

  // Props with TypeScript
  interface Props {
    user: User;
    readonly?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    readonly: false,
  });

  // Emits with TypeScript
  interface Emits {
    (e: 'update', user: User): void;
    (e: 'delete', id: string): void;
  }

  const emit = defineEmits<Emits>();

  // Reactive state
  const loading = ref(false);

  // Computed properties
  const displayName = computed(() => `${props.user.firstName} ${props.user.lastName}`);

  // Methods
  const handleUpdate = () => {
    emit('update', props.user);
  };
</script>
```

### 2. Dependency Injection Pattern

Services are provided globally and injected where needed:

```typescript
// boot/services.ts
export const API_SERVICE_KEY: InjectionKey<typeof ApiService> = Symbol('apiService');

app.provide(API_SERVICE_KEY, ApiService);

// In components
import { useApiService } from '@/composables/useInject';

const api = useApiService();
```

### 3. Repository Pattern

Services act as repositories for data access:

```typescript
// services/auth/index.ts
export class AuthService {
  static async login(credentials: LoginCredentials): Promise<User> {
    const response = await ApiService.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/auth/login',
      credentials
    );
    // Handle tokens and return user
    return response.data.user;
  }
}
```

### 4. Composable Pattern

Reusable logic extracted into composables:

```typescript
// composables/useAuth.ts
export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    await authStore.login(credentials);
    router.push({ name: 'dashboard' });
  };

  return {
    login,
    logout: authStore.logout,
    user: computed(() => authStore.user),
  };
}
```

### 5. Feature Module Pattern

Domain-driven design with self-contained modules:

```
features/user-management/
├── components/     # UI components
├── composables/    # Business logic
├── services/       # Data access
├── stores/         # State management
├── types/          # Type definitions
├── utils/          # Feature utilities
└── README.md       # Documentation
```

## State Management

### Pinia Stores

Type-safe state management with Composition API:

```typescript
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const tokens = ref<AuthTokens | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!user.value);

  // Actions
  async function login(credentials: LoginCredentials) {
    const response = await AuthService.login(credentials);
    user.value = response.user;
    tokens.value = response.tokens;
  }

  return {
    // State
    user,
    tokens,
    // Getters
    isAuthenticated,
    // Actions
    login,
  };
});
```

### Store Organization

- **authStore**: User authentication state
- **appStore**: Global UI state (theme, notifications, loading)
- **Feature stores**: Domain-specific state within feature modules

## Routing

### Modular Routes

Routes are organized by feature:

```typescript
// router/routes/auth.routes.ts
export const authRoutes: AppRoute[] = [
  {
    path: '/login',
    name: ROUTE_NAMES.LOGIN,
    component: () => import('@/pages/page-auth-signin.vue'),
    meta: { requiresGuest: true },
  },
];
```

### Route Guards

Type-safe route guards for authorization:

```typescript
// router/guards/auth.guard.ts
export const authGuard: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: ROUTE_NAMES.LOGIN });
  }

  next();
};
```

### Middlewares

Global route middlewares:

- **loggerMiddleware**: Log navigation events
- **titleMiddleware**: Set page title
- **progressMiddleware**: Show loading indicator

## API Integration

### Centralized API Client

Axios instance with interceptors:

```typescript
// Automatic token injection
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatic error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => handleApiError(error)
);
```

### Type-Safe API Calls

```typescript
const response = await ApiService.get<ApiResponse<User[]>>('/users');
// response.data is typed as User[]
```

## Authentication

### JWT Token Management

- Tokens stored in secure storage
- Automatic refresh before expiration
- CSRF protection for state-changing requests

### Authentication Flow

1. User submits credentials
2. API returns JWT tokens
3. Tokens stored securely
4. Access token added to requests
5. Refresh token used when access token expires

## Form Management

### useForm Composable

Type-safe form handling with validation:

```typescript
const { formData, errors, isValid, submit } = useForm<LoginForm>(
  {
    email: '',
    password: '',
  },
  {
    email: [required(), email()],
    password: [required(), minLength(6)],
  }
);
```

### Validators

Reusable validation functions:

- `required()` - Required field
- `email()` - Email format
- `minLength(n)` - Minimum length
- `password()` - Strong password
- `confirmPassword()` - Password confirmation

## Component Architecture

### Atomic Design

Components organized by complexity:

1. **Atoms**: Basic building blocks (BaseButton, BaseInput)
2. **Molecules**: Simple combinations (FormInput with validation)
3. **Organisms**: Complex components (UserTable, LoginForm)
4. **Templates**: Page layouts
5. **Pages**: Complete views

### Component Example

```vue
<template>
  <BaseButton :loading="loading" @click="handleClick">
    <slot />
  </BaseButton>
</template>

<script setup lang="ts">
  interface Props {
    loading?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
  });

  interface Emits {
    (e: 'click'): void;
  }

  const emit = defineEmits<Emits>();

  const handleClick = () => {
    if (!props.loading) {
      emit('click');
    }
  };
</script>
```

## Feature Modules

### Self-Contained Modules

Each feature module is independent:

```typescript
// features/user-management/composables/useUserManagement.ts
export function useUserManagement() {
  const store = useUserManagementStore();

  const loadUsers = async () => {
    await store.fetchUsers();
  };

  return {
    users: computed(() => store.users),
    loading: computed(() => store.loading),
    loadUsers,
  };
}
```

### Module Benefits

- Clear boundaries between domains
- Easy to test in isolation
- Can be extracted as separate packages
- Self-documenting with README

## Security

### Implemented Protections

1. **XSS Protection**: Input sanitization and HTML escaping
2. **CSRF Protection**: Token-based protection for mutations
3. **Input Validation**: Client-side validation with sanitization
4. **Secure Storage**: Encrypted storage for sensitive data
5. **Rate Limiting**: Prevent brute force attacks

### Security Utilities

```typescript
import { sanitizeInput, escapeHtml, sanitizeHtml } from '@/utils/security';

// Sanitize user input
const safe = sanitizeInput(userInput);

// Escape HTML
const escaped = escapeHtml(htmlString);

// Sanitize rich text
const clean = sanitizeHtml(richText);
```

See [SECURITY.md](./SECURITY.md) for complete security documentation.

## Testing

### Testing Strategy

1. **Unit Tests**: Test individual functions and composables
2. **Component Tests**: Test component behavior
3. **Integration Tests**: Test feature modules
4. **E2E Tests**: Test complete user flows

### Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseButton from '@/components/common/BaseButton.vue';

describe('BaseButton', () => {
  it('emits click event when clicked', async () => {
    const wrapper = mount(BaseButton);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('does not emit click when loading', async () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true },
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeFalsy();
  });
});
```

## Best Practices

### TypeScript

- Always use strict mode
- Define interfaces for all data structures
- Avoid `any` type - use `unknown` if type is truly unknown
- Use type guards for runtime type checking

### Vue 3

- Use Composition API with `<script setup>`
- Extract reusable logic into composables
- Use `ref()` for primitives, `reactive()` for objects
- Prefer `computed()` over methods for derived state

### Code Organization

- One component per file
- Group related files in folders
- Use barrel exports (index.ts) for cleaner imports
- Follow naming conventions (PascalCase for components, camelCase for functions)

### Performance

- Lazy load routes and heavy components
- Use virtual scrolling for long lists
- Debounce/throttle frequent operations
- Optimize images and assets

### Git Workflow

- Use conventional commits
- Keep commits small and focused
- Write descriptive commit messages
- Run linters before committing (automated with Husky)

## Additional Documentation

- [Dependency Injection](./DEPENDENCY_INJECTION.md)
- [Security Best Practices](./SECURITY.md)
- [Feature Module Guide](../src/features/user-management/README.md)

## Roadmap

### Planned Improvements

- [ ] Add comprehensive test coverage (>80%)
- [ ] Implement real-time features with WebSockets
- [ ] Add PWA support
- [ ] Implement advanced caching strategies
- [ ] Add performance monitoring
- [ ] Implement micro-frontend architecture

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

[Add your license here]
