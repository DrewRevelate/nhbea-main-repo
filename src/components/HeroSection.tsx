import Image from 'next/image';
import Link from 'next/link';
import { HomepageContent } from '@/types/content';

interface HeroSectionProps {
  content: HomepageContent;
}

export default function HeroSection({ content }: HeroSectionProps) {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--nhbea-royal-blue)] via-[var(--nhbea-royal-blue-dark)] to-[var(--nhbea-royal-blue-deeper)] overflow-hidden"
      role="banner"
      aria-label="Hero section"
    >
      {/* Conservative royal blue gradient overlay with subtle pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--nhbea-royal-blue)] via-[var(--nhbea-royal-blue-dark)] to-[var(--nhbea-royal-blue-deeper)]"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
        <div 
          className="absolute top-0 right-0 w-full h-full opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`
          }}
        ></div>
      </div>
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 nhbea-button-primary z-50"
      >
        Skip to main content
      </a>

      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Professional heading with enhanced typography */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight tracking-tight">
              <span className="block">New Hampshire</span>
              <span className="block text-4xl md:text-5xl lg:text-6xl text-white/90 font-semibold">Business Educators Association</span>
            </h1>
          </div>
          
          {/* Sophisticated subtitle with enhanced styling */}
          <div className="mb-12 animate-slide-up animation-delay-200">
            <p className="text-xl md:text-2xl max-w-4xl mx-auto text-white/90 leading-relaxed font-light">
              {content?.heroSubtitle || "Promoting excellence in business education throughout New Hampshire through professional development, networking, and career advancement opportunities."}
            </p>
          </div>

          {/* Brand-consistent Value Propositions */}
          <div className="mb-16 animate-slide-up animation-delay-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="flex flex-col items-center text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Professional Development</h3>
                <p className="text-white/80 leading-relaxed">Continuous learning opportunities and certification programs to advance your career</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Networking</h3>
                <p className="text-white/80 leading-relaxed">Connect with fellow educators and industry professionals across New Hampshire</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Career Growth</h3>
                <p className="text-white/80 leading-relaxed">Recognition programs and advancement opportunities in business education</p>
              </div>
            </div>
          </div>

          {/* Professional Call-to-Action with brand styling */}
          <div className="mb-16 animate-slide-up animation-delay-400">
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
              <Link 
                href="/membership/professional"
                className="px-8 py-4 bg-[var(--nhbea-accent-orange)] text-white font-semibold rounded-xl hover:bg-[var(--nhbea-accent-orange-dark)] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
              >
                Become a Member
              </Link>
              <Link 
                href="/conference"
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 text-center"
              >
                View Events
              </Link>
            </div>
          </div>

          {/* Hero image with clean styling */}
          {content.heroImageURL && content.heroImageURL.trim() !== '' && (
            <div className="animate-fade-in">
              <div className="relative max-w-4xl mx-auto">
                <div className="relative overflow-hidden rounded-lg border border-border">
                  <Image
                    src={content.heroImageURL}
                    alt="NHBEA Professional Educators"
                    width={1200}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}