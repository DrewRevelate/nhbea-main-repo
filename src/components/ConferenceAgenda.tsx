'use client';

import React, { useState, useMemo } from 'react';
import { ConferenceAgenda, ConferenceSession, ConferenceSpeaker } from '@/types/conference';
import { Button } from '@/components/ui/button';

interface ConferenceAgendaProps {
  agenda: ConferenceAgenda;
  speakers?: ConferenceSpeaker[];
  className?: string;
}

interface SessionDetailModalProps {
  session: ConferenceSession;
  speaker?: ConferenceSpeaker;
  isOpen: boolean;
  onClose: () => void;
}

function SessionDetailModal({ session, speaker, isOpen, onClose }: SessionDetailModalProps) {
  if (!isOpen) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'keynote':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        );
      case 'workshop':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'panel':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'networking':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {getTypeIcon(session.type)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(session.level)}`}>
                    {session.level}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                    {session.type}
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{session.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatTime(session.startTime)} - {formatTime(session.endTime)}
                </div>
                {session.room && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {session.room}
                  </div>
                )}
                {session.capacity && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {session.capacity} seats
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Speaker Info */}
          {speaker && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-4">
                {speaker.photoURL && (
                  <img
                    src={speaker.photoURL}
                    alt={speaker.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{speaker.name}</h3>
                  <p className="text-gray-600">{speaker.title}</p>
                  <p className="text-sm text-gray-500">{speaker.organization}</p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Description</h3>
            <p className="text-gray-700 leading-relaxed">{session.description}</p>
          </div>

          {/* Learning Objectives */}
          {session.learningObjectives && session.learningObjectives.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Learning Objectives</h3>
              <ul className="space-y-2">
                {session.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Materials */}
          {session.materials && session.materials.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Materials Provided</h3>
              <ul className="space-y-2">
                {session.materials.map((material, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{material}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {session.tags && session.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {session.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              Close
            </Button>
            <Button className="px-6 bg-blue-600 hover:bg-blue-700">
              Add to My Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConferenceAgenda({ agenda, speakers = [], className = '' }: ConferenceAgendaProps) {
  const [selectedFilters, setSelectedFilters] = useState<{
    track: string;
    type: string;
    level: string;
  }>({
    track: 'all',
    type: 'all',
    level: 'all'
  });
  const [selectedSession, setSelectedSession] = useState<ConferenceSession | null>(null);
  const [printView, setPrintView] = useState(false);

  const filteredSessions = useMemo(() => {
    return agenda.sessions.filter(session => {
      if (selectedFilters.track !== 'all' && session.track !== selectedFilters.track) {
        return false;
      }
      if (selectedFilters.type !== 'all' && session.type !== selectedFilters.type) {
        return false;
      }
      if (selectedFilters.level !== 'all' && session.level !== selectedFilters.level) {
        return false;
      }
      return true;
    });
  }, [agenda.sessions, selectedFilters]);

  const sessionsByTimeSlot = useMemo(() => {
    const grouped: { [key: string]: ConferenceSession[] } = {};
    
    filteredSessions.forEach(session => {
      const timeKey = session.startTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      if (!grouped[timeKey]) {
        grouped[timeKey] = [];
      }
      grouped[timeKey].push(session);
    });
    
    return grouped;
  }, [filteredSessions]);

  const getSpeakerById = (speakerId: string) => {
    return speakers.find(speaker => speaker.id === speakerId);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'keynote': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'workshop': return 'bg-green-100 text-green-800 border-green-200';
      case 'panel': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'networking': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'break': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleFilterChange = (filterType: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      track: 'all',
      type: 'all',
      level: 'all'
    });
  };

  const handlePrint = () => {
    setPrintView(true);
    setTimeout(() => {
      window.print();
      setPrintView(false);
    }, 100);
  };

  const uniqueTypes = [...new Set(agenda.sessions.map(s => s.type))];
  const uniqueLevels = [...new Set(agenda.sessions.map(s => s.level))];

  return (
    <div className={`conference-agenda ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            <span className="conference-gradient-text">Conference Agenda</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Explore our comprehensive schedule of sessions, workshops, and networking opportunities designed to shape the future of business education
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Track Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Track</label>
                <select
                  value={selectedFilters.track}
                  onChange={(e) => handleFilterChange('track', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Tracks</option>
                  {agenda.tracks.map(track => (
                    <option key={track} value={track}>{track}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={selectedFilters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Types</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  value={selectedFilters.level}
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Levels</option>
                  {uniqueLevels.map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <Button
                onClick={clearFilters}
                variant="outline"
                className="px-4 py-2"
              >
                Clear Filters
              </Button>
              <Button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Schedule
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedFilters.track !== 'all' || selectedFilters.type !== 'all' || selectedFilters.level !== 'all') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {selectedFilters.track !== 'all' && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Track: {selectedFilters.track}
                  </span>
                )}
                {selectedFilters.type !== 'all' && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Type: {selectedFilters.type}
                  </span>
                )}
                {selectedFilters.level !== 'all' && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                    Level: {selectedFilters.level}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredSessions.length} of {agenda.sessions.length} sessions
          </p>
        </div>

        {/* Sessions by Time Slot */}
        <div className="space-y-8">
          {Object.entries(sessionsByTimeSlot)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([timeSlot, sessions]) => (
              <div key={timeSlot} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg overflow-hidden">
                {/* Time Slot Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                  <h3 className="text-2xl font-bold">{timeSlot}</h3>
                </div>

                {/* Sessions */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessions.map((session) => {
                      const speaker = session.speaker ? getSpeakerById(session.speaker) : null;
                      
                      return (
                        <div
                          key={session.id}
                          className="group cursor-pointer bg-white rounded-xl border-2 border-gray-100 p-4 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                          onClick={() => setSelectedSession(session)}
                        >
                          {/* Session Type Badge */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(session.type)}`}>
                              {session.type}
                            </span>
                            <span className="text-xs text-gray-500">
                              {session.track}
                            </span>
                          </div>

                          {/* Session Title */}
                          <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {session.title}
                          </h4>

                          {/* Session Details */}
                          <div className="space-y-1 text-sm text-gray-600 mb-3">
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {session.endTime.getTime() - session.startTime.getTime() > 0 && 
                                `${Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60))} min`
                              }
                            </div>
                          </div>

                          {/* Speaker */}
                          {speaker && (
                            <div className="flex items-center space-x-2 mb-3">
                              {speaker.photoURL && (
                                <img
                                  src={speaker.photoURL}
                                  alt={speaker.name}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              )}
                              <span className="text-sm font-medium text-gray-700">{speaker.name}</span>
                            </div>
                          )}

                          {/* Description Preview */}
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {session.description}
                          </p>

                          {/* Level Badge */}
                          <div className="flex justify-between items-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              session.level === 'beginner' ? 'bg-green-100 text-green-800' :
                              session.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              session.level === 'advanced' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {session.level}
                            </span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see more sessions.</p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          speaker={selectedSession.speaker ? getSpeakerById(selectedSession.speaker) : undefined}
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}