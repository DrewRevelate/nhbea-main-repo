import Link from 'next/link';

export default function MembershipSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50/50 to-indigo-50/50 flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-green-300/10 to-transparent rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-300/10 to-transparent rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <div className="glass-card p-8 lg:p-12 rounded-2xl backdrop-blur-md bg-white/40 border border-white/50 shadow-lg">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
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
          </div>

          {/* Success Message */}
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Payment Successful!
          </h1>
          
          <div className="space-y-4 text-slate-600 mb-8">
            <p className="text-lg">
              Thank you for joining the New Hampshire Business Educators Association!
            </p>
            
            <p>
              Your professional membership application has been successfully processed. 
              You will receive a confirmation email shortly with your membership details 
              and member number.
            </p>

            <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-4 text-sm">
              <h2 className="font-semibold text-blue-800 mb-2">What happens next?</h2>
              <ul className="text-blue-700 space-y-1 text-left">
                <li>• You'll receive a welcome email with your member number</li>
                <li>• Access to member resources will be activated within 24 hours</li>
                <li>• You'll be added to our newsletter and communications list</li>
                <li>• Watch for information about upcoming events and conferences</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-white/50 transition-all duration-200 ease-out shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Return to Homepage
            </Link>
            
            <Link
              href="/about"
              className="px-6 py-3 rounded-xl font-semibold text-slate-700 bg-white/60 hover:bg-white/80 border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:ring-offset-2 focus:ring-offset-white/50 transition-all duration-200 ease-out shadow hover:shadow-md"
            >
              Learn More About NHBEA
            </Link>
          </div>

          {/* Contact Information */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-sm text-slate-500">
            <p>
              Questions about your membership? Contact us at{' '}
              <a 
                href="mailto:membership@nhbea.org" 
                className="text-blue-600 hover:text-blue-700 underline"
              >
                membership@nhbea.org
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Membership Payment Successful - NHBEA',
  description: 'Your NHBEA professional membership application has been successfully processed.',
  robots: 'noindex, nofollow', // Don't index success pages
};