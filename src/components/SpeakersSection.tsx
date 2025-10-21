'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ConferenceSpeaker, ConferenceSession } from '@/types/conference';
import { Button } from '@/components/ui/button';

interface SpeakersSectionProps {
  speakers: ConferenceSpeaker[];
  sessions?: ConferenceSession[];
  className?: string;
}

interface SpeakerBioModalProps {
  speaker: ConferenceSpeaker;
  sessions?: ConferenceSession[];
  isOpen: boolean;
  onClose: () => void;
}

function SpeakerBioModal({ speaker, sessions = [], isOpen, onClose }: SpeakerBioModalProps) {
  if (!isOpen) return null;

  const speakerSessions = sessions.filter(session => 
    session.speaker === speaker.id || session.speakers?.includes(speaker.id)
  );

  const formatSessionTime = (session: ConferenceSession) => {
    const startTime = session.startTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const endTime = session.endTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return `${startTime} - ${endTime}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <div className="h-32 rounded-t-2xl" style={{ background: `linear-gradient(to right, var(--nhbea-royal-blue), var(--nhbea-royal-blue-dark))` }} />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Speaker Photo and Basic Info */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              {speaker.photoURL ? (
                <Image
                  src={speaker.photoURL}
                  alt={speaker.name}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center" style={{ background: `linear-gradient(to bottom right, var(--nhbea-royal-blue), var(--nhbea-royal-blue-dark))` }}>
                  <span className="text-3xl font-bold text-white">
                    {speaker.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
              {speaker.isKeynote && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  KEYNOTE
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-20 p-8">
          {/* Speaker Info */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{speaker.name}</h2>
            <p className="text-xl text-gray-600 mb-1">{speaker.title}</p>
            <p className="text-lg text-gray-500 mb-4">{speaker.organization}</p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {speaker.linkedInURL && (
                <a
                  href={speaker.linkedInURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: `var(--nhbea-royal-blue-subtle)`,
                    color: `var(--nhbea-royal-blue)` 
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-lighter)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-subtle)`;
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
              {speaker.twitterHandle && (
                <a
                  href={`https://twitter.com/${speaker.twitterHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: `var(--nhbea-royal-blue-subtle)`,
                    color: `var(--nhbea-royal-blue)` 
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-lighter)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-subtle)`;
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              )}
              {speaker.websiteURL && (
                <a
                  href={speaker.websiteURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: `var(--nhbea-royal-blue-subtle)`,
                    color: `var(--nhbea-royal-blue)` 
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-lighter)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-subtle)`;
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Biography</h3>
            <div className="prose prose-lg text-gray-700 max-w-none">
              {speaker.bio.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Expertise */}
          {speaker.expertise && speaker.expertise.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-3">
                {speaker.expertise.map((area, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full font-medium"
                    style={{ 
                      backgroundColor: `var(--nhbea-royal-blue-subtle)`,
                      color: `var(--nhbea-royal-blue-dark)` 
                    }}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sessions */}
          {speakerSessions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {speaker.name.split(' ')[0]}'s Sessions
              </h3>
              <div className="space-y-4">
                {speakerSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 flex-1">
                        {session.title}
                      </h4>
                      <span 
                        className="ml-4 px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: session.type === 'keynote' 
                            ? `var(--nhbea-accent-purple)40` 
                            : session.type === 'workshop'
                            ? `var(--nhbea-accent-green)40`
                            : `var(--nhbea-royal-blue-subtle)`,
                          color: session.type === 'keynote' 
                            ? `var(--nhbea-accent-purple)` 
                            : session.type === 'workshop'
                            ? `var(--nhbea-accent-green)`
                            : `var(--nhbea-royal-blue-dark)`
                        }}
                      >
                        {session.type}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{session.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatSessionTime(session)}
                      </div>
                      {session.room && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {session.room}
                        </div>
                      )}
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {session.track}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t border-gray-200">
          <div className="flex justify-center">
            <Button
              onClick={onClose}
              className="px-8 py-2"
              style={{ 
                backgroundColor: `var(--nhbea-royal-blue)`,
                color: 'white'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = `var(--nhbea-royal-blue-dark)`;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = `var(--nhbea-royal-blue)`;
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SpeakersSection({ speakers, sessions = [], className = '' }: SpeakersSectionProps) {
  const [selectedSpeaker, setSelectedSpeaker] = useState<ConferenceSpeaker | null>(null);
  const [filter, setFilter] = useState<'all' | 'keynote' | 'featured'>('all');

  const filteredSpeakers = speakers.filter(speaker => {
    switch (filter) {
      case 'keynote':
        return speaker.isKeynote;
      case 'featured':
        return speaker.featured;
      default:
        return true;
    }
  });

  const featuredSpeakers = speakers.filter(speaker => speaker.featured || speaker.isKeynote);
  const regularSpeakers = speakers.filter(speaker => !speaker.featured && !speaker.isKeynote);

  const getSpeakerSessions = (speakerId: string) => {
    return sessions.filter(session => 
      session.speaker === speakerId || session.speakers?.includes(speakerId)
    );
  };

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: `var(--nhbea-gray-900)` }}>
            <span className="bg-clip-text text-transparent" style={{ background: `linear-gradient(to right, var(--nhbea-royal-blue), var(--nhbea-royal-blue-dark))` }}>Featured Speakers</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8" style={{ color: `var(--nhbea-gray-600)` }}>
            Learn from industry leaders and education innovators who are shaping the future of business education
          </p>
          
          {/* Filter Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === 'all'
                  ? 'text-white shadow-lg'
                  : 'bg-white hover:bg-gray-50 border'
              }`}
              style={filter === 'all' ? {
                backgroundColor: `var(--nhbea-royal-blue)`,
                color: 'white'
              } : {
                color: `var(--nhbea-gray-600)`,
                borderColor: `var(--nhbea-gray-300)`
              }}
            >
              All Speakers ({speakers.length})
            </button>
            <button
              onClick={() => setFilter('keynote')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === 'keynote'
                  ? 'text-white shadow-lg'
                  : 'bg-white hover:bg-gray-50 border'
              }`}
              style={filter === 'keynote' ? {
                backgroundColor: `var(--nhbea-royal-blue)`,
                color: 'white'
              } : {
                color: `var(--nhbea-gray-600)`,
                borderColor: `var(--nhbea-gray-300)`
              }}
            >
              Keynote ({speakers.filter(s => s.isKeynote).length})
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === 'featured'
                  ? 'text-white shadow-lg'
                  : 'bg-white hover:bg-gray-50 border'
              }`}
              style={filter === 'featured' ? {
                backgroundColor: `var(--nhbea-royal-blue)`,
                color: 'white'
              } : {
                color: `var(--nhbea-gray-600)`,
                borderColor: `var(--nhbea-gray-300)`
              }}
            >
              Featured ({speakers.filter(s => s.featured).length})
            </button>
          </div>
        </div>

        {/* Featured/Keynote Speakers - Large Cards */}
        {filter === 'all' && featuredSpeakers.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Keynote & Featured Speakers</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredSpeakers.map((speaker) => {
                const speakerSessions = getSpeakerSessions(speaker.id);
                
                return (
                  <div
                    key={speaker.id}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedSpeaker(speaker)}
                  >
                    <div className="relative">
                      {/* Background gradient */}
                      <div className="h-32" style={{ background: `linear-gradient(to right, var(--nhbea-royal-blue), var(--nhbea-royal-blue-dark))` }} />
                      
                      {/* Keynote badge */}
                      {speaker.isKeynote && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          KEYNOTE SPEAKER
                        </div>
                      )}
                      
                      {/* Speaker photo */}
                      <div className="absolute -bottom-16 left-8">
                        {speaker.photoURL ? (
                          <Image
                            src={speaker.photoURL}
                            alt={speaker.name}
                            width={128}
                            height={128}
                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300" style={{ background: `linear-gradient(to bottom right, var(--nhbea-royal-blue), var(--nhbea-royal-blue-dark))` }}>
                            <span className="text-3xl font-bold text-white">
                              {speaker.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-20 p-8">
                      <h3 className="text-2xl font-bold mb-2 transition-colors" style={{ color: `var(--nhbea-gray-900)` }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLHeadingElement).style.color = `var(--nhbea-royal-blue)`;
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLHeadingElement).style.color = `var(--nhbea-gray-900)`;
                        }}>
                        {speaker.name}
                      </h3>
                      <p className="text-lg text-gray-600 mb-1">{speaker.title}</p>
                      <p className="text-gray-500 mb-4">{speaker.organization}</p>
                      
                      {/* Bio preview */}
                      <p className="text-gray-700 line-clamp-3 mb-4">
                        {speaker.bio}
                      </p>
                      
                      {/* Expertise tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {speaker.expertise.slice(0, 3).map((area, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: `var(--nhbea-royal-blue-subtle)`,
                              color: `var(--nhbea-royal-blue-dark)`
                            }}
                          >
                            {area}
                          </span>
                        ))}
                        {speaker.expertise.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            +{speaker.expertise.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      {/* Sessions count */}
                      {speakerSessions.length > 0 && (
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {speakerSessions.length} session{speakerSessions.length !== 1 ? 's' : ''}
                        </div>
                      )}
                      
                      {/* Social links */}
                      <div className="flex items-center space-x-3">
                        {speaker.linkedInURL && (
                          <a
                            href={speaker.linkedInURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg transition-colors"
                            style={{
                              backgroundColor: `var(--nhbea-royal-blue-subtle)`,
                              color: `var(--nhbea-royal-blue)`
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-lighter)`;
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-subtle)`;
                            }}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        )}
                        {speaker.twitterHandle && (
                          <a
                            href={`https://twitter.com/${speaker.twitterHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg transition-colors"
                            style={{
                              backgroundColor: `var(--nhbea-royal-blue-subtle)`,
                              color: `var(--nhbea-royal-blue)`
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-lighter)`;
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-subtle)`;
                            }}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </a>
                        )}
                        {speaker.websiteURL && (
                          <a
                            href={speaker.websiteURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg transition-colors"
                            style={{
                              backgroundColor: `var(--nhbea-royal-blue-subtle)`,
                              color: `var(--nhbea-royal-blue)`
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-lighter)`;
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-subtle)`;
                            }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                            </svg>
                          </a>
                        )}
                        <div className="flex-1" />
                        <svg className="w-5 h-5 transition-colors" style={{ color: `var(--nhbea-gray-400)` }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Speakers - Compact Cards */}
        {filter === 'all' && regularSpeakers.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Additional Speakers</h3>
          </div>
        )}
        
        {/* Speaker Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(filter === 'all' ? regularSpeakers : filteredSpeakers).map((speaker) => {
            const speakerSessions = getSpeakerSessions(speaker.id);
            
            return (
              <div
                key={speaker.id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => setSelectedSpeaker(speaker)}
              >
                {/* Speaker photo */}
                <div className="p-6 pb-3 text-center">
                  {speaker.photoURL ? (
                    <Image
                      src={speaker.photoURL}
                      alt={speaker.name}
                      width={100}
                      height={100}
                      className="w-24 h-24 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-300 shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
                      <span className="text-xl font-bold text-white">
                        {speaker.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  
                  {speaker.isKeynote && (
                    <div className="mt-2">
                      <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                        KEYNOTE
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="px-6 pb-6">
                  <h3 className="text-lg font-bold mb-1 text-center transition-colors" style={{ color: `var(--nhbea-gray-900)` }}>
                    {speaker.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center mb-1">{speaker.title}</p>
                  <p className="text-sm text-gray-500 text-center mb-3">{speaker.organization}</p>
                  
                  {/* Bio preview */}
                  <p className="text-sm text-gray-700 line-clamp-2 mb-3 text-center">
                    {speaker.bio}
                  </p>
                  
                  {/* Expertise tags */}
                  <div className="flex flex-wrap gap-1 justify-center mb-3">
                    {speaker.expertise.slice(0, 2).map((area, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `var(--nhbea-royal-blue-subtle)`,
                          color: `var(--nhbea-royal-blue-dark)`
                        }}
                      >
                        {area}
                      </span>
                    ))}
                    {speaker.expertise.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{speaker.expertise.length - 2}
                      </span>
                    )}
                  </div>
                  
                  {/* Sessions count */}
                  {speakerSessions.length > 0 && (
                    <div className="flex items-center justify-center text-xs text-gray-600 mb-3">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {speakerSessions.length} session{speakerSessions.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  
                  {/* Social links */}
                  <div className="flex items-center justify-center space-x-2">
                    {speaker.linkedInURL && (
                      <a
                        href={speaker.linkedInURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{
                          backgroundColor: `var(--nhbea-royal-blue-subtle)`,
                          color: `var(--nhbea-royal-blue)`
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-lighter)`;
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-subtle)`;
                        }}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    {speaker.twitterHandle && (
                      <a
                        href={`https://twitter.com/${speaker.twitterHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{
                          backgroundColor: `var(--nhbea-royal-blue-subtle)`,
                          color: `var(--nhbea-royal-blue)`
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-lighter)`;
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-subtle)`;
                        }}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    )}
                    {speaker.websiteURL && (
                      <a
                        href={speaker.websiteURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{
                          backgroundColor: `var(--nhbea-royal-blue-subtle)`,
                          color: `var(--nhbea-royal-blue)`
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-lighter)`;
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-subtle)`;
                        }}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredSpeakers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No speakers found</h3>
            <p className="text-gray-600 mb-4">No speakers match the selected filter.</p>
            <Button onClick={() => setFilter('all')} variant="outline">
              View All Speakers
            </Button>
          </div>
        )}
      </div>

      {/* Speaker Bio Modal */}
      {selectedSpeaker && (
        <SpeakerBioModal
          speaker={selectedSpeaker}
          sessions={sessions}
          isOpen={!!selectedSpeaker}
          onClose={() => setSelectedSpeaker(null)}
        />
      )}
    </section>
  );
}