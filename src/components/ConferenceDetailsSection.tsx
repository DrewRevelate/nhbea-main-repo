'use client';

import { Conference } from '@/types/conference';
import { Container } from '@/components/ResponsiveGrid';
import { getPublicStorageUrl } from '@/lib/firebase';
import Image from 'next/image';

interface ConferenceDetailsSectionProps {
  conference: Conference;
  availability: {
    isAvailable: boolean;
    spotsRemaining: number;
    registrationStatus: 'open' | 'closed' | 'full' | 'not_started';
  };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour24 = parseInt(hours);
  const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
}

export default function ConferenceDetailsSection({ conference, availability }: ConferenceDetailsSectionProps) {
  return (
    <section className="py-16">
      <Container size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-[var(--nhbea-royal-blue-deeper)] mb-6">
            Event Details
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            Everything you need to know about joining us for this transformative experience
          </p>
        </div>

        {/* Hero Image First - Venue Preview */}
        <div className="mb-12">
          <div className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative">
              <Image
                src={conference.media?.imageURL?.includes('token=') 
                  ? conference.media.imageURL 
                  : (conference.media?.imageURL 
                    ? `${conference.media.imageURL}&token=e86c68da-b6b9-4848-a616-39ea86baa639`
                    : 'https://firebasestorage.googleapis.com/v0/b/nhbea-64cab.firebasestorage.app/o/conference_images%2Ftqupg_2025%20NHBEA%20Annual%20Conference.jpg?alt=media&token=e86c68da-b6b9-4848-a616-39ea86baa639')}
                alt={`${conference.title} venue exterior showing ${conference.location.venue} building and entrance`}
                width={1200}
                height={500}
                className="w-full h-96 md:h-[500px] object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                priority
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              {/* Fallback content if image fails */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="text-2xl font-bold mb-2">{conference.location.venue}</h3>
                  <p className="text-lg opacity-90">Your Conference Destination</p>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white z-10">
              <h3 className="text-2xl font-bold mb-2">{conference.location.venue}</h3>
              <p className="text-lg opacity-90">Your Conference Destination</p>
            </div>
          </div>
        </div>

        {/* Essential Information Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Date & Time */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[var(--color-border-primary)] shadow-lg hover:shadow-xl transition-all">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">When</h3>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-[var(--color-text-primary)]">{formatDate(conference.schedule.date)}</p>
                <p className="text-lg text-[var(--color-text-secondary)]">
                  {formatTime(conference.schedule.startTime)} - {formatTime(conference.schedule.endTime)}
                </p>
                <span className="inline-block px-3 py-1 bg-[var(--nhbea-royal-blue)]/10 text-[var(--color-text-primary)] text-sm font-medium rounded-full">
                  Eastern Time
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[var(--color-border-primary)] shadow-lg hover:shadow-xl transition-all">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-[var(--nhbea-royal-blue-light)] to-[var(--nhbea-royal-blue)] rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">Location</h3>
              <div className="space-y-3">
                <p className="text-xl font-semibold text-[var(--color-text-primary)]">{conference.location.venue}</p>
                <div className="text-[var(--color-text-secondary)]">
                  <p className="font-medium">{conference.location.address.street}</p>
                  <p>{conference.location.address.city}, {conference.location.address.state} {conference.location.address.zipCode}</p>
                </div>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${conference.location.address.street}, ${conference.location.address.city}, ${conference.location.address.state} ${conference.location.address.zipCode}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-[var(--nhbea-royal-blue)] text-white rounded-lg hover:bg-[var(--nhbea-royal-blue-dark)] transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Directions
                </a>
                {conference.location.virtualOption && (
                  <div className="mt-2 inline-flex items-center px-3 py-1 bg-[var(--nhbea-royal-blue)]/10 rounded-full">
                    <div className="w-2 h-2 bg-[var(--nhbea-royal-blue)] rounded-full mr-2"></div>
                    <span className="text-sm text-[var(--nhbea-royal-blue)] font-medium">Virtual option available</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Availability & Registration Status */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[var(--color-border-primary)] shadow-lg hover:shadow-xl transition-all">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)] rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">Availability</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-[var(--color-text-primary)]">{availability.spotsRemaining}</span>
                    <span className="text-sm text-[var(--color-text-secondary)]">of {conference.registration.capacity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <div 
                      className="bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(0, ((conference.registration.capacity - availability.spotsRemaining) / conference.registration.capacity) * 100)}%` 
                      }}
                      aria-label={`${availability.spotsRemaining} spots remaining out of ${conference.registration.capacity} total capacity`}
                    ></div>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">Spots Available</p>
                </div>
                {availability.spotsRemaining < 20 && availability.spotsRemaining > 0 && (
                  <div className="px-3 py-2 bg-[var(--nhbea-accent-orange)]/10 text-[var(--nhbea-accent-orange-dark)] rounded-lg">
                    <p className="text-sm font-medium">⚡ Limited availability!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* What to Expect */}
          <div className="bg-gradient-to-br from-[var(--nhbea-royal-blue)]/5 to-[var(--nhbea-royal-blue-light)]/5 rounded-2xl p-8 border border-[var(--nhbea-royal-blue)]/20">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-[var(--nhbea-royal-blue)] rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">What to Expect</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-[var(--nhbea-royal-blue)] mb-1">6</div>
                <div className="text-sm text-gray-600">Hours of Learning</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-[var(--nhbea-royal-blue)] mb-1">150+</div>
                <div className="text-sm text-gray-600">Fellow Educators</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-[var(--nhbea-royal-blue)] mb-1">4+</div>
                <div className="text-sm text-gray-600">Expert Sessions</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                <div className="text-2xl font-bold text-[var(--nhbea-royal-blue)] mb-1">Lunch</div>
                <div className="text-sm text-gray-600">Included</div>
              </div>
            </div>
          </div>

          {/* Conference Benefits */}
          <div className="bg-white rounded-2xl p-8 border-2 border-[var(--color-border-primary)] shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-[var(--nhbea-accent-gold)] rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">You'll Receive</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[var(--nhbea-accent-gold)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Certificate of Professional Development</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[var(--nhbea-accent-gold)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Professional Development Hours Credit</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[var(--nhbea-accent-gold)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Conference Materials & Handouts</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[var(--nhbea-accent-gold)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Networking Directory of Attendees</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[var(--nhbea-accent-gold)] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Complimentary Lunch & Refreshments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Travel & Logistics Information */}
        <div className="bg-white rounded-2xl p-8 border-2 border-[var(--color-border-primary)] shadow-lg">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-[var(--nhbea-accent-gold)] to-[var(--nhbea-accent-gold-dark)] rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">Travel & Logistics</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-[var(--nhbea-accent-gold)]/5 rounded-xl border border-[var(--nhbea-accent-gold)]/20">
              <h4 className="font-bold text-[var(--color-text-primary)] mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[var(--nhbea-accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Parking
              </h4>
              <p className="text-[var(--color-text-secondary)] text-sm mb-2">Free parking available on campus in designated visitor lots.</p>
              <p className="text-[var(--color-text-secondary)] text-xs">Follow signs to main entrance and visitor parking areas.</p>
            </div>
            
            <div className="p-6 bg-[var(--nhbea-royal-blue)]/5 rounded-xl border border-[var(--nhbea-royal-blue)]/20">
              <h4 className="font-bold text-[var(--color-text-primary)] mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[var(--nhbea-royal-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Campus Entry
              </h4>
              <p className="text-[var(--color-text-secondary)] text-sm">Enter through the main entrance and follow signs to conference registration.</p>
            </div>
            
            <div className="p-6 bg-[var(--nhbea-accent-orange)]/5 rounded-xl border border-[var(--nhbea-accent-orange)]/20">
              <h4 className="font-bold text-[var(--color-text-primary)] mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[var(--nhbea-accent-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Local Amenities
              </h4>
              <p className="text-[var(--color-text-secondary)] text-sm">Manchester offers dining and lodging options within a short drive of campus.</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}