'use client';

import React, { useState, useEffect } from 'react';
import { SocialMediaConfig } from '@/types/conference';

interface SocialMediaFeedProps {
  config: SocialMediaConfig;
  className?: string;
}

interface SocialPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'linkedin';
  content: string;
  author: string;
  authorHandle: string;
  authorAvatar?: string;
  timestamp: Date;
  engagement: {
    likes: number;
    retweets?: number;
    comments: number;
  };
  media?: {
    type: 'image' | 'video';
    url: string;
    alt?: string;
  }[];
  url: string;
}

// Mock data for demonstration (in real implementation, this would come from APIs)
const mockPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'twitter',
    content: `Excited to be speaking at #${process.env.NEXT_PUBLIC_CONFERENCE_HASHTAG || 'NHBEAConf'} about the future of business education! Looking forward to connecting with fellow educators and sharing innovative teaching strategies. 🎓✨`,
    author: 'Dr. Sarah Johnson',
    authorHandle: '@sarahjohnson_edu',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    engagement: { likes: 42, retweets: 15, comments: 8 },
    url: 'https://twitter.com/sarahjohnson_edu/status/123456789'
  },
  {
    id: '2',
    platform: 'twitter',
    content: `Day 1 of prep for #${process.env.NEXT_PUBLIC_CONFERENCE_HASHTAG || 'NHBEAConf'} is complete! The agenda looks incredible - can't wait to learn from industry leaders about digital transformation in education. See you there! 📚💻`,
    author: 'NHBEA',
    authorHandle: '@NHBEA_Official',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    engagement: { likes: 28, retweets: 12, comments: 5 },
    url: 'https://twitter.com/NHBEA_Official/status/123456790'
  },
  {
    id: '3',
    platform: 'twitter',
    content: `The future of business education is collaborative, innovative, and student-centered. Proud to be part of #${process.env.NEXT_PUBLIC_CONFERENCE_HASHTAG || 'NHBEAConf'} where we're shaping tomorrow's business leaders together! 🌟`,
    author: 'Michael Roberts',
    authorHandle: '@mike_edu_leader',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    engagement: { likes: 56, retweets: 23, comments: 12 },
    url: 'https://twitter.com/mike_edu_leader/status/123456791'
  },
  {
    id: '4',
    platform: 'twitter',
    content: `Registration is still open for #${process.env.NEXT_PUBLIC_CONFERENCE_HASHTAG || 'NHBEAConf'}! Don't miss out on this incredible opportunity to network with peers and discover cutting-edge teaching methodologies. Early bird pricing ends soon! 🎯`,
    author: 'NHBEA',
    authorHandle: '@NHBEA_Official',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    engagement: { likes: 34, retweets: 18, comments: 6 },
    url: 'https://twitter.com/NHBEA_Official/status/123456792'
  }
];

function SocialPost({ post }: { post: SocialPost }) {
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return `${days}d`;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return { color: `var(--nhbea-royal-blue)` };
      case 'instagram': return { color: '#e91e63' };
      case 'linkedin': return { color: `var(--nhbea-royal-blue-dark)` };
      default: return { color: `var(--nhbea-gray-500)` };
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(to bottom right, var(--nhbea-royal-blue), var(--nhbea-royal-blue-dark))` }}>
            <span className="text-white font-bold text-sm">
              {post.author.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{post.author}</h4>
            <p className="text-sm text-gray-500">{post.authorHandle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div style={getPlatformColor(post.platform)}>
            {getPlatformIcon(post.platform)}
          </div>
          <span className="text-sm text-gray-500">{formatTimestamp(post.timestamp)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
      </div>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="mb-4">
          <div className="rounded-lg overflow-hidden bg-gray-100">
            {post.media[0].type === 'image' && (
              <img
                src={post.media[0].url}
                alt={post.media[0].alt || ''}
                className="w-full h-48 object-cover"
              />
            )}
          </div>
        </div>
      )}

      {/* Engagement */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{post.engagement.likes}</span>
          </div>
          {post.engagement.retweets && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{post.engagement.retweets}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{post.engagement.comments}</span>
          </div>
        </div>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium"
          style={{ color: `var(--nhbea-royal-blue)` }}
          onMouseEnter={(e) => {
            (e.target as HTMLAnchorElement).style.color = `var(--nhbea-royal-blue-dark)`;
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLAnchorElement).style.color = `var(--nhbea-royal-blue)`;
          }}
        >
          View Post
        </a>
      </div>
    </div>
  );
}

function SocialSharingButtons({ config, title, url }: { 
  config: SocialMediaConfig; 
  title: string; 
  url: string; 
}) {
  const shareUrl = encodeURIComponent(url);
  const shareText = encodeURIComponent(`${title} #${config.hashtag}`);

  const shareButtons = [
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      color: { backgroundColor: `var(--nhbea-royal-blue)`, hoverColor: `var(--nhbea-royal-blue-dark)` },
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      color: { backgroundColor: `var(--nhbea-royal-blue-dark)`, hoverColor: `var(--nhbea-royal-blue-deeper)` },
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      color: { backgroundColor: `var(--nhbea-royal-blue)`, hoverColor: `var(--nhbea-royal-blue-dark)` },
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {shareButtons.map((button) => (
        <a
          key={button.name}
          href={button.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors"
          style={{ backgroundColor: button.color.backgroundColor }}
          onMouseEnter={(e) => {
            (e.target as HTMLAnchorElement).style.backgroundColor = button.color.hoverColor;
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLAnchorElement).style.backgroundColor = button.color.backgroundColor;
          }}
          onClick={(e) => {
            e.preventDefault();
            const popup = window.open(
              button.url,
              'share',
              'width=600,height=400,scrollbars=no,resizable=no'
            );
            popup?.focus();
          }}
        >
          {button.icon}
          <span className="ml-2">{button.name}</span>
        </a>
      ))}
    </div>
  );
}

export default function SocialMediaFeed({ config, className = '' }: SocialMediaFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'share'>('feed');
  const [liveUpdates] = useState<string[]>([
    `🔥 Conference registration is now open! Join us in shaping the future of business education. #${config.hashtag}`,
    `📚 New speaker announcement coming tomorrow - stay tuned! #${config.hashtag}`,
    `🎯 Early bird pricing ends in 48 hours. Don't miss out! #${config.hashtag}`,
    `💡 Interactive workshops will feature the latest in EdTech innovation. #${config.hashtag}`
  ]);

  useEffect(() => {
    // Simulate API call to fetch social media posts
    const fetchPosts = async () => {
      setLoading(true);
      
      // In a real implementation, this would make actual API calls to Twitter, Instagram, etc.
      setTimeout(() => {
        setPosts(mockPosts);
        setLoading(false);
      }, 1000);
    };

    if (config.enableTwitterFeed) {
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, [config]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: `var(--nhbea-gray-900)` }}>
            <span className="bg-clip-text text-transparent" style={{ background: `linear-gradient(to right, var(--nhbea-royal-blue), var(--nhbea-royal-blue-dark))` }}>Social Hub</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8" style={{ color: `var(--nhbea-gray-600)` }}>
            Join the conversation and stay connected with fellow attendees, speakers, and the latest conference updates
          </p>
          
          {/* Conference Hashtag */}
          <div className="inline-flex items-center px-6 py-3 text-white rounded-full shadow-lg mb-8" style={{ background: `linear-gradient(to right, var(--nhbea-royal-blue), var(--nhbea-royal-blue-dark))` }}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <span className="font-bold text-lg">#{config.hashtag}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8 py-4">
              <button
                onClick={() => setActiveTab('feed')}
                className={`flex items-center space-x-2 py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  'border-transparent'
                }`}
                style={{
                  borderBottomColor: activeTab === 'feed' ? `var(--nhbea-royal-blue)` : 'transparent',
                  color: activeTab === 'feed' ? `var(--nhbea-royal-blue)` : `var(--nhbea-gray-500)`
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'feed') {
                    (e.target as HTMLButtonElement).style.color = `var(--nhbea-gray-700)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'feed') {
                    (e.target as HTMLButtonElement).style.color = `var(--nhbea-gray-500)`;
                  }
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span>Social Feed</span>
              </button>
              <button
                onClick={() => setActiveTab('share')}
                className={`flex items-center space-x-2 py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  'border-transparent'
                }`}
                style={{
                  borderBottomColor: activeTab === 'share' ? `var(--nhbea-royal-blue)` : 'transparent',
                  color: activeTab === 'share' ? `var(--nhbea-royal-blue)` : `var(--nhbea-gray-500)`
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'share') {
                    (e.target as HTMLButtonElement).style.color = `var(--nhbea-gray-700)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'share') {
                    (e.target as HTMLButtonElement).style.color = `var(--nhbea-gray-500)`;
                  }
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share Conference</span>
              </button>
            </nav>
          </div>

          <div className="p-8">
            {/* Social Feed Tab */}
            {activeTab === 'feed' && (
              <div>
                {/* Live Updates Ticker */}
                {config.liveUpdatesEnabled && (
                  <div className="rounded-xl p-6 mb-8 border" style={{ background: `linear-gradient(to right, var(--nhbea-royal-blue-subtle)50, var(--nhbea-royal-blue-subtle)30)`, borderColor: `var(--nhbea-royal-blue-lighter)` }}>
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">Live Updates</h3>
                    </div>
                    <div className="space-y-2">
                      {liveUpdates.slice(0, 2).map((update, index) => (
                        <p key={index} className="text-gray-700 leading-relaxed">
                          {update}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Media Feed */}
                {config.enableTwitterFeed ? (
                  <div>
                    {loading ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, index) => (
                          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 p-6 animate-pulse">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-10 h-10 bg-gray-300 rounded-full" />
                              <div className="flex-1">
                                <div className="h-4 bg-gray-300 rounded w-24 mb-2" />
                                <div className="h-3 bg-gray-300 rounded w-32" />
                              </div>
                            </div>
                            <div className="space-y-2 mb-4">
                              <div className="h-4 bg-gray-300 rounded" />
                              <div className="h-4 bg-gray-300 rounded w-3/4" />
                            </div>
                            <div className="flex space-x-4">
                              <div className="h-3 bg-gray-300 rounded w-12" />
                              <div className="h-3 bg-gray-300 rounded w-12" />
                              <div className="h-3 bg-gray-300 rounded w-12" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : posts.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        {posts.map((post) => (
                          <SocialPost key={post.id} post={post} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No social posts available</h3>
                        <p className="text-gray-600 mb-4">
                          Be the first to share about the conference using #{config.hashtag}!
                        </p>
                        <div className="flex justify-center">
                          <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Excited about the upcoming conference! #${config.hashtag}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 text-white rounded-lg transition-colors"
                            style={{ backgroundColor: `var(--nhbea-royal-blue)` }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-dark)`;
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue)`;
                            }}
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                            Tweet about the conference
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Load More Button */}
                    {posts.length > 0 && (
                      <div className="text-center mt-8">
                        <button 
                          className="px-8 py-3 bg-white rounded-lg transition-colors font-medium"
                          style={{
                            color: `var(--nhbea-gray-700)`,
                            borderColor: `var(--color-border-primary)`,
                            border: '1px solid'
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLButtonElement).style.backgroundColor = `var(--nhbea-gray-50)`;
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLButtonElement).style.backgroundColor = 'white';
                          }}
                        >
                          Load More Posts
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Social feed not available</h3>
                    <p className="text-gray-600">
                      Social media integration is currently disabled for this conference.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Share Tab */}
            {activeTab === 'share' && (
              <div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Share the Conference</h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Help spread the word about our upcoming conference! Share with your network and colleagues.
                  </p>
                </div>

                {config.enableSocialSharing ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Social Sharing Buttons */}
                    <div className="rounded-xl p-6 border" style={{ background: `linear-gradient(to bottom right, var(--nhbea-royal-blue-subtle)30, var(--nhbea-royal-blue-subtle)10)`, borderColor: `var(--nhbea-royal-blue-lighter)` }}>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Share on Social Media</h4>
                      <p className="text-gray-600 mb-6">
                        Click below to share the conference on your preferred social platform:
                      </p>
                      <SocialSharingButtons
                        config={config}
                        title="Join us at the NHBEA Conference - Shaping the Future of Business Education"
                        url={currentUrl}
                      />
                    </div>

                    {/* Custom Share Message */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Create Custom Message</h4>
                      <div className="space-y-4">
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 border rounded-lg resize-none"
                          style={{
                            borderColor: `var(--color-border-primary)`,
                            '--focus-ring-color': `var(--nhbea-royal-blue)`,
                            '--focus-border-color': `var(--nhbea-royal-blue)`
                          } as React.CSSProperties}
                          placeholder={`Join me at the upcoming conference! Excited to learn about the future of business education. #${config.hashtag}`}
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Don't forget to use #{config.hashtag}
                          </span>
                          <button 
                            className="px-4 py-2 text-white rounded-lg transition-colors"
                            style={{ backgroundColor: `var(--nhbea-royal-blue)` }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLButtonElement).style.backgroundColor = `var(--nhbea-royal-blue-dark)`;
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLButtonElement).style.backgroundColor = `var(--nhbea-royal-blue)`;
                            }}
                          >
                            Copy Message
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Share Statistics */}
                    <div className="md:col-span-2 bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Conference Buzz</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{ color: `var(--nhbea-royal-blue)` }}>127</div>
                          <div className="text-sm text-gray-600">Mentions Today</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{ color: `var(--nhbea-accent-green)` }}>2.3K</div>
                          <div className="text-sm text-gray-600">Total Reach</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{ color: `var(--nhbea-accent-purple)` }}>89</div>
                          <div className="text-sm text-gray-600">Participants Sharing</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{ color: `var(--nhbea-accent-orange)` }}>456</div>
                          <div className="text-sm text-gray-600">Total Engagement</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Social sharing not available</h3>
                    <p className="text-gray-600">
                      Social sharing features are currently disabled for this conference.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Follow Us Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Follow NHBEA</h3>
          <div className="flex justify-center space-x-6">
            {config.twitterHandle && (
              <a
                href={`https://twitter.com/${config.twitterHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 text-white rounded-full transition-colors"
                style={{ backgroundColor: `var(--nhbea-royal-blue)` }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-dark)`;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue)`;
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            )}
            {config.linkedInPage && (
              <a
                href={config.linkedInPage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 text-white rounded-full transition-colors"
                style={{ backgroundColor: `var(--nhbea-royal-blue-dark)` }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-deeper)`;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.backgroundColor = `var(--nhbea-royal-blue-dark)`;
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
            {config.instagramHandle && (
              <a
                href={`https://instagram.com/${config.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 text-white rounded-full transition-colors"
                style={{ backgroundColor: `#e91e63` }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.backgroundColor = `#c2185b`;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.backgroundColor = `#e91e63`;
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}