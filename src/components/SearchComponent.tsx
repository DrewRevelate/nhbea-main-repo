'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search query:', searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-48 px-4 py-2 pr-10 text-sm border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--nhbea-royal-blue)] focus:border-transparent transition-all"
          aria-label="Search NHBEA website"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--nhbea-royal-blue)] transition-colors"
          aria-label="Submit search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
