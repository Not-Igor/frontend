import React from 'react';
import { useTranslation } from 'react-i18next';
import { FriendSuggestion } from '../services/friendService';

interface FriendSuggestionsProps {
  suggestions: FriendSuggestion[];
  onSendRequest: (username: string) => void;
  isSending: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

const FriendSuggestions: React.FC<FriendSuggestionsProps> = ({
  suggestions,
  onSendRequest,
  isSending,
  isLoading,
  onLoadMore,
  hasMore,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">{t('friends.suggestions.loading')}</span>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p className="mt-4 text-gray-600">{t('friends.suggestions.noSuggestions')}</p>
        <p className="mt-2 text-sm text-gray-500">{t('friends.suggestions.noSuggestionsHint')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800">{t('friends.suggestions.peopleYouMayKnow')}</h3>
          </div>
          <span className="bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full">
            {suggestions.length}
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-200 max-h-[450px] overflow-y-auto">
        {suggestions.map((suggestion) => {
          const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${suggestion.username}`;
          
          return (
            <div
              key={suggestion.id}
              className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <img
                      src={avatarUrl}
                      alt={suggestion.username}
                      className="h-12 w-12 sm:h-14 sm:w-14 rounded-full ring-2 ring-purple-100"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                      {suggestion.username}
                    </p>
                    <div className="flex items-center mt-1">
                      <svg className="h-4 w-4 text-indigo-500 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {suggestion.mutualFriendsCount === 1
                          ? t('friends.suggestions.mutualFriend')
                          : t('friends.suggestions.mutualFriends', { count: suggestion.mutualFriendsCount })}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onSendRequest(suggestion.username)}
                  disabled={isSending}
                  className="flex-shrink-0 px-3 py-2 sm:px-4 sm:py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="hidden sm:inline">{t('friends.suggestions.add')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && !isLoading && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onLoadMore}
            className="w-full py-3 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t('friends.suggestions.loadMore')}
          </button>
        </div>
      )}
    </div>
  );
};

export default FriendSuggestions;
