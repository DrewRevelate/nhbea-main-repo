'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AboutSectionProps {
  title: string;
  content: string;
  imageURL?: string;
}

function FeatureCard({ icon, title, description, delay }: { 
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
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="flex items-start space-x-6 p-8 bg-white rounded-2xl shadow-lg border border-gray-200 relative">
        {/* Clean white background */}
        <div className="absolute inset-0 bg-white rounded-2xl"></div>
        
        <div className="flex-shrink-0 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-br from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] rounded-xl flex items-center justify-center shadow-lg">
            <div className="text-white">
              {icon}
            </div>
          </div>
        </div>
        <div className="relative z-10 flex-1">
          <h4 className="text-xl font-semibold mb-3 leading-tight text-gray-900">{title}</h4>
          <p className="leading-relaxed text-base text-gray-700">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function EnhancedAboutSection({ title, content, imageURL }: AboutSectionProps) {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Side */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[var(--nhbea-royal-blue-dark)]">
                {title || "About NHBEA"}
              </h2>
              
              <div className="space-y-8 text-lg md:text-xl leading-relaxed text-gray-700">
                {(content || '').split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="font-light">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>

            {/* Key Features Section */}
            <div className="pt-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-center text-[var(--nhbea-royal-blue-dark)] mb-8">
                  Our Key Features
                </h3>
                <div className="space-y-6">
                  <FeatureCard
                    delay={200}
                    icon={
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    }
                    title="Professional Development"
                    description="Empowering educators with cutting-edge training, certifications, and career advancement opportunities"
                  />

                  <FeatureCard
                    delay={400}
                    icon={
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    }
                    title="Collaborative Network"
                    description="Building lasting connections between business educators throughout New Hampshire and beyond"
                  />

                  <FeatureCard
                    delay={600}
                    icon={
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    }
                    title="Excellence Recognition"
                    description="Celebrating outstanding achievements through prestigious awards and professional recognition programs"
                  />
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="pt-8">
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <a 
                  href="/membership/professional"
                  className="nhbea-button-primary nhbea-button-lg w-full justify-center"
                >
                  Become a Member
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="/conference"
                  className="nhbea-button-secondary nhbea-button-md w-full justify-center"
                >
                  Conference Info
                </a>
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative lg:order-first">
            {imageURL && imageURL.trim() !== '' ? (
              <div className="relative">
                {/* Background decoration */}
                <div className="absolute -inset-4 bg-[var(--nhbea-royal-blue)]/10 rounded-2xl blur-lg opacity-30"></div>
                
                {/* Main image container */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg shadow-gray-900/10 border border-gray-200">
                  <Image
                    src={imageURL}
                    alt={title}
                    fill
                    className="object-cover"
                    priority={false}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGBkRMUUaH/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/EABgRAAMBAQAAAAAAAAAAAAAAAAABAhEh/9oADAMBAAIRAxEAPwDLcc4//9k="
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"></div>
                </div>
              </div>
            ) : (
              // Brand-focused visual element when no image
              <div className="relative">
                <div className="bg-white rounded-xl p-12 shadow-lg border border-[var(--nhbea-royal-blue)]/20">
                  <div className="text-center space-y-8">
                    {/* Brand Icon */}
                    <div className="w-24 h-24 bg-gradient-to-br from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    
                    {/* Brand Identity */}
                    <div className="space-y-4">
                      <h3 className="text-3xl font-normal text-[var(--nhbea-royal-blue-dark)]">NHBEA</h3>
                      <p className="text-[var(--nhbea-gray-700)] font-light">New Hampshire Business Educators Association</p>
                      <div className="flex items-center justify-center space-x-4 text-sm text-[var(--nhbea-gray-600)]">
                        <span className="bg-[var(--nhbea-royal-blue)]/10 px-3 py-1 rounded-full font-light">Est. 1923</span>
                        <span className="bg-[var(--nhbea-royal-blue)]/10 px-3 py-1 rounded-full font-light">Statewide</span>
                      </div>
                    </div>

                    {/* Mission Statement */}
                    <div className="bg-[var(--nhbea-royal-blue)]/5 rounded-lg p-6 border border-[var(--nhbea-royal-blue)]/15">
                      <p className="text-[var(--nhbea-gray-700)] font-light italic leading-relaxed">
                        "Promoting excellence in business education throughout New Hampshire"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}