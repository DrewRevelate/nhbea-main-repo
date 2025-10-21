'use client';

import { AdminLayout } from '../../../components/admin/AdminLayout';
import { PermissionGuard } from '../../../components/admin/PermissionGuard';
import { AdminUserManagement } from '../../../components/admin/AdminUserManagement';

export default function AdminUsersPage() {
  return (
    <AdminLayout title="User Management">
      <PermissionGuard 
        requiredPermission="canManageUsers"
        fallback={
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-yellow-800 mb-2">Access Restricted</h3>
              <p className="text-yellow-700 mb-4">You don't have permission to manage users. Contact a super administrator for access.</p>
              <a
                href="/admin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Return to Dashboard
              </a>
            </div>
          </div>
        }
      >
        <AdminUserManagement />
      </PermissionGuard>
    </AdminLayout>
  );
}