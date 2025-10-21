import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  variant?: 'auto' | 'equal' | 'masonry';
  breakpoints?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  'data-testid'?: string;
}

export function ResponsiveGrid({
  children,
  variant = 'auto',
  breakpoints = { mobile: 1, tablet: 2, desktop: 3, wide: 4 },
  gap = 'md',
  className = '',
  'data-testid': testId,
  ...props
}: ResponsiveGridProps) {
  const gaps = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  // Generate responsive grid classes
  const gridClasses = [
    `grid-cols-${breakpoints.mobile || 1}`,
    breakpoints.tablet ? `md:grid-cols-${breakpoints.tablet}` : '',
    breakpoints.desktop ? `lg:grid-cols-${breakpoints.desktop}` : '',
    breakpoints.wide ? `xl:grid-cols-${breakpoints.wide}` : ''
  ].filter(Boolean).join(' ');

  const baseClasses = `grid ${gridClasses} ${gaps[gap]} ${className}`;

  return (
    <div className={baseClasses} data-testid={testId} {...props}>
      {children}
    </div>
  );
}

// Typography scale system
export const responsiveTypography = {
  heading1: 'text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold',
  heading2: 'text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold',
  heading3: 'text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold',
  heading4: 'text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold',
  body: 'text-base md:text-lg lg:text-xl',
  small: 'text-sm md:text-base lg:text-lg',
  caption: 'text-xs md:text-sm lg:text-base'
};

// Container system
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  'data-testid'?: string;
}

export function Container({
  children,
  size = 'lg',
  padding = 'md',
  className = '',
  'data-testid': testId,
  ...props
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddings = {
    sm: 'px-4',
    md: 'px-6 lg:px-8',
    lg: 'px-8 lg:px-12',
    xl: 'px-12 lg:px-16'
  };

  const containerClasses = `${sizes[size]} mx-auto ${paddings[padding]} ${className}`;

  return (
    <div className={containerClasses} data-testid={testId} {...props}>
      {children}
    </div>
  );
}

// Breakpoint utilities
export const breakpoints = {
  mobile: {
    min: '320px',
    max: '767px',
    container: 'max-w-sm mx-auto px-4',
    grid: 'grid-cols-1',
    spacing: 'space-y-8'
  },
  tablet: {
    min: '768px',
    max: '1023px',
    container: 'max-w-4xl mx-auto px-6',
    grid: 'grid-cols-2',
    spacing: 'space-y-12'
  },
  desktop: {
    min: '1024px',
    max: '1439px',
    container: 'max-w-6xl mx-auto px-8',
    grid: 'grid-cols-3',
    spacing: 'space-y-16'
  },
  wide: {
    min: '1440px',
    container: 'max-w-7xl mx-auto px-8',
    grid: 'grid-cols-4',
    spacing: 'space-y-20'
  }
};

export default ResponsiveGrid;