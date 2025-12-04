import React from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
}

interface UserSearchDropdownProps {
  users: User[];
  onSelectUser: (user: User) => void;
}

const UserSearchDropdown: React.FC<UserSearchDropdownProps> = ({ users, onSelectUser }) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
      {users.map((user) => {
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;
        
        return (
          <button
            key={user.id}
            onClick={() => onSelectUser(user)}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
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
          </button>
        );
      })}
    </div>
  );
};

export default UserSearchDropdown;
