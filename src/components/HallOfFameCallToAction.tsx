'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HallOfFameCallToAction() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('hall-of-fame-cta');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="hall-of-fame-cta" className="py-20 lg:py-24 bg-[var(--nhbea-royal-blue-dark)] relative overflow-hidden">
      {/* Clean solid background with subtle overlay for better contrast */}
      <div className="absolute inset-0 bg-[var(--nhbea-royal-blue-dark)]">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className={`max-w-5xl mx-auto text-center transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Section indicator - matches other hero sections */}
          <div className="inline-flex items-center space-x-3 text-white/90 mb-8">
            <div className="w-8 h-px bg-white/80"></div>
            <span className="text-sm font-medium tracking-wider uppercase">Join the Legacy</span>
            <div className="w-8 h-px bg-white/80"></div>
          </div>

          {/* Heading with consistent typography */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Nominate a{' '}
            <span className="text-[var(--nhbea-accent-gold)]">
              Distinguished
            </span>{' '}
            Educator
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl font-medium mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
            Know an exceptional business educator who deserves recognition? Help us celebrate 
            excellence by nominating them for one of our prestigious awards. Every great educator 
            deserves to be recognized for their dedication to student success.
          </p>

          {/* Action Buttons - consistent with other hero sections */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto mb-16">
            <Link
              href="/awards"
              className="px-8 py-4 bg-[var(--nhbea-accent-gold-dark)] text-white font-bold text-lg rounded-xl shadow-xl text-center flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Start Nomination
            </Link>

            <Link
              href="/awards"
              className="px-8 py-4 bg-white/20 text-white font-semibold text-lg rounded-xl border-2 border-white/60 text-center backdrop-blur-sm flex items-center justify-center"
            >
              View All Awards
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Process Steps - cleaner design */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Select Award',
                description: 'Choose the most appropriate recognition category for your nominee',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                )
              },
              {
                step: '2',
                title: 'Provide Details',
                description: 'Share information about the nominee and their outstanding contributions',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                )
              },
              {
                step: '3',
                title: 'Submit & Celebrate',
                description: 'Complete your nomination and help recognize educational excellence',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )
              }
            ].map((item, index) => (
              <div
                key={item.step}
                className={`transform transition-all duration-1000 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${(index + 1) * 200}ms` }}
              >
                <div className="bg-white/15 backdrop-blur-sm border-2 border-white/40 rounded-2xl p-8 text-center">
                  {/* Step Number */}
                  <div className="flex items-center justify-center w-16 h-16 bg-[var(--nhbea-accent-gold)] rounded-2xl text-white font-bold text-xl mb-6 mx-auto">
                    {item.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="flex items-center justify-center text-white mb-6">
                    {item.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-white/90 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}