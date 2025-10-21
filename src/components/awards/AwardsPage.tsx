'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { FlexibleHero } from '@/components/FlexibleHero';
import { LoadingSpinner, LoadingSkeleton } from '@/components/LoadingSpinner';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';

// Import our new components
import { EnhancedAwardCard } from './EnhancedAwardCard';

// Import utilities and hooks
import { useAwardAnimations } from './shared/hooks/useAwardAnimations';
import { calculateAwardStatus, sortAwardsByPriority } from './shared/utils/awardHelpers';

// Import types
import type { Award } from '@/types/dataModels';
import type { 
  AwardWithStatus
} from './shared/types/awards';

interface AwardsPageProps {
  awards: Award[];
  onNominate: (awardId: string) => void;
  onViewDetails: (awardId: string) => void;
}

export const AwardsPage: React.FC<AwardsPageProps> = ({
  awards,
  onNominate,
  onViewDetails
}) => {
  const [isLoading, setIsLoading] = useState(true);
  
  const { animateEntrance, isAnimating } = useAwardAnimations();

  // Transform awards with status information
  const awardsWithStatus = useMemo((): AwardWithStatus[] => {
    return awards.map((award) => ({
      ...award,
      ...calculateAwardStatus(award)
    }));
  }, [awards]);





  // Display all awards sorted by priority
  const displayedAwards = useMemo(() => {
    return sortAwardsByPriority(awardsWithStatus);
  }, [awardsWithStatus]);


  // Handle loading simulation (remove in production)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle entrance animations
  useEffect(() => {
    if (!isLoading && displayedAwards.length > 0) {
      const cardElements = document.querySelectorAll('[role="article"]') as NodeListOf<HTMLElement>;
      animateEntrance(Array.from(cardElements));
    }
  }, [isLoading, displayedAwards, animateEntrance]);

  if (isLoading) {
    return (
      <StandardPageLayout
        hero={{
          component: FlexibleHero,
          props: {
            variant: 'awards' as const,
            activeAwards: 0,
            nominationDeadline: undefined
          }
        }}
        error={{ boundary: true }}
        loading={{ enabled: true }}
        meta={{
          title: 'Awards & Recognition - NHBEA',
          description: 'Recognizing excellence in business education',
          openGraph: true,
          twitterCard: true
        }}
      >
        <LoadingSpinner variant="page" message="Loading awards..." />
      </StandardPageLayout>
    );
  }

  return (
    <StandardPageLayout
      hero={{
        component: FlexibleHero,
        props: {
          variant: 'awards' as const,
          activeAwards: awardsWithStatus.length,
          nominationDeadline: undefined
        }
      }}
      error={{ boundary: true }}
      loading={{ enabled: true }}
      meta={{
        title: 'Awards & Recognition - NHBEA',
        description: 'Recognizing excellence in business education. Nominate deserving colleagues who have made significant contributions to the field.',
        openGraph: true,
        twitterCard: true
      }}
    >
      <div className="min-h-screen bg-white">

        
        {/* Main Awards Grid */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <StandardErrorBoundary>

            {/* Awards Grid */}
            {displayedAwards.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No awards available
                </h3>
                <p className="text-gray-600 mb-6">
                  There are currently no awards available.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {displayedAwards.map((award, index) => (
                  <div
                    key={award.id}
                    className={`
                      ${award.status === 'active' ? 'lg:col-span-2' : ''}
                    `}
                  >
                    <EnhancedAwardCard
                      award={award}
                      onNominate={onNominate}
                      onViewDetails={onViewDetails}
                      animationDelay={index * 100}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            )}
          </StandardErrorBoundary>
        </main>

        {/* Call to Action Section */}
        <section className="bg-white border-t border-gray-200 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Your Nomination Makes a Difference
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Every nomination helps us recognize outstanding contributions to business education. 
                Take a moment to nominate someone who has made a meaningful impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => {
                    document.getElementById('available-awards')?.scrollIntoView({ 
                      behavior: 'smooth' 
                    });
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Start Nominating
                </button>
                <button 
                  onClick={() => {
                    window.open('/about/awards-program', '_blank');
                  }}
                  className="px-8 py-4 bg-white text-gray-700 font-semibold border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </StandardPageLayout>
  );
};