import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type SortOption = 'title' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

interface CompetitionFilterProps {
  userFilter: string;
  onUserFilterChange: (value: string) => void;
  sortOption: SortOption;
  onSortOptionChange: (value: SortOption) => void;
  sortDirection: SortDirection;
  onSortDirectionChange: (value: SortDirection) => void;
}

const CompetitionFilter: React.FC<CompetitionFilterProps> = ({
  userFilter,
  onUserFilterChange,
  sortOption,
  onSortOptionChange,
  sortDirection,
  onSortDirectionChange,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const resetFilters = () => {
    onUserFilterChange('');
    onSortOptionChange('createdAt');
    onSortDirectionChange('desc');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4"
      >
        <span className="font-semibold text-gray-800">
          {t('filter.title')}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* User Filter */}
            <div className="col-span-1">
              <label htmlFor="user-filter" className="block text-sm font-medium text-gray-700 mb-1">
                {t('filter.filterByUser')}
              </label>
              <input
                type="text"
                id="user-filter"
                value={userFilter}
                onChange={(e) => onUserFilterChange(e.target.value)}
                placeholder={t('filter.enterUsername')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            {/* Sort By */}
            <div className="col-span-1">
              <label htmlFor="sort-option" className="block text-sm font-medium text-gray-700 mb-1">
                {t('filter.sortBy')}
              </label>
              <select
                id="sort-option"
                value={sortOption}
                onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
              >
                <option value="createdAt">{t('filter.creationDate')}</option>
                <option value="title">{t('filter.alphabetical')}</option>
              </select>
            </div>

            {/* Sort Direction */}
            <div className="col-span-1 flex justify-start md:justify-end">
              <div className="flex rounded-lg border border-gray-300 p-0.5 bg-gray-100">
                <button
                  onClick={() => onSortDirectionChange('asc')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    sortDirection === 'asc'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {sortOption === 'title' ? 'A-Z' : t('filter.ascending')}
                </button>
                <button
                  onClick={() => onSortDirectionChange('desc')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    sortDirection === 'desc'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {sortOption === 'title' ? 'Z-A' : t('filter.descending')}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              {t('filter.reset')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionFilter;
