'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Awards', href: '/awards' },
    { label: 'Conference', href: '/conference' },
    { label: 'Hall of Fame', href: '/hall-of-fame' },
  ];

  const membershipItems = [
    { label: 'Membership Benefits', href: '/membership/benefits' },
    { label: 'Professional Membership', href: '/membership/professional' },
    { label: 'Student Membership', href: '/membership/student' },
    { label: 'Renew Membership', href: '/membership/renewal' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <div className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 md:hidden shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-lg font-semibold text-gray-900">Menu</span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    block px-4 py-3 rounded-lg text-base font-medium transition-colors
                    ${
                      isActiveLink(item.href)
                        ? 'bg-[var(--nhbea-royal-blue)] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}

              {/* Membership Section */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Membership
                </div>
                {membershipItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`
                      block px-4 py-3 rounded-lg text-base font-medium transition-colors
                      ${
                        isActiveLink(item.href)
                          ? 'bg-[var(--nhbea-royal-blue)] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer CTA */}
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/membership/professional"
              onClick={onClose}
              className="block w-full px-4 py-3 text-center bg-[var(--nhbea-royal-blue)] text-white rounded-lg font-medium hover:bg-[var(--nhbea-royal-blue)]/90 transition-colors"
            >
              Join NHBEA
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
