'use client';

import { useState, useEffect } from 'react';

interface LeadershipOverviewProps {
  className?: string;
}

function LeadershipCard({ icon, title, description, delay }: { 
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
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-full">
        <div className="flex flex-col items-center text-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg"
            style={{ backgroundColor: delay === 200 ? 'var(--brand-primary)' : delay === 400 ? 'var(--brand-accent-primary)' : 'var(--nhbea-gray-600)' }}
          >
            {icon}
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
          <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function LeadershipOverviewSection({ className = '' }: LeadershipOverviewProps) {
  return (
    <section 
      className={`py-20 lg:py-32 relative overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(135deg, var(--nhbea-gray-100) 0%, var(--color-bg-primary) 100%)' }}
    >
      {/* Academic leadership background texture */}
      <div 
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.08'%3E%3Ccircle cx='60' cy='60' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Institutional leadership accent elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-32 right-28 w-px h-20 bg-gradient-to-b from-slate-300/40 to-transparent"></div>
        <div className="absolute bottom-32 left-28 w-px h-28 bg-gradient-to-b from-slate-300/40 to-transparent"></div>
        <div className="absolute top-1/2 right-1/3 w-12 h-px bg-gradient-to-r from-slate-300/30 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-slate-400/20 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/5 w-1.5 h-1.5 bg-slate-400/20 rounded-full"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
            <span style={{ 
              background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent-primary) 50%, var(--nhbea-gray-600) 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent', 
              backgroundClip: 'text'
            }}>
              Leadership & Governance
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Dedicated professionals guiding NHBEA's mission and ensuring excellence in business education
          </p>
          <div className="mt-8 w-24 h-1 rounded-full mx-auto" style={{ background: 'linear-gradient(to right, var(--nhbea-gray-700), var(--brand-accent-primary))' }}></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <LeadershipCard
            delay={200}
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd" />
              </svg>
            }
            title="Executive Board"
            description="Experienced educators leading strategic initiatives and setting the vision for business education excellence across New Hampshire."
          />

          <LeadershipCard
            delay={400}
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            }
            title="Board Members"
            description="Dedicated professionals from across the state bringing diverse perspectives and expertise to guide our organization."
          />

          <LeadershipCard
            delay={600}
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            }
            title="Past Presidents"
            description="Honoring the legacy of former leaders who have shaped NHBEA into the respected organization it is today."
          />
        </div>

        {/* Key Values Grid - Academic Excellence Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 border border-slate-200/40">
            <div className="flex items-start space-x-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Collaborative Leadership</h4>
                <p className="text-slate-600 leading-relaxed">
                  Our board works together to ensure every decision reflects the needs and interests of our diverse membership.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 border border-slate-200/40">
            <div className="flex items-start space-x-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--brand-accent-primary)' }}
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-2">Forward-Thinking Vision</h4>
                <p className="text-slate-600 leading-relaxed">
                  We anticipate future trends in business education and prepare our members for emerging challenges and opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation to leadership sections - Academic Excellence Style */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <a 
              href="#board-members"
              className="group relative px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-500/50"
              style={{ 
                background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent-primary) 100%)'
              }}
            >
              <span className="relative z-10">Meet Our Board</span>
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, var(--brand-primary-dark) 0%, var(--nhbea-accent-orange-dark) 100%)'
                }}
              ></div>
            </a>
            <a 
              href="#past-presidents"
              className="group px-8 py-4 text-slate-700 font-semibold rounded-xl border-2 border-slate-300 hover:border-slate-400 hover:bg-white/70 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-500/50"
            >
              Honor Past Presidents
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}