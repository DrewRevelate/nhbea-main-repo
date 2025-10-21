'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SuccessPageContent() {
  const [nominationId, setNominationId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    setNominationId(searchParams.get('id'));
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-6">
            <svg 
              className="h-6 w-6 text-green-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Nomination Submitted Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Thank you for nominating a deserving colleague for an NHBEA award. 
            Your nomination has been received and will be reviewed by the awards committee.
          </p>

          {/* Nomination ID */}
          {nominationId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Nomination Reference ID</p>
              <p className="text-lg font-mono text-gray-900">{nominationId}</p>
              <p className="text-xs text-gray-500 mt-1">
                Save this ID for your records
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">What Happens Next?</h2>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 text-blue-600 mr-2">1.</span>
                <span>The NHBEA awards committee will review your nomination</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 text-blue-600 mr-2">2.</span>
                <span>Additional information may be requested if needed</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 text-blue-600 mr-2">3.</span>
                <span>Award recipients will be announced at the annual conference</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 text-blue-600 mr-2">4.</span>
                <span>All nominators will be notified of the committee's decision</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/awards"
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View All Awards
            </Link>
            <Link
              href="/awards/nominate"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Submit Another Nomination
            </Link>
          </div>

          {/* Contact Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Questions about your nomination? Contact the NHBEA board at{' '}
              <a href="mailto:awards@nhbea.org" className="text-blue-600 hover:text-blue-800">
                awards@nhbea.org
              </a>
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About NHBEA Awards</h2>
          <p className="text-gray-600 mb-4">
            The New Hampshire Business Education Association recognizes outstanding educators who have made 
            significant contributions to business education. These awards celebrate excellence in teaching, 
            innovation in curriculum development, and service to the educational community.
          </p>
          <p className="text-gray-600">
            Award recipients receive recognition at the annual conference, professional development opportunities, 
            and become part of NHBEA's prestigious legacy of educational excellence.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Award Nomination Success Page
 * Confirms successful submission and provides next steps
 */
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}

