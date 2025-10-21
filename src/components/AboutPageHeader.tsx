'use client';

import React from 'react';
import Link from 'next/link';

interface AboutPageHeaderProps {
  title?: string;
  subtitle?: string;
  establishedYear?: number;
  boardCount?: number;
  className?: string;
}

export default function AboutPageHeader({
  title = "We're shaping the future of business education in New Hampshire",
  subtitle = "For 102 years, NHBEA has been the driving force behind innovative business education that prepares students for tomorrow's challenges.",
  establishedYear = 1923,
  boardCount = 15,
  className = ""
}: AboutPageHeaderProps) {
  const currentYear = new Date().getFullYear();
  const yearsServing = currentYear - establishedYear;

  return (
    <section className={`relative overflow-hidden bg-white ${className}`}>
      {/* Subtle background pattern - reduced opacity for better contrast */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-100 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative container mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Modern hero section */}
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Main content - larger on desktop */}
            <div className="lg:col-span-7">
              <div className="space-y-8">
                {/* Small tagline */}
                <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full border border-gray-300 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-800">Since {establishedYear}</span>
                </div>

                {/* Hero headline - modern, human */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {title}
                </h1>

                {/* Supporting copy */}
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl">
                  {subtitle}
                </p>

                {/* Modern CTA section */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link 
                    href="/membership/professional"
                    className="nhbea-button-primary nhbea-button-lg hover:scale-105 transition-transform duration-300"
                    aria-label="Join NHBEA professional membership"
                  >
                    Join Our Community
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <button 
                    onClick={() => document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' })}
                    className="nhbea-button-secondary nhbea-button-lg hover:scale-105 transition-transform duration-300"
                    aria-label="Scroll to our story section"
                  >
                    Learn Our Story
                  </button>
                </div>
              </div>
            </div>

            {/* Stats grid - modern layout */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-6">
                {/* Large feature stat */}
                <div className="col-span-2 nhbea-card p-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-[var(--nhbea-royal-blue)] mb-2">
                      {yearsServing}+
                    </div>
                    <div className="text-gray-800 font-semibold">Years of Excellence</div>
                    <div className="text-sm text-gray-700 mt-2 font-medium">Continuous innovation in business education</div>
                  </div>
                </div>

                {/* Smaller stats */}
                <div className="nhbea-card p-6">
                  <div className="text-3xl font-bold text-[var(--nhbea-accent-orange)] mb-1">250+</div>
                  <div className="text-gray-800 text-sm font-semibold">Active Members</div>
                </div>

                <div className="nhbea-card p-6">
                  <div className="text-3xl font-bold text-[var(--nhbea-accent-orange)] mb-1">50+</div>
                  <div className="text-gray-800 text-sm font-semibold">Partner Schools</div>
                </div>

                <div className="nhbea-card p-6">
                  <div className="text-3xl font-bold text-[var(--nhbea-accent-orange)] mb-1">{boardCount}</div>
                  <div className="text-gray-800 text-sm font-semibold">Board Members</div>
                </div>

                <div className="nhbea-card p-6">
                  <div className="text-3xl font-bold text-[var(--nhbea-accent-orange)] mb-1">NH</div>
                  <div className="text-gray-800 text-sm font-semibold">Statewide Impact</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick navigation - modern pill design */}
          <div className="mt-16 pt-8 border-t border-gray-300">
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: 'Our Story', href: '#our-story' },
                { label: 'Mission & Values', href: '#mission' },
                { label: 'Leadership Team', href: '#board-members' },
                { label: 'Past Presidents', href: '#past-presidents' }
              ].map((item) => (
                <button
                  key={item.href}
                  onClick={() => document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: 'smooth' })}
                  className="nhbea-button-ghost rounded-full hover:bg-[var(--nhbea-royal-blue-subtle)] hover:text-[var(--nhbea-royal-blue)] transition-all duration-200"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}