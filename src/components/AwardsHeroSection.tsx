'use client';

import { useState, useEffect } from 'react';

interface AwardsHeroSectionProps {
  className?: string;
}

function AnimatedFeature({ icon, title, description, delay }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
      }`}
    >
      <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-[var(--color-border-primary)] shadow-sm">
        <div className="w-10 h-10 bg-gradient-to-br from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <div className="font-semibold text-[var(--color-text-primary)] text-sm">{title}</div>
          <div className="text-[var(--color-text-secondary)] text-xs">{description}</div>
        </div>
      </div>
    </div>
  );
}

export default function AwardsHeroSection({ className = '' }: AwardsHeroSectionProps) {
  return (
    <section 
      className={`relative py-20 lg:py-32 overflow-hidden ${className}`}
      role="banner"
      aria-label="NHBEA Awards hero section"
    >
      {/* Sophisticated academic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--nhbea-royal-blue)] via-[var(--nhbea-royal-blue-dark)] to-[var(--nhbea-royal-blue-deeper)]">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
        {/* Elegant academic texture */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(15, 20, 25, 0.15) 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>
      
      {/* Sophisticated academic decorative elements */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none" 
        aria-hidden="true"
        role="presentation"
      >
        {/* Elegant academic ambience */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-br from-white/15 to-white/10 rounded-full blur-3xl"></div>
        
        {/* Refined accent lines */}
        <div className="absolute top-16 left-16 w-32 h-px bg-gradient-to-r from-white/20 to-transparent transform rotate-12"></div>
        <div className="absolute bottom-16 right-16 w-24 h-px bg-gradient-to-r from-white/20 to-transparent transform -rotate-12"></div>
        
        {/* Subtle institutional elements */}
        <div className="absolute top-1/3 left-10 w-2 h-2 bg-white/15 rounded-full"></div>
        <div className="absolute bottom-1/3 right-12 w-1.5 h-1.5 bg-white/15 rounded-full"></div>
      </div>

      {/* Skip to content link for accessibility */}
      <a 
        href="#awards-main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[var(--nhbea-royal-blue)] text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Prestigious Award Badge */}
          <div className="mb-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.1s_forwards]">
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
              <div className="w-3 h-3 bg-gradient-to-r from-[var(--nhbea-academic-gold)] to-[var(--nhbea-academic-gold-dark)] rounded-full mr-3"></div>
              <span className="text-[var(--nhbea-royal-blue)] font-bold text-sm tracking-wide">EXCELLENCE RECOGNITION PROGRAM</span>
              <svg className="w-4 h-4 ml-2 text-[var(--nhbea-academic-gold)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Achievement-focused heading */}
          <div className="mb-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Honoring 
              <span className="block bg-gradient-to-r from-[var(--nhbea-academic-gold)] via-[var(--nhbea-academic-gold-light)] to-[var(--nhbea-academic-gold)] bg-clip-text text-transparent">
                Educational Excellence
              </span>
            </h1>
          </div>
          
          {/* Inspiring subtitle */}
          <div className="mb-12 opacity-0 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-medium">
              Recognizing the distinguished educators who exemplify excellence, innovation, 
              and the highest standards of professional achievement in business education.
            </p>
          </div>

          {/* Enhanced Award Showcase */}
          <div className="mb-12 opacity-0 animate-[fadeInUp_1s_ease-out_0.6s_forwards]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <AnimatedFeature
                delay={800}
                icon={
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v-3m0 0V9m0 3h3m-3 0H9m12-5a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="Two Prestigious Awards"
                description="Recognizing excellence & lifetime achievement"
              />
              <AnimatedFeature
                delay={1000}
                icon={
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                }
                title="Peer-Nominated Recognition"
                description="Honored by fellow educators statewide"
              />
              <AnimatedFeature
                delay={1200}
                icon={
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                }
                title="Century of Excellence"
                description="102 years of celebrating achievement"
              />
            </div>
          </div>

          {/* Prominent Call-to-Action */}
          <div className="mb-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.8s_forwards]">
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
              <a 
                href="#awards-main-content"
                className="group relative px-10 py-4 bg-gradient-to-r from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)] text-white font-semibold text-lg rounded-lg shadow-lg transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-[var(--nhbea-accent-orange)]/30 transform hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd" />
                  </svg>
                  View Awards
                </span>
              </a>
              <a 
                href="/awards/nominate"
                className="group px-10 py-4 bg-white/95 backdrop-blur-sm text-[var(--nhbea-royal-blue)] font-semibold text-lg rounded-lg border border-white/30 hover:bg-white hover:border-white/40 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 transform hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Nominate Someone
                </span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}