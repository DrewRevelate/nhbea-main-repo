export default function TrustBadgesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-[var(--nhbea-gray-600)] font-light" role="heading" aria-level="3">Trusted by educators across New Hampshire</p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8">
          {/* Trust badges */}
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-3 border-2 border-[var(--nhbea-gray-300)] shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer hover:scale-105 hover:border-[var(--nhbea-royal-blue)]/30">
            <svg className="w-5 h-5 text-[var(--nhbea-success)]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-[var(--nhbea-gray-800)] text-sm font-light group-hover:text-[var(--nhbea-royal-blue)] transition-colors duration-300">Secure & Safe</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-3 border-2 border-[var(--nhbea-gray-300)] shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer hover:scale-105 hover:border-[var(--nhbea-royal-blue)]/30">
            <svg className="w-5 h-5 text-[var(--nhbea-royal-blue)]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
            <span className="text-[var(--nhbea-gray-800)] text-sm font-light group-hover:text-[var(--nhbea-royal-blue)] transition-colors duration-300">Statewide Network</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-3 border-2 border-[var(--nhbea-gray-300)] shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer hover:scale-105 hover:border-[var(--nhbea-royal-blue)]/30">
            <svg className="w-5 h-5 text-[var(--nhbea-accent-gold-dark)]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <span className="text-[var(--nhbea-gray-800)] text-sm font-light group-hover:text-[var(--nhbea-royal-blue)] transition-colors duration-300">102 Years</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-3 border-2 border-[var(--nhbea-gray-300)] shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer hover:scale-105 hover:border-[var(--nhbea-royal-blue)]/30">
            <svg className="w-5 h-5 text-[var(--nhbea-royal-blue)]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-[var(--nhbea-gray-800)] text-sm font-light group-hover:text-[var(--nhbea-royal-blue)] transition-colors duration-300">2 Prestigious Awards</span>
          </div>
        </div>
      </div>
    </section>
  );
}