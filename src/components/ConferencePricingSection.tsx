'use client';

import { Conference } from '@/types/conference';
import { Container } from '@/components/ResponsiveGrid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ConferencePricingSectionProps {
  registration: Conference['registration'];
  availability: {
    isAvailable: boolean;
    spotsRemaining: number;
    registrationStatus: 'open' | 'closed' | 'full' | 'not_started';
  };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function getEarlyBirdPrice(registration: Conference['registration']): number | null {
  const now = new Date();
  const earlyBird = registration.fees.earlyBird;
  
  if (earlyBird && now <= earlyBird.deadline) {
    return earlyBird.amount;
  }
  
  return null;
}

export default function ConferencePricingSection({ registration, availability }: ConferencePricingSectionProps) {
  const earlyBirdPrice = getEarlyBirdPrice(registration);
  const isEarlyBird = earlyBirdPrice !== null;

  return (
    <section className="py-16">
      <Container size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-[var(--nhbea-royal-blue-deeper)] mb-6">
            Registration & Pricing
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Choose the registration option that works best for you
          </p>
        </div>

        {/* Early Bird Alert */}
        {isEarlyBird && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-700 font-medium text-lg">Early Bird Special!</span>
              </div>
              <p className="text-green-700">
                Save ${registration.fees.member - earlyBirdPrice} when you register before {formatDate(registration.fees.earlyBird!.deadline)}
              </p>
            </div>
          </div>
        )}

        {/* Pricing Options */}
        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-3">
          {/* Member Pricing */}
          <div className="bg-white rounded-2xl p-8 border-2 border-[var(--color-border-primary)] shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-medium text-[var(--color-text-primary)] mb-4">NHBEA Members</h3>
            <div className="mb-6">
              {isEarlyBird ? (
                <>
                  <p className="text-3xl font-medium text-[var(--nhbea-royal-blue)] mb-2">
                    ${earlyBirdPrice}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)] line-through">
                    Regular: ${registration.fees.member}
                  </p>
                </>
              ) : (
                <p className="text-3xl font-medium text-[var(--nhbea-royal-blue)]">
                  ${registration.fees.member}
                </p>
              )}
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Full conference access</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Networking opportunities</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Certificate of attendance</span>
              </li>
            </ul>
            {availability.isAvailable && (
              <Link href="/conference/register">
                <Button className="w-full bg-[var(--nhbea-royal-blue)] hover:bg-[var(--nhbea-royal-blue-dark)] text-white">
                  Register as Member
                </Button>
              </Link>
            )}
          </div>

          {/* Non-Member Pricing */}
          <div className="bg-white rounded-2xl p-8 border-2 border-[var(--color-border-primary)] shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-medium text-[var(--color-text-primary)] mb-4">Non-Members</h3>
            <div className="mb-6">
              <p className="text-3xl font-medium text-[var(--nhbea-royal-blue)]">
                ${registration.fees.nonMember}
              </p>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Full conference access</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Networking opportunities</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Certificate of attendance</span>
              </li>
            </ul>
            {availability.isAvailable && (
              <Link href="/conference/register">
                <Button className="w-full bg-[var(--nhbea-royal-blue)] hover:bg-[var(--nhbea-royal-blue-dark)] text-white">
                  Register as Guest
                </Button>
              </Link>
            )}
          </div>

          {/* Student Pricing */}
          <div className="bg-white rounded-2xl p-8 border-2 border-[var(--color-border-primary)] shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-medium text-[var(--color-text-primary)] mb-4">Students</h3>
            <div className="mb-6">
              <p className="text-3xl font-medium text-[var(--nhbea-royal-blue)]">
                ${registration.fees.student}
              </p>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Full conference access</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Student networking</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Valid student ID required</span>
              </li>
            </ul>
            {availability.isAvailable && (
              <Link href="/conference/register">
                <Button className="w-full bg-[var(--nhbea-royal-blue)] hover:bg-[var(--nhbea-royal-blue-dark)] text-white">
                  Register as Student
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Registration Period Info */}
        <div className="mt-12 text-center">
          <p className="text-[var(--color-text-secondary)]">
            Registration open from {formatDate(registration.openDate)} to {formatDate(registration.closeDate)}
          </p>
        </div>
      </Container>
    </section>
  );
}