'use client';

import { useEffect, useState } from 'react';
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';
import { LoadingSkeleton } from '@/components/LoadingSpinner';
import { getHallOfFameMembers } from '@/lib/hallOfFame';
import { HallOfFameMember } from '@/types/dataModels';
import HallOfFameHeroSection from '@/components/HallOfFameHeroSection';
import EnhancedHallOfFameGrid from '@/components/EnhancedHallOfFameGrid';
import HallOfFameCallToAction from '@/components/HallOfFameCallToAction';

// Loading component using brand-consistent design
function HallOfFameLoading() {
  return (
    <StandardPageLayout
      loading={{ enabled: true }}
      meta={{
        title: 'Hall of Fame - NHBEA',
        description: 'Celebrating excellence in business education',
        openGraph: true
      }}
    >
      <section className="nhbea-academic-hero">
        <div className="nhbea-container">
          <div className="animate-pulse">
            <div className="h-4 bg-white/20 rounded w-32 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="h-16 bg-white/20 rounded-lg w-3/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-4 bg-white/10 rounded w-5/6"></div>
                  <div className="h-4 bg-white/10 rounded w-4/6"></div>
                </div>
                <div className="flex space-x-4">
                  <div className="h-12 bg-white/20 rounded-xl w-32"></div>
                  <div className="h-12 bg-white/10 rounded-xl w-28"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="h-32 bg-white/10 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="nhbea-section bg-gradient-to-br from-background via-card to-secondary/10">
        <div className="nhbea-container">
          <div className="text-center mb-16">
            <LoadingSkeleton variant="content" />
            <LoadingSkeleton variant="content" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }, (_, i) => (
              <LoadingSkeleton key={i} variant="grid" />
            ))}
          </div>
        </div>
      </section>
    </StandardPageLayout>
  );
}

// Error component using brand-consistent design
function HallOfFameError({ error }: { error: string }) {
  return (
    <StandardPageLayout
      error={{ boundary: true }}
      meta={{
        title: 'Hall of Fame - Error - NHBEA',
        description: 'Error loading Hall of Fame members'
      }}
    >
      <StandardErrorBoundary>
        <HallOfFameHeroSection totalMembers={0} latestInductionYear={new Date().getFullYear()} />
      </StandardErrorBoundary>
      
      <section className="nhbea-section bg-gradient-to-br from-background via-card to-secondary/10">
        <div className="nhbea-container-narrow">
          <div className="nhbea-card text-center p-12">
            <div className="w-20 h-20 bg-gradient-to-r from-accent/20 to-accent/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="heading-2 mb-4">Unable to Load Hall of Fame</h2>
            <p className="body-text text-lg mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="nhbea-button-primary"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </section>

      <StandardErrorBoundary>
        <HallOfFameCallToAction />
      </StandardErrorBoundary>
    </StandardPageLayout>
  );
}

// Main component that fetches and displays Hall of Fame members
function HallOfFameContent() {
  const [members, setMembers] = useState<HallOfFameMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMembers() {
      try {
        const fetchedMembers = await getHallOfFameMembers();
        setMembers(fetchedMembers);
      } catch (err) {
        console.error('Error fetching Hall of Fame members:', err);
        setError('Unable to load Hall of Fame members at this time. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, []);

  if (loading) {
    return <HallOfFameLoading />;
  }

  if (error) {
    return <HallOfFameError error={error} />;
  }

  // Calculate stats for hero section
  const totalMembers = members.length;
  const latestInductionYear = members.length > 0 
    ? Math.max(...members.map(m => m.inductionYear))
    : new Date().getFullYear();

  return (
    <StandardPageLayout
      error={{ boundary: true }}
      loading={{ enabled: true }}
      meta={{
        title: 'Hall of Fame - NHBEA',
        description: 'Celebrating the extraordinary educators who have shaped business education in New Hampshire. Discover our distinguished Hall of Fame honorees.',
        openGraph: true,
        twitterCard: true
      }}
      main={{ id: 'hall-of-fame-main-content', focusable: true }}
    >
      {/* Hero Section */}
      <StandardErrorBoundary>
        <HallOfFameHeroSection 
          totalMembers={totalMembers}
          latestInductionYear={latestInductionYear}
        />
      </StandardErrorBoundary>

      {/* Members Grid */}
      <StandardErrorBoundary>
        <EnhancedHallOfFameGrid members={members} />
      </StandardErrorBoundary>

      {/* Call to Action */}
      <StandardErrorBoundary>
        <HallOfFameCallToAction />
      </StandardErrorBoundary>
    </StandardPageLayout>
  );
}

// Main page component
export default function HallOfFamePage() {
  return <HallOfFameContent />;
}