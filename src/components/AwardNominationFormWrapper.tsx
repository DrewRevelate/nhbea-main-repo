'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AwardNominationForm from './AwardNominationForm';
import { awardsRepository } from '@/lib/awards';
import type { Award } from '@/types/dataModels';
import type { AwardNominationFormData } from '@/lib/awardValidation';

interface NominationSubmissionResult {
  success: boolean;
  message: string;
  nominationId?: string;
  error?: string;
}

async function submitNomination(data: AwardNominationFormData): Promise<NominationSubmissionResult> {
  try {
    const response = await fetch('/api/nominations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Failed to submit nomination',
        error: errorData.error
      };
    }

    return response.json();
  } catch (error) {
    console.error('Network error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

function AwardNominationFormContent() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedAwardId = searchParams.get('award');

  useEffect(() => {
    async function loadAwards() {
      try {
        setLoading(true);
        const fetchedAwards = await awardsRepository.getAllAwards();
        
        // Filter for active awards with future deadlines
        const availableAwards = fetchedAwards.filter(award => 
          award.isActive && new Date() <= award.deadline
        );
        
        setAwards(availableAwards);
        setError(null);
      } catch (err) {
        console.error('Failed to load awards:', err);
        setError('Unable to load awards data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadAwards();
  }, []);

  const handleSubmission = async (data: AwardNominationFormData): Promise<NominationSubmissionResult> => {
    const result = await submitNomination(data);
    
    if (result.success) {
      // Redirect to success page with nomination ID
      router.push(`/awards/success?id=${result.nominationId}`);
    }
    
    return result;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading awards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-red-800 mb-2">Unable to Load Nomination Form</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (awards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-yellow-800 mb-2">No Awards Available for Nomination</h1>
            <p className="text-yellow-700 mb-4">
              All award nomination deadlines have passed. Please check back next year for new nomination opportunities.
            </p>
            <a 
              href="/awards"
              className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              View All Awards
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Submit an Award Nomination</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nominate a deserving colleague for recognition of their outstanding contributions to business education.
          </p>
        </div>

        <AwardNominationForm 
          awards={awards} 
          onSubmit={handleSubmission}
        />

        {/* Help Information */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Need Help?</h2>
          <div className="text-blue-800 space-y-2 text-sm">
            <p>• Make sure you have permission to nominate the individual</p>
            <p>• Provide detailed, specific examples of achievements</p>
            <p>• Review the award criteria carefully before submitting</p>
            <p>• Contact the NHBEA board if you have questions about the nomination process</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AwardNominationFormWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading nomination form...</p>
        </div>
      </div>
    }>
      <AwardNominationFormContent />
    </Suspense>
  );
}