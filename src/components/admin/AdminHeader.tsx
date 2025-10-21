'use client';

import { useState } from 'react';
import { useAdminAuth } from '../../hooks/admin/useAdminAuth';
import { PermissionGuard } from './PermissionGuard';
import Logo from '../Logo';

export const AdminHeader: React.FC = () => {
  const { adminUser, signOut } = useAdminAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-white shadow border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Logo 
                size="sm" 
                showText={false} 
                linkToHome={true} 
                variant="default"
              />
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">NHBEA Admin</h1>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="/admin"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </a>
            
            <PermissionGuard requiredPermission="canEditContent">
              <a
                href="/admin/content"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Content
              </a>
            </PermissionGuard>

            <PermissionGuard requiredPermission="canManageSponsors">
              <a
                href="/admin/sponsors"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sponsors
              </a>
            </PermissionGuard>

            <PermissionGuard requiredPermission="canManageMembers">
              <a
                href="/admin/members"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Members
              </a>
            </PermissionGuard>

            <PermissionGuard requiredPermission="canManageUsers">
              <a
                href="/admin/users"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Users
              </a>
            </PermissionGuard>
          </nav>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {adminUser?.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">
                    {adminUser?.displayName}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {adminUser?.role.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{adminUser?.displayName}</div>
                    <div className="text-xs text-gray-500">{adminUser?.email}</div>
                  </div>
                  
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a
            href="/admin"
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
          >
            Dashboard
          </a>
          
          <PermissionGuard requiredPermission="canEditContent">
            <a
              href="/admin/content"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              Content
            </a>
          </PermissionGuard>

          <PermissionGuard requiredPermission="canManageSponsors">
            <a
              href="/admin/sponsors"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              Sponsors
            </a>
          </PermissionGuard>

          <PermissionGuard requiredPermission="canManageMembers">
            <a
              href="/admin/members"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              Members
            </a>
          </PermissionGuard>

          <PermissionGuard requiredPermission="canManageUsers">
            <a
              href="/admin/users"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              Users
            </a>
          </PermissionGuard>
        </div>
      </div>
    </header>
  );
};