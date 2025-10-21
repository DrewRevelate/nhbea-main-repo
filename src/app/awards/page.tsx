'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AwardsPageWrapper } from '@/components/awards/AwardsPageWrapper';
import { awardsRepository } from '@/lib/awards';
import type { Award } from '@/types/dataModels';

/**
 * Main Awards Page
 * Client-side component for proper data loading with static export
 */
export default function AwardsPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAwards() {
      try {
        setLoading(true);
        setError(null);
        
        // Add a small delay to ensure Firebase is initialized
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const awardsData = await awardsRepository.getAllAwards();
        setAwards(awardsData);
      } catch (err) {
        console.error('Failed to load awards:', err);
        setError('Unable to load awards data. Please try again later.');
        setAwards([]); // Ensure awards is empty on error
      } finally {
        setLoading(false);
      }
    }

    // Only load if we're in the browser
    if (typeof window !== 'undefined') {
      loadAwards();
    } else {
      setLoading(false);
    }
  }, []);

  // Loading state
  if (loading) {
    return <LoadingSpinner variant="page" message="Loading awards..." />;
  }

  // Error state
  if (error || awards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error ? 'Unable to Load Awards' : 'No Awards Available'}
          </h1>
          <p className="text-gray-600 mb-8">
            {error || 'No awards have been configured yet. Please check back later.'}
          </p>
          <Link 
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AwardsPageWrapper awards={awards} />
  );
}