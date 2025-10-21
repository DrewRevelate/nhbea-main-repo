import type { Award } from '@/types/dataModels';
import type { AwardWithStatus, AwardStatus, AwardPriority, AwardCategory } from '../types/awards';

/**
 * Calculate comprehensive award status with urgency levels
 */
export const calculateAwardStatus = (award: Award): AwardWithStatus => {
  const now = new Date();
  const deadline = new Date(award.deadline);
  const daysUntilDeadline = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  let status: AwardStatus;
  let urgencyLevel: number;
  
  if (!award.isActive) {
    status = 'suspended';
    urgencyLevel = 0;
  } else if (daysUntilDeadline < 0) {
    status = 'expired';
    urgencyLevel = 0;
  } else if (daysUntilDeadline <= 3) {
    status = 'urgent';
    urgencyLevel = 5;
  } else if (daysUntilDeadline <= 7) {
    status = 'urgent';
    urgencyLevel = 4;
  } else if (daysUntilDeadline <= 14) {
    status = 'warning';
    urgencyLevel = 3;
  } else if (daysUntilDeadline <= 30) {
    status = 'warning';
    urgencyLevel = 2;
  } else {
    status = 'active';
    urgencyLevel = 1;
  }
  
  return {
    ...award,
    status,
    daysUntilDeadline,
    canNominate: award.isActive && daysUntilDeadline > 0,
    urgencyLevel
  };
};

/**
 * Sort awards by status priority and urgency
 */
export const sortAwardsByStatus = (awards: AwardWithStatus[]): AwardWithStatus[] => {
  return [...awards].sort((a, b) => {
    // First sort by nomination eligibility
    if (a.canNominate && !b.canNominate) return -1;
    if (!a.canNominate && b.canNominate) return 1;
    
    // Among nominatable awards, sort by urgency
    if (a.canNominate && b.canNominate) {
      if (a.urgencyLevel !== b.urgencyLevel) {
        return b.urgencyLevel - a.urgencyLevel; // Higher urgency first
      }
      return a.daysUntilDeadline - b.daysUntilDeadline; // Sooner deadline first
    }
    
    // Among non-nominatable awards, sort by how recently they expired
    if (!a.canNominate && !b.canNominate) {
      return b.daysUntilDeadline - a.daysUntilDeadline; // Most recently expired first
    }
    
    return 0;
  });
};

/**
 * Group awards by category with status information
 */
export const groupAwardsByCategory = (awards: AwardWithStatus[]): Record<string, AwardWithStatus[]> => {
  const grouped = awards.reduce((acc, award) => {
    if (!acc[award.category]) {
      acc[award.category] = [];
    }
    acc[award.category].push(award);
    return acc;
  }, {} as Record<string, AwardWithStatus[]>);
  
  // Sort awards within each category
  Object.keys(grouped).forEach(category => {
    grouped[category] = sortAwardsByStatus(grouped[category]);
  });
  
  return grouped;
};

/**
 * Format award category for display
 */
export const formatCategory = (category: string): string => {
  switch (category) {
    case 'Excellence':
      return 'Excellence in Education';
    case 'Lifetime':
      return 'Lifetime Achievement';
    case 'Innovation':
      return 'Innovation in Teaching';
    case 'Service':
      return 'Service to Community';
    default:
      return category;
  }
};

/**
 * Sort awards by priority and status (alias for sortAwardsByStatus)
 */
export const sortAwardsByPriority = sortAwardsByStatus;

/**
 * Get status badge configuration
 */
export const getStatusBadgeConfig = (status: AwardStatus, daysRemaining?: number) => {
  switch (status) {
    case 'urgent':
      return {
        bg: 'linear-gradient(135deg, #ea580c, #dc2626)',
        text: '#ffffff',
        label: daysRemaining ? `${daysRemaining} days left!` : 'Urgent',
        shouldAnimate: true,
        icon: '!'
      };
    case 'warning':
      return {
        bg: 'linear-gradient(135deg, #f59e0b, #d97706)',
        text: '#ffffff',
        label: daysRemaining ? `⏰ ${daysRemaining} days left` : 'Warning',
        shouldAnimate: false,
        icon: '⏰'
      };
    case 'active':
      return {
        bg: 'linear-gradient(135deg, #10b981, #059669)',
        text: '#ffffff',
        label: 'Active',
        shouldAnimate: false,
        icon: '●'
      };
    case 'expired':
      return {
        bg: '#e5e7eb',
        text: '#6b7280',
        label: 'Expired',
        shouldAnimate: false,
        icon: '○'
      };
    case 'suspended':
      return {
        bg: '#f3f4f6',
        text: '#6b7280',
        label: 'Suspended',
        shouldAnimate: false,
        icon: '⏸️'
      };
    default:
      return {
        bg: '#f3f4f6',
        text: '#6b7280',
        label: 'Unknown',
        shouldAnimate: false,
        icon: '❓'
      };
  }
};


/**
 * Format deadline for display
 */
export const formatDeadline = (deadline: Date, format: 'full' | 'compact' | 'minimal'): string => {
  const now = new Date();
  const daysUntilDeadline = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (format === 'minimal') {
    if (daysUntilDeadline < 0) return 'Expired';
    if (daysUntilDeadline === 0) return 'Today';
    if (daysUntilDeadline === 1) return 'Tomorrow';
    if (daysUntilDeadline < 7) return `${daysUntilDeadline}d`;
    return deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  if (format === 'compact') {
    if (daysUntilDeadline < 0) return 'Expired';
    if (daysUntilDeadline === 0) return 'Due Today';
    if (daysUntilDeadline === 1) return 'Due Tomorrow';
    if (daysUntilDeadline < 7) return `Due in ${daysUntilDeadline} days`;
    return `Due ${deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }

  // format === 'full'
  if (daysUntilDeadline < 0) {
    return `Expired on ${deadline.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`;
  }

  if (daysUntilDeadline === 0) return 'Due Today';
  if (daysUntilDeadline === 1) return 'Due Tomorrow';

  return `Due ${deadline.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`;
};