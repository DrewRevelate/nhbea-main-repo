'use client';

import { Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ResponsiveGrid, Container } from '@/components/ResponsiveGrid';

interface RegistrantData {
  id: string;
  participant: {
    fullName: string | { first_name: string; last_name: string };
    email: string;
    institution: string;
    phone?: string;
  };
  conferenceTitle: string;
  conferenceYear: number;
  registration: {
    totalAmount: number;
    paymentStatus: string;
    registrationType: string;
    registrationDate: any;
  };
  payment?: {
    receiptUrl?: string;
    completedAt?: any;
    squarePaymentId?: string;
  };
  status: string;
  registrationStatus: string;
  paymentStatus: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const registrantId = searchParams.get('registrantId');
  const [loading, setLoading] = useState(true);
  const [registrant, setRegistrant] = useState<RegistrantData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRegistrantData() {
      try {
        if (!registrantId) {
          setError('No registration ID provided');
          setLoading(false);
          return;
        }

        // Fetch registrant data from Firestore
        const { getRegistrantById } = await import('@/lib/conference');
        const registrantData = await getRegistrantById(registrantId);

        if (!registrantData) {
          setError('Registration not found');
          setLoading(false);
          return;
        }

        setRegistrant(registrantData as RegistrantData);
      } catch (err) {
        console.error('Error loading registration:', err);
        setError('Failed to load registration details');
      } finally {
        setLoading(false);
      }
    }

    loadRegistrantData();
  }, [registrantId]);

  if (loading) {
    return <LoadingSpinner variant="page" message="Loading your registration details..." />;
  }

  if (error || !registrant) {
    return (
      <Container size="md" className="py-16 text-center">
        <h1 className="text-3xl font-medium text-[var(--color-text-primary)] mb-4">
          Registration Status
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] mb-8">
          {error || 'Unable to load registration details. Please check your email for confirmation.'}
        </p>
        <Link href="/conference">
          <Button className="bg-[var(--nhbea-royal-blue)] hover:bg-[var(--nhbea-royal-blue-dark)] text-white">
            Back to Conference
          </Button>
        </Link>
      </Container>
    );
  }

  const isPaid = registrant.paymentStatus === 'paid' || registrant.registration?.paymentStatus === 'paid';
  
  // Handle fullName as either string or object
  const fullName = typeof registrant.participant.fullName === 'string' 
    ? registrant.participant.fullName 
    : `${registrant.participant.fullName.first_name} ${registrant.participant.fullName.last_name}`;

  return (
    <Container size="md" className="py-16">
      <div className="bg-white rounded-2xl shadow-xl border-2 border-[var(--color-border-primary)] p-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-medium text-[var(--color-text-primary)] mb-2">
            Registration {isPaid ? 'Complete' : 'Submitted'}!
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            {isPaid 
              ? 'Your payment has been processed successfully.'
              : 'Your registration has been received. Please complete payment to confirm your spot.'}
          </p>
        </div>

        {/* Confirmation Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-medium text-[var(--color-text-primary)] mb-4">
            Confirmation Details
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Confirmation Code</p>
              <p className="text-lg font-medium text-[var(--nhbea-royal-blue)] font-mono">
                {registrantId}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Conference</p>
              <p className="text-lg text-[var(--color-text-primary)]">
                {registrant.conferenceTitle}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Registrant</p>
              <p className="text-lg text-[var(--color-text-primary)]">
                {fullName}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Email</p>
              <p className="text-lg text-[var(--color-text-primary)]">
                {registrant.participant.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Institution</p>
              <p className="text-lg text-[var(--color-text-primary)]">
                {registrant.participant.institution}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Registration Type</p>
              <p className="text-lg text-[var(--color-text-primary)]">
                {registrant.registration.registrationType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Amount</p>
              <p className="text-lg font-medium text-[var(--color-text-primary)]">
                ${registrant.registration.totalAmount}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Payment Status</p>
              <p className={`text-lg font-medium ${isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                {isPaid ? 'Paid' : 'Pending Payment'}
              </p>
            </div>
          </div>
        </div>

        {/* Receipt Link */}
        {isPaid && registrant.payment?.receiptUrl && (
          <div className="mb-8 text-center">
            <a 
              href={registrant.payment.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-[var(--nhbea-royal-blue)] hover:bg-[var(--nhbea-royal-blue-dark)] text-white rounded-xl transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Receipt
            </a>
          </div>
        )}

        {/* Next Steps */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-4">
            Next Steps
          </h3>
          <ul className="space-y-2 text-[var(--color-text-secondary)]">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>A confirmation email has been sent to {registrant.participant.email}</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Save your confirmation code <strong>{registrantId}</strong> for check-in at the conference</span>
            </li>
            {isPaid && (
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Your payment has been confirmed and receipt is available above</span>
              </li>
            )}
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>You'll receive reminder emails as the conference date approaches</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Confirmation
          </Button>
          <Link href="/conference">
            <Button className="bg-[var(--nhbea-royal-blue)] hover:bg-[var(--nhbea-royal-blue-dark)] text-white">
              Back to Conference
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Return Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Support Info */}
      <div className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
        <p>
          Questions? Contact us at{' '}
          <a 
            href="mailto:support@nhbea.org" 
            className="text-[var(--nhbea-royal-blue)] hover:underline"
          >
            support@nhbea.org
          </a>
        </p>
      </div>
    </Container>
  );
}

export default function ConferenceSuccessPage() {
  return (
    <StandardPageLayout
      hero={{
        component: 'none' as any,
        props: {}
      }}
      meta={{
        title: 'Registration Successful - NHBEA Conference',
        description: 'Your conference registration has been successfully processed.'
      }}
      error={{ boundary: true }}
      loading={{ enabled: true }}
    >
      <ResponsiveGrid 
        gap="lg" 
        breakpoints={{ mobile: 1, tablet: 1, desktop: 1, wide: 1 }}
        className="space-y-16"
      >
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSpinner variant="page" message="Loading registration details..." />}>
            <SuccessContent />
          </Suspense>
        </StandardErrorBoundary>
      </ResponsiveGrid>
    </StandardPageLayout>
  );
}