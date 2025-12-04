import React from 'react';
import { UserSearchResult as UserSearchResultType } from '../services/friendService';

interface UserSearchResultProps {
  user: UserSearchResultType;
  onSendRequest: (username: string) => void;
  isSending: boolean;
}

const UserSearchResult: React.FC<UserSearchResultProps> = ({ user, onSendRequest, isSending }) => {
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <img
            src={avatarUrl}
            alt={user.username}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">{user.username}</h3>
            <p className="text-sm sm:text-base text-gray-600 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => onSendRequest(user.username)}
          disabled={isSending}
          className="flex-shrink-0 p-3 sm:px-6 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          title={isSending ? 'Verzenden...' : 'Vriendschapsverzoek sturen'}
        >
          {/* Mobile: Icon only */}
          <span className="sm:hidden">
            {isSending ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            )}
          </span>
          {/* Desktop: Full text */}
          <span className="hidden sm:inline">
            {isSending ? 'Verzenden...' : 'Vriendschapsverzoek sturen'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default UserSearchResult;
