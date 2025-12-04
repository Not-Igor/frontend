import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface UserSearchBarProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({ onSearch, isLoading }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const previousSearchRef = useRef<string>('');

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  }, []);

  // Debounce effect - only search if value actually changed
  useEffect(() => {
    const trimmedSearch = searchTerm.trim();
    
    // Don't search if less than 2 characters
    if (trimmedSearch.length < 2) {
      previousSearchRef.current = '';
      return;
    }

    // Don't search if the value hasn't changed
    if (trimmedSearch === previousSearchRef.current) {
      return;
    }

    const handler = setTimeout(() => {
      previousSearchRef.current = trimmedSearch;
      onSearch(trimmedSearch);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearch]);

  return (
    <div className="relative mb-8">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={t('friends.searchPlaceholder')}
        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoComplete="off"
      />
      
      {/* Search icon */}
      <svg 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      
      {searchTerm.trim().length > 0 && searchTerm.trim().length < 2 && (
        <p className="mt-2 text-sm text-gray-500">
          {t('friends.searchMinLength', { count: 2 - searchTerm.trim().length })}
        </p>
      )}
    </div>
  );
};

export default UserSearchBar;
