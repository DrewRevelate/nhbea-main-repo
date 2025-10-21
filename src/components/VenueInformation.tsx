'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { VenueDetails, AccommodationInfo } from '@/types/conference';
import { Button } from '@/components/ui/button';

interface VenueInformationProps {
  venue: VenueDetails;
  className?: string;
}

interface GoogleMapProps {
  coordinates?: { lat: number; lng: number };
  address: string;
  venueName: string;
}

function GoogleMap({ coordinates, address, venueName }: GoogleMapProps) {
  const [mapError, setMapError] = useState(false);
  
  useEffect(() => {
    // Check if Google Maps API is available
    if (!window.google) {
      setMapError(true);
    }
  }, []);

  const mapUrl = coordinates 
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${coordinates.lat},${coordinates.lng}&zoom=15`
    : `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}&zoom=15`;

  const directionsUrl = coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  if (mapError || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{venueName}</h3>
        <p className="text-gray-600 mb-4">{address}</p>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
          </svg>
          Get Directions
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-lg">
      <div className="relative h-96">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-xl"
        />
        <div className="absolute bottom-4 right-4">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
            </svg>
            <span className="font-medium text-gray-900">Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function FacilityIcon({ iconName }: { iconName?: string }) {
  const getIcon = () => {
    switch (iconName) {
      case 'wifi':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        );
      case 'parking':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1a2 2 0 012 2v1a2 2 0 01-2 2H9V7z" />
          </svg>
        );
      case 'restaurant':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'accessibility':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'audio':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        );
      case 'climate':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
    }
  };

  return <div className="text-green-600">{getIcon()}</div>;
}

function AccommodationCard({ accommodation }: { accommodation: AccommodationInfo }) {
  const getPriceColor = (priceRange: string) => {
    switch (priceRange) {
      case '$': return 'text-green-600 bg-green-100';
      case '$$': return 'text-yellow-600 bg-yellow-100';
      case '$$$': return 'text-orange-600 bg-orange-100';
      case '$$$$': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1a2 2 0 012 2v1a2 2 0 01-2 2H9V7z" />
          </svg>
        );
      case 'inn':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'b&b':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            {getTypeIcon(accommodation.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{accommodation.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{accommodation.type}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPriceColor(accommodation.priceRange)}`}>
          {accommodation.priceRange}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {accommodation.distanceFromVenue} from venue
        </div>
        
        {accommodation.specialRates && (
          <div className="flex items-center text-sm text-green-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Conference rates available
          </div>
        )}

        {accommodation.bookingDeadline && (
          <div className="flex items-center text-sm text-orange-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Book by {accommodation.bookingDeadline.toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Amenities */}
      {accommodation.amenities.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-1">
            {accommodation.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {amenity}
              </span>
            ))}
            {accommodation.amenities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{accommodation.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="flex space-x-2">
        {accommodation.website && (
          <a
            href={accommodation.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Website
          </a>
        )}
        {accommodation.phone && (
          <a
            href={`tel:${accommodation.phone}`}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Call
          </a>
        )}
      </div>
    </div>
  );
}

export default function VenueInformation({ venue, className = '' }: VenueInformationProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'accessibility' | 'parking' | 'accommodations' | 'transportation'>('overview');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const accessibilityFeatures = [
    { key: 'wheelchairAccessible', label: 'Wheelchair Accessible', icon: 'accessibility' },
    { key: 'elevatorAccess', label: 'Elevator Access', icon: 'accessibility' },
    { key: 'accessibleParking', label: 'Accessible Parking', icon: 'parking' },
    { key: 'accessibleRestrooms', label: 'Accessible Restrooms', icon: 'accessibility' },
    { key: 'hearingLoopAvailable', label: 'Hearing Loop Available', icon: 'audio' },
    { key: 'signLanguageInterpreter', label: 'Sign Language Interpreter', icon: 'accessibility' },
    { key: 'largeTextMaterials', label: 'Large Text Materials', icon: 'accessibility' }
  ];

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            <span className="conference-gradient-text">Venue Information</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover everything you need to know about our conference venue, including facilities, accessibility, and nearby accommodations
          </p>
        </div>

        {/* Venue Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg overflow-hidden mb-8">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Venue Details */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{venue.name}</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">{venue.description}</p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">Address</h4>
                    <p className="text-gray-600">
                      {venue.address.street}<br />
                      {venue.address.city}, {venue.address.state} {venue.address.zipCode}
                    </p>
                  </div>
                </div>

                {venue.phone && (
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">Phone</h4>
                      <a href={`tel:${venue.phone}`} className="text-blue-600 hover:text-blue-700">
                        {venue.phone}
                      </a>
                    </div>
                  </div>
                )}

                {venue.website && (
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">Website</h4>
                      <a
                        href={venue.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            <div>
              <GoogleMap
                coordinates={venue.coordinates}
                address={`${venue.address.street}, ${venue.address.city}, ${venue.address.state} ${venue.address.zipCode}`}
                venueName={venue.name}
              />
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        {venue.photos && venue.photos.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Venue Photos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {venue.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <Image
                    src={photo}
                    alt={`${venue.name} - Photo ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8 py-4 overflow-x-auto">
              {[
                { id: 'overview', label: 'Facilities', icon: '🏢' },
                { id: 'accessibility', label: 'Accessibility', icon: '♿' },
                { id: 'parking', label: 'Parking', icon: '🚗' },
                { id: 'transportation', label: 'Transportation', icon: '🚌' },
                { id: 'accommodations', label: 'Hotels', icon: '🏨' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Facilities Overview */}
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Venue Facilities</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {venue.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 ${
                        facility.available
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <FacilityIcon iconName={facility.iconName} />
                        <h4 className={`font-semibold ${facility.available ? 'text-gray-900' : 'text-gray-500'}`}>
                          {facility.name}
                        </h4>
                        {facility.available ? (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        )}
                      </div>
                      <p className={`text-sm ${facility.available ? 'text-gray-700' : 'text-gray-500'}`}>
                        {facility.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accessibility */}
            {activeTab === 'accessibility' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Accessibility Features</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {accessibilityFeatures.map((feature) => {
                    const isAvailable = venue.accessibility[feature.key as keyof typeof venue.accessibility];
                    
                    return (
                      <div
                        key={feature.key}
                        className={`flex items-center space-x-4 p-4 rounded-xl border-2 ${
                          isAvailable
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isAvailable ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <FacilityIcon iconName={feature.icon} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${isAvailable ? 'text-gray-900' : 'text-gray-500'}`}>
                            {feature.label}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {isAvailable ? (
                              <div className="flex items-center text-green-600">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm font-medium">Available</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-sm">Not Available</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {venue.accessibility.additionalNotes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-900 mb-2">Additional Accessibility Information</h4>
                    <p className="text-blue-800">{venue.accessibility.additionalNotes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Parking */}
            {activeTab === 'parking' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Parking Information</h3>
                
                {venue.parking.available ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1a2 2 0 012 2v1a2 2 0 01-2 2H9V7z" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-bold text-green-800">Parking Available</h4>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-green-700">Total Spaces:</span>
                          <span className="font-semibold text-green-800">{venue.parking.spaces}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-green-700">Cost:</span>
                          <span className="font-semibold text-green-800">
                            {venue.parking.free ? 'Free' : `$${venue.parking.cost}`}
                          </span>
                        </div>
                        
                        {venue.parking.validationAvailable && (
                          <div className="flex items-center text-green-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Validation available
                          </div>
                        )}
                      </div>
                    </div>

                    {venue.parking.alternatives && venue.parking.alternatives.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Alternative Parking</h4>
                        <ul className="space-y-2">
                          {venue.parking.alternatives.map((alternative, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                              <span className="text-gray-700">{alternative}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-yellow-800">Limited Parking Available</h4>
                    </div>
                    <p className="text-yellow-700 mb-4">
                      On-site parking is not available at this venue. Please consider alternative transportation options.
                    </p>
                  </div>
                )}

                {venue.parking.notes && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-900 mb-2">Additional Parking Notes</h4>
                    <p className="text-blue-800">{venue.parking.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Transportation */}
            {activeTab === 'transportation' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Transportation Options</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Public Transit */}
                  <div className={`p-6 rounded-xl border-2 ${
                    venue.transportation.publicTransit
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        venue.transportation.publicTransit ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">Public Transit</h4>
                    </div>
                    <p className={`${venue.transportation.publicTransit ? 'text-green-700' : 'text-gray-500'}`}>
                      {venue.transportation.publicTransit
                        ? 'Public transportation is available to the venue'
                        : 'Limited public transportation options'
                      }
                    </p>
                  </div>

                  {/* Walking Distance */}
                  <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                    <h4 className="text-lg font-bold text-blue-900 mb-4">Walking Distance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-700">From Downtown:</span>
                        <span className="font-semibold text-blue-800">{venue.transportation.walkingDistance.fromDowntown}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">From Station:</span>
                        <span className="font-semibold text-blue-800">{venue.transportation.walkingDistance.fromStation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Airport Shuttles */}
                {venue.transportation.airportShuttles.length > 0 && (
                  <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Airport Transportation</h4>
                    <ul className="space-y-2">
                      {venue.transportation.airportShuttles.map((shuttle, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-4 h-4 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{shuttle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Rideshare */}
                {venue.transportation.rideshareRecommended && (
                  <div className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <h4 className="text-lg font-bold text-purple-900">Rideshare Recommended</h4>
                    </div>
                    <p className="text-purple-700">
                      Uber and Lyft services are readily available and recommended for convenient transportation to the venue.
                    </p>
                  </div>
                )}

                {/* Driving Directions */}
                {venue.transportation.drivingDirections && (
                  <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Driving Directions</h4>
                    <p className="text-gray-700">{venue.transportation.drivingDirections}</p>
                  </div>
                )}
              </div>
            )}

            {/* Accommodations */}
            {activeTab === 'accommodations' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Nearby Accommodations</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {venue.nearbyAccommodations.map((accommodation, index) => (
                    <AccommodationCard key={index} accommodation={accommodation} />
                  ))}
                </div>
                
                {venue.nearbyAccommodations.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Accommodation information coming soon</h3>
                    <p className="text-gray-600">We're working on compiling nearby hotel and accommodation options for conference attendees.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src={selectedPhoto}
                alt="Venue photo"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}