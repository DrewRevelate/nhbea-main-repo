import { useState, useCallback, useRef } from 'react';
import type { AwardStatus, UseAwardAnimationsReturn } from '../types/awards';
import { shouldAnimate, animationTimings } from '../utils/animationUtils';

/**
 * Custom hook for managing award component animations
 */
export const useAwardAnimations = (): UseAwardAnimationsReturn => {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeouts = useRef<NodeJS.Timeout[]>([]);

  // Clean up timeouts on unmount
  const clearTimeouts = useCallback(() => {
    animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
    animationTimeouts.current = [];
  }, []);

  // Animate entrance of multiple elements with stagger
  const animateEntrance = useCallback((elements: HTMLElement[]) => {
    if (!shouldAnimate()) return;

    setIsAnimating(true);
    clearTimeouts();

    elements.forEach((element, index) => {
      const delay = index * 100; // 100ms stagger
      
      const timeout = setTimeout(() => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px) scale(0.95)';
        element.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1)`;
        
        // Trigger animation
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0) scale(1)';
        });
      }, delay);
      
      animationTimeouts.current.push(timeout);
    });

    // Mark animation as complete
    const completionTimeout = setTimeout(() => {
      setIsAnimating(false);
    }, elements.length * 100 + 600);
    
    animationTimeouts.current.push(completionTimeout);
  }, [clearTimeouts]);

  // Animate exit of multiple elements
  const animateExit = useCallback((elements: HTMLElement[]) => {
    if (!shouldAnimate()) {
      elements.forEach(element => {
        element.style.display = 'none';
      });
      return;
    }

    setIsAnimating(true);
    clearTimeouts();

    elements.forEach((element, index) => {
      const delay = index * 50; // Faster exit stagger
      
      const timeout = setTimeout(() => {
        element.style.transition = `all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`;
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px) scale(0.95)';
        
        // Hide element after animation
        setTimeout(() => {
          element.style.display = 'none';
        }, 300);
      }, delay);
      
      animationTimeouts.current.push(timeout);
    });

    // Mark animation as complete
    const completionTimeout = setTimeout(() => {
      setIsAnimating(false);
    }, elements.length * 50 + 300);
    
    animationTimeouts.current.push(completionTimeout);
  }, [clearTimeouts]);

  // Animate status change of a single element
  const animateStatusChange = useCallback((element: HTMLElement, newStatus: AwardStatus) => {
    if (!shouldAnimate()) return;

    setIsAnimating(true);

    // Get status-specific animation
    const getStatusAnimation = (status: AwardStatus) => {
      switch (status) {
        case 'urgent':
          return {
            background: 'linear-gradient(135deg, #ea580c, #dc2626)',
            boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.4)',
            animation: 'urgentPulse 2s infinite'
          };
        case 'warning':
          return {
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
            animation: 'none'
          };
        case 'active':
          return {
            background: 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.2)',
            animation: 'none'
          };
        case 'expired':
          return {
            background: '#e5e7eb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            animation: 'none'
          };
        default:
          return {
            background: '#f3f4f6',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            animation: 'none'
          };
      }
    };

    // Apply smooth transition
    element.style.transition = animationTimings.emphasisTransition;
    
    // Apply new status styles
    const statusStyles = getStatusAnimation(newStatus);
    Object.assign(element.style, statusStyles);

    // Mark animation as complete
    const timeout = setTimeout(() => {
      setIsAnimating(false);
    }, 400);
    
    animationTimeouts.current.push(timeout);
  }, []);

  return {
    animateEntrance,
    animateExit,
    animateStatusChange,
    isAnimating
  };
};