'use client';

import { useState, useEffect } from 'react';

interface ValueCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  stats?: string;
}

const valuesData: ValueCard[] = [
  {
    title: "Excellence in Education",
    description: "We champion the highest standards in business education, ensuring our members have access to cutting-edge curriculum and teaching methodologies.",
    stats: "250+ Educators",
    icon: (
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
      </svg>
    )
  },
  {
    title: "Professional Growth",
    description: "We provide continuous professional development opportunities, networking events, and resources that advance careers in business education.",
    stats: "Annual Conference",
    icon: (
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
      </svg>
    )
  },
  {
    title: "Innovation & Leadership",
    description: "We embrace new technologies and teaching methods, leading the way in business education innovation across New Hampshire.",
    stats: "102 Years Strong",
    icon: (
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    title: "Community Impact",
    description: "We strengthen communities by preparing students for successful careers and supporting economic development throughout New Hampshire.",
    stats: "2 Prestigious Awards",
    icon: (
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    )
  }
];

function AnimatedValueCard({ value, index }: { value: ValueCard; index: number }) {
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
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-full group">
        <div className="flex flex-col h-full">
          {/* Icon and stat */}
          <div className="flex items-center justify-between mb-6">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
              style={{ 
                backgroundColor: index === 0 ? 'var(--brand-primary)' : index === 1 ? 'var(--brand-accent-primary)' : index === 2 ? 'var(--nhbea-gray-600)' : 'var(--brand-primary)'
              }}
            >
              {value.icon}
            </div>
            {value.stats && (
              <div className="text-right">
                <div 
                  className="text-sm font-semibold uppercase tracking-wide"
                  style={{ color: 'var(--brand-accent-primary)' }}
                >
                  {value.stats}
                </div>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{value.title}</h3>
            <p className="text-slate-600 leading-relaxed">{value.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ValuesImpactSection() {
  return (
    <section 
      className="py-20 lg:py-32 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--nhbea-gray-100) 100%)' }}
    >
      {/* Academic values background texture */}
      <div 
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.1'%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Institutional values accent elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-28 left-24 w-px h-24 bg-gradient-to-b from-slate-300/40 to-transparent"></div>
        <div className="absolute bottom-28 right-24 w-px h-32 bg-gradient-to-b from-slate-300/40 to-transparent"></div>
        <div className="absolute top-2/3 right-1/3 w-16 h-px bg-gradient-to-r from-slate-300/30 to-transparent"></div>
        <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-slate-400/20 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-slate-400/20 rounded-full"></div>
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
              Our Core Values
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            The principles that guide our mission and drive our commitment to excellence in business education
          </p>
          <div className="mt-8 w-24 h-1 rounded-full mx-auto" style={{ background: 'linear-gradient(to right, var(--nhbea-gray-700), var(--brand-accent-primary))' }}></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {valuesData.map((value, index) => (
            <AnimatedValueCard 
              key={value.title} 
              value={value} 
              index={index} 
            />
          ))}
        </div>

        {/* Impact Statistics - Academic Excellence Style */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-200/40 shadow-lg mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">
              <span style={{ 
                background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent-primary) 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent', 
                backgroundClip: 'text'
              }}>
                Making a Difference
              </span>
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our impact extends across New Hampshire, supporting educators and students in their pursuit of excellence
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--brand-primary)' }}>250+</div>
              <div className="text-slate-600 font-medium">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--brand-accent-primary)' }}>102</div>
              <div className="text-slate-600 font-medium">Years of Service</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--nhbea-gray-600)' }}>1</div>
              <div className="text-slate-600 font-medium">Annual Conference</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--brand-primary)' }}>2</div>
              <div className="text-slate-600 font-medium">Prestigious Awards</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Ready to Join Our Mission?</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Become part of New Hampshire's premier organization for business educators and help shape the future of business education.
            </p>
          </div>
          
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <a 
              href="/membership/professional"
              className="group relative px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-500/50"
              style={{ 
                background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent-primary) 100%)'
              }}
            >
              <span className="relative z-10">Become a Member</span>
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, var(--brand-primary-dark) 0%, var(--nhbea-accent-orange-dark) 100%)'
                }}
              ></div>
            </a>
            <a 
              href="/conference"
              className="group px-8 py-4 text-slate-700 font-semibold rounded-xl border-2 border-slate-300 hover:border-slate-400 hover:bg-white/70 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-500/50"
            >
              Join Our Conference
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}