/**
 * User Management Feature Types
 */

import type { BaseEntity } from '@/types/common';
import type { UserRole, UserStatus } from '@/types/auth';

/**
 * User management specific types
 */
export interface UserManagement extends BaseEntity {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    emailVerified: boolean;
    phoneNumber?: string;
    lastLoginAt?: string;
    department?: string;
    position?: string;
}

/**
 * User filter criteria
 */
export interface UserFilterCriteria {
    search?: string;
    role?: UserRole;
    status?: UserStatus;
    emailVerified?: boolean;
    department?: string;
}

/**
 * User create/update data
 */
export interface UserFormData {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    status: UserStatus;
    phoneNumber?: string;
    department?: string;
    position?: string;
}
