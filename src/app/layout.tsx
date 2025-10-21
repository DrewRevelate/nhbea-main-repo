import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import { initPerformanceMonitoring } from "@/lib/performance";

export const metadata: Metadata = {
  title: {
    default: "NHBEA Connect - New Hampshire Business Education Association",
    template: "%s | NHBEA Connect"
  },
  description: "New Hampshire Business Education Association - Supporting business educators across the state with professional development, networking, and career advancement opportunities since 1923.",
  metadataBase: new URL("https://nhbea.org"),
  keywords: [
    "business education",
    "New Hampshire",
    "educators",
    "professional development",
    "teaching excellence",
    "career advancement",
    "networking",
    "awards",
    "NHBEA"
  ],
  authors: [{ name: "New Hampshire Business Education Association" }],
  creator: "NHBEA",
  publisher: "New Hampshire Business Education Association",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "NHBEA Connect",
    title: "New Hampshire Business Education Association",
    description: "Supporting business educators across New Hampshire with professional development, networking, and career advancement opportunities since 1923.",
    url: "https://nhbea.org",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Hampshire Business Education Association",
    description: "Supporting business educators across New Hampshire with professional development opportunities since 1923.",
  },
  verification: {
    google: "verify-google-site", // Add actual verification code when available
  },
  alternates: {
    canonical: "https://nhbea.org",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Performance optimization meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* Font preloading for performance optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://storage.googleapis.com" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="msapplication-TileColor" content="#1e3a8a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Critical font loading with optimal display strategy */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Georgia:wght@400;700&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                const preloadLinks = document.querySelectorAll('link[rel="preload"][as="style"]');
                preloadLinks.forEach(function(link) {
                  link.addEventListener('load', function() {
                    this.onload = null;
                    this.rel = 'stylesheet';
                  });
                });
              });
            `
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Georgia:wght@400;700&display=swap"
          />
        </noscript>
        
        {/* Performance monitoring initialization */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                // Initialize performance monitoring as early as possible
                window.addEventListener('DOMContentLoaded', function() {
                  if (window.initPerformanceMonitoring) {
                    window.initPerformanceMonitoring();
                  }
                });
              }
            `,
          }}
        />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "New Hampshire Business Education Association",
              "alternateName": "NHBEA",
              "url": "https://nhbea.org",
              "description": "New Hampshire Business Education Association - Supporting business educators across the state with professional development, networking, and career advancement opportunities since 1923.",
              "foundingDate": "1923",
              "address": {
                "@type": "PostalAddress",
                "addressRegion": "NH",
                "addressCountry": "US"
              },
              "sameAs": [
                "https://nhbea.org"
              ],
              "knowsAbout": [
                "Business Education",
                "Professional Development",
                "Teaching Excellence",
                "Career Advancement",
                "Educational Leadership"
              ],
              "memberOf": {
                "@type": "Organization",
                "name": "National Business Education Association"
              }
            }),
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning={true}>
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            {children}
          </Suspense>
        </main>
        <Footer />
        
        
        {/* Initialize performance monitoring after DOM load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                if (typeof initPerformanceMonitoring === 'function') {
                  initPerformanceMonitoring();
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
