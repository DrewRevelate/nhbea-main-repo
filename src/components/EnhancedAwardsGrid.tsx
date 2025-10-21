'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Award } from '@/types/dataModels';
import { awardsUtils } from '@/lib/awards';

interface EnhancedAwardsGridProps {
  awardsByCategory: Record<string, Award[]>;
}

function AwardCard({ award, index }: { award: Award; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const daysUntilDeadline = awardsUtils.getDaysUntilDeadline(award.deadline);
  const isDeadlinePassed = awardsUtils.isDeadlinePassed(award.deadline);
  const canNominate = award.isActive && !isDeadlinePassed;
  const isDisabled = !award.isActive || isDeadlinePassed;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 150 + 300);
    return () => clearTimeout(timer);
  }, [index]);

  const getStatusBadge = () => {
    if (!award.isActive) {
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        dot: 'bg-gray-400',
        label: 'Award Inactive',
        priority: 'low'
      };
    }
    if (isDeadlinePassed) {
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        dot: 'bg-red-500',
        label: 'Deadline Passed',
        priority: 'critical'
      };
    }
    if (daysUntilDeadline <= 7) {
      return {
        bg: 'bg-[var(--nhbea-accent-orange)]/10',
        text: 'text-[var(--nhbea-accent-orange-dark)]',
        dot: 'bg-[var(--nhbea-accent-orange)]',
        label: `🔥 ${daysUntilDeadline} days left!`,
        priority: 'urgent'
      };
    }
    if (daysUntilDeadline <= 30) {
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        dot: 'bg-yellow-500',
        label: `⏰ ${daysUntilDeadline} days left`,
        priority: 'medium'
      };
    }
    return {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
      label: `📅 Due ${awardsUtils.formatDeadline(award.deadline)}`,
      priority: 'normal'
    };
  };

  const status = getStatusBadge();

  // UX enhancement: Show motivation and impact
  const getMotivationalText = () => {
    if (canNominate) {
      return "This nomination could be the recognition they deserve!";
    }
    return "Check back next year for nomination opportunities.";
  };

  return (
    <div 
      className={`transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}
    >
      <article className={`rounded-2xl border-2 p-6 md:p-8 h-full flex flex-col relative overflow-hidden ${
        canNominate 
          ? 'bg-white shadow-lg border-gray-400' 
          : 'bg-gray-50 shadow-sm border-gray-300 opacity-75'
      }`}>
        
        {/* Priority indicator bar for urgent deadlines */}
        {status.priority === 'urgent' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)]"></div>
        )}

        {/* Award Header with Better Hierarchy */}
        <div className="mb-6">
          {/* Status Badge - Top Priority */}
          <div className="flex justify-between items-start mb-4">
            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${status.bg} ${status.text} shadow-sm`}>
              <div className={`w-2.5 h-2.5 rounded-full mr-2 ${status.dot} ${status.priority === 'urgent' ? 'animate-pulse' : ''}`}></div>
              {status.label}
            </div>
            
            {/* Award Category Icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300 ${
              canNominate 
                ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' 
                : 'bg-gradient-to-br from-gray-300 to-gray-400'
            }`}>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Award Title */}
          <h3 className={`text-xl md:text-2xl font-bold mb-3 leading-tight ${
            canNominate ? 'text-[var(--color-text-primary)]' : 'text-gray-600'
          }`}>
            {award.name}
          </h3>
        </div>

        {/* Award Description with scannable format */}
        <div className="mb-6 flex-1">
          <p className={`leading-relaxed mb-4 ${
            canNominate ? 'text-[var(--color-text-secondary)]' : 'text-gray-500'
          } ${!isExpanded ? 'line-clamp-3' : ''}`}>
            {award.description}
          </p>
          
          {/* Expand/Collapse for long descriptions */}
          {award.description.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`text-sm font-medium underline hover:no-underline transition-colors ${
                canNominate ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Quick Eligibility Preview */}
        <div className="mb-6">
          <h4 className={`font-semibold mb-3 flex items-center text-sm uppercase tracking-wide ${
            canNominate ? 'text-[var(--color-text-primary)]' : 'text-gray-500'
          }`}>
            <svg className={`w-4 h-4 mr-2 ${
              canNominate ? 'text-blue-600' : 'text-gray-400'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Who Can Be Nominated
          </h4>
          <div className={`rounded-xl p-4 border-l-4 ${
            canNominate 
              ? 'bg-blue-50 border-blue-500' 
              : 'bg-gray-50 border-gray-300'
          }`}>
            <p className={`text-sm leading-relaxed ${
              canNominate ? 'text-[var(--color-text-secondary)]' : 'text-gray-500'
            } ${!isExpanded ? 'line-clamp-2' : ''}`}>
              {award.eligibility}
            </p>
          </div>
        </div>

        {/* Motivational Message */}
        {canNominate && (
          <div className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium text-center">
              {getMotivationalText()}
            </p>
          </div>
        )}

        {/* Action Button with enhanced UX */}
        <div className="mt-auto">
          {canNominate ? (
            <Link
              href={`/awards/nominate?award=${award.id}`}
              className="group relative w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-[var(--nhbea-accent-orange)] to-[var(--nhbea-accent-orange-dark)] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--nhbea-accent-orange)]/30 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Nominate Now
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--nhbea-accent-orange-dark)] to-[var(--nhbea-accent-orange)] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_0.8s_ease-out] transition-opacity duration-300"></div>
            </Link>
          ) : (
            <div className="w-full inline-flex items-center justify-center px-6 py-4 bg-gray-100 text-gray-500 font-semibold rounded-xl cursor-not-allowed border-2 border-gray-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {!award.isActive ? 'Award Inactive' : 'Nominations Closed'}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

function CategorySection({ category, awards, categoryIndex }: { 
  category: string; 
  awards: Award[]; 
  categoryIndex: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), categoryIndex * 200 + 100);
    return () => clearTimeout(timer);
  }, [categoryIndex]);

  // Enhanced UX: Prioritize active awards, move expired awards to bottom
  const sortedAwards = [...awards].sort((a, b) => {
    const aCanNominate = a.isActive && !awardsUtils.isDeadlinePassed(a.deadline);
    const bCanNominate = b.isActive && !awardsUtils.isDeadlinePassed(b.deadline);
    const aDaysLeft = awardsUtils.getDaysUntilDeadline(a.deadline);
    const bDaysLeft = awardsUtils.getDaysUntilDeadline(b.deadline);
    
    // HIGHEST PRIORITY: Active nominations ALWAYS come first
    if (aCanNominate && !bCanNominate) return -1;
    if (!aCanNominate && bCanNominate) return 1;
    
    // SECOND PRIORITY: Among active nominations, sort by urgency
    if (aCanNominate && bCanNominate) {
      // Critical deadlines (≤7 days) first
      if (aDaysLeft <= 7 && bDaysLeft > 7) return -1;
      if (bDaysLeft <= 7 && aDaysLeft > 7) return 1;
      
      // Then by deadline (soonest first)
      return aDaysLeft - bDaysLeft;
    }
    
    // LOWEST PRIORITY: Expired awards go to bottom, sorted by how recently they closed
    if (!aCanNominate && !bCanNominate) {
      return bDaysLeft - aDaysLeft; // Most recently closed first
    }
    
    return 0;
  });

  const activeAwards = sortedAwards.filter(award => 
    award.isActive && !awardsUtils.isDeadlinePassed(award.deadline)
  );
  const expiredAwards = sortedAwards.filter(award => 
    !award.isActive || awardsUtils.isDeadlinePassed(award.deadline)
  );

  // Count active nominations for user guidance
  const activeCount = activeAwards.length;

  const categoryId = `category-${category.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <section 
      id={categoryId}
      className={`transform transition-all duration-700 scroll-mt-24 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              {awardsUtils.formatCategory(category as Award['category'])}
            </h2>
            <div className="w-24 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Category status indicator */}
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${activeCount > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                {activeCount > 0 
                  ? `${activeCount} active nomination${activeCount !== 1 ? 's' : ''}` 
                  : 'No active nominations'
                }
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              {sortedAwards.length} total award{sortedAwards.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
      
      {/* Active Awards Section */}
      {activeAwards.length > 0 && (
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {activeAwards.map((award, index) => (
              <AwardCard 
                key={award.id} 
                award={award} 
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Expired Awards Section */}
      {expiredAwards.length > 0 && (
        <div className="mb-16">
          {/* Separator for expired awards */}
          {activeAwards.length > 0 && (
            <div className="flex items-center mb-8">
              <hr className="flex-1 border-gray-300" />
              <div className="px-4 py-2 bg-gray-100 rounded-full">
                <span className="text-sm font-medium text-gray-600 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Past Deadline
                </span>
              </div>
              <hr className="flex-1 border-gray-300" />
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {expiredAwards.map((award, index) => (
              <AwardCard 
                key={award.id} 
                award={award} 
                index={activeAwards.length + index}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default function EnhancedAwardsGrid({ awardsByCategory }: EnhancedAwardsGridProps) {
  return (
    <div className="space-y-16">
      {Object.entries(awardsByCategory).map(([category, awards], categoryIndex) => (
        <CategorySection
          key={category}
          category={category}
          awards={awards}
          categoryIndex={categoryIndex}
        />
      ))}
    </div>
  );
}