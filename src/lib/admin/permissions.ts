import { AdminUser, AdminPermission } from '../../types/admin';

export const ROLE_PERMISSIONS: Record<AdminUser['role'], AdminUser['permissions']> = {
  superAdmin: {
    canEditContent: true,
    canManageSponsors: true,
    canManageMembers: true,
    canManageUsers: true,
    canPublishContent: true,
    canAccessAnalytics: true,
  },
  contentEditor: {
    canEditContent: true,
    canManageSponsors: true,
    canManageMembers: false,
    canManageUsers: false,
    canPublishContent: true,
    canAccessAnalytics: true,
  },
  readOnly: {
    canEditContent: false,
    canManageSponsors: false,
    canManageMembers: false,
    canManageUsers: false,
    canPublishContent: false,
    canAccessAnalytics: true,
  },
};

export const permissions = {
  hasPermission(
    userPermissions: AdminUser['permissions'],
    requiredPermission: AdminPermission
  ): boolean {
    return userPermissions[requiredPermission] === true;
  },

  hasAnyPermission(
    userPermissions: AdminUser['permissions'],
    requiredPermissions: AdminPermission[]
  ): boolean {
    return requiredPermissions.some(permission => this.hasPermission(userPermissions, permission));
  },

  hasAllPermissions(
    userPermissions: AdminUser['permissions'],
    requiredPermissions: AdminPermission[]
  ): boolean {
    return requiredPermissions.every(permission => this.hasPermission(userPermissions, permission));
  },

  canAccessAdminPanel(userPermissions: AdminUser['permissions']): boolean {
    return Object.values(userPermissions).some(permission => permission === true);
  },

  getDefaultPermissionsForRole(role: AdminUser['role']): AdminUser['permissions'] {
    return { ...ROLE_PERMISSIONS[role] };
  },

  validatePermissions(permissions: Partial<AdminUser['permissions']>): AdminUser['permissions'] {
    return {
      canEditContent: permissions.canEditContent ?? false,
      canManageSponsors: permissions.canManageSponsors ?? false,
      canManageMembers: permissions.canManageMembers ?? false,
      canManageUsers: permissions.canManageUsers ?? false,
      canPublishContent: permissions.canPublishContent ?? false,
      canAccessAnalytics: permissions.canAccessAnalytics ?? false,
    };
  },

  isHigherRole(currentRole: AdminUser['role'], targetRole: AdminUser['role']): boolean {
    const roleHierarchy: Record<AdminUser['role'], number> = {
      readOnly: 1,
      contentEditor: 2,
      superAdmin: 3,
    };
    
    return roleHierarchy[currentRole] > roleHierarchy[targetRole];
  },

  canManageUser(
    currentUser: Pick<AdminUser, 'role' | 'permissions'>,
    targetUser: Pick<AdminUser, 'role'>
  ): boolean {
    // Super admins can manage all users
    if (currentUser.role === 'superAdmin') {
      return true;
    }
    
    // Other roles cannot manage users
    return false;
  }
};