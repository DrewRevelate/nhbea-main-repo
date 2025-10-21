'use client';

import { useState, useEffect } from 'react';

interface RecognitionItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight: string;
}

// UX-Enhanced recognition data with clearer value propositions
const recognitionData: RecognitionItem[] = [
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Teaching Excellence Award",
    description: "For educators who consistently deliver outstanding instruction, inspire student success, and demonstrate innovative teaching methods.",
    highlight: "Most Popular"
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Lifetime Achievement Award",
    description: "Honoring educators with sustained excellence throughout their career, mentoring others, and lasting impact on business education.",
    highlight: "Prestigious Honor"
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Simple Nomination Process",
    description: "Our streamlined 3-step process makes it easy to nominate deserving colleagues in just 10 minutes.",
    highlight: "Easy & Fast"
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Community Recognition",
    description: "Winners receive statewide recognition, networking opportunities, and become part of our prestigious alumni network.",
    highlight: "Valued Network"
  }
];

function RecognitionCard({ item, index }: { item: RecognitionItem; index: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 200 + 500);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div 
      className={`transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}
    >
      <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-full">
        <div className="flex flex-col h-full">
          {/* Icon and Highlight */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br from-gray-600 to-gray-700">
              {item.icon}
            </div>
            <div className="text-right">
              <div className="inline-flex items-center px-3 py-1 bg-gray-200 rounded-full border border-gray-300">
                <div className="w-2 h-2 bg-gray-600 rounded-full mr-2 animate-pulse"></div>
                <span className="font-semibold text-sm text-gray-700">{item.highlight}</span>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-4" style={{ color: `var(--nhbea-gray-800)` }}>{item.title}</h3>
            <p className="leading-relaxed" style={{ color: `var(--nhbea-gray-600)` }}>{item.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecognitionShowcaseSection() {
  return (
    <section id="why-nominate" className="py-16 lg:py-24 relative overflow-hidden bg-white">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-gradient-to-br from-gray-200/40 to-transparent rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-gradient-to-br from-gray-300/30 to-transparent rounded-full animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* User-centered headline */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gray-200 rounded-full mb-6">
            <div className="w-2 h-2 bg-gray-600 rounded-full mr-2 animate-pulse"></div>
            <span className="text-gray-700 font-semibold text-sm tracking-wide uppercase">Why Nominate</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-gray-800">
            Your Nomination Makes a Difference
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-[var(--color-text-secondary)]">
            Recognize the educators who inspire excellence, drive innovation, and shape the future of business education in New Hampshire.
          </p>
          <div className="mt-8 w-24 h-1 bg-gray-300 rounded-full mx-auto"></div>
        </div>

        {/* Value proposition grid - now with clearer benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {recognitionData.map((item, index) => (
            <RecognitionCard 
              key={item.title} 
              item={item} 
              index={index}
            />
          ))}
        </div>

        {/* Social proof section with better UX messaging */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/30 shadow-lg mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--color-text-primary)]">
              <span className="text-gray-800">
                Join a Legacy of Excellence
              </span>
            </h3>
            <p className="max-w-2xl mx-auto text-[var(--color-text-secondary)]">
              Be part of our longstanding tradition of honoring exceptional business educators across New Hampshire.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-800 group-hover:scale-110 transition-transform duration-300">102</div>
              <div className="font-medium text-[var(--color-text-secondary)]">Years of Tradition</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-800 group-hover:scale-110 transition-transform duration-300">2</div>
              <div className="font-medium text-[var(--color-text-secondary)]">Award Categories</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-[var(--nhbea-accent-orange)] group-hover:scale-110 transition-transform duration-300">10</div>
              <div className="font-medium text-[var(--color-text-secondary)]">Minutes to Nominate</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-800 group-hover:scale-110 transition-transform duration-300">∞</div>
              <div className="font-medium text-[var(--color-text-secondary)]">Lasting Impact</div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA with urgency and clarity */}
        <div className="text-center bg-gray-50 rounded-2xl p-8 md:p-12">
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--color-text-primary)]">
              Ready to Nominate an Outstanding Educator?
            </h3>
            <p className="max-w-2xl mx-auto text-[var(--color-text-secondary)] mb-4">
              Your nomination could be the recognition that celebrates years of dedication and inspires continued excellence.
            </p>
            <div className="inline-flex items-center px-3 py-1 bg-[var(--nhbea-accent-orange)]/10 rounded-full text-sm font-medium text-[var(--nhbea-accent-orange)]">
              ⏰ Nominations typically close December 15th
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="/awards/nominate"
              className="group relative px-10 py-4 bg-gradient-to-r from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--nhbea-accent-orange)]/30"
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Start Nomination Now
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--nhbea-accent-orange-dark)] to-[var(--nhbea-accent-orange)] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            
            <a 
              href="#available-awards"
              className="px-8 py-4 bg-white text-gray-700 font-semibold text-lg rounded-xl border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300/30"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                See Award Details First
              </span>
            </a>
          </div>
          
          {/* Trust signal */}
          <div className="mt-6 text-sm text-[var(--color-text-tertiary)]">
            ✨ Join hundreds of colleagues who have recognized excellence in business education
          </div>
        </div>
      </div>
    </section>
  );
}