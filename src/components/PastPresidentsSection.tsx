import { PastPresident } from '@/types/pastPresidents';

interface PastPresidentsSectionProps {
  pastPresidents: PastPresident[];
}

export default function PastPresidentsSection({ pastPresidents }: PastPresidentsSectionProps) {
  console.log('🔍 PastPresidentsSection: Received', pastPresidents?.length || 0, 'presidents');
  
  // Fallback test data if no real data
  const testPresidents: PastPresident[] = [
    {
      id: 'fallback-1',
      name: 'James Dowding',
      term: '2022-2023',
      order: 1
    }
  ];

  // Use real data if available, otherwise use test data
  const displayPresidents = pastPresidents && pastPresidents.length > 0 ? pastPresidents : testPresidents;

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Brand-aligned header matching homepage style */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--nhbea-royal-blue)] to-transparent w-20"></div>
            <div className="mx-6 text-[var(--nhbea-royal-blue)]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
              </svg>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--nhbea-royal-blue)] to-transparent w-20"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--nhbea-royal-blue-dark)] mb-6">
            Past Presidents
          </h2>
          <p className="text-xl text-[var(--nhbea-gray-600)] max-w-3xl mx-auto leading-relaxed">
            Honoring the distinguished leaders who have shaped NHBEA's century-long legacy of educational excellence and professional advancement.
          </p>
        </div>

        {/* Brand-aligned grid layout matching homepage component style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {displayPresidents.map((president, index) => (
            <div 
              key={president.id}
              className="bg-white rounded-2xl shadow-md border border-[var(--nhbea-gray-200)] p-8 relative overflow-hidden transform opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Brand accent matching royal blue theme */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)]"></div>
              
              <div className="text-center">
                {/* Name and title with consistent typography */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[var(--nhbea-royal-blue-dark)] mb-2">
                    {president.name}
                  </h3>
                  <p className="text-[var(--nhbea-gray-600)] font-medium mb-3">
                    NHBEA President
                  </p>
                  
                  {/* Term display with brand styling */}
                  {president.term && (
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--nhbea-royal-blue)]/10 border border-[var(--nhbea-royal-blue)]/20">
                      <span className="text-[var(--nhbea-royal-blue-dark)] font-semibold text-sm">
                        {president.term}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bio section with consistent spacing */}
                {president.bio && (
                  <div className="mt-6 pt-6 border-t border-[var(--nhbea-gray-200)]">
                    <p className="text-[var(--nhbea-gray-600)] leading-relaxed">
                      {president.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Brand-aligned legacy section */}
        <div className="text-center mt-20">
          <div className="bg-[var(--nhbea-royal-blue-dark)] rounded-2xl p-12 text-white shadow-lg max-w-4xl mx-auto transform opacity-0 animate-[fadeInUp_0.8s_ease-out_1000ms_forwards] relative overflow-hidden">
            {/* Static light gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--nhbea-royal-blue-light)]/10 via-transparent to-[var(--nhbea-accent-gold)]/5 opacity-100"></div>
            <div className="flex items-center justify-center mb-8 relative z-10">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center shadow-sm">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
              A Century of Leadership Excellence
            </h3>
            <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto relative z-10">
              Each president has contributed their unique vision and dedication, building upon 
              the foundation laid by their predecessors to advance business education throughout 
              New Hampshire. Their collective wisdom continues to guide NHBEA's educational mission.
            </p>
            <div className="mt-8 pt-8 border-t border-white/20 relative z-10">
              <p className="text-white/80 font-medium">
                Continuing our tradition of excellence since 1923
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}