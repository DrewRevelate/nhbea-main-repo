interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'page' | 'section' | 'inline';
  message?: string;
}

export function LoadingSpinner({
  size = 'md',
  variant = 'section',
  message
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variants = {
    page: 'min-h-screen flex items-center justify-center',
    section: 'py-12 flex items-center justify-center',
    inline: 'flex items-center justify-center py-4'
  };

  return (
    <div className={variants[variant]} role="status" aria-live="polite">
      <div className="text-center">
        <div className={`${sizes[size]} animate-spin rounded-full border-b-2 border-[var(--nhbea-royal-blue)] mx-auto`}></div>
        {message && (
          <p className="mt-4 text-gray-600 font-medium" aria-label={message}>
            {message}
          </p>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

interface LoadingSkeletonProps {
  variant: 'hero' | 'content' | 'grid' | 'list';
  count?: number;
}

export function LoadingSkeleton({ variant, count = 1 }: LoadingSkeletonProps) {
  const skeletons = {
    hero: (
      <div className="animate-pulse py-20" role="status" aria-label="Loading hero content">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="flex space-x-4">
            <div className="h-12 bg-gray-200 rounded w-32"></div>
            <div className="h-12 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    ),
    
    content: (
      <div className="animate-pulse py-8" role="status" aria-label="Loading content">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    ),
    
    grid: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="status" aria-label="Loading grid content">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    ),
    
    list: (
      <div className="space-y-4" role="status" aria-label="Loading list content">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  };

  return <div>{skeletons[variant]}</div>;
}