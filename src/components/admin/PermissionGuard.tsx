'use client';

import { ReactNode } from 'react';
import { useAdminAuth } from '../../hooks/admin/useAdminAuth';
import { AdminPermission } from '../../types/admin';
import { permissions } from '../../lib/admin/permissions';

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermission?: AdminPermission;
  requiredPermissions?: AdminPermission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  role?: 'superAdmin' | 'contentEditor' | 'readOnly';
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  requiredPermissions,
  requireAll = true,
  fallback = null,
  role,
}) => {
  const { adminUser, isAuthenticated } = useAdminAuth();

  // If not authenticated, don't render
  if (!isAuthenticated || !adminUser) {
    return <>{fallback}</>;
  }

  // Check role if specified
  if (role && adminUser.role !== role) {
    return <>{fallback}</>;
  }

  // Check single permission
  if (requiredPermission) {
    const hasPermission = permissions.hasPermission(adminUser.permissions, requiredPermission);
    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }

  // Check multiple permissions
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasPermissions = requireAll
      ? permissions.hasAllPermissions(adminUser.permissions, requiredPermissions)
      : permissions.hasAnyPermission(adminUser.permissions, requiredPermissions);

    if (!hasPermissions) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

// Convenience components for common permission checks
export const SuperAdminOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <PermissionGuard role="superAdmin" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const ContentEditorOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <PermissionGuard
    requiredPermissions={['canEditContent', 'canPublishContent']}
    requireAll={false}
    fallback={fallback}
  >
    {children}
  </PermissionGuard>
);

export const UserManagerOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback = null,
}) => (
  <PermissionGuard requiredPermission="canManageUsers" fallback={fallback}>
    {children}
  </PermissionGuard>
);