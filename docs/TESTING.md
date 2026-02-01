# Testing Guide

Comprehensive guide for testing the KuraKampus frontend application.

## Table of Contents

1. [Overview](#overview)
2. [Testing Stack](#testing-stack)
3. [Setup](#setup)
4. [Running Tests](#running-tests)
5. [Unit Tests](#unit-tests)
6. [Component Tests](#component-tests)
7. [Integration Tests](#integration-tests)
8. [E2E Tests](#e2e-tests)
9. [Mocking](#mocking)
10. [Code Coverage](#code-coverage)
11. [Best Practices](#best-practices)

## Overview

The testing strategy emphasizes:

- **High coverage**: Minimum 80% code coverage
- **Fast execution**: Unit tests run in milliseconds
- **Reliability**: Consistent, reproducible results
- **Maintainability**: Clear, readable test code

## Testing Stack

### Core Tools

- **Vitest** - Fast unit test framework for Vite projects
- **Vue Test Utils** - Official testing utilities for Vue components
- **JSDOM** - DOM implementation for Node.js
- **@vitest/coverage-v8** - Code coverage provider

### Optional Tools (To Be Installed)

- **Playwright** or **Cypress** - E2E testing
- **MSW (Mock Service Worker)** - API mocking

## Setup

### Install Dependencies

```bash
npm install -D vitest @vitest/ui @vitest/coverage-v8 @vue/test-utils jsdom happy-dom
```

### Configuration

Test configuration is in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

### Update package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest watch"
  }
}
```

## Running Tests

### All Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### With UI

```bash
npm run test:ui
```

### Coverage Report

```bash
npm run test:coverage
```

### Specific File

```bash
npm test validators.test
```

## Unit Tests

Unit tests focus on individual functions and utilities.

### Example: Testing Validators

```typescript
import { describe, it, expect } from 'vitest';
import { required, email } from '@/utils/validators';

describe('required validator', () => {
  it('validates non-empty values', () => {
    const validator = required('Field is required');
    expect(validator('test').valid).toBe(true);
  });

  it('invalidates empty values', () => {
    const validator = required('Field is required');
    const result = validator('');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Field is required');
  });
});
```

### Testing Utilities

Test pure functions with various inputs:

```typescript
import { formatCurrency } from '@/utils/formatters';

describe('formatCurrency', () => {
  it('formats positive numbers', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('formats negative numbers', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});
```

## Component Tests

Component tests verify component behavior and rendering.

### Example: Testing BaseButton

```typescript
import { mount } from '@vue/test-utils';
import BaseButton from '@/components/common/BaseButton.vue';

describe('BaseButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me',
      },
    });

    expect(wrapper.text()).toContain('Click me');
  });

  it('emits click event', async () => {
    const wrapper = mount(BaseButton);
    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('shows loading state', () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true },
    });

    expect(wrapper.find('.q-spinner').exists()).toBe(true);
  });
});
```

### Testing Props

```typescript
it('applies custom color', () => {
  const wrapper = mount(BaseButton, {
    props: {
      color: 'secondary',
    },
  });

  const button = wrapper.find('button');
  expect(button.classes()).toContain('bg-secondary');
});
```

### Testing Events

```typescript
it('emits custom event with payload', async () => {
  const wrapper = mount(MyComponent);

  await wrapper.find('button').trigger('click');

  expect(wrapper.emitted('custom-event')).toBeTruthy();
  expect(wrapper.emitted('custom-event')?.[0]).toEqual([{ id: 1 }]);
});
```

### Testing Slots

```typescript
it('renders named slots', () => {
  const wrapper = mount(MyComponent, {
    slots: {
      header: '<div>Header Content</div>',
      default: '<div>Body Content</div>',
      footer: '<div>Footer Content</div>',
    },
  });

  expect(wrapper.html()).toContain('Header Content');
  expect(wrapper.html()).toContain('Body Content');
  expect(wrapper.html()).toContain('Footer Content');
});
```

## Integration Tests

Integration tests verify how multiple components work together.

### Example: Testing Composables

```typescript
import { setActivePinia, createPinia } from 'pinia';
import { useAuth } from '@/composables/useAuth';
import { useAuthStore } from '@/stores/authStore';

describe('useAuth composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('login updates auth state', async () => {
    const auth = useAuth();
    const authStore = useAuthStore();

    await auth.login({
      email: 'test@example.com',
      password: 'password',
    });

    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.user).toBeDefined();
  });
});
```

### Testing with Router

```typescript
import { createRouter, createMemoryHistory } from 'vue-router';
import { routes } from '@/router/routes';

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

const wrapper = mount(MyComponent, {
  global: {
    plugins: [router],
  },
});

await router.push('/dashboard');
await router.isReady();

expect(wrapper.text()).toContain('Dashboard');
```

## E2E Tests

End-to-end tests verify complete user flows.

### With Playwright (Recommended)

```typescript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});
```

### Setup Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

## Mocking

### Mocking Modules

```typescript
import { vi } from 'vitest';

vi.mock('@/services/api', () => ({
  ApiService: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));
```

### Mocking Functions

```typescript
const mockFn = vi.fn();
mockFn.mockReturnValue('mocked value');
mockFn.mockResolvedValue({ data: 'async mocked value' });
```

### Mocking API Calls

```typescript
import { ApiService } from '@/services/api';

vi.spyOn(ApiService, 'get').mockResolvedValue({
  data: [{ id: 1, name: 'Test User' }],
});
```

### Mocking Router

```typescript
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
};

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  useRoute: () => ({
    params: { id: '1' },
    query: {},
  }),
}));
```

### Mocking Quasar

```typescript
vi.mock('quasar', () => ({
  useQuasar: () => ({
    notify: vi.fn(),
    loading: {
      show: vi.fn(),
      hide: vi.fn(),
    },
  }),
}));
```

## Code Coverage

### View Coverage Report

```bash
npm run test:coverage
```

Coverage report will be generated in `coverage/` directory.

### Coverage Thresholds

Configured in `vitest.config.ts`:

```typescript
coverage: {
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  },
}
```

### Improving Coverage

1. **Identify uncovered code**: Check coverage report
2. **Write missing tests**: Focus on critical paths
3. **Test edge cases**: Handle error scenarios
4. **Test error handling**: Verify error boundaries

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ❌ Bad - Testing implementation
it('sets loading to true', () => {
  const wrapper = mount(MyComponent);
  expect(wrapper.vm.loading).toBe(true);
});

// ✅ Good - Testing behavior
it('shows loading spinner', () => {
  const wrapper = mount(MyComponent);
  expect(wrapper.find('.loading-spinner').exists()).toBe(true);
});
```

### 2. Use Descriptive Test Names

```typescript
// ❌ Bad
it('works', () => {});

// ✅ Good
it('displays error message when login fails', () => {});
```

### 3. Arrange-Act-Assert Pattern

```typescript
it('submits form with valid data', async () => {
  // Arrange
  const wrapper = mount(LoginForm);
  const submitSpy = vi.fn();

  // Act
  await wrapper.find('input[name="email"]').setValue('test@example.com');
  await wrapper.find('input[name="password"]').setValue('password123');
  await wrapper.find('form').trigger('submit');

  // Assert
  expect(submitSpy).toHaveBeenCalled();
});
```

### 4. Test One Thing at a Time

```typescript
// ❌ Bad - Multiple assertions unrelated
it('component works', () => {
  expect(wrapper.text()).toContain('Hello');
  expect(wrapper.emitted('click')).toBeTruthy();
  expect(wrapper.classes()).toContain('active');
});

// ✅ Good - Separate tests
it('displays greeting message', () => {
  expect(wrapper.text()).toContain('Hello');
});

it('emits click event when clicked', () => {
  expect(wrapper.emitted('click')).toBeTruthy();
});

it('applies active class when active', () => {
  expect(wrapper.classes()).toContain('active');
});
```

### 5. Clean Up After Tests

```typescript
afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  wrapper?.unmount();
});
```

### 6. Use Test Utilities

```typescript
// Create reusable test utilities
function createWrapper(props = {}) {
  return mount(MyComponent, {
    props,
    global: {
      plugins: [createTestingPinia()],
    },
  });
}

it('renders with default props', () => {
  const wrapper = createWrapper();
  expect(wrapper.exists()).toBe(true);
});
```

### 7. Test Edge Cases

```typescript
describe('divide function', () => {
  it('divides numbers correctly', () => {
    expect(divide(10, 2)).toBe(5);
  });

  it('handles division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });

  it('handles negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
  });

  it('handles decimals', () => {
    expect(divide(5, 2)).toBe(2.5);
  });
});
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)

## Troubleshooting

### Tests Timing Out

Increase timeout in test file:

```typescript
it('slow test', async () => {
  // Test code
}, 10000); // 10 second timeout
```

### Module Not Found

Check path aliases in `vitest.config.ts`:

```typescript
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
  },
}
```

### Component Not Rendering

Ensure Quasar is installed in test environment:

```typescript
// tests/setup.ts
import { config } from '@vue/test-utils';
import { Quasar } from 'quasar';

config.global.plugins = [Quasar];
```
