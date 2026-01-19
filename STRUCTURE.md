# 📁 Project Structure

This document describes the organized folder structure of the KuraKampus Frontend application.

## 🎯 Overview

The project follows a modular, feature-based structure for better maintainability and scalability.

## 📂 Folder Structure

```
src/
├── assets/              # Static assets (images, fonts, etc.)
├── boot/                # Quasar boot files
│   └── axios.ts        # Axios configuration & interceptors
├── components/          # Reusable components
│   ├── models.ts       # Component type definitions
│   ├── EssentialLink.vue
│   └── ExampleComponent.vue
├── composables/         # Vue composables (reusable logic)
│   └── usePolling.ts   # Polling functionality
├── css/                 # Global styles
│   ├── app.scss
│   └── quasar.variables.scss
├── layouts/             # Layout components
│   ├── AuthLayout.vue  # Layout for authentication pages
│   └── MainLayout.vue  # Main app layout
├── pages/               # Page components (organized by feature)
│   ├── auth/           # Authentication pages
│   │   ├── LoginPage.vue
│   │   └── SignupPage.vue
│   ├── dashboard/      # Dashboard pages
│   │   └── DashboardPage.vue
│   ├── home/           # Home pages
│   │   └── IndexPage.vue
│   └── errors/         # Error pages
│       └── ErrorNotFound.vue
├── router/              # Vue Router configuration
│   ├── index.ts        # Router setup & guards
│   └── routes.ts       # Route definitions
├── services/            # API services
│   └── api.service.ts  # API request wrapper
├── stores/              # Pinia stores (state management)
│   ├── index.ts        # Store setup
│   ├── auth.ts         # Authentication state
│   └── example-store.ts
└── App.vue              # Root component
```

## 🗂️ Feature Organization

### Pages Structure

Pages are organized by feature/domain:

- **`pages/auth/`** - Authentication related pages (Login, Signup, Forgot Password, etc.)
- **`pages/dashboard/`** - Dashboard and analytics pages
- **`pages/home/`** - Landing and home pages
- **`pages/errors/`** - Error pages (404, 500, etc.)

### Benefits

1. **Scalability** - Easy to add new features without cluttering
2. **Maintainability** - Clear separation of concerns
3. **Developer Experience** - Easy to find and navigate code
4. **Team Collaboration** - Multiple developers can work on different features

## 🚀 Adding New Features

### Adding a New Page Category

```bash
# Example: Adding profile pages
mkdir src/pages/profile
touch src/pages/profile/ProfilePage.vue
touch src/pages/profile/SettingsPage.vue
```

### Adding a New Route

Update `src/router/routes.ts`:

```typescript
{
  path: '/profile',
  component: () => import('layouts/MainLayout.vue'),
  meta: { requiresAuth: true },
  children: [
    {
      path: '',
      name: 'profile',
      component: () => import('pages/profile/ProfilePage.vue'),
      meta: { title: 'Profile' }
    }
  ]
}
```

## 🔐 Route Protection

Routes are protected using navigation guards in `src/router/index.ts`:

- **Protected Routes** - Require authentication (`meta: { requiresAuth: true }`)
- **Public Routes** - Accessible without auth (`meta: { requiresAuth: false }`)

## 📝 Naming Conventions

- **Components** - PascalCase with suffix (e.g., `LoginPage.vue`, `UserCard.vue`)
- **Composables** - camelCase with `use` prefix (e.g., `usePolling.ts`, `useAuth.ts`)
- **Stores** - kebab-case (e.g., `auth.ts`, `user-settings.ts`)
- **Routes** - kebab-case (e.g., `/auth/login`, `/user/profile`)

## 🎨 Layouts

Two main layouts:

1. **AuthLayout** - For authentication pages (Login, Signup)
   - No sidebar/navigation
   - Centered content
   - Gradient background

2. **MainLayout** - For authenticated app pages
   - Sidebar navigation
   - Header with user menu
   - Full app functionality

## 🔄 State Management

Pinia stores organized by feature:

- `stores/auth.ts` - Authentication state & actions
- Future: `stores/user.ts`, `stores/courses.ts`, etc.

## 📦 Services

API services provide clean abstraction:

- `services/api.service.ts` - Base API service with common methods
- Future: Feature-specific services (e.g., `services/user.service.ts`)

## 🧩 Composables

Reusable logic extracted into composables:

- `composables/usePolling.ts` - Polling functionality
- Future: `useAuth.ts`, `useNotification.ts`, etc.

---

**Last Updated:** January 19, 2026
