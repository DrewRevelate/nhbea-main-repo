'use client';

import React from 'react';
import Link from 'next/link';

interface HallOfFameHeroSectionProps {
  totalMembers?: number;
  latestInductionYear?: number;
}

export default function HallOfFameHeroSection({ 
  totalMembers = 0, 
  latestInductionYear = new Date().getFullYear() 
}: HallOfFameHeroSectionProps) {
  return (
    <section 
      className="py-16 lg:py-24 bg-[var(--nhbea-royal-blue-dark)] relative overflow-hidden"
      role="banner"
      aria-label="Hall of Fame hero section"
    >
      {/* Clean solid background with subtle overlay for better contrast */}
      <div className="absolute inset-0 bg-[var(--nhbea-royal-blue-dark)]">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Main heading with consistent typography */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight animate-[fadeInUp_1s_ease-out_0.1s_forwards] opacity-0">
              Hall of{' '}
              <span className="text-[var(--nhbea-accent-gold)]">
                Fame
              </span>
            </h1>
            
            {/* Subtitle with proper hierarchy */}
            <p className="text-xl md:text-2xl font-medium mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed animate-[fadeInUp_1s_ease-out_0.3s_forwards] opacity-0">
              Celebrating the extraordinary educators who have shaped business education 
              in New Hampshire. These distinguished professionals represent the pinnacle 
              of excellence, innovation, and dedication to student success.
            </p>
          </div>

          {/* Stats section with improved design - matches About page pattern */}
          <div className="mb-12 animate-[fadeInUp_1s_ease-out_0.4s_forwards] opacity-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-[var(--nhbea-accent-orange)] mb-2">{totalMembers}</div>
                <div className="text-white/80 text-sm font-medium">Distinguished Honorees</div>
              </div>
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-[var(--nhbea-accent-orange)] mb-2">{latestInductionYear}</div>
                <div className="text-white/80 text-sm font-medium">Latest Induction</div>
              </div>
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-[var(--nhbea-accent-orange)] mb-2">102+</div>
                <div className="text-white/80 text-sm font-medium">Years of Excellence</div>
              </div>
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-[var(--nhbea-accent-orange)] mb-2">NH</div>
                <div className="text-white/80 text-sm font-medium">Statewide Impact</div>
              </div>
            </div>
          </div>
          
          {/* CTA Buttons - consistent with other hero sections */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto animate-[fadeInUp_1s_ease-out_0.5s_forwards] opacity-0">
            <Link 
              href="/awards"
              className="px-8 py-4 bg-[var(--nhbea-accent-gold-dark)] text-white font-bold text-lg rounded-xl hover:bg-[var(--nhbea-accent-gold)] transition-all duration-300 shadow-xl hover:shadow-2xl text-center transform hover:scale-105 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Nominate a Colleague
            </Link>
            
            <Link 
              href="/about"
              className="px-8 py-4 bg-white/10 text-white font-semibold text-lg rounded-xl border-2 border-white/40 hover:bg-white/20 hover:text-white transition-all duration-300 text-center backdrop-blur-sm hover:scale-105 flex items-center justify-center"
            >
              Learn About NHBEA
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}