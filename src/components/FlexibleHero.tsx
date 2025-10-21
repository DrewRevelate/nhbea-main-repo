'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HomepageContent } from '@/types/content';

// Base hero props
interface BaseHeroProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

// Home hero props
interface HomeHeroProps extends BaseHeroProps {
  variant: 'home';
  content: HomepageContent;
}

// About hero props  
interface AboutHeroProps extends BaseHeroProps {
  variant: 'about';
  boardCount?: number;
  establishedYear?: number;
}

// Conference hero props
interface ConferenceHeroProps extends BaseHeroProps {
  variant: 'conference';
  conference?: {
    title: string;
    date: string;
    location: string;
    registrationOpen: boolean;
    earlyBirdDeadline?: string;
    theme?: {
      primaryColor: string;
      secondaryColor: string;
      backgroundImage?: string;
    };
  };
}

// Membership hero props
interface MembershipHeroProps extends BaseHeroProps {
  variant: 'membership';
  membershipType: 'professional' | 'student';
  pricing: {
    amount: number;
    currency: string;
    period: string;
  };
  benefits: string[];
}

// Hall of Fame hero props
interface HallOfFameHeroProps extends BaseHeroProps {
  variant: 'hall-of-fame';
  stats: {
    totalMembers: number;
    latestYear: number;
    establishedYear?: number;
  };
}

// Awards hero props
interface AwardsHeroProps extends BaseHeroProps {
  variant: 'awards';
  nominationDeadline?: string;
  activeAwards?: number;
}

// Union type for all hero variants
export type FlexibleHeroProps = 
  | HomeHeroProps 
  | AboutHeroProps 
  | ConferenceHeroProps 
  | MembershipHeroProps 
  | HallOfFameHeroProps 
  | AwardsHeroProps;

export function FlexibleHero(props: FlexibleHeroProps) {
  const baseClasses = "relative overflow-hidden";
  const containerClasses = `${baseClasses} ${props.className || ''}`;

  switch (props.variant) {
    case 'home':
      return <HomeHeroVariant {...props} className={containerClasses} />;
    case 'about':
      return <AboutHeroVariant {...props} className={containerClasses} />;
    case 'conference':
      return <ConferenceHeroVariant {...props} className={containerClasses} />;
    case 'membership':
      return <MembershipHeroVariant {...props} className={containerClasses} />;
    case 'hall-of-fame':
      return <HallOfFameHeroVariant {...props} className={containerClasses} />;
    case 'awards':
      return <AwardsHeroVariant {...props} className={containerClasses} />;
    default:
      return null;
  }
}

// Home Hero Variant
function HomeHeroVariant({ content, title, subtitle, className }: HomeHeroProps & { className: string }) {
  const heroImage = content?.heroImageURL?.trim();
  return (
    <section 
      className={`${className} min-h-screen flex items-center justify-center bg-[var(--nhbea-royal-blue-dark)]`}
      role="banner"
      aria-label="Hero section"
    >
      {/* Clean brand background */}
      <div className="absolute inset-0 bg-[var(--nhbea-royal-blue-dark)]"></div>

      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main heading - Clear hierarchy */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal mb-4 text-white leading-tight">
              <span className="block tracking-tight">New Hampshire</span>
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/95 font-light tracking-wide mt-2">Business Educators Association</span>
            </h1>
          </div>
          
          {/* Subtitle - Supporting content */}
          <div className="mb-12 animate-slide-up animation-delay-200">
            <p className="text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto text-white/95 leading-relaxed font-light">
              {content?.heroSubtitle || "Promoting excellence in business education throughout New Hampshire through professional development, networking, and career advancement opportunities."}
            </p>
          </div>

          {/* Value propositions */}
          <div className="mb-16 animate-slide-up animation-delay-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              <div className="flex flex-col items-center text-center p-8 bg-white/15 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
                <div className="w-16 h-16 bg-white/25 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-light text-white mb-4">Professional Development</h3>
                <p className="text-white/90 leading-relaxed text-sm font-light">Continuous learning opportunities and certification programs to advance your career</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-8 bg-white/15 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
                <div className="w-16 h-16 bg-white/25 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light text-white mb-4">Networking</h3>
                <p className="text-white/90 leading-relaxed text-sm font-light">Connect with fellow educators and industry professionals across New Hampshire</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-8 bg-white/15 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
                <div className="w-16 h-16 bg-white/25 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light text-white mb-4">Career Growth</h3>
                <p className="text-white/90 leading-relaxed text-sm font-light">Recognition programs and advancement opportunities in business education</p>
              </div>
            </div>
          </div>

          {/* Clear CTA Hierarchy - Primary Action Focus */}
          <div className="mb-16 animate-slide-up animation-delay-400">
            <div className="text-center max-w-md mx-auto">
              {/* Primary CTA - Much larger and more prominent */}
              <Link 
                href="/membership/professional"
                className="inline-block w-full mb-6 px-12 py-6 bg-gradient-to-r from-[var(--nhbea-accent-gold)] to-[var(--nhbea-accent-gold-dark)] text-white font-normal text-xl rounded-2xl shadow-2xl text-center relative overflow-hidden"
              >
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.1 1 1 0 01-.95-.8zM6.331 10.8a6.968 6.968 0 011.239-.1c1.845 0 3.58.532 5.043 1.451A8.967 8.967 0 0110 18a8.967 8.967 0 01-2.613-5.849L6.331 10.8z"/>
                  </svg>
                  <span className="text-xl font-normal">Join NHBEA Today</span>
                </span>
                <div className="mt-2 text-sm font-light opacity-90">
                  Professional Membership • $50/year
                </div>
              </Link>

              {/* Secondary Actions - Much smaller and clearly secondary */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href="/conference"
                  className="group px-6 py-3 text-white/90 font-light text-sm rounded-lg border border-white/30 hover:bg-white/10 hover:text-white transition-all duration-300 text-center backdrop-blur-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>View Conference</span>
                </Link>
                
                <Link 
                  href="/awards"
                  className="group px-6 py-3 text-white/90 font-light text-sm rounded-lg border border-white/30 hover:bg-white/10 hover:text-white transition-all duration-300 text-center backdrop-blur-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span>Nominate Educator</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Hero image */}
          {heroImage && (
            <div className="animate-fade-in">
              <div className="relative max-w-4xl mx-auto">
                <div className="relative overflow-hidden rounded-lg border border-border">
                  <Image
                    src={heroImage}
                    alt="NHBEA Professional Educators"
                    width={1200}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKABQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGBkaEDFBRB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgT/xAAbEQACAwEBAQAAAAAAAAAAAAABAgADERIhMf/aAAwDAQACEQMRAD8Auz4//9k="
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// About Hero Variant
function AboutHeroVariant({ title, subtitle, boardCount = 12, establishedYear = 1960, className }: AboutHeroProps & { className: string }) {
  return (
    <section 
      className={`${className} py-16 lg:py-24 bg-[var(--nhbea-royal-blue-dark)]`}
      role="banner"
      aria-label="About us hero section"
    >
      {/* Solid background with subtle overlay for better contrast */}
      <div className="absolute inset-0 bg-[var(--nhbea-royal-blue-dark)]">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 leading-tight text-white drop-shadow-lg">
            {title || "About NHBEA"}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-12 text-white leading-relaxed max-w-3xl mx-auto drop-shadow-md">
            {subtitle || "Dedicated to advancing business education excellence in New Hampshire since " + establishedYear}
          </p>
          
          {/* Stats section with improved design */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-2xl md:text-3xl font-normal text-[var(--nhbea-accent-orange)] mb-1">{boardCount}</div>
              <div className="text-white/80 text-sm">Board Members</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-2xl md:text-3xl font-normal text-[var(--nhbea-accent-orange)] mb-1">{new Date().getFullYear() - establishedYear}+</div>
              <div className="text-white/80 text-sm">Years Serving</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-2xl md:text-3xl font-normal text-[var(--nhbea-accent-orange)] mb-1">250+</div>
              <div className="text-white/80 text-sm">Active Members</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-2xl md:text-3xl font-normal text-[var(--nhbea-accent-orange)] mb-1">50+</div>
              <div className="text-white/80 text-sm">Schools</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Conference Hero Variant
function ConferenceHeroVariant({ title, subtitle, conference, className }: ConferenceHeroProps & { className: string }) {
  return (
    <section 
      className={`${className} min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)]`}
      role="banner"
      aria-label="Conference hero section"
    >
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-black/5"></div>
      
      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Section indicator */}
          <div className="inline-flex items-center space-x-3 text-white/90 mb-8 animate-[fadeInUp_1s_ease-out_0.1s_forwards] opacity-0">
            <div className="w-8 h-px bg-white/80"></div>
            <span className="text-sm font-light tracking-wider uppercase">Annual Conference</span>
            <div className="w-8 h-px bg-white/80"></div>
          </div>
          
          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal mb-6 text-white leading-tight animate-[fadeInUp_1s_ease-out_0.2s_forwards] opacity-0">
            {conference?.title || title || "NHBEA Annual Conference"}
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl font-light mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed animate-[fadeInUp_1s_ease-out_0.3s_forwards] opacity-0">
            {subtitle || "Join New Hampshire's premier gathering of business educators for professional development, networking, and innovation"}
          </p>
          
          {conference && (
            <div className="mb-12 animate-[fadeInUp_1s_ease-out_0.4s_forwards] opacity-0">
              {/* Conference details in clean cards */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white font-light">{conference.date}</span>
                </div>
                
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white font-light">{conference.location}</span>
                </div>
              </div>
              
              {conference.earlyBirdDeadline && (
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20 mb-8">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-sm font-light">
                    Early Bird Pricing Available Until {conference.earlyBirdDeadline}
                  </span>
                </div>
              )}
            </div>
          )}
          
          {/* CTA Buttons */}
          {conference?.registrationOpen && (
            <div className="animate-[fadeInUp_1s_ease-out_0.5s_forwards] opacity-0">
              <Link 
                href="/conference/register"
                className="inline-block px-10 py-4 bg-white text-[var(--nhbea-royal-blue)] font-normal text-lg rounded-xl shadow-xl"
              >
                Register Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Membership Hero Variant
function MembershipHeroVariant({ title, subtitle, membershipType, pricing, benefits, className }: MembershipHeroProps & { className: string }) {
  return (
    <section 
      className={`${className} py-16 bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)]`}
      role="banner"
      aria-label="Membership hero section"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-normal mb-6 leading-tight">
            {title || `${membershipType === 'professional' ? 'Professional' : 'Student'} Membership`}
          </h1>
          <p className="text-xl mb-8 text-white/90">
            {subtitle || "Join our community of dedicated business educators"}
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-5xl font-normal text-[var(--nhbea-accent-orange)] mb-2">
              {pricing.currency}{pricing.amount}
            </div>
            <div className="text-white/80 mb-6">per {pricing.period}</div>
            <div className="space-y-2 text-left">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center text-white/90">
                  <svg className="w-5 h-5 text-[var(--nhbea-accent-orange)] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Hall of Fame Hero Variant
function HallOfFameHeroVariant({ title, subtitle, stats, className }: HallOfFameHeroProps & { className: string }) {
  return (
    <section 
      className={`${className} py-20 bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)]`}
      role="banner"
      aria-label="Hall of Fame hero section"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-normal mb-6 leading-tight">
            {title || "Hall of Fame"}
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 leading-relaxed">
            {subtitle || "Honoring excellence in business education"}
          </p>
          <div className="flex justify-center space-x-12">
            <div className="text-center">
              <div className="text-5xl font-normal text-[var(--nhbea-accent-orange)]">{stats.totalMembers}</div>
              <div className="text-white/80">Honored Members</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-normal text-[var(--nhbea-accent-orange)]">{stats.latestYear}</div>
              <div className="text-white/80">Latest Induction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Awards Hero Variant - UX Enhanced
function AwardsHeroVariant({ title, subtitle, nominationDeadline, activeAwards, className }: AwardsHeroProps & { className: string }) {
  // Calculate urgency messaging
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const nominationEndDate = new Date(currentYear, 11, 15); // Dec 15th typical deadline
  const daysUntilDeadline = Math.ceil((nominationEndDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  const showUrgency = daysUntilDeadline > 0 && daysUntilDeadline <= 30;

  return (
    <section 
      className={`${className} py-16 lg:py-24 bg-white relative overflow-hidden`}
      role="banner"
      aria-label="Awards hero section"
    >
      {/* Subtle background pattern for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gray-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gray-200/30 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Urgent notification bar */}
          {showUrgency && (
            <div className="mb-8 animate-[fadeInUp_1s_ease-out_0.1s_forwards] opacity-0">
              <div className="flex items-center justify-center space-x-3 bg-[var(--nhbea-accent-orange)] text-white px-6 py-3 rounded-full text-center font-light shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm sm:text-base">
                  Only {daysUntilDeadline} days left to nominate! Deadline: December 15th
                </span>
              </div>
            </div>
          )}

          <div className="text-center text-[var(--nhbea-gray-800)] mb-12">
            {/* Compelling headline with emotional appeal */}
            <div className="mb-8 animate-[fadeInUp_1s_ease-out_0.2s_forwards] opacity-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 leading-tight">
                {title || (
                  <>
                    <span className="block">Celebrate</span>
                    <span className="block bg-gradient-to-r from-[var(--nhbea-accent-gold)] via-[var(--nhbea-accent-gold-light)] to-[var(--nhbea-accent-gold)] bg-clip-text text-transparent">
                      Educational Excellence
                    </span>
                  </>
                )}
              </h1>
            </div>
            
            {/* Social proof oriented subtitle */}
            <div className="mb-12 animate-[fadeInUp_1s_ease-out_0.3s_forwards] opacity-0">
              <p className="text-xl md:text-2xl mb-6 text-[var(--nhbea-gray-700)] leading-relaxed max-w-4xl mx-auto">
                {subtitle || "Join 102 years of honoring the educators who shape tomorrow's business leaders. Your nomination could recognize the next inspiring teacher."}
              </p>
            </div>

            {/* Trust indicators and stats */}
            <div className="mb-12 animate-[fadeInUp_1s_ease-out_0.4s_forwards] opacity-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                <div className="text-center p-4 bg-white border border-gray-200 shadow-lg">
                  <div className="text-2xl md:text-3xl font-normal text-[var(--nhbea-accent-orange)] mb-1">102</div>
                  <div className="text-[var(--nhbea-gray-600)] text-sm font-light">Years of Recognition</div>
                </div>
                <div className="text-center p-4 bg-white border border-gray-200 shadow-lg">
                  <div className="text-2xl md:text-3xl font-normal text-[var(--nhbea-accent-orange)] mb-1">{activeAwards || 2}</div>
                  <div className="text-[var(--nhbea-gray-600)] text-sm font-light">Award Categories</div>
                </div>
                <div className="text-center p-4 bg-white border border-gray-200 shadow-lg">
                  <div className="text-2xl md:text-3xl font-normal text-[var(--nhbea-accent-orange)] mb-1">250+</div>
                  <div className="text-[var(--nhbea-gray-600)] text-sm font-light">Past Winners</div>
                </div>
                <div className="text-center p-4 bg-white border border-gray-200 shadow-lg">
                  <div className="text-2xl md:text-3xl font-normal text-[var(--nhbea-accent-orange)] mb-1">NH</div>
                  <div className="text-[var(--nhbea-gray-600)] text-sm font-light">Statewide Impact</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dual CTA approach - Primary and Secondary actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto animate-[fadeInUp_1s_ease-out_0.5s_forwards] opacity-0">
            <Link 
              href="/awards/nominate"
              className="px-8 py-4 bg-gradient-to-r from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)] text-white font-normal text-lg rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-[var(--nhbea-accent-orange)]/30"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Nominate Someone
              </span>
            </Link>
            
            <Link 
              href="#available-awards"
              className="px-8 py-4 bg-white border-2 border-[var(--nhbea-royal-blue)] text-[var(--nhbea-royal-blue)] font-light text-lg rounded-xl focus:outline-none focus:ring-4 focus:ring-[var(--nhbea-royal-blue)]/30 text-center shadow-sm"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Learn About Awards
              </span>
            </Link>
          </div>

          {/* Quick help text */}
          <div className="text-center mt-8 animate-[fadeInUp_1s_ease-out_0.6s_forwards] opacity-0">
            <p className="text-[var(--nhbea-gray-600)] text-sm">
              Not sure who to nominate? <Link href="#nomination-guide" className="underline text-[var(--nhbea-royal-blue)] hover:text-[var(--nhbea-royal-blue-dark)] transition-colors font-light">See our nomination guide</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FlexibleHero;