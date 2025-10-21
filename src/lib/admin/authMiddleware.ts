import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '../firebase-admin';
import { adminDb } from '../firebase-admin';
import { AdminUser, AdminPermission } from '../../types/admin';

export interface AdminAuthContext {
  user: {
    uid: string;
    email: string;
  };
  adminUser: AdminUser;
}

export class AuthMiddlewareError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'AuthMiddlewareError';
  }
}

export const authMiddleware = {
  async verifyAdminAuth(request: NextRequest): Promise<AdminAuthContext> {
    // Extract authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthMiddlewareError('Missing or invalid authorization header', 401, 'MISSING_AUTH');
    }

    const idToken = authHeader.split('Bearer ')[1];
    if (!idToken) {
      throw new AuthMiddlewareError('Missing authentication token', 401, 'MISSING_TOKEN');
    }

    try {
      // Verify the Firebase ID token
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      
      // Get admin user data from Firestore
      const adminUserDoc = await adminDb.collection('admin_users').doc(decodedToken.uid).get();
      
      if (!adminUserDoc.exists) {
        throw new AuthMiddlewareError('User is not authorized as an admin', 403, 'NOT_ADMIN');
      }

      const adminUser = adminUserDoc.data() as AdminUser;
      
      if (!adminUser.isActive) {
        throw new AuthMiddlewareError('Admin account is deactivated', 403, 'ACCOUNT_DISABLED');
      }

      return {
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email || adminUser.email,
        },
        adminUser,
      };
    } catch (error: any) {
      if (error instanceof AuthMiddlewareError) {
        throw error;
      }

      // Handle Firebase auth errors
      if (error.code === 'auth/id-token-expired') {
        throw new AuthMiddlewareError('Authentication token has expired', 401, 'TOKEN_EXPIRED');
      }
      
      if (error.code === 'auth/id-token-revoked') {
        throw new AuthMiddlewareError('Authentication token has been revoked', 401, 'TOKEN_REVOKED');
      }

      throw new AuthMiddlewareError('Authentication verification failed', 401, 'AUTH_VERIFICATION_FAILED');
    }
  },

  async verifyAdminPermission(
    context: AdminAuthContext,
    requiredPermission: AdminPermission
  ): Promise<void> {
    if (!context.adminUser.permissions[requiredPermission]) {
      throw new AuthMiddlewareError(
        `Insufficient permissions: ${requiredPermission} required`,
        403,
        'INSUFFICIENT_PERMISSIONS'
      );
    }
  },

  async verifyAdminPermissions(
    context: AdminAuthContext,
    requiredPermissions: AdminPermission[],
    requireAll: boolean = true
  ): Promise<void> {
    const hasPermissions = requireAll
      ? requiredPermissions.every(permission => context.adminUser.permissions[permission])
      : requiredPermissions.some(permission => context.adminUser.permissions[permission]);

    if (!hasPermissions) {
      const permissionType = requireAll ? 'all' : 'any';
      throw new AuthMiddlewareError(
        `Insufficient permissions: requires ${permissionType} of [${requiredPermissions.join(', ')}]`,
        403,
        'INSUFFICIENT_PERMISSIONS'
      );
    }
  },

  createErrorResponse(error: AuthMiddlewareError): NextResponse {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code || 'UNKNOWN_ERROR',
      },
      { status: error.status }
    );
  },

  createProtectedHandler<T = any>(
    handler: (request: NextRequest, context: AdminAuthContext) => Promise<NextResponse<T>>,
    options?: {
      requiredPermission?: AdminPermission;
      requiredPermissions?: AdminPermission[];
      requireAllPermissions?: boolean;
    }
  ) {
    return async (request: NextRequest): Promise<NextResponse<T>> => {
      try {
        // Verify authentication
        const context = await this.verifyAdminAuth(request);

        // Verify permissions if specified
        if (options?.requiredPermission) {
          await this.verifyAdminPermission(context, options.requiredPermission);
        }

        if (options?.requiredPermissions) {
          await this.verifyAdminPermissions(
            context,
            options.requiredPermissions,
            options.requireAllPermissions
          );
        }

        // Call the actual handler
        return await handler(request, context);
      } catch (error) {
        if (error instanceof AuthMiddlewareError) {
          return this.createErrorResponse(error);
        }

        // Handle unexpected errors
        console.error('Unexpected error in auth middleware:', error);
        return NextResponse.json(
          {
            error: 'Internal server error',
            code: 'INTERNAL_ERROR',
          },
          { status: 500 }
        );
      }
    };
  },

  // Utility to extract client IP
  getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    return 'unknown';
  },

  // Utility to extract user agent
  getUserAgent(request: NextRequest): string {
    return request.headers.get('user-agent') || 'unknown';
  }
};