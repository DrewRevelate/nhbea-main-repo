import { z } from 'zod';
import { AdminUser } from '../../types/admin';

// Admin user validation schemas
export const adminUserRoleSchema = z.enum(['superAdmin', 'contentEditor', 'readOnly']);

export const adminPermissionsSchema = z.object({
  canEditContent: z.boolean(),
  canManageSponsors: z.boolean(),
  canManageMembers: z.boolean(),
  canManageUsers: z.boolean(),
  canPublishContent: z.boolean(),
  canAccessAnalytics: z.boolean(),
});

export const createAdminUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  role: adminUserRoleSchema,
  permissions: adminPermissionsSchema,
});

export const updateAdminUserSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').optional(),
  role: adminUserRoleSchema.optional(),
  permissions: adminPermissionsSchema.optional(),
  isActive: z.boolean().optional(),
});

export const adminSignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Audit log validation schemas
export const auditLogActionSchema = z.enum(['create', 'update', 'delete', 'publish', 'unpublish']);

export const auditLogResourceTypeSchema = z.enum(['homepage', 'content', 'sponsor', 'member', 'user']);

export const createAuditLogSchema = z.object({
  adminUserId: z.string().min(1, 'Admin user ID is required'),
  adminDisplayName: z.string().min(1, 'Admin display name is required'),
  action: auditLogActionSchema,
  resourceType: auditLogResourceTypeSchema,
  resourceId: z.string().min(1, 'Resource ID is required'),
  changes: z.object({
    before: z.record(z.any()).optional(),
    after: z.record(z.any()).optional(),
  }).optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
});

// Validation utilities
export const validation = {
  validateCreateAdminUser(data: unknown) {
    return createAdminUserSchema.parse(data);
  },

  validateUpdateAdminUser(data: unknown) {
    return updateAdminUserSchema.parse(data);
  },

  validateAdminSignIn(data: unknown) {
    return adminSignInSchema.parse(data);
  },

  validateCreateAuditLog(data: unknown) {
    return createAuditLogSchema.parse(data);
  },

  validateEmail(email: string): boolean {
    try {
      z.string().email().parse(email);
      return true;
    } catch {
      return false;
    }
  },

  validateRole(role: string): role is AdminUser['role'] {
    try {
      adminUserRoleSchema.parse(role);
      return true;
    } catch {
      return false;
    }
  },

  validatePermissions(permissions: unknown): boolean {
    try {
      adminPermissionsSchema.parse(permissions);
      return true;
    } catch {
      return false;
    }
  },

  sanitizeDisplayName(displayName: string): string {
    return displayName.trim().replace(/\s+/g, ' ');
  },

  getValidationErrorMessage(error: z.ZodError): string {
    return error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('; ');
  }
};