import React from 'react';
import { UserSearchResult } from '../services/friendService';

interface UserSearchDropdownProps {
  users: UserSearchResult[];
  onSelectUser: (user: UserSearchResult) => void;
  searchError?: string | null;
}

const UserSearchDropdown: React.FC<UserSearchDropdownProps> = ({ users, onSelectUser, searchError }) => {
  // Show error message if present
  if (searchError) {
    return (
      <div className="absolute left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
        <div className="px-4 py-4 flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-600 text-sm">{searchError}</p>
        </div>
      </div>
    );
  }

  // Don't show dropdown if no users
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 z-10 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto">
      {users.map((user) => {
        const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`;
        
        return (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            <img
              src={avatarUrl}
              alt={user.username}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.username}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserSearchDropdown;
