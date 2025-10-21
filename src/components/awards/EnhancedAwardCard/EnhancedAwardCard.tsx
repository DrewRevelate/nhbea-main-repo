'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { EnhancedAwardCardProps } from '../shared/types/awards';
import { AwardStatusBadge } from '../AwardStatusBadge';
import { DeadlineCountdown } from '../DeadlineCountdown';

export const EnhancedAwardCard: React.FC<EnhancedAwardCardProps> = ({
  award,
  onNominate,
  onViewDetails,
  isExpanded = false,
  animationDelay = 0,
  index
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState(isExpanded);
  const [isHovered, setIsHovered] = useState(false);

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);
    
    return () => clearTimeout(timer);
  }, [animationDelay]);

  // Determine if description should be expandable
  const shouldShowExpand = award.description.length > 150;
  const displayDescription = expanded || !shouldShowExpand 
    ? award.description 
    : `${award.description.substring(0, 150)}...`;

  // Get card styling based on status
  const getCardStyling = () => {
    const baseClasses = `
      group relative rounded-2xl border p-6 transition-all duration-300 ease-out
      transform hover:scale-[1.02] hover:-translate-y-1 cursor-pointer
      shadow-md hover:shadow-lg bg-white
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
    `;

    if (!award.canNominate) {
      return `${baseClasses} border-gray-200 opacity-70`;
    }

    switch (award.status) {
      case 'urgent':
        return `${baseClasses} border-red-200 shadow-red-100`;
      case 'warning':
        return `${baseClasses} border-yellow-200 shadow-yellow-100`;
      default:
        return `${baseClasses} border-gray-200`;
    }
  };

  // Get icon styling based on status
  const getIconStyling = () => {
    const baseClasses = `
      relative overflow-hidden shadow-sm border
      group-hover:scale-105 transition-all duration-300
    `;
    
    if (!award.canNominate) {
      return `${baseClasses} bg-gray-100 border-gray-200 text-gray-500`;
    }

    switch (award.status) {
      case 'urgent':
        return `${baseClasses} bg-red-50 border-red-200 text-red-600`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-200 text-yellow-600`;
      default:
        return `${baseClasses} bg-blue-50 border-blue-200 text-blue-600`;
    }
  };

  return (
    <article 
      className={getCardStyling()}
      style={{
        animationDelay: `${animationDelay}ms`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-labelledby={`award-title-${award.id}`}
    >
      {/* Urgent indicator bar for critical deadlines */}
      {award.status === 'urgent' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-t-2xl" />
      )}

      {/* Header Section */}
      <header className="mb-6">
        <div className="flex justify-between items-start mb-4">
          {/* Status Badge */}
          <AwardStatusBadge 
            status={award.status}
            daysRemaining={award.daysUntilDeadline}
            isAnimated={award.status === 'urgent'}
            size="md"
          />
          
          {/* Award Icon */}
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center shadow-lg
            transition-transform duration-300 group-hover:scale-110
            ${getIconStyling()}
          `}>
            <svg 
              className="w-6 h-6" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
        
        {/* Award Title */}
        <h3 
          id={`award-title-${award.id}`}
          className={`
            text-xl font-bold leading-tight mb-3 transition-all duration-300
            ${award.canNominate ? 'text-gray-900' : 'text-gray-500'}
          `}
        >
          {award.name}
        </h3>

        {/* Deadline Information */}
        <DeadlineCountdown 
          deadline={award.deadline}
          format="compact"
          urgencyThreshold={7}
        />
      </header>

      {/* Content Section */}
      <div className="mb-6 flex-1">
        <p className={`
          leading-relaxed mb-4 transition-all duration-300 text-base
          ${award.canNominate ? 'text-gray-900' : 'text-gray-500'}
        `}>
          {displayDescription}
        </p>
        
        {/* Expand/Collapse button */}
        {shouldShowExpand && (
          <button
            onClick={() => setExpanded(!expanded)}
            className={`
              text-sm font-medium underline hover:no-underline transition-colors duration-200
              ${award.canNominate ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400'}
            `}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Eligibility Section */}
      <div className="mb-6">
        <h4 className={`
          font-semibold mb-3 flex items-center text-sm uppercase tracking-wide
          ${award.canNominate ? 'text-gray-800' : 'text-gray-500'}
        `}>
          <svg 
            className={`w-4 h-4 mr-2 ${award.canNominate ? 'text-blue-600' : 'text-gray-400'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          Eligibility
        </h4>
        <div className={`
          rounded-lg p-3 border-l-3 transition-colors duration-300
          ${award.canNominate 
            ? 'bg-gray-50 border-gray-400' 
            : 'bg-gray-50 border-gray-300'
          }
        `}>
          <p className={`
            text-sm leading-relaxed
            ${award.canNominate ? 'text-gray-700' : 'text-gray-500'}
          `}>
            {award.eligibility}
          </p>
        </div>
      </div>

      {/* Motivational Message for Active Awards */}
      {award.canNominate && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 font-medium text-center">
            This nomination could be the recognition they deserve!
          </p>
        </div>
      )}

      {/* Action Section */}
      <footer className="mt-auto">
        {award.canNominate ? (
          <div className="flex gap-3">
            <Link
              href={`/awards/nominate?award=${award.id}`}
              className="
                flex-1 group/btn relative px-8 py-5 
                bg-gradient-to-r from-orange-500 via-red-500 to-red-600 
                text-white font-bold text-lg rounded-2xl shadow-xl 
                hover:shadow-2xl hover:shadow-red-300/50 transition-all duration-300 
                hover:scale-105 hover:-translate-y-1
                focus:outline-none focus:ring-4 focus:ring-red-300/50 
                overflow-hidden text-center border border-red-400/50
                before:absolute before:inset-0 before:bg-gradient-to-r 
                before:from-white/10 before:to-transparent before:opacity-0 
                before:hover:opacity-100 before:transition-opacity before:duration-300
              "
              onClick={() => onNominate(award.id)}
            >
              <span className="relative z-10 flex items-center justify-center">
                <svg 
                  className="w-5 h-5 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                  />
                </svg>
                Nominate Now
                <span className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </span>
              
              {/* Shimmer effect */}
              <div className="
                absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                opacity-0 group-hover/btn:opacity-100 group-hover/btn:animate-[shimmer_0.8s_ease-out] 
                transition-opacity duration-300
              " />
              
              {/* Hover background */}
              <div className="
                absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl 
                opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300
              " />
            </Link>
            
            <button
              onClick={() => onViewDetails(award.id)}
              className="
                px-5 py-5 bg-white/90 backdrop-blur-sm text-gray-700 font-semibold rounded-2xl 
                border-2 border-gray-300/60 shadow-lg hover:bg-white hover:border-gray-400/80 
                transition-all duration-300 hover:scale-105 hover:-translate-y-1
                focus:outline-none focus:ring-4 focus:ring-gray-300/50
                hover:shadow-xl hover:shadow-gray-200/50
                group/details relative overflow-hidden
                before:absolute before:inset-0 before:bg-gradient-to-r 
                before:from-gray-100/50 before:to-transparent before:opacity-0 
                before:hover:opacity-100 before:transition-opacity before:duration-300
              "
              aria-label={`View details for ${award.name}`}
            >
              <svg 
                className="w-5 h-5 relative z-10 group-hover/details:scale-110 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="
            w-full inline-flex items-center justify-center px-6 py-4 
            bg-gray-100 text-gray-500 font-semibold rounded-xl 
            cursor-not-allowed border-2 border-gray-200
          ">
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            {!award.isActive ? 'Award Inactive' : 'Nominations Closed'}
          </div>
        )}
      </footer>
    </article>
  );
};