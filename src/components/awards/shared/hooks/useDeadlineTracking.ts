import { useState, useEffect, useCallback } from 'react';
import type { AwardStatus, UseDeadlineTrackingReturn } from '../types/awards';
import { formatDeadline } from '../utils/awardHelpers';

/**
 * Custom hook for real-time deadline tracking and status updates
 */
export const useDeadlineTracking = (
  deadline: Date,
  updateInterval: number = 60000 // 1 minute by default
): UseDeadlineTrackingReturn => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time at specified interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  // Calculate days until deadline
  const daysUntilDeadline = Math.ceil(
    (deadline.getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Determine urgency level (0-5 scale)
  const urgencyLevel = (() => {
    if (daysUntilDeadline < 0) return 0;
    if (daysUntilDeadline <= 1) return 5;
    if (daysUntilDeadline <= 3) return 4;
    if (daysUntilDeadline <= 7) return 3;
    if (daysUntilDeadline <= 14) return 2;
    if (daysUntilDeadline <= 30) return 1;
    return 0;
  })();

  // Determine status
  const status: AwardStatus = (() => {
    if (daysUntilDeadline < 0) return 'expired';
    if (daysUntilDeadline <= 7) return 'urgent';
    if (daysUntilDeadline <= 30) return 'warning';
    return 'active';
  })();

  // Format deadline for display
  const formattedDeadline = formatDeadline(deadline, 'full');

  // Check if expired
  const isExpired = daysUntilDeadline < 0;

  return {
    daysUntilDeadline,
    urgencyLevel,
    status,
    formattedDeadline,
    isExpired,
    updateInterval
  };
};