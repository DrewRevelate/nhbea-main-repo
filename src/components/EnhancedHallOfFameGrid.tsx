'use client';

import { useState, useEffect } from 'react';
import { HallOfFameMember } from '@/types/dataModels';
import MemberImage from './MemberImage';

interface EnhancedHallOfFameGridProps {
  members: HallOfFameMember[];
}

// Premium Hall of Fame member card with sophisticated aesthetic
function PremiumRecipientCard({ member, index }: { member: HallOfFameMember; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  const getAwardIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div
      className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${
        isHovered ? 'scale-105' : 'scale-100'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Elegant gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 opacity-60"></div>
      
      {/* Premium accent border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--nhbea-royal-blue)] via-[var(--nhbea-accent-gold)] to-[var(--nhbea-royal-blue)]"></div>
      
      <div className="relative z-10 p-8">
        {/* Sophisticated member photo presentation */}
        <div className="relative mb-8">
          <div className="relative mx-auto w-36 h-36">
            {/* Elegant photo frame with multiple layers */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--nhbea-royal-blue)] to-[var(--nhbea-accent-gold)] p-1">
              <div className="w-full h-full rounded-full bg-white p-1">
                <MemberImage
                  imagePath={member.imageUrl}
                  memberName={member.name}
                  className="w-full h-full object-cover rounded-full"
                  containerClassName="w-full h-full rounded-full overflow-hidden shadow-lg"
                  width={144}
                  height={144}
                />
              </div>
            </div>
            
            {/* Award badge positioned elegantly */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-[var(--nhbea-accent-gold)] text-white px-4 py-2 rounded-full shadow-lg border-2 border-white">
                <div className="flex items-center space-x-2">
                  {getAwardIcon()}
                  <span className="text-sm font-bold">{member.inductionYear}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium member information */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-serif text-[var(--nhbea-royal-blue)] font-bold leading-tight">
            {member.name}
          </h3>
          
          {/* Primary award display with elegant styling */}
          {member.activeAwards && member.activeAwards.length > 0 && (
            <div className="inline-block">
              <div className="bg-gradient-to-r from-[var(--nhbea-accent-gold)]/20 to-[var(--nhbea-accent-gold)]/10 border border-[var(--nhbea-accent-gold)]/30 rounded-xl px-4 py-2">
                <span className="text-[var(--nhbea-accent-gold)] font-semibold text-sm">
                  {member.activeAwards[0].awardName}
                </span>
              </div>
            </div>
          )}
          
          {/* Institution with subtle styling */}
          {member.institution && (
            <p className="text-gray-600 font-medium">
              {member.institution}
            </p>
          )}
          
          {/* Biography with refined presentation */}
          {member.bio && (
            <div className="pt-6 border-t border-gray-200">
              <p className="text-gray-700 leading-relaxed text-sm">
                {member.bio}
              </p>
            </div>
          )}
          
          {/* Achievement highlight */}
          {member.achievement && (
            <div className="pt-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs font-semibold text-[var(--nhbea-royal-blue)] mb-2 uppercase tracking-wide">
                  Notable Achievement
                </div>
                <p className="text-gray-700 text-sm italic">
                  {member.achievement}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle hover glow effect */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--nhbea-royal-blue)]/5 to-[var(--nhbea-accent-gold)]/5 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>
    </div>
  );
}

// Loading skeleton component
function LoadingCard({ index }: { index: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div 
      className={`relative bg-white rounded-2xl shadow-lg border-2 border-gray-300 p-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Premium card accent */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--nhbea-royal-blue)] via-[var(--nhbea-royal-blue-dark)] to-[var(--nhbea-accent-gold)]"></div>
      
      <div className="animate-pulse">
        <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6"></div>
        <div className="space-y-3 mb-6">
          <div className="h-6 bg-gray-200 rounded mx-auto w-3/4"></div>
          <div className="h-8 bg-gray-100 rounded-full mx-auto w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded mx-auto w-1/4"></div>
        </div>
        <div className="space-y-2 mb-6 pt-4 border-t border-gray-100">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
    </div>
  );
}


// Premium Hall of Fame showcase with sophisticated design
export default function EnhancedHallOfFameGrid({ members }: EnhancedHallOfFameGridProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <div className="inline-block h-12 w-80 bg-gray-200 rounded-xl mb-6 animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {Array.from({ length: 6 }, (_, i) => (
              <LoadingCard key={i} index={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (members.length === 0) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-32 h-32 bg-gradient-to-br from-[var(--nhbea-royal-blue)]/10 to-[var(--nhbea-accent-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-[var(--nhbea-royal-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 012-2h10a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-4xl font-serif text-[var(--nhbea-royal-blue)] mb-6">Hall of Fame Coming Soon</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Our distinguished Hall of Fame honorees will be showcased here soon. These exceptional educators 
              represent the pinnacle of excellence in New Hampshire business education.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-6 py-24">
        {/* Elegant Hero Section */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-serif text-[var(--nhbea-royal-blue)] mb-6">
            Hall of Fame
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-accent-gold)] mx-auto mb-8"></div>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Celebrating Excellence in Business Education
          </p>
        </div>

        {/* Premium Award Recipient Showcase */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {members.map((member, index) => (
              <PremiumRecipientCard 
                key={member.id} 
                member={member} 
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Elegant Footer */}
        <div className="text-center mt-20 pt-16 border-t border-gray-200">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-serif text-[var(--nhbea-royal-blue)] mb-4">
              Legacy of Excellence
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Each honoree represents years of dedication to business education excellence, 
              inspiring countless students and advancing the profession throughout New Hampshire.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}