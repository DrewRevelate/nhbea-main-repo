'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
// Using inline SVG icons to match existing codebase pattern

function FailureContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const registrantId = searchParams.get('registrantId');
  const conferenceId = searchParams.get('conferenceId');
  const error = searchParams.get('error');

  // Determine the failure reason and appropriate messaging
  let title = 'Registration Failed';
  let message = 'We encountered an error while processing your conference registration.';
  let actionText = 'Try Again';
  let showRetry = true;

  switch (reason) {
    case 'cancelled':
      title = 'Registration Cancelled';
      message = 'You cancelled the payment process. Your registration was not completed.';
      actionText = 'Try Again';
      break;
    case 'payment_failed':
      title = 'Payment Failed';
      message = 'Your payment could not be processed. Please check your payment information and try again.';
      actionText = 'Try Again';
      break;
    case 'timeout':
      title = 'Registration Timeout';
      message = 'Your registration session expired. Please start the registration process again.';
      actionText = 'Start Over';
      break;
    case 'capacity_full':
      title = 'Conference Full';
      message = 'Unfortunately, the conference has reached full capacity while you were completing your registration.';
      actionText = 'Join Waitlist';
      showRetry = false;
      break;
    case 'registration_closed':
      title = 'Registration Closed';
      message = 'Registration for this conference has closed.';
      actionText = 'View Conference Details';
      showRetry = false;
      break;
    default:
      if (error) {
        message = `Error: ${decodeURIComponent(error)}`;
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {/* Error Icon and Title */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            <p className="text-lg text-gray-600">
              {message}
            </p>
          </div>

          {/* Error Details */}
          {(registrantId || error) && (
            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Error Details</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {registrantId && (
                  <p><strong>Registration ID:</strong> {registrantId}</p>
                )}
                {conferenceId && (
                  <p><strong>Conference ID:</strong> {conferenceId}</p>
                )}
                {error && (
                  <p><strong>Error:</strong> {decodeURIComponent(error)}</p>
                )}
                <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* What happened section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What happened?</h2>
            <div className="space-y-3 text-sm text-gray-600">
              {reason === 'cancelled' && (
                <>
                  <p>• You clicked "Cancel" or closed the payment window</p>
                  <p>• No charges were made to your payment method</p>
                  <p>• Your registration information was not saved</p>
                </>
              )}
              {reason === 'payment_failed' && (
                <>
                  <p>• Your payment method was declined or failed to process</p>
                  <p>• This could be due to insufficient funds, expired card, or bank restrictions</p>
                  <p>• No charges were made to your account</p>
                </>
              )}
              {reason === 'timeout' && (
                <>
                  <p>• The registration session expired due to inactivity</p>
                  <p>• This is a security measure to protect your information</p>
                  <p>• You'll need to start the registration process again</p>
                </>
              )}
              {reason === 'capacity_full' && (
                <>
                  <p>• The conference reached its maximum capacity</p>
                  <p>• You can join the waitlist to be notified of any openings</p>
                  <p>• Priority is given to waitlist members if spots become available</p>
                </>
              )}
              {reason === 'registration_closed' && (
                <>
                  <p>• The registration deadline has passed</p>
                  <p>• Late registration may be available - contact us directly</p>
                  <p>• Check for future conference announcements</p>
                </>
              )}
              {!reason && (
                <>
                  <p>• A technical error occurred during processing</p>
                  <p>• Your payment information was not processed</p>
                  <p>• Please try again or contact support if the problem persists</p>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {showRetry && (
                <Link href="/conference/register">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {actionText}
                  </Button>
                </Link>
              )}
              
              {reason === 'capacity_full' && (
                <Link href="/conference/register?waitlist=true">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    {actionText}
                  </Button>
                </Link>
              )}
              
              <Link href="/conference">
                <Button variant="outline" className="w-full sm:w-auto">
                  View Conference Details
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <Link href="/">
                <Button variant="ghost" className="text-gray-500">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>

          {/* Support Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="bg-blue-50 rounded-md p-4">
              <p className="text-sm text-blue-800 mb-3">
                If you continue to experience issues or have questions about your registration, 
                our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="mailto:support@nhbea.org?subject=Conference Registration Issue"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@nhbea.org
                </a>
                <a 
                  href="tel:+15551234567"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (555) 123-4567
                </a>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Please include your registration ID and error details when contacting support.
              </p>
            </div>
          </div>

          {/* Tips for Success */}
          {showRetry && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tips for a Successful Registration</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">•</span>
                  <span>Ensure your payment information is up to date</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">•</span>
                  <span>Complete the registration process without long delays</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">•</span>
                  <span>Use a stable internet connection</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">•</span>
                  <span>Disable browser extensions that might interfere with payments</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConferenceFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <FailureContent />
    </Suspense>
  );
}