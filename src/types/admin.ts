import { Timestamp } from 'firebase/firestore';

export interface AdminUser {
  uid: string;                           // Firebase Auth UID
  email: string;                         // Admin login email
  displayName: string;                   // Admin's display name
  role: 'superAdmin' | 'contentEditor' | 'readOnly';
  isActive: boolean;                     // Account status
  lastLogin?: Timestamp;
  createdAt: Timestamp;
  permissions: {
    canEditContent: boolean;
    canManageSponsors: boolean;
    canManageMembers: boolean;
    canManageUsers: boolean;
    canPublishContent: boolean;
    canAccessAnalytics: boolean;
  };
  createdBy: string;
  lastModified: Timestamp;
}

export interface AuditLog {
  id: string;
  adminUserId: string;                   // Who performed the action
  adminDisplayName: string;              // For display purposes
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
  resourceType: 'homepage' | 'content' | 'sponsor' | 'member' | 'user';
  resourceId: string;                    // Specific item that was changed
  timestamp: Timestamp;
  changes?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  userAgent?: string;
  ipAddress?: string;
}

export interface AdminSession {
  adminUserId: string;
  email: string;
  displayName: string;
  role: AdminUser['role'];
  permissions: AdminUser['permissions'];
  expiresAt: number;
}

export type AdminPermission = keyof AdminUser['permissions'];

export interface CreateAdminUserRequest {
  email: string;
  displayName: string;
  role: AdminUser['role'];
  permissions: AdminUser['permissions'];
}

export interface UpdateAdminUserRequest {
  displayName?: string;
  role?: AdminUser['role'];
  permissions?: AdminUser['permissions'];
  isActive?: boolean;
}