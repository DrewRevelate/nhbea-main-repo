import type { Award } from '@/types/dataModels';

// Extended award types with enhanced status information
export type AwardPriority = 'critical' | 'high' | 'medium' | 'low';
export type AwardStatus = 'active' | 'urgent' | 'warning' | 'expired' | 'suspended';

export interface AwardCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface AwardWithStatus extends Award {
  status: AwardStatus;
  daysUntilDeadline: number;
  canNominate: boolean;
  urgencyLevel: number; // 0-5 scale
}


export interface CategoryStats {
  total: number;
  active: number;
  urgent: number;
  expired: number;
}

// Component prop interfaces

export interface EnhancedAwardCardProps {
  award: AwardWithStatus;
  onNominate: (awardId: string) => void;
  onViewDetails: (awardId: string) => void;
  isExpanded?: boolean;
  animationDelay?: number;
  index: number;
}

export interface AwardStatusBadgeProps {
  status: AwardStatus;
  daysRemaining?: number;
  isAnimated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface DeadlineCountdownProps {
  deadline: Date;
  format: 'full' | 'compact' | 'minimal';
  urgencyThreshold?: number;
  onUrgentStateChange?: (isUrgent: boolean) => void;
}

export interface CategoryNavigationTabsProps {
  categories: AwardCategory[];
  activeCategory: string;
  categoryStats: Record<string, CategoryStats>;
  onCategoryChange: (category: string) => void;
  stickyOffset?: number;
}

// Animation and interaction interfaces
export interface AwardCardAnimationProps {
  index: number;
  isVisible: boolean;
  animationDelay: number;
  animationType: 'entrance' | 'exit' | 'update';
}

export interface ExpandableContentProps {
  content: string;
  maxLength: number;
  expandText?: string;
  collapseText?: string;
}

// Hook return type interfaces

export interface UseDeadlineTrackingReturn {
  daysUntilDeadline: number;
  urgencyLevel: number;
  status: AwardStatus;
  formattedDeadline: string;
  isExpired: boolean;
  updateInterval: number;
}

export interface UseAwardAnimationsReturn {
  animateEntrance: (elements: HTMLElement[]) => void;
  animateExit: (elements: HTMLElement[]) => void;
  animateStatusChange: (element: HTMLElement, newStatus: AwardStatus) => void;
  isAnimating: boolean;
}

// Accessibility interfaces
export interface AriaProps {
  'aria-label': string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-live'?: 'polite' | 'assertive';
  role?: string;
}

export interface KeyboardNavigationProps {
  focusableElements: HTMLElement[];
  initialFocus?: number;
  onEscape?: () => void;
  onEnter?: (element: HTMLElement) => void;
}