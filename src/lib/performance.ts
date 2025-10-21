// Performance monitoring and Core Web Vitals tracking
export interface WebVitalMetric {
  id: string;
  name: string;
  value: number;
  delta: number;
  entries: PerformanceEntry[];
}

// Core Web Vitals tracking
export function reportWebVitals(metric: WebVitalMetric) {
  if (typeof window === 'undefined') return;
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }
  
  // Here you could send to analytics service like Google Analytics
  // gtag('event', metric.name, {
  //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
  //   event_label: metric.id,
  //   non_interaction: true,
  // });
}

// Resource hints for better performance
export function addResourceHints() {
  if (typeof window === 'undefined') return;
  
  const head = document.head;
  
  // DNS prefetch for external domains
  const dnsPrefetchDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'firebasestorage.googleapis.com',
  ];
  
  dnsPrefetchDomains.forEach(domain => {
    if (!document.querySelector(`link[href="//${domain}"]`)) {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      head.appendChild(link);
    }
  });
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;
  
  // Preload critical CSS
  const criticalCss = document.querySelector('style[data-href*="globals.css"]');
  if (criticalCss) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = '/globals.css';
    document.head.appendChild(link);
  }
}

// Optimize animations for performance
export function optimizeAnimations() {
  if (typeof window === 'undefined') return;
  
  // Reduce animations for users who prefer reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    document.documentElement.style.setProperty('--transition-duration', '0.01ms');
  }
}

// Intersection Observer for lazy loading
export function createLazyObserver(callback: IntersectionObserverCallback) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px 0px',
    threshold: 0.1,
  });
}

// Performance monitoring setup
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;
  
  // Add resource hints
  addResourceHints();
  
  // Preload critical resources
  preloadCriticalResources();
  
  // Optimize animations
  optimizeAnimations();
  
  // Monitor largest contentful paint
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Performance entry:', entry);
          }
        });
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      console.warn('Performance observer not supported');
    }
  }
}

// Image loading optimization
export function optimizeImageLoading() {
  if (typeof window === 'undefined') return;
  
  // Add loading="lazy" to images that don't have it
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach((img) => {
    if (img instanceof HTMLImageElement) {
      // Only add lazy loading if image is not above the fold
      const rect = img.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        img.loading = 'lazy';
      }
    }
  });
}

// Bundle size monitoring
export function logBundleSize() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;
  
  // Monitor JavaScript bundle size
  const scripts = document.querySelectorAll('script[src]');
  let totalSize = 0;
  
  scripts.forEach((script) => {
    if (script instanceof HTMLScriptElement && script.src.includes('/_next/')) {
      fetch(script.src, { method: 'HEAD' })
        .then(response => {
          const size = parseInt(response.headers.get('content-length') || '0');
          totalSize += size;
          console.log(`Script: ${script.src.split('/').pop()} - ${(size / 1024).toFixed(2)}KB`);
        })
        .catch(() => {});
    }
  });
  
  setTimeout(() => {
    console.log(`Total estimated JS bundle size: ${(totalSize / 1024).toFixed(2)}KB`);
  }, 1000);
}