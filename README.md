# KuraKampus Frontend v1

Enterprise-grade Vue 3 application built with TypeScript, Quasar Framework, and modern best practices.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![Vue](https://img.shields.io/badge/Vue-3.5.22-brightgreen.svg)](https://vuejs.org/)
[![Quasar](https://img.shields.io/badge/Quasar-2.16.0-00b4ff.svg)](https://quasar.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## ✨ Features

- 🚀 **Vue 3** - Composition API with `<script setup>`
- 📘 **TypeScript** - Strict mode with full type safety
- 🎨 **Quasar Framework** - Beautiful, responsive UI components
- 🔐 **Authentication** - JWT-based auth with token refresh
- 📦 **State Management** - Pinia with type-safe stores
- 🛣️ **Vue Router** - Modular routes with guards and middlewares
- 🔧 **API Integration** - Axios with interceptors and error handling
- 🧩 **Composables** - Reusable business logic
- 🔒 **Security** - XSS/CSRF protection, input sanitization
- 🧪 **Testing** - Vitest with 80%+ coverage target
- 📱 **Responsive** - Mobile-first design
- 🎯 **Type Safety** - Strict TypeScript configuration
- 🏗️ **Architecture** - Feature-based modular design
- 📚 **Documentation** - Comprehensive docs and examples

## 📋 Prerequisites

- Node.js >= 20.x
- npm >= 6.13.4 or yarn >= 1.21.1
- Git

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Setup Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=KuraKampus
```

### 3. Start Development Server

```bash
npm run dev
# or
quasar dev
```

The app will be available at `http://localhost:5173`

## 📦 Project Structure

```
src/
├── assets/           # Static assets
├── boot/             # Quasar boot files (DI setup)
├── components/       # Reusable components
│   ├── common/      # Atomic design components
│   ├── forms/       # Form components
│   └── layouts/     # Layout components
├── composables/      # Composition API composables
├── config/           # App configuration
├── constants/        # Global constants
├── features/         # Feature modules (domain-driven)
├── layouts/          # Page layouts
├── pages/            # Page components
├── router/           # Vue Router configuration
│   ├── guards/      # Route guards
│   ├── middlewares/ # Route middlewares
│   └── routes/      # Modular routes
├── services/         # Business logic services
│   ├── api/         # API client
│   ├── auth/        # Authentication
│   ├── storage/     # Storage abstraction
│   ├── error/       # Error handling
│   └── logger/      # Logging
├── stores/           # Pinia stores
├── types/            # TypeScript types
├── utils/            # Utility functions
│   ├── validators/  # Form validators
│   ├── formatters/  # Data formatters
│   ├── helpers/     # Helper functions
│   └── security/    # Security utilities
└── App.vue           # Root component
```

## 🛠️ Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

### Testing

```bash
npm test             # Run tests
npm run test:ui      # Run tests with UI
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Git Hooks

Pre-configured with Husky:

- **pre-commit**: Runs linter on staged files
- **commit-msg**: Validates commit message format

## 🏗️ Architecture

### Design Patterns

- **Composition API**: All components use Vue 3 Composition API
- **Dependency Injection**: Services provided globally via `provide/inject`
- **Repository Pattern**: Services act as data repositories
- **Feature Modules**: Domain-driven design with self-contained modules
- **Atomic Design**: Components organized by complexity

### Key Technologies

| Technology        | Purpose                          |
| ----------------- | -------------------------------- |
| Vue 3             | Progressive JavaScript framework |
| TypeScript        | Type-safe JavaScript             |
| Quasar            | UI component framework           |
| Pinia             | State management                 |
| Vue Router        | Routing                          |
| Axios             | HTTP client                      |
| Vitest            | Testing framework                |
| ESLint + Prettier | Code quality                     |

## 🔐 Authentication

The app uses JWT-based authentication:

```typescript
import { useAuth } from '@/composables/useAuth';

const { login, logout, user, isAuthenticated } = useAuth();

// Login
await login({
  email: 'user@example.com',
  password: 'password123',
});

// Access user data
console.log(user.value);

// Logout
await logout();
```

## 📝 Forms

Type-safe form handling with validation:

```typescript
import { useForm } from '@/composables/useForm';
import { required, email } from '@/utils/validators';

const { formData, errors, isValid, submit } = useForm(
  { email: '', password: '' },
  {
    email: [required(), email()],
    password: [required(), minLength(6)],
  }
);

const handleSubmit = async () => {
  await submit(async (data) => {
    await api.post('/login', data);
  });
};
```

## 🔄 State Management

Pinia stores with TypeScript:

```typescript
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

// Access state
console.log(authStore.user);
console.log(authStore.isAuthenticated);

// Call actions
await authStore.login(credentials);
await authStore.logout();
```

## 🌐 API Integration

Type-safe API calls:

```typescript
import { ApiService } from '@/services/api';

// GET request
const users = await ApiService.get<User[]>('/users');

// POST request
const newUser = await ApiService.post<User>('/users', userData);

// With error handling
try {
  const data = await ApiService.get('/data');
} catch (error) {
  // Automatically handled by error interceptor
}
```

## 🧪 Testing

Write tests with Vitest:

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MyComponent from '@/components/MyComponent.vue';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent);
    expect(wrapper.text()).toContain('Hello');
  });
});
```

Run tests:

```bash
npm test                 # Run all tests
npm run test:coverage    # With coverage
npm run test:ui          # With UI
```

## 🔒 Security

Built-in security features:

- **XSS Protection**: Input sanitization and HTML escaping
- **CSRF Protection**: Token-based protection for mutations
- **Input Validation**: Client-side validation
- **Secure Storage**: Encrypted storage for sensitive data
- **Rate Limiting**: Brute force protection

See [docs/SECURITY.md](docs/SECURITY.md) for details.

## 📚 Documentation

Comprehensive documentation available:

- [Architecture Guide](docs/ARCHITECTURE.md) - System architecture and design patterns
- [Dependency Injection](docs/DEPENDENCY_INJECTION.md) - Service injection setup
- [Security Best Practices](docs/SECURITY.md) - Security implementation
- [Testing Guide](docs/TESTING.md) - Testing strategies and examples

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Environment Variables

Create `.env.production`:

```env
VITE_API_BASE_URL=https://api.kurakampus.com
VITE_APP_NAME=KuraKampus
VITE_ENABLE_LOGGING=false
```

### Docker Deployment

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update dependencies
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Ilham Faturachman** - [@IlhamFaturachman](mailto:ilhamfatur46@gmail.com)

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/)
- [Quasar Framework](https://quasar.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

## 📞 Support

For support, email ilhamfatur46@gmail.com or open an issue.

---

Built with ❤️ using Vue 3 + TypeScript + Quasar
