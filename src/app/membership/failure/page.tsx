import Link from 'next/link';

export default function MembershipFailurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-slate-50 to-blue-50/50 flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-red-300/10 to-transparent rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-slate-300/10 to-transparent rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <div className="glass-card p-8 lg:p-12 rounded-2xl backdrop-blur-md bg-white/40 border border-white/50 shadow-lg">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
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
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Payment Unsuccessful
          </h1>
          
          <div className="space-y-4 text-slate-600 mb-8">
            <p className="text-lg">
              We encountered an issue processing your membership payment.
            </p>
            
            <p>
              Don't worry – no charges have been made to your account. 
              This could be due to a temporary issue with the payment system 
              or your payment method.
            </p>

            <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-4 text-sm">
              <h2 className="font-semibold text-amber-800 mb-2">Common reasons for payment issues:</h2>
              <ul className="text-amber-700 space-y-1 text-left">
                <li>• Insufficient funds or credit limit reached</li>
                <li>• Incorrect card information or expired card</li>
                <li>• Bank security settings blocking the transaction</li>
                <li>• Network connectivity issues</li>
                <li>• Browser or ad-blocker interference</li>
              </ul>
            </div>

            <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-4 text-sm">
              <h2 className="font-semibold text-blue-800 mb-2">What you can do:</h2>
              <ul className="text-blue-700 space-y-1 text-left">
                <li>• Try the payment again with the same or different payment method</li>
                <li>• Check with your bank if the transaction was blocked</li>
                <li>• Use a different browser or disable ad-blockers</li>
                <li>• Contact us if the problem persists</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/membership/professional"
              className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-white/50 transition-all duration-200 ease-out shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try Payment Again
            </Link>
            
            <Link
              href="/"
              className="px-6 py-3 rounded-xl font-semibold text-slate-700 bg-white/60 hover:bg-white/80 border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:ring-offset-2 focus:ring-offset-white/50 transition-all duration-200 ease-out shadow hover:shadow-md"
            >
              Return to Homepage
            </Link>
          </div>

          {/* Contact Information */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="text-sm text-slate-600 space-y-2">
              <p className="font-medium">
                Need help with your membership application?
              </p>
              <div className="space-y-1">
                <p>
                  Email us at{' '}
                  <a 
                    href="mailto:membership@nhbea.org" 
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    membership@nhbea.org
                  </a>
                </p>
                <p>
                  or call us at{' '}
                  <a 
                    href="tel:+15555551234" 
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    (555) 555-1234
                  </a>
                </p>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                We're here to help Monday-Friday, 9 AM - 5 PM EST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Membership Payment Failed - NHBEA',
  description: 'There was an issue processing your NHBEA membership payment. Please try again.',
  robots: 'noindex, nofollow', // Don't index error pages
};