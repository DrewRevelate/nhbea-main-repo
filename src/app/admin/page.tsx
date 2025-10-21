'use client';

import { AdminLayout } from '../../components/admin/AdminLayout';
import { DashboardStats } from '../../components/admin/DashboardStats';
import { PermissionGuard } from '../../components/admin/PermissionGuard';
import { AuditTrail } from '../../components/admin/AuditTrail';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Welcome to NHBEA Admin Portal</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your website content, members, and organizational data from this central dashboard.
            </p>
          </div>
        </div>

        {/* Dashboard Statistics */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Overview</h3>
          <DashboardStats />
        </div>

        {/* Quick Actions */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            <p className="mt-1 text-sm text-gray-500">
              Common administrative tasks
            </p>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <PermissionGuard requiredPermission="canEditContent">
                <a
                  href="/admin/content"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-navy-500 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-navy-50 text-navy-600 ring-4 ring-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-navy-600">
                      Edit Content
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Update website pages and content sections
                    </p>
                  </div>
                </a>
              </PermissionGuard>

              <PermissionGuard requiredPermission="canManageSponsors">
                <a
                  href="/admin/sponsors"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-navy-500 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600 ring-4 ring-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600">
                      Manage Sponsors
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Add, edit, and organize sponsor information
                    </p>
                  </div>
                </a>
              </PermissionGuard>

              <PermissionGuard requiredPermission="canManageMembers">
                <a
                  href="/admin/members"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-navy-500 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 ring-4 ring-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                      Member Directory
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      View and manage member information
                    </p>
                  </div>
                </a>
              </PermissionGuard>

              <PermissionGuard requiredPermission="canManageUsers">
                <a
                  href="/admin/users"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-navy-500 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-600 ring-4 ring-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-600">
                      User Management
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Manage admin users and permissions
                    </p>
                  </div>
                </a>
              </PermissionGuard>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <p className="mt-1 text-sm text-gray-500">
              Latest administrative actions and changes
            </p>
          </div>
          <div className="px-6 py-4">
            <AuditTrail maxItems={10} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}