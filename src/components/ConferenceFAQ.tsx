'use client';

import React, { useState, useMemo } from 'react';
import { ConferenceFAQ } from '@/types/conference';
import { Button } from '@/components/ui/button';

interface ConferenceFAQProps {
  faqs: ConferenceFAQ[];
  className?: string;
}

interface FAQItemProps {
  faq: ConferenceFAQ;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'registration': return 'bg-blue-100 text-blue-800';
      case 'venue': return 'bg-green-100 text-green-800';
      case 'sessions': return 'bg-purple-100 text-purple-800';
      case 'accommodation': return 'bg-orange-100 text-orange-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'registration':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'venue':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
        );
      case 'sessions':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'accommodation':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093v.636M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 16h.01" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 shadow-sm hover:shadow-lg transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-xl"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(faq.category)}`}>
                {getCategoryIcon(faq.category)}
                <span className="ml-1 capitalize">{faq.category}</span>
              </span>
              {faq.tags && faq.tags.length > 0 && (
                <div className="hidden sm:flex space-x-1">
                  {faq.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {faq.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{faq.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 pr-4">
              {faq.question}
            </h3>
          </div>
          <div className="flex-shrink-0 ml-4">
            <svg
              className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-4">
          <div className="prose prose-gray max-w-none">
            {faq.answer.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Last Updated */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Last updated: {faq.lastUpdated.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConferenceFAQ({ faqs, className = '' }: ConferenceFAQProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set());
  const [showFAQForm, setShowFAQForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(faqs.map(faq => faq.category))];
    return uniqueCategories.sort();
  }, [faqs]);

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    let filtered = faqs;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term) ||
        faq.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Sort by order
    return filtered.sort((a, b) => a.order - b.order);
  }, [faqs, searchTerm, selectedCategory]);

  const toggleFAQ = (faqId: string) => {
    const newOpenFAQs = new Set(openFAQs);
    if (newOpenFAQs.has(faqId)) {
      newOpenFAQs.delete(faqId);
    } else {
      newOpenFAQs.add(faqId);
    }
    setOpenFAQs(newOpenFAQs);
  };

  const expandAll = () => {
    setOpenFAQs(new Set(filteredFAQs.map(faq => faq.id)));
  };

  const collapseAll = () => {
    setOpenFAQs(new Set());
  };

  const handleFAQSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newQuestion.trim()) return;

    // In a real implementation, this would submit to an API
    console.log('New FAQ question submitted:', newQuestion);
    
    // Reset form
    setNewQuestion('');
    setShowFAQForm(false);
    
    // Show success message (in a real implementation, you'd use a toast or notification)
    alert('Thank you for your question! We\'ll review it and add it to our FAQ if appropriate.');
  };

  const getCategoryStats = () => {
    const stats: { [key: string]: number } = {};
    faqs.forEach(faq => {
      stats[faq.category] = (stats[faq.category] || 0) + 1;
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            <span className="conference-gradient-text">Frequently Asked Questions</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Find answers to common questions about our conference. Can't find what you're looking for? Submit your question below!
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories ({faqs.length})</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)} ({categoryStats[category]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Button
                onClick={expandAll}
                variant="outline"
                size="sm"
                disabled={filteredFAQs.length === 0}
              >
                Expand All
              </Button>
              <Button
                onClick={collapseAll}
                variant="outline" 
                size="sm"
                disabled={openFAQs.size === 0}
              >
                Collapse All
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Showing {filteredFAQs.length} of {faqs.length} questions
              </span>
              <Button
                onClick={() => setShowFAQForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093v.636M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 16h.01" />
                </svg>
                Ask Question
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Items */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openFAQs.has(faq.id)}
                onToggle={() => toggleFAQ(faq.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093v.636M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? `No questions match "${searchTerm}". Try adjusting your search terms.`
                : 'No questions in the selected category. Try selecting a different category.'
              }
            </p>
            <div className="flex justify-center space-x-3">
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')} variant="outline">
                  Clear Search
                </Button>
              )}
              {selectedCategory !== 'all' && (
                <Button onClick={() => setSelectedCategory('all')} variant="outline">
                  View All Categories
                </Button>
              )}
              <Button onClick={() => setShowFAQForm(true)} className="bg-blue-600 hover:bg-blue-700">
                Ask a Question
              </Button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {filteredFAQs.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">FAQ Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-4 rounded-xl text-center transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                  }`}
                >
                  <div className="text-2xl font-bold mb-1">{categoryStats[category]}</div>
                  <div className="text-sm capitalize">{category}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FAQ Submission Modal */}
      {showFAQForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Ask a Question</h3>
                <button
                  onClick={() => setShowFAQForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Can't find the answer you're looking for? Submit your question and we'll consider adding it to our FAQ section.
              </p>

              <form onSubmit={handleFAQSubmission}>
                <div className="mb-6">
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Question *
                  </label>
                  <textarea
                    id="question"
                    rows={4}
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="What would you like to know about the conference?"
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">
                        Before submitting
                      </h4>
                      <div className="mt-1 text-sm text-blue-700">
                        <p>Please check if your question is already answered above. We review all submissions and will add relevant questions to help future attendees.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    onClick={() => setShowFAQForm(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!newQuestion.trim()}
                  >
                    Submit Question
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}