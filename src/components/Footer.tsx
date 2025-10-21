'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FooterLogo } from '@/components/Logo';
import { Suspense } from 'react';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';

// Dynamically import FooterNewsletterSignup to prevent SSR issues
const FooterNewsletterSignup = dynamic(
  () => import('@/components/FooterNewsletterSignup'),
  { 
    ssr: false,
    loading: () => (
      <div className="animate-pulse">
        <div className="h-10 bg-white/10 rounded-lg mb-2"></div>
        <div className="h-10 bg-white/10 rounded-lg"></div>
      </div>
    )
  }
);

export default function Footer() {
  return (
    <footer className="brand-bg-primary-deep text-white relative overflow-hidden mt-auto">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <FooterLogo className="mb-4" />
            <p className="text-sm text-white/80 leading-relaxed mb-4">
              Empowering business educators across New Hampshire since 1923.
            </p>
            <div className="flex items-center text-sm text-white/70">
              <svg className="w-4 h-4 mr-2 text-[var(--nhbea-accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@nhbea.org" className="hover:text-[var(--nhbea-accent-gold)] transition-colors">
                info@nhbea.org
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-white/80 hover:text-[var(--nhbea-accent-gold)] transition-colors">
                  About NHBEA
                </Link>
              </li>
              <li>
                <Link href="/conference" className="text-sm text-white/80 hover:text-[var(--nhbea-accent-gold)] transition-colors">
                  Annual Conference
                </Link>
              </li>
              <li>
                <Link href="/awards" className="text-sm text-white/80 hover:text-[var(--nhbea-accent-gold)] transition-colors">
                  Awards Program
                </Link>
              </li>
              <li>
                <Link href="/hall-of-fame" className="text-sm text-white/80 hover:text-[var(--nhbea-accent-gold)] transition-colors">
                  Hall of Fame
                </Link>
              </li>
            </ul>
          </div>

          {/* Membership */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Membership</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/membership/professional" className="text-sm text-white/80 hover:text-[var(--nhbea-accent-gold)] transition-colors">
                  Professional
                </Link>
              </li>
              <li>
                <Link href="/membership/student" className="text-sm text-white/80 hover:text-[var(--nhbea-accent-gold)] transition-colors">
                  Student
                </Link>
              </li>
              <li>
                <Link href="/membership/benefits" className="text-sm text-white/80 hover:text-[var(--nhbea-accent-gold)] transition-colors">
                  Benefits
                </Link>
              </li>
              <li>
                <Link href="/membership/renewal" className="text-sm text-white/80 hover:text-[var(--nhbea-accent-gold)] transition-colors">
                  Renewal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Stay Connected</h4>
            <p className="text-sm text-white/80 mb-4">
              Get updates on conferences and professional development.
            </p>
            
            <StandardErrorBoundary 
              fallback={(props) => (
                <div className="text-sm text-white/60 bg-white/5 rounded-lg p-3">
                  <p>Newsletter signup temporarily unavailable.</p>
                  <p className="mt-1">Contact us at <a href="mailto:info@nhbea.org" className="text-[var(--nhbea-accent-gold)]">info@nhbea.org</a></p>
                </div>
              )}
            >
              <Suspense fallback={
                <div className="animate-pulse">
                  <div className="h-10 bg-white/10 rounded-lg mb-2"></div>
                  <div className="h-10 bg-white/10 rounded-lg"></div>
                </div>
              }>
                <FooterNewsletterSignup />
              </Suspense>
            </StandardErrorBoundary>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Copyright */}
            <div className="text-center sm:text-left">
              <p className="text-sm text-white/70">
                &copy; {new Date().getFullYear()} New Hampshire Business Education Association
              </p>
              <p className="text-xs text-white/50 mt-1">
                Website by <a href="https://DrewLambert.com" target="_blank" rel="noopener noreferrer" className="text-[var(--nhbea-accent-gold)] hover:underline">Drew Lambert</a>
              </p>
            </div>
            
            {/* Footer Links */}
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-sm text-white/70 hover:text-[var(--nhbea-accent-gold)] transition-colors">
                Privacy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-white/70 hover:text-[var(--nhbea-accent-gold)] transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-sm text-white/70 hover:text-[var(--nhbea-accent-gold)] transition-colors">
                Contact
              </Link>
              <Link href="/sitemap" className="text-sm text-white/70 hover:text-[var(--nhbea-accent-gold)] transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}