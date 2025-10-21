'use client';

import React, { useEffect } from 'react';
import { ConferenceTheme } from '@/types/conference';

interface ConferenceThemeProviderProps {
  theme?: ConferenceTheme;
  children: React.ReactNode;
}

const defaultTheme: ConferenceTheme = {
  primaryColor: '#2563eb', // Conservative royal blue - BRAND COMPLIANT
  secondaryColor: '#1e40af', // Royal blue dark - BRAND COMPLIANT
  accentColor: '#ea580c', // NHBEA brand orange - BRAND COMPLIANT
  backgroundGradient: {
    from: '#f8fafc', // NHBEA brand gray-50 - BRAND COMPLIANT
    to: '#e0f2fe'   // Light blue
  },
  brandingElements: {
    shapingTheFuture: true,
    animatedElements: true
  }
};

export function ConferenceThemeProvider({ theme = defaultTheme, children }: ConferenceThemeProviderProps) {
  useEffect(() => {
    // Apply CSS custom properties for dynamic theming
    const root = document.documentElement;
    
    root.style.setProperty('--conference-primary', theme.primaryColor);
    root.style.setProperty('--conference-secondary', theme.secondaryColor);
    root.style.setProperty('--conference-accent', theme.accentColor);
    
    if (theme.backgroundGradient) {
      root.style.setProperty('--conference-bg-from', theme.backgroundGradient.from);
      root.style.setProperty('--conference-bg-to', theme.backgroundGradient.to);
    }
    
    if (theme.typography?.headingFont) {
      root.style.setProperty('--conference-heading-font', theme.typography.headingFont);
    }
    
    if (theme.typography?.bodyFont) {
      root.style.setProperty('--conference-body-font', theme.typography.bodyFont);
    }
    
    // Inject custom CSS if provided
    if (theme.brandingElements.customCSS) {
      const style = document.createElement('style');
      style.id = 'conference-custom-theme';
      style.textContent = theme.brandingElements.customCSS;
      document.head.appendChild(style);
      
      return () => {
        const existingStyle = document.getElementById('conference-custom-theme');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, [theme]);

  return <>{children}</>;
}

interface ShapingTheFutureHeroProps {
  title: string;
  subtitle: string;
  theme?: ConferenceTheme;
}

export function ShapingTheFutureHero({ title, subtitle, theme = defaultTheme }: ShapingTheFutureHeroProps) {
  const isShapingTheFuture = theme.brandingElements.shapingTheFuture;
  const hasAnimations = theme.brandingElements.animatedElements;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-[500px]">
      {/* Dynamic Background with Shaping the Future theme */}
      <div 
        className="absolute inset-0"
        style={{
          background: theme.backgroundGradient 
            ? `linear-gradient(135deg, ${theme.backgroundGradient.from} 0%, ${theme.backgroundGradient.to} 100%)`
            : `linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)`
        }}
      />
      
      {/* Enhanced Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Animated gradient orbs */}
        <div 
          className={`absolute -top-1/4 -right-1/4 w-96 h-96 rounded-full opacity-20 ${hasAnimations ? 'animate-pulse' : ''}`}
          style={{ 
            background: `radial-gradient(circle, ${theme.primaryColor}40 0%, transparent 70%)`,
            filter: 'blur(40px)'
          }}
        />
        <div 
          className={`absolute -bottom-1/4 -left-1/4 w-80 h-80 rounded-full opacity-20 ${hasAnimations ? 'animate-pulse animation-delay-1000' : ''}`}
          style={{ 
            background: `radial-gradient(circle, ${theme.secondaryColor}40 0%, transparent 70%)`,
            filter: 'blur(40px)'
          }}
        />
        
        {/* Floating innovation particles */}
        {hasAnimations && (
          <>
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-float opacity-40" />
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-float animation-delay-500 opacity-40" />
            <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-blue-300 rounded-full animate-float animation-delay-1000 opacity-30" />
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-indigo-300 rounded-full animate-float animation-delay-1500 opacity-40" />
          </>
        )}
        
        {/* Dynamic grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(${theme.primaryColor}20 1px, transparent 1px), linear-gradient(90deg, ${theme.primaryColor}20 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center py-32 px-4">
        {/* Shaping the Future Badge */}
        {isShapingTheFuture && (
          <div className={`inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-md rounded-full border border-blue-200/50 mb-10 shadow-lg ${hasAnimations ? 'animate-fade-in-up' : ''}`}>
            <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-blue-900 font-bold text-lg tracking-wide">SHAPING THE FUTURE</span>
            <span className="mx-3 text-blue-300">•</span>
            <span className="text-blue-700 font-medium">Professional Excellence</span>
          </div>
        )}
        
        {/* Main Title with Dynamic Gradient */}
        <h1 
          className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight ${hasAnimations ? 'animate-fade-in-up animation-delay-200' : ''}`}
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 50%, ${theme.primaryColor} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {title}
        </h1>
        
        {/* Compelling Subtitle */}
        <p className={`text-xl md:text-2xl lg:text-3xl text-slate-700 max-w-5xl mx-auto mb-12 leading-relaxed font-medium ${hasAnimations ? 'animate-fade-in-up animation-delay-300' : ''}`}>
          {subtitle}
        </p>
        
        {/* Value Proposition Cards */}
        {isShapingTheFuture && (
          <div className={`grid md:grid-cols-3 gap-6 max-w-4xl mx-auto ${hasAnimations ? 'animate-fade-in-up animation-delay-400' : ''}`}>
            <div className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Innovative Teaching</h3>
              <p className="text-slate-600 text-sm">Transform your classroom with cutting-edge strategies</p>
            </div>
            
            <div className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Expert Network</h3>
              <p className="text-slate-600 text-sm">Connect with leading business educators nationwide</p>
            </div>
            
            <div className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Career Growth</h3>
              <p className="text-slate-600 text-sm">Advance your professional development journey</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Academic styling for conferences
export const conferenceThemeStyles = `
  .conference-gradient-text {
    background: linear-gradient(135deg, var(--conference-primary, #0f1419), var(--conference-secondary, #1a1f2e), var(--conference-accent, #b8860b));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .conference-button {
    background: linear-gradient(135deg, var(--conference-primary, #0f1419), var(--conference-secondary, #1a1f2e));
    transition: all 0.3s ease;
  }
  
  .conference-button:hover {
    background: linear-gradient(135deg, var(--conference-secondary, #1a1f2e), var(--conference-accent, #b8860b));
    transform: translateY(-1px);
    box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;