'use client';

import Link from 'next/link';
import { Sponsor } from '@/types/sponsors';

interface SponsorsSectionProps {
  sponsors: Sponsor[];
}

interface SponsorCardProps {
  sponsor: Sponsor;
  index: number;
}

function SponsorCard({ sponsor, index }: SponsorCardProps) {
  // Create sponsor initials
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 3);
  };

  const initials = getInitials(sponsor.name);

  return (
    <Link
      href={sponsor.website}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative block opacity-0 animate-[fadeInUp_0.6s_ease-out_${index * 100}ms_forwards]`}
    >
      <div className="relative bg-white rounded-lg shadow-md border-2 border-gray-400 p-6 aspect-square flex items-center justify-center">
        
        {/* Professional sponsor display */}
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-[var(--nhbea-royal-blue)] text-white rounded-lg flex items-center justify-center mb-3 mx-auto shadow-sm">
            <span className="text-lg font-bold">{initials}</span>
          </div>
          <div className="text-sm font-medium text-gray-800 leading-tight">
            {sponsor.name}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SponsorsSection({ sponsors }: SponsorsSectionProps) {
  if (!sponsors || sponsors.length === 0) {
    return (
      <section className="py-20 bg-[var(--nhbea-gray-50)]">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--nhbea-royal-blue-deeper)] mb-6">
              Our Sponsors
            </h2>
            <p className="text-xl text-[var(--nhbea-gray-600)] max-w-3xl mx-auto leading-relaxed mb-12">
              We are grateful to our sponsors who support business education in New Hampshire
            </p>
            <div className="bg-white rounded-lg p-12 shadow-md border border-[var(--nhbea-gray-200)]">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-2xl font-semibold text-[var(--nhbea-royal-blue-dark)] mb-4">
                Become Our First Sponsor
              </h3>
              <p className="text-[var(--nhbea-gray-600)] mb-8 max-w-md mx-auto">
                Join us in supporting business education throughout New Hampshire
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-[var(--nhbea-royal-blue)] text-white font-medium rounded-lg hover:bg-[var(--nhbea-royal-blue-dark)] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Contact Us
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[var(--nhbea-gray-50)]">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--nhbea-royal-blue-deeper)] mb-6">
            Our Sponsors
          </h2>
          <p className="text-xl text-[var(--nhbea-gray-600)] max-w-3xl mx-auto leading-relaxed">
            We are grateful to our sponsors who support business education in New Hampshire
          </p>
        </div>
        
        {/* Sponsors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8 mb-16">
          {sponsors.map((sponsor, index) => (
            <SponsorCard key={sponsor.id} sponsor={sponsor} index={index} />
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center space-y-6 bg-white rounded-lg p-8 lg:p-12 shadow-md border border-[var(--nhbea-gray-200)] transform opacity-0 animate-[fadeInUp_0.6s_ease-out_800ms_forwards] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            {/* Subtle animation background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--nhbea-royal-blue)]/5 via-transparent to-[var(--nhbea-accent-gold)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="text-2xl md:text-3xl font-bold text-[var(--nhbea-royal-blue-deeper)] relative z-10">
              Interested in becoming a sponsor?
            </h3>
            <p className="text-lg text-[var(--nhbea-gray-600)] max-w-md leading-relaxed relative z-10">
              Join our community of supporters and help shape the future of business education.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-[var(--nhbea-accent-gold-dark)] text-white font-semibold rounded-lg hover:bg-[var(--nhbea-accent-gold)] transition-all duration-300 shadow-md hover:shadow-lg relative z-10 hover:scale-105 hover:-translate-y-1"
            >
              Contact Us
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}