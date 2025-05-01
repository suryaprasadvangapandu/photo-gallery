import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="relative max-w-md mx-auto mb-8">
      <input
        type="text"
        placeholder="Search by title or tags..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-2 pl-10 pr-10 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
      />
      <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="Clear search"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;