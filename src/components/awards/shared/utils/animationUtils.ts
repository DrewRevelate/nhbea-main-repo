/**
 * Animation utility functions for enhanced award components
 */

export const animationUtils = {
  /**
   * Calculate staggered animation delay
   */
  staggerDelay: (index: number, baseDelay: number = 100): number => {
    return index * baseDelay;
  },

  /**
   * Predefined easing functions
   */
  easing: {
    easeOutCubic: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeInOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
    easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)'
  },

  /**
   * Animation duration constants
   */
  duration: {
    fast: '0.2s',
    normal: '0.3s',
    slow: '0.6s',
    slower: '0.8s'
  },

  /**
   * Create CSS keyframes dynamically
   */
  createKeyframes: (name: string, frames: Record<string, Record<string, string>>): string => {
    let keyframeCSS = `@keyframes ${name} {\n`;
    
    Object.entries(frames).forEach(([percentage, styles]) => {
      keyframeCSS += `  ${percentage} {\n`;
      Object.entries(styles).forEach(([property, value]) => {
        keyframeCSS += `    ${property}: ${value};\n`;
      });
      keyframeCSS += `  }\n`;
    });
    
    keyframeCSS += '}';
    return keyframeCSS;
  },

  /**
   * Predefined animation classes
   */
  classes: {
    cardEntrance: 'animate-[cardEntrance_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]',
    cardHover: 'transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
    badgePulse: 'animate-[urgentPulse_2s_infinite]',
    slideUp: 'animate-[slideUp_0.5s_ease-out_forwards]',
    fadeIn: 'animate-[fadeIn_0.4s_ease-out_forwards]'
  }
};

/**
 * Animation CSS definitions to be injected into global styles
 */
export const animationCSS = `
/* Card entrance animation */
@keyframes cardEntrance {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Urgent pulse animation */
@keyframes urgentPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(220, 38, 38, 0);
  }
}

/* Slide up animation */
@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fade in animation */
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* Shimmer effect for buttons */
@keyframes shimmer {
  0% {
    transform: translateX(-100%) skewX(-12deg);
  }
  100% {
    transform: translateX(200%) skewX(-12deg);
  }
}

/* Float animation for decorative elements */
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-10px) translateX(5px);
  }
  50% {
    transform: translateY(-5px) translateX(-5px);
  }
  75% {
    transform: translateY(-8px) translateX(3px);
  }
}

/* Scale bounce animation */
@keyframes scaleBounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
`;

/**
 * Hook for managing animation states
 */
export interface AnimationState {
  isVisible: boolean;
  isAnimating: boolean;
  animationDelay: number;
}

/**
 * Calculate optimal animation delays for staggered entrance
 */
export const calculateStaggeredDelays = (
  totalItems: number,
  maxDelay: number = 800,
  baseDelay: number = 100
): number[] => {
  const delays: number[] = [];
  const increment = Math.min(baseDelay, maxDelay / totalItems);
  
  for (let i = 0; i < totalItems; i++) {
    delays.push(Math.min(i * increment, maxDelay));
  }
  
  return delays;
};

/**
 * Create intersection observer for entrance animations
 */
export const createEntranceObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    ...options
  };
  
  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, defaultOptions);
};

/**
 * Animation timing functions for different use cases
 */
export const animationTimings = {
  microInteraction: '0.15s ease-out',
  standardTransition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  emphasisTransition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  layoutShift: '0.5s cubic-bezier(0.16, 1, 0.3, 1)',
  pageTransition: '0.8s cubic-bezier(0.16, 1, 0.3, 1)'
};

/**
 * Prefers-reduced-motion utilities
 */
export const respectsReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const getAnimationDuration = (baseDuration: string): string => {
  return respectsReducedMotion() ? '0.01s' : baseDuration;
};

export const shouldAnimate = (): boolean => {
  return !respectsReducedMotion();
};