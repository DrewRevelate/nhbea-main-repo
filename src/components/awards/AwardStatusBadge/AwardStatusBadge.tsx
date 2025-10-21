'use client';

import React from 'react';
import type { AwardStatusBadgeProps } from '../shared/types/awards';
import { getStatusBadgeConfig } from '../shared/utils/awardHelpers';

export const AwardStatusBadge: React.FC<AwardStatusBadgeProps> = ({
  status,
  daysRemaining,
  isAnimated = true,
  size = 'md'
}) => {
  const config = getStatusBadgeConfig(status, daysRemaining);
  
  // Size configurations
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  // Animation classes
  const animationClass = config.shouldAnimate && isAnimated 
    ? 'animate-[urgentPulse_2s_infinite]' 
    : '';

  return (
    <div 
      className={`
        inline-flex items-center font-semibold rounded-full uppercase tracking-wide
        ${sizeClasses[size]}
        ${animationClass}
        transition-all duration-300 ease-out
      `}
      style={{
        background: config.bg,
        color: config.text,
        boxShadow: config.shouldAnimate 
          ? '0 0 0 0 rgba(220, 38, 38, 0.4)' 
          : '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
      role="status"
      aria-label={`Award status: ${config.label}`}
    >
      <span className="mr-1.5" aria-hidden="true">
        {config.icon}
      </span>
      <span>{config.label}</span>
    </div>
  );
};