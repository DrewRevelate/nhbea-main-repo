import { Suspense, lazy } from 'react';
import { StandardPageLayout } from '@/components/StandardPageLayout';
import { FlexibleHero } from '@/components/FlexibleHero';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';
import { LoadingSpinner, LoadingSkeleton } from '@/components/LoadingSpinner';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCurrentConference, checkRegistrationAvailability } from '@/lib/conference';
import { Conference } from '@/types/conference';
import { Metadata } from 'next';

// Lazy load non-critical sections for better performance
const ConferenceDetailsSection = lazy(() => import('@/components/ConferenceDetailsSection'));
const ConferenceAgenda = lazy(() => import('@/components/ConferenceAgenda'));
const SpeakersSection = lazy(() => import('@/components/SpeakersSection'));
const ConferencePricingSection = lazy(() => import('@/components/ConferencePricingSection'));

// Generate dynamic metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const conference = await getCurrentConference();
  
  if (!conference) {
    return {
      title: 'Conference - NHBEA',
      description: 'Join the New Hampshire Business Education Association annual conference for professional development, networking, and the latest in business education.',
    };
  }

  return {
    title: `${conference.title} | NHBEA Conference`,
    description: conference.description,
    keywords: ['business education', 'conference', 'New Hampshire', 'NHBEA', 'professional development'],
    openGraph: {
      title: conference.title,
      description: conference.description,
      type: 'website',
      locale: 'en_US',
      url: `https://nhbea.org/conference`,
      siteName: 'NHBEA',
    },
    twitter: {
      card: 'summary_large_image',
      title: conference.title,
      description: conference.description,
      site: '@NHBEA_Official',
      creator: '@NHBEA_Official',
    },
  };
}

interface ConferenceWithAvailability extends Conference {
  availability: {
    isAvailable: boolean;
    spotsRemaining: number;
    registrationStatus: 'open' | 'closed' | 'full' | 'not_started';
  };
}

async function getConferenceData(): Promise<ConferenceWithAvailability | null> {
  try {
    const conference = await getCurrentConference();
    if (!conference) return null;
    
    const availability = await checkRegistrationAvailability(conference.id);
    
    // Convert Firebase Timestamps to serializable dates
    const serializedConference = {
      ...conference,
      createdAt: conference.createdAt instanceof Date ? conference.createdAt : new Date(conference.createdAt.seconds * 1000),
      updatedAt: conference.updatedAt instanceof Date ? conference.updatedAt : new Date(conference.updatedAt.seconds * 1000),
      schedule: {
        ...conference.schedule,
        date: conference.schedule.date instanceof Date ? conference.schedule.date : new Date(conference.schedule.date.seconds * 1000)
      },
      registration: {
        ...conference.registration,
        openDate: conference.registration.openDate instanceof Date ? conference.registration.openDate : new Date(conference.registration.openDate.seconds * 1000),
        closeDate: conference.registration.closeDate instanceof Date ? conference.registration.closeDate : new Date(conference.registration.closeDate.seconds * 1000),
        fees: {
          ...conference.registration.fees,
          earlyBird: conference.registration.fees.earlyBird ? {
            ...conference.registration.fees.earlyBird,
            deadline: conference.registration.fees.earlyBird.deadline instanceof Date ? conference.registration.fees.earlyBird.deadline : new Date(conference.registration.fees.earlyBird.deadline.seconds * 1000)
          } : null
        }
      }
    };
    
    return {
      ...serializedConference,
      availability
    };
  } catch (error) {
    console.error('Error fetching conference data:', error);
    return null;
  }
}

async function ConferencePage() {
  const conferenceData = await getConferenceData();
  
  if (!conferenceData) {
    return (
      <StandardPageLayout
        hero={{
          component: FlexibleHero,
          props: {
            variant: 'conference' as const,
            title: 'Conference Information',
            subtitle: 'No active conference found. Please check back later for updates on our upcoming professional development opportunities.',
          }
        }}
        meta={{
          title: 'Conference - NHBEA',
          description: 'Join the New Hampshire Business Education Association annual conference.'
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
            <section className="text-center py-16">
              <Link href="/">
                <Button className="bg-[var(--nhbea-royal-blue)] hover:bg-[var(--nhbea-royal-blue-dark)] text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Return Home
                </Button>
              </Link>
            </section>
          </StandardErrorBoundary>
        </ResponsiveGrid>
      </StandardPageLayout>
    );
  }

  const conference = conferenceData;
  const { availability } = conferenceData;

  return (
    <StandardPageLayout
      hero={{
        component: FlexibleHero,
        props: {
          variant: 'conference' as const,
          title: conference.title,
          subtitle: conference.description,
          conference: {
            title: conference.title,
            date: conference.schedule.date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            location: conference.location.venue,
            registrationOpen: availability.isAvailable,
          }
        }
      }}
      meta={{
        title: `${conference.title} | NHBEA Conference`,
        description: conference.description,
      }}
      error={{ boundary: true }}
      loading={{ enabled: true }}
    >
      <ResponsiveGrid 
        gap="lg" 
        breakpoints={{ mobile: 1, tablet: 1, desktop: 1, wide: 1 }}
        className="space-y-16"
      >
        {/* Conference Details Section */}
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="content" />}>
            <ConferenceDetailsSection 
              conference={conference}
              availability={availability}
            />
          </Suspense>
        </StandardErrorBoundary>

        {/* Pricing Section */}
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="content" />}>
            <ConferencePricingSection 
              registration={conference.registration}
              availability={availability}
            />
          </Suspense>
        </StandardErrorBoundary>

        {/* Speakers Section */}
        {conference.speakers && conference.speakers.length > 0 && (
          <StandardErrorBoundary>
            <Suspense fallback={<LoadingSkeleton variant="content" />}>
              <SpeakersSection 
                speakers={conference.speakers}
                sessions={conference.agenda?.sessions}
              />
            </Suspense>
          </StandardErrorBoundary>
        )}

        {/* Agenda Section */}
        {conference.agenda && conference.agenda.sessions.length > 0 && (
          <StandardErrorBoundary>
            <Suspense fallback={<LoadingSkeleton variant="content" />}>
              <ConferenceAgenda 
                agenda={conference.agenda}
                speakers={conference.speakers}
              />
            </Suspense>
          </StandardErrorBoundary>
        )}

        {/* Registration CTA */}
        <StandardErrorBoundary>
          <section className="text-center py-8">
            {availability.isAvailable ? (
              <div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                  Ready to Join Us?
                </h3>
                <p className="text-lg font-medium text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
                  Secure your spot at New Hampshire's premier business education conference.
                </p>
                <Link href="/conference/register">
                  <Button className="bg-[var(--nhbea-accent-orange)] hover:bg-[var(--nhbea-accent-orange-dark)] text-white px-12 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    Register Now
                  </Button>
                </Link>
                {availability.spotsRemaining < 20 && (
                  <p className="mt-4 text-[var(--nhbea-accent-orange-dark)] font-bold">
                    Only {availability.spotsRemaining} spots remaining!
                  </p>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                  Registration Status
                </h3>
                <p className="text-lg font-medium text-[var(--color-text-secondary)]">
                  {availability.registrationStatus === 'not_started' && 'Registration will open soon. Please check back later.'}
                  {availability.registrationStatus === 'closed' && 'Registration has closed for this conference.'}
                  {availability.registrationStatus === 'full' && 'This conference is at full capacity.'}
                </p>
              </div>
            )}
          </section>
        </StandardErrorBoundary>
      </ResponsiveGrid>

      {/* Floating Registration CTA */}
      {availability.isAvailable && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link href="/conference/register">
            <Button className="bg-[var(--nhbea-accent-orange)] hover:bg-[var(--nhbea-accent-orange-dark)] text-white px-6 py-3 font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Register
              </span>
            </Button>
          </Link>
        </div>
      )}
    </StandardPageLayout>
  );
}

export default function Conference() {
  return (
    <Suspense fallback={<LoadingSpinner variant="page" message="Loading conference..." />}>
      <ConferencePage />
    </Suspense>
  );
}