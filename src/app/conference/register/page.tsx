import { getCachedCurrentConference } from '@/lib/conference';
import ConferenceRegistrationFormWrapper from '@/components/ConferenceRegistrationFormWrapper';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// Using inline SVG icons to match existing codebase pattern

export default async function ConferenceRegisterPage() {
  const conference = await getCachedCurrentConference();
  
  if (!conference) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Conference Registration
            </h1>
            <p className="text-gray-600 mb-8">
              No active conference found. Please check back later for updates.
            </p>
            <Link href="/conference">
              <Button variant="outline">Back to Conference</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if registration is closed
  const now = new Date();
  const isRegistrationClosed = !conference.registration.isOpen || 
    now > conference.registration.closeDate || 
    now < conference.registration.openDate;

  if (isRegistrationClosed) {
    let message = 'Registration is currently closed.';
    
    if (now < conference.registration.openDate) {
      message = `Registration opens on ${conference.registration.openDate.toLocaleDateString()}.`;
    } else if (now > conference.registration.closeDate) {
      message = `Registration closed on ${conference.registration.closeDate.toLocaleDateString()}.`;
    }

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Conference Registration
            </h1>
            <p className="text-gray-600 mb-8">{message}</p>
            <Link href="/conference">
              <Button variant="outline">Back to Conference</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/conference" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Conference Details
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Register for {conference.title}
          </h1>
          <p className="text-gray-600">
            Complete the form below to register for the conference. 
            You will be redirected to secure payment processing after submitting your information.
          </p>
        </div>

        {/* Conference Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Conference Summary</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Date:</strong> {conference.schedule.date.toLocaleDateString()}</p>
              <p><strong>Time:</strong> {conference.schedule.startTime} - {conference.schedule.endTime}</p>
            </div>
            <div>
              <p><strong>Location:</strong> {conference.location.venue}</p>
              <p><strong>Address:</strong> {conference.location.address.city}, {conference.location.address.state}</p>
            </div>
          </div>
          
          {/* Pricing Summary */}
          <div className="mt-4 pt-4 border-t border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Registration Fees</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">Members</p>
                <p className="text-blue-700">${conference.registration.fees.member}</p>
              </div>
              <div>
                <p className="font-medium">Non-Members</p>
                <p className="text-blue-700">${conference.registration.fees.nonMember}</p>
              </div>
              <div>
                <p className="font-medium">Students</p>
                <p className="text-blue-700">${conference.registration.fees.student}</p>
              </div>
              {conference.registration.fees.earlyBird && now <= conference.registration.fees.earlyBird.deadline && (
                <div>
                  <p className="font-medium text-green-700">Early Bird</p>
                  <p className="text-green-700">${conference.registration.fees.earlyBird.amount}</p>
                  <p className="text-xs text-green-600">
                    Until {conference.registration.fees.earlyBird.deadline.toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Registration Information
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              All fields marked with an asterisk (*) are required.
            </p>
          </div>
          
          <div className="p-6">
            <ConferenceRegistrationFormWrapper 
              conference={{
                id: conference.id,
                title: conference.title,
                registration: {
                  fees: {
                    member: conference.registration.fees.member,
                    nonMember: conference.registration.fees.nonMember,
                    student: conference.registration.fees.student,
                    earlyBird: conference.registration.fees.earlyBird ? {
                      amount: conference.registration.fees.earlyBird.amount,
                      deadline: conference.registration.fees.earlyBird.deadline.toISOString()
                    } : undefined
                  }
                }
              } as any}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Need help? Contact us at{' '}
            <a 
              href="mailto:support@nhbea.org" 
              className="text-blue-600 hover:text-blue-800"
            >
              support@nhbea.org
            </a>
          </p>
          <p className="mt-2">
            Registration data is processed securely. Payment processing is handled by Square.
          </p>
        </div>
      </div>
    </div>
  );
}