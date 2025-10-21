'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { HeaderLogo } from '@/components/Logo';
import SearchComponent from '@/components/SearchComponent';
import MobileNavigation from '@/components/MobileNavigation';
import { Menu, ChevronDown } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const pathname = usePathname();
  
  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  const membershipButtonRef = useRef<HTMLButtonElement>(null);
  const membershipMenuRef = useRef<HTMLDivElement>(null);

  // Close membership dropdown when route changes
  useEffect(() => {
    setIsMembershipOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close membership dropdown when clicking outside or on escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      if (isMembershipOpen && 
          membershipMenuRef.current && 
          !membershipMenuRef.current.contains(target) && 
          !membershipButtonRef.current?.contains(target)) {
        setIsMembershipOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMembershipOpen) {
        setIsMembershipOpen(false);
        membershipButtonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMembershipOpen]);

  const handleLinkClick = () => {
    setIsMembershipOpen(false);
  };

  const handleMembershipToggle = () => {
    setIsMembershipOpen(!isMembershipOpen);
  };

  // Navigation items configuration for better maintainability
  const navigationItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/conference', label: 'Conference', highlight: true }, // Conference is highlighted as current focus
    { href: '/awards', label: 'Awards' },
    { href: '/hall-of-fame', label: 'Hall of Fame' }
  ];

  const membershipItems = [
    { href: '/membership/professional', label: 'Professional Membership', description: 'For educators and professionals' },
    { href: '/membership/student', label: 'Student Membership', description: 'For students and recent graduates' }
  ];

  return (
    <>
      <header className="w-full border-b border-[var(--color-border-primary)] bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16" role="navigation" aria-label="Main navigation">
            {/* Logo/Brand - Enhanced accessibility */}
            <div className="flex-shrink-0">
              <HeaderLogo />
            </div>

            {/* Desktop Navigation - Improved visual hierarchy and accessibility */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative text-sm font-medium transition-all duration-200 
                      px-3 py-2 rounded-md
                      hover:text-[var(--nhbea-royal-blue)] hover:bg-[var(--nhbea-royal-blue)]/5
                      focus:outline-none focus:ring-2 focus:ring-[var(--nhbea-royal-blue)] focus:ring-opacity-50
                      ${isActiveLink(item.href) 
                        ? 'text-[var(--nhbea-royal-blue)] font-semibold' 
                        : 'text-[var(--color-text-primary)]'
                      }
                      ${item.highlight ? 'after:absolute after:top-0 after:right-0 after:w-2 after:h-2 after:bg-[var(--nhbea-royal-blue)] after:rounded-full' : ''}
                    `}
                    aria-current={isActiveLink(item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              {/* Enhanced Membership Dropdown */}
              <div className="relative">
                <button 
                  ref={membershipButtonRef}
                  className={`
                    flex items-center space-x-1 text-sm font-medium transition-all duration-200
                    px-3 py-2 rounded-md
                    hover:text-[var(--nhbea-royal-blue)] hover:bg-[var(--nhbea-royal-blue)]/5
                    focus:outline-none focus:ring-2 focus:ring-[var(--nhbea-royal-blue)] focus:ring-opacity-50
                    ${isActiveLink('/membership') 
                      ? 'text-[var(--nhbea-royal-blue)] font-semibold bg-[var(--nhbea-royal-blue)]/5' 
                      : 'text-[var(--color-text-primary)]'
                    }
                  `}
                  onClick={handleMembershipToggle}
                  aria-expanded={isMembershipOpen}
                  aria-haspopup="true"
                  aria-label="Membership options"
                >
                  <span>Membership</span>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${isMembershipOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                
                {isMembershipOpen && (
                  <div 
                    ref={membershipMenuRef}
                    className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-[var(--color-border-primary)] py-2 z-50 animate-fade-in-up"
                    role="menu"
                    aria-labelledby="membership-button"
                  >
                    {membershipItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-3 text-sm hover:bg-[var(--nhbea-royal-blue)]/5 transition-colors duration-150 group"
                        onClick={handleLinkClick}
                        role="menuitem"
                      >
                        <div className="font-medium text-[var(--color-text-primary)] group-hover:text-[var(--nhbea-royal-blue)]">
                          {item.label}
                        </div>
                        <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                          {item.description}
                        </div>
                      </Link>
                    ))}
                    <div className="border-t border-[var(--color-border-primary)] mt-2 pt-2">
                      <Link
                        href="/membership/benefits"
                        className="block px-4 py-2 text-xs text-[var(--nhbea-royal-blue)] hover:underline"
                        onClick={handleLinkClick}
                        role="menuitem"
                      >
                        View all membership benefits →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Search Component - Better spacing */}
              <div className="border-l border-[var(--color-border-primary)] pl-4 ml-2">
                <SearchComponent />
              </div>
              
              {/* Enhanced CTA Button */}
              <Link 
                href="/membership/professional" 
                className="
                  nhbea-button-primary px-4 py-2 font-semibold text-sm
                  transition-all duration-200 hover:shadow-lg hover:scale-105 focus:scale-105
                  focus:outline-none focus:ring-2 focus:ring-[var(--nhbea-royal-blue)] focus:ring-opacity-50
                "
                aria-label="Join NHBEA today - Professional membership"
              >
                Join Today
              </Link>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <button 
              className="md:hidden mobile-nav-button flex items-center justify-center rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--nhbea-royal-blue)] focus:ring-opacity-50"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-5 h-5 text-[var(--color-text-primary)]" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Component */}
      <MobileNavigation 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
}