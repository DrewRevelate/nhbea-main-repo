'use client';

import { useState, useEffect } from 'react';

interface MissionSectionProps {
  title?: string;
  content?: string;
  imageURL?: string;
}

export default function EnhancedMissionSection({ 
  title = "Our Mission",
  content = "The New Hampshire Business Educators Association is dedicated to promoting excellence in business education throughout the state.",
  imageURL 
}: MissionSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const missionPillars = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Educational Excellence",
      description: "Promoting the highest standards in business education curriculum and innovative teaching methodologies that prepare students for tomorrow's challenges.",
      color: "from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)]"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Professional Development",
      description: "Supporting continuous growth and career advancement through workshops, certifications, and networking opportunities for our educator community.",
      color: "from-[var(--nhbea-accent-gold-dark)] to-[var(--nhbea-accent-gold)]"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Community Impact",
      description: "Building stronger communities through quality business education, student success initiatives, and meaningful industry partnerships.",
      color: "from-[var(--nhbea-accent-green)] to-[var(--nhbea-accent-green-dark)]"
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      {/* Clean white background for optimal readability */}

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced title section */}
          <div className={`text-center mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-block px-4 py-2 bg-[var(--nhbea-royal-blue)]/10 text-[var(--nhbea-royal-blue)] rounded-full text-sm font-light mb-6">
              What Drives Us
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-gray-900 mb-10 leading-tight">
              Our <span className="bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] bg-clip-text text-transparent">Mission</span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed mb-8 font-light">
                {content}
              </p>
              <details className="group cursor-pointer">
                <summary 
                  className="text-lg text-[var(--nhbea-royal-blue)] font-light hover:text-[var(--nhbea-royal-blue-dark)] transition-colors duration-200 list-none flex items-center justify-center gap-2 mb-6"
                  aria-expanded="false"
                  role="button"
                  aria-label="Learn more about our impact - click to expand"
                >
                  <span>Learn More About Our Impact</span>
                  <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 p-6 bg-[var(--nhbea-gray-50)] rounded-xl border border-[var(--nhbea-gray-200)]">
                  <p className="text-xl text-gray-600 leading-relaxed font-normal">
                    Through professional development, networking opportunities, and innovative programs, we empower educators to inspire the next generation of business leaders while fostering strong connections between academia and industry.
                  </p>
                </div>
              </details>
            </div>
            <div className="w-24 h-1 bg-[var(--nhbea-royal-blue)] rounded-full mx-auto mt-8"></div>
          </div>

          {/* Enhanced mission pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-24">
            {missionPillars.map((pillar, index) => (
              <div 
                key={index}
                className={`group transition-all duration-700 delay-${index * 200} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 h-full">
                  <div className="w-16 h-16 rounded-xl bg-[var(--nhbea-royal-blue)] flex items-center justify-center mb-6">
                    {pillar.icon}
                  </div>
                  
                  <h3 className="text-2xl font-normal text-gray-900 mb-4">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-lg text-gray-600 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced call to action */}
          <div className={`text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-gradient-to-r from-[var(--nhbea-royal-blue-dark)] to-[var(--nhbea-royal-blue-deeper)] rounded-2xl p-12 text-white shadow-2xl border border-[var(--nhbea-accent-gold-dark)]/20">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-4xl md:text-5xl font-normal mb-8 text-white">
                  ⚡ Ready to Make an Impact?
                </h3>
                <p className="text-2xl text-white mb-10 leading-relaxed font-light">
                  Join our community of dedicated educators and help shape the future of business education in New Hampshire.
                </p>
                <div className="flex flex-col gap-4 justify-center max-w-sm mx-auto">
                  <a 
                    href="/membership/professional"
                    className="px-10 py-6 bg-[var(--nhbea-accent-gold-dark)] text-white font-normal text-xl rounded-xl hover:bg-[var(--nhbea-accent-gold)] transition-all duration-300 shadow-xl hover:shadow-2xl text-center transform hover:scale-110 border-2 border-[var(--nhbea-accent-gold)] min-h-[56px] flex items-center justify-center"
                  >
                    🚀 Join Our Mission
                  </a>
                  <a 
                    href="/conference"
                    className="px-8 py-4 bg-white/15 text-white font-light rounded-lg border-2 border-white/50 hover:bg-white/25 hover:text-white transition-all duration-300 text-center backdrop-blur-sm min-h-[48px] flex items-center justify-center"
                  >
                    View Conference Details
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}