'use client';

import React, { useEffect, useState } from 'react';
import type { DeadlineCountdownProps } from '../shared/types/awards';
import { useDeadlineTracking } from '../shared/hooks/useDeadlineTracking';
import { formatDeadline } from '../shared/utils/awardHelpers';

export const DeadlineCountdown: React.FC<DeadlineCountdownProps> = ({
  deadline,
  format = 'compact',
  urgencyThreshold = 7,
  onUrgentStateChange
}) => {
  const { daysUntilDeadline, urgencyLevel, status, isExpired } = useDeadlineTracking(deadline);
  const [isUrgent, setIsUrgent] = useState(false);

  // Track urgent state changes
  useEffect(() => {
    const newUrgentState = daysUntilDeadline <= urgencyThreshold && !isExpired;
    if (newUrgentState !== isUrgent) {
      setIsUrgent(newUrgentState);
      onUrgentStateChange?.(newUrgentState);
    }
  }, [daysUntilDeadline, urgencyThreshold, isExpired, isUrgent, onUrgentStateChange]);

  // Format the display based on format prop
  const getDisplayText = () => {
    if (format === 'minimal') {
      if (isExpired) return 'Expired';
      if (daysUntilDeadline === 0) return 'Today';
      if (daysUntilDeadline === 1) return 'Tomorrow';
      if (daysUntilDeadline < 7) return `${daysUntilDeadline}d`;
      return deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    return formatDeadline(deadline, format);
  };

  // Get color scheme based on urgency
  const getColorScheme = () => {
    if (isExpired) {
      return {
        textColor: 'text-gray-500',
        bgColor: 'bg-gray-100',
        iconColor: 'text-gray-400'
      };
    }
    
    if (urgencyLevel >= 4) {
      return {
        textColor: 'text-red-700',
        bgColor: 'bg-red-50',
        iconColor: 'text-red-500'
      };
    }
    
    if (urgencyLevel >= 2) {
      return {
        textColor: 'text-orange-700',
        bgColor: 'bg-orange-50',
        iconColor: 'text-orange-500'
      };
    }
    
    return {
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    };
  };

  const colorScheme = getColorScheme();
  const displayText = getDisplayText();

  return (
    <div 
      className={`
        inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium
        ${colorScheme.bgColor} ${colorScheme.textColor}
        ${isUrgent ? 'animate-pulse' : ''}
        transition-all duration-300
      `}
      role="timer"
      aria-label={`Deadline: ${displayText}`}
      title={`Full deadline: ${deadline.toLocaleString()}`}
    >
      {/* Icon */}
      <svg 
        className={`w-4 h-4 mr-2 ${colorScheme.iconColor}`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {isExpired ? (
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        ) : (
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        )}
      </svg>
      
      {/* Countdown text */}
      <span className="font-mono tabular-nums">
        {displayText}
      </span>
      
      {/* Urgency indicator */}
      {isUrgent && !isExpired && (
        <span className="ml-1 text-red-500 animate-bounce" aria-hidden="true">
          ⚠️
        </span>
      )}
    </div>
  );
};