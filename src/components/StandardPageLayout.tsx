import React, { Suspense } from 'react';
import { StandardErrorBoundary } from './StandardErrorBoundary';
import { LoadingSpinner } from './LoadingSpinner';

interface StandardPageLayoutProps {
  children: React.ReactNode;
  hero?: {
    component: React.ComponentType<any>;
    props?: any;
    variant?: 'default' | 'minimal' | 'conference' | 'form';
  };
  main?: {
    id?: string;
    className?: string;
    focusable?: boolean;
  };
  meta?: {
    title: string;
    description: string;
    openGraph?: boolean;
    twitterCard?: boolean;
    structuredData?: any;
  };
  loading?: {
    enabled?: boolean;
    component?: React.ComponentType;
  };
  error?: {
    boundary?: boolean;
    fallback?: React.ComponentType<{error: string}>;
  };
  className?: string;
}

export function StandardPageLayout({
  children,
  hero,
  main = { id: 'main-content', focusable: true },
  meta,
  loading = { enabled: true },
  error = { boundary: true },
  className = 'min-h-screen'
}: StandardPageLayoutProps) {
  const LoadingComponent = loading.component || LoadingSpinner;
  
  return (
    <div className={className}>
      {/* Skip to content link for accessibility */}
      <a 
        href={`#${main.id || 'main-content'}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[var(--nhbea-royal-blue)] text-white font-semibold rounded-md transition-all duration-300"
      >
        Skip to main content
      </a>

      {/* Hero Section */}
      {hero && (
        <StandardErrorBoundary fallback={error.fallback}>
          {loading.enabled ? (
            <Suspense fallback={<LoadingComponent variant="section" />}>
              <hero.component {...hero.props} />
            </Suspense>
          ) : (
            <hero.component {...hero.props} />
          )}
        </StandardErrorBoundary>
      )}
      
      {/* Main Content */}
      <main 
        id={main.id || 'main-content'}
        className={`focus:outline-none ${main.className || ''}`}
        tabIndex={main.focusable ? -1 : undefined}
        role="main"
        aria-label="Main content"
      >
        {error.boundary ? (
          <StandardErrorBoundary fallback={error.fallback}>
            {loading.enabled ? (
              <Suspense fallback={<LoadingComponent variant="section" />}>
                {children}
              </Suspense>
            ) : (
              children
            )}
          </StandardErrorBoundary>
        ) : (
          <>
            {loading.enabled ? (
              <Suspense fallback={<LoadingComponent variant="section" />}>
                {children}
              </Suspense>
            ) : (
              children
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Export a higher-order component for easier page layout wrapping
interface WithStandardLayoutProps {
  hero?: StandardPageLayoutProps['hero'];
  main?: StandardPageLayoutProps['main'];
  meta?: StandardPageLayoutProps['meta'];
  loading?: StandardPageLayoutProps['loading'];
  error?: StandardPageLayoutProps['error'];
  className?: string;
}

export function withStandardLayout<P extends object>(
  Component: React.ComponentType<P>,
  layoutProps?: WithStandardLayoutProps
) {
  return function WrappedComponent(props: P) {
    return (
      <StandardPageLayout {...layoutProps}>
        <Component {...props} />
      </StandardPageLayout>
    );
  };
}

export default StandardPageLayout;