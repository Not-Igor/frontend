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
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={avatarUrl}
            alt={user.username}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{user.username}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => onSendRequest(user.username)}
          disabled={isSending}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSending ? 'Verzenden...' : 'Vriendschapsverzoek sturen'}
        </button>
      </div>
    </div>
  );
};

export default UserSearchResult;
