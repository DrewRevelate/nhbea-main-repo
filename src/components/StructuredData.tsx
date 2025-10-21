import { memo } from 'react';

interface StructuredDataProps {
  type: 'membership' | 'awards' | 'event';
  data: any;
}

const StructuredDataComponent = memo(({ type, data }: StructuredDataProps) => {
  const generateStructuredData = () => {
    switch (type) {
      case 'membership':
        return {
          "@context": "https://schema.org",
          "@type": "Offer",
          "name": "NHBEA Professional Membership",
          "description": "Join the New Hampshire Business Education Association for professional development, networking opportunities, and career advancement in business education.",
          "price": "50.00",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "validFrom": new Date().toISOString().split('T')[0],
          "validThrough": `${new Date().getFullYear() + 1}-12-31`,
          "category": "Professional Membership",
          "offeredBy": {
            "@type": "EducationalOrganization",
            "name": "New Hampshire Business Education Association",
            "url": "https://nhbea-64cab.web.app"
          },
          "includesObject": [
            {
              "@type": "Service",
              "name": "Professional Development Workshops"
            },
            {
              "@type": "Service", 
              "name": "Networking Events"
            },
            {
              "@type": "Service",
              "name": "Career Advancement Resources"
            },
            {
              "@type": "Service",
              "name": "Awards and Recognition Programs"
            }
          ]
        };
      
      case 'awards':
        return {
          "@context": "https://schema.org",
          "@type": "Award",
          "name": "NHBEA Excellence in Business Education Awards",
          "description": "Recognizing outstanding achievement and lifetime contributions to business education in New Hampshire.",
          "award": [
            "Teaching Excellence Award",
            "Lifetime Achievement Award"
          ],
          "awardingBody": {
            "@type": "EducationalOrganization",
            "name": "New Hampshire Business Education Association"
          },
          "eligibility": "Business educators in New Hampshire",
          "recognitionDate": new Date().getFullYear().toString()
        };
      
      case 'event':
        return {
          "@context": "https://schema.org",
          "@type": "Event",
          "name": data.name || "NHBEA Professional Development Conference",
          "description": data.description || "Annual conference featuring the latest trends in business education, networking opportunities, and professional development sessions.",
          "startDate": data.startDate || new Date().toISOString(),
          "endDate": data.endDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "location": {
            "@type": "Place",
            "name": data.venue || "Conference Center",
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "NH",
              "addressCountry": "US"
            }
          },
          "organizer": {
            "@type": "EducationalOrganization",
            "name": "New Hampshire Business Education Association",
            "url": "https://nhbea-64cab.web.app"
          },
          "offers": {
            "@type": "Offer",
            "price": data.price || "75.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        };
      
      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();
  
  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
});

StructuredDataComponent.displayName = 'StructuredData';

export { StructuredDataComponent as StructuredData };