'use client';

import { useState, useEffect } from 'react';

function HeritageCard({ icon, title, description, delay }: { 
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
        <div className="flex flex-col items-center text-center h-full">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg"
            style={{ backgroundColor: delay === 200 ? 'var(--brand-primary)' : delay === 400 ? 'var(--brand-accent-primary)' : 'var(--nhbea-gray-600)' }}
          >
            {icon}
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
          <p className="text-slate-600 leading-relaxed flex-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HeritageSection() {
  return (
    <section 
      className="py-20 lg:py-32 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--nhbea-gray-100) 0%, var(--color-bg-primary) 100%)' }}
    >
      {/* Academic heritage background texture */}
      <div 
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.12'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}
      />
      
      {/* Institutional heritage accent elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-24 right-20 w-px h-28 bg-gradient-to-b from-slate-300/40 to-transparent"></div>
        <div className="absolute bottom-24 left-20 w-px h-36 bg-gradient-to-b from-slate-300/40 to-transparent"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-px bg-gradient-to-r from-slate-300/30 to-transparent"></div>
        <div className="absolute top-1/3 right-1/5 w-1.5 h-1.5 bg-slate-400/20 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/5 w-2 h-2 bg-slate-400/20 rounded-full"></div>
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
              Our Legacy
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Over a century of dedication to business education excellence in New Hampshire
          </p>
          <div className="mt-8 w-24 h-1 bg-gradient-to-r from-slate-700 to-yellow-700 rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <HeritageCard
            delay={200}
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd" />
              </svg>
            }
            title="Founded 1922"
            description="Established as New Hampshire's premier organization for business educators, dedicated to promoting excellence in business education."
          />

          <HeritageCard
            delay={400}
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            }
            title="Growing Strong Together"
            description="A thriving community of business educators from across New Hampshire, united in our commitment to student success."
          />

          <HeritageCard
            delay={600}
            icon={
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03z" clipRule="evenodd" />
              </svg>
            }
            title="Continuing Innovation"
            description="Committed to staying at the forefront of business education, embracing new technologies and teaching methodologies."
          />
        </div>

        {/* Call to action */}
        <div className="text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Be Part of Our Continuing Story</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Join NHBEA and contribute to the next chapter of business education excellence in New Hampshire.
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
              <span className="relative z-10">Join Our Legacy</span>
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
              Attend Our Conference
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}