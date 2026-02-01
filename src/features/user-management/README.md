# User Management Feature

This feature module contains all user management related functionality.

## Structure

```
user-management/
├── components/       # Feature-specific UI components
├── composables/      # Feature-specific composables
├── services/         # API services for user management
├── stores/           # Pinia store for state management
├── types/            # TypeScript types and interfaces
└── utils/            # Feature-specific utilities
```

## Usage

### Import the composable

```typescript
import { useUserManagement } from '@/features/user-management/composables/useUserManagement';

const { users, loadUsers, createUser, updateUser, deleteUser } = useUserManagement();
```

### Load users

```typescript
await loadUsers();
```

### Create a new user

```typescript
await createUser({
  email: 'user@example.com',
  username: 'john_doe',
  firstName: 'John',
  lastName: 'Doe',
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
});
```

## API Endpoints

- `GET /users` - Get paginated list of users
- `GET /users/:id` - Get single user
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/:id/activate` - Activate user
- `POST /users/:id/deactivate` - Deactivate user

## Type Safety

All functions and components in this feature module are fully typed with TypeScript for maximum type safety.
