import { Suspense, lazy } from 'react';
import Link from 'next/link';
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { FlexibleHero } from '@/components/FlexibleHero';
import { LoadingSpinner, LoadingSkeleton } from '@/components/LoadingSpinner';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { StructuredData } from '@/components/StructuredData';
import MembershipBenefitsHighlight from '@/components/MembershipBenefitsHighlight';
import ConferenceHomeBanner from '@/components/ConferenceHomeBanner';
import SponsorsSection from '@/components/SponsorsSection';
import { getSponsors, defaultSponsors } from '@/lib/sponsors';

// Lazy load non-critical sections for better performance
const TrustBadgesSection = lazy(() => import('@/components/TrustBadgesSection'));
const NewsletterSignup = lazy(() => import('@/components/NewsletterSignup'));


async function HomePage() {
  let sponsors = defaultSponsors;

  try {
    const fetchedSponsors = await getSponsors();
    if (fetchedSponsors) {
      sponsors = fetchedSponsors;
    }
  } catch (error) {
    console.error('Failed to fetch sponsors:', error);
  }

  return (
    <StandardPageLayout
      hero={{
        component: FlexibleHero,
        props: {
          variant: 'home' as const
        }
      }}
      error={{ boundary: true }}
      loading={{ enabled: true }}
      meta={{
        title: 'New Hampshire Business Educators Association - NHBEA',
        description: 'Promoting excellence in business education throughout New Hampshire through professional development, networking, and career advancement opportunities.',
        openGraph: true,
        twitterCard: true
      }}
    >
      {/* SEO Structured Data */}
      <StructuredData type="membership" data={{}} />
      <StructuredData type="awards" data={{}} />
      
      {/* Conference Banner - Prominent at top of content */}
      <div className="mt-16 lg:mt-20">
        <StandardErrorBoundary>
          <ConferenceHomeBanner />
        </StandardErrorBoundary>
      </div>
      
      {/* Visual separator after conference section */}
      <div className="relative py-8">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--brand-primary)]/10 to-transparent"></div>
        <div className="container mx-auto px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/20 to-transparent"></div>
        </div>
      </div>
      
      {/* Value Proposition Section - Critical for perfect UX */}
      <section className="py-8 lg:py-12 bg-gradient-to-br from-[var(--brand-primary)]/5 via-[var(--color-bg-primary)] to-[var(--brand-primary)]/5">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 bg-[var(--brand-accent-primary)]/10 text-[var(--nhbea-accent-gold-dark)] px-4 py-2 rounded-full mb-6">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-sm">TRANSFORM YOUR TEACHING CAREER</span>
            </div>
            <h2 className="heading-1 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] bg-clip-text text-transparent mb-6 leading-tight">
              Join New Hampshire Business Educators Who Are Already Winning
            </h2>
            <p className="body-text-large text-[var(--color-text-secondary)] leading-relaxed mb-8">
              Stop teaching in isolation. Get the professional development, resources, and network you need to become the educator your students deserve—and advance your career faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/membership/professional"
                className="nhbea-button-primary text-lg"
              >
                Start My Professional Journey
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="/about"
                className="nhbea-button-secondary text-lg"
              >
                Learn Our Story
              </Link>
            </div>
          </div>
          
          {/* Social Proof Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="nhbea-card text-center">
              <div className="text-4xl font-bold text-[var(--brand-primary)] mb-2">✓</div>
              <div className="body-text text-[var(--color-text-secondary)] font-medium">Active Members</div>
            </div>
            <div className="nhbea-card text-center">
              <div className="text-4xl font-bold text-[var(--brand-primary)] mb-2">✓</div>
              <div className="body-text text-[var(--color-text-secondary)] font-medium">Years of Excellence</div>
            </div>
            <div className="nhbea-card text-center">
              <div className="text-4xl font-bold text-[var(--brand-primary)] mb-2">✓</div>
              <div className="body-text text-[var(--color-text-secondary)] font-medium">Districts Represented</div>
            </div>
          </div>
        </div>
      </section>

      <ResponsiveGrid 
        gap="lg" 
        breakpoints={{ mobile: 1, tablet: 1, desktop: 1, wide: 1 }}
        className="space-y-16 mt-16"
      >
        {/* Membership Benefits Section */}
        <StandardErrorBoundary>
          <MembershipBenefitsHighlight />
        </StandardErrorBoundary>
        
        {/* Sponsors Section */}
        <StandardErrorBoundary>
          <SponsorsSection sponsors={sponsors} />
        </StandardErrorBoundary>
        
        {/* Trust Indicators */}
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="content" />}>
            <TrustBadgesSection />
          </Suspense>
        </StandardErrorBoundary>
        
        {/* Newsletter Sign-up */}
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="content" />}>
            <NewsletterSignup />
          </Suspense>
        </StandardErrorBoundary>
      </ResponsiveGrid>

      {/* Final CTA Section - Critical for Perfect UX */}
      <section className="py-20 bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-primary-dark)] to-[var(--nhbea-royal-blue-deeper)] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--brand-accent-primary)] rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--brand-accent-secondary)] rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[var(--brand-accent-primary)]/20 text-[var(--nhbea-accent-gold-light)] px-4 py-2 rounded-full mb-6">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-sm">LIMITED TIME: 2025 MEMBERSHIPS NOW OPEN</span>
            </div>
            
            <h2 className="heading-1 text-white mb-6 leading-tight">
              Your Best Teaching Year Starts Now
            </h2>
            
            <p className="body-text-large text-white/90 leading-relaxed mb-8">
              Stop struggling alone. Join New Hampshire business educators who are already transforming their careers with NHBEA membership. 
              <span className="font-bold text-[var(--nhbea-accent-gold-light)]"> Limited spots available for 2025.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link 
                href="/membership/professional"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[var(--brand-accent-primary)] to-[var(--nhbea-accent-gold-dark)] text-[var(--brand-primary)] font-bold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg min-w-[280px]"
              >
                <svg className="mr-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Join Now - Only $30/Year
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <div className="text-center">
                <div className="text-white/80 text-sm mb-1">Are you a student?</div>
                <Link 
                  href="/membership/student"
                  className="text-[var(--nhbea-accent-gold-light)] hover:text-[var(--brand-accent-primary)] font-semibold underline transition-colors duration-200"
                >
                  Get FREE Student Membership
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center text-white/80">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="font-semibold">No Long-Term Commitment</div>
              </div>
              <div className="text-center text-white/80">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </div>
                <div className="font-semibold">Immediate Access</div>
              </div>
              <div className="text-center text-white/80">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="font-semibold">Active Members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </StandardPageLayout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner variant="page" message="Loading homepage..." />}>
      <HomePage />
    </Suspense>
  );
}
