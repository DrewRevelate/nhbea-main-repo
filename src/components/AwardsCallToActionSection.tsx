'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ActionStep {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// UX-Enhanced nomination steps with clearer value props and reduced friction
const nominationSteps: ActionStep[] = [
  {
    number: "1",
    title: "Pick the Right Award",
    description: "Choose from Teaching Excellence or Lifetime Achievement. Not sure? We have a quick guide to help you decide in 30 seconds.",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    number: "2",
    title: "Fill Out Simple Form",
    description: "Just 5 required fields and optional details. Takes about 10 minutes. You can save and return later if needed.",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    )
  },
  {
    number: "3",
    title: "Submit & Get Updates",
    description: "Hit submit and we'll send you confirmation plus updates on the selection process. Your nominee gets recognized!",
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    )
  }
];

function StepCard({ step, index }: { step: ActionStep; index: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 200 + 300);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div 
      className={`transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}
    >
      <div className="group relative bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        {/* Step Number */}
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <span className="text-white font-bold text-lg">{step.number}</span>
        </div>
        
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 ml-4">
          {step.icon}
        </div>
        
        {/* Content */}
        <div className="ml-4">
          <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
          <p className="text-slate-600 leading-relaxed">{step.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function AwardsCallToActionSection() {
  return (
    <section id="nomination-guide" className="py-16 lg:py-24 relative overflow-hidden bg-gradient-to-br from-[var(--nhbea-royal-blue)]/5 via-white to-[var(--nhbea-academic-gold)]/5">
      {/* Subtle background elements aligned with brand */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 -left-20 w-40 h-40 bg-gradient-to-br from-[var(--nhbea-royal-blue)]/20 to-transparent rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 -right-20 w-40 h-40 bg-gradient-to-br from-[var(--nhbea-academic-gold)]/20 to-transparent rounded-full animate-pulse"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced headline with user-focused messaging */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-[var(--nhbea-royal-blue)]/10 rounded-full mb-6">
            <div className="w-2 h-2 bg-[var(--nhbea-royal-blue)] rounded-full mr-2 animate-pulse"></div>
            <span className="text-[var(--nhbea-royal-blue)] font-semibold text-sm tracking-wide uppercase">Simple Process</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] leading-tight mb-6">
            <span className="bg-gradient-to-r from-[var(--nhbea-royal-blue)] via-[var(--nhbea-royal-blue-dark)] to-[var(--nhbea-royal-blue-deeper)] bg-clip-text text-transparent">
              Nominate in Just 3 Easy Steps
            </span>
          </h2>
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed mb-8">
            Take 10 minutes to recognize an outstanding educator. Your nomination could make their year and inspire continued excellence.
          </p>
          
          {/* Time estimate with trust indicator */}
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[var(--nhbea-royal-blue)]/20">
            <svg className="w-4 h-4 text-[var(--nhbea-royal-blue)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[var(--nhbea-royal-blue)] font-medium text-sm">Average time: 10 minutes</span>
          </div>
          
          <div className="mt-8 w-24 h-1 bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] rounded-full mx-auto"></div>
        </div>

        {/* Enhanced Steps Grid with Better UX */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {nominationSteps.map((step, index) => (
            <StepCard 
              key={step.number} 
              step={step} 
              index={index}
            />
          ))}
        </div>

        {/* Redesigned Information Section with Better Hierarchy */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/40 shadow-lg mb-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center">
                <div className="w-8 h-8 bg-[var(--nhbea-royal-blue)]/10 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-[var(--nhbea-royal-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Quick Requirements Check
              </h3>
              <ul className="space-y-4 text-[var(--color-text-secondary)]">
                <li className="flex items-start group">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                  <span className="group-hover:text-[var(--color-text-primary)] transition-colors duration-200">
                    <strong>Current or former</strong> business educator in New Hampshire
                  </span>
                </li>
                <li className="flex items-start group">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                  <span className="group-hover:text-[var(--color-text-primary)] transition-colors duration-200">
                    <strong>You know</strong> their professional achievements and impact
                  </span>
                </li>
                <li className="flex items-start group">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                  <span className="group-hover:text-[var(--color-text-primary)] transition-colors duration-200">
                    <strong>They deserve</strong> recognition for their excellence
                  </span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center">
                <div className="w-8 h-8 bg-[var(--nhbea-accent-orange)]/10 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-[var(--nhbea-accent-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Need Help? We're Here!
              </h3>
              <div className="space-y-4">
                <p className="text-[var(--color-text-secondary)]">
                  Stuck on which award to choose? Not sure what to write? Our board members love helping with nominations.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href="/about#board-members"
                    className="inline-flex items-center justify-center px-4 py-2 bg-[var(--nhbea-royal-blue)] text-white font-medium rounded-lg hover:bg-[var(--nhbea-royal-blue-dark)] transition-colors duration-200 text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2m2-4h2a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V6a2 2 0 012-2h2z" />
                    </svg>
                    Contact Board
                  </Link>
                  <a 
                    href="#available-awards"
                    className="inline-flex items-center justify-center px-4 py-2 bg-white text-[var(--nhbea-royal-blue)] font-medium rounded-lg border border-[var(--nhbea-royal-blue)]/20 hover:bg-[var(--nhbea-royal-blue)]/5 transition-colors duration-200 text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Award Guide
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Final CTA with Urgency and Social Proof */}
        <div className="text-center bg-gradient-to-r from-[var(--nhbea-royal-blue)]/5 to-[var(--nhbea-royal-blue-dark)]/5 rounded-2xl p-8 md:p-12">
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-4">
              Ready to Make Someone's Day?
            </h3>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-6">
              Your 10-minute nomination could be the recognition that celebrates years of dedication and inspires continued excellence in business education.
            </p>
            
            {/* Social proof indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-[var(--color-text-tertiary)] mb-8">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span>250+ past nominations</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>102 years of recognition</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                <span>Statewide impact</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/awards/nominate"
              className="group relative px-10 py-4 bg-gradient-to-r from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--nhbea-accent-orange)]/30 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Start Nomination Now
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--nhbea-accent-orange-dark)] to-[var(--nhbea-accent-orange)] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_0.8s_ease-out] transition-opacity duration-300"></div>
            </Link>
            
            <a 
              href="#available-awards"
              className="px-8 py-4 bg-white/80 backdrop-blur-sm text-[var(--nhbea-royal-blue)] font-semibold text-lg rounded-xl border-2 border-white/40 hover:bg-white hover:border-white/60 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Browse Awards First
              </span>
            </a>
          </div>
          
          {/* Trust signal */}
          <div className="mt-6 text-sm text-[var(--color-text-tertiary)]">
            ✨ Nominations are reviewed by a distinguished panel of education professionals
          </div>
        </div>
      </div>
    </section>
  );
}