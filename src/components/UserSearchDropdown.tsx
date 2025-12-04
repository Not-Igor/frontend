import React from 'react';
import { UserSearchResult } from '../services/friendService';

interface UserSearchDropdownProps {
  users: UserSearchResult[];
  onSelectUser: (user: UserSearchResult) => void;
}

const UserSearchDropdown: React.FC<UserSearchDropdownProps> = ({ users, onSelectUser }) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto">
      {users.map((user) => {
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;
        
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
