import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiService from '../services/apiService';
import authService from '../services/authService';

interface User {
  id: number;
  username: string;
  email: string | null;
  role: string;
}

interface UserSelectorProps {
  selectedUserIds: number[];
  onToggleUser: (userId: number) => void;
  existingParticipantIds?: number[];
}

const UserSelector: React.FC<UserSelectorProps> = ({ selectedUserIds, onToggleUser, existingParticipantIds = [] }) => {
  const { t } = useTranslation();
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const user = authService.getUser();
      if (!user) return;

      const friendsList = await apiService.get<any[]>(`/users/friends/${user.id}`);
      
      // Map friend DTOs to User objects
      const friendUsers: User[] = friendsList.map(friend => ({
        id: friend.id,
        username: friend.username,
        email: null,
        role: 'USER'
      }));

      setFriends(friendUsers);
    } catch (err: any) {
      console.error('Failed to load friends:', err);
      setError(t('userSelector.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500">
        {t('userSelector.loadingFriends')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        {error}
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        {t('userSelector.noFriends')}
      </div>
    );
  }

  const getAvatarUrl = (username: string) => {
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`;
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('competition.selectParticipants')}
      </label>
      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-sm">
        {friends.map((friend) => {
          const isSelected = selectedUserIds.includes(friend.id);
          const isExisting = existingParticipantIds.includes(friend.id);
          return (
            <div
              key={friend.id}
              className={`flex items-center p-4 border-b last:border-b-0 transition-all ${
                isExisting
                  ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                  : isSelected 
                    ? 'bg-indigo-50 hover:bg-indigo-100 cursor-pointer' 
                    : 'bg-white hover:bg-gray-50 cursor-pointer'
              }`}
              onClick={() => !isExisting && onToggleUser(friend.id)}
            >
              <input
                type="checkbox"
                checked={isSelected || isExisting}
                onChange={() => !isExisting && onToggleUser(friend.id)}
                disabled={isExisting}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-50"
                onClick={(e) => e.stopPropagation()}
              />
              
              <img
                src={getAvatarUrl(friend.username)}
                alt={friend.username}
                className="ml-3 h-10 w-10 rounded-full ring-2 ring-white shadow-sm"
              />
              
              <label className={`ml-3 block text-sm font-medium flex-grow ${isExisting ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 cursor-pointer'}`}>
                {friend.username}
                {isExisting && <span className="text-xs text-gray-400 ml-2">({t('userSelector.alreadyParticipant')})</span>}
              </label>
              
              {(isSelected || isExisting) && (
                <svg className={`h-5 w-5 ${isExisting ? 'text-gray-400' : 'text-indigo-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <p className="text-gray-500">
          {t('userSelector.selectedCount', { count: selectedUserIds.length })}
        </p>
        {selectedUserIds.length > 0 && (
          <button
            type="button"
            onClick={() => selectedUserIds.forEach(id => onToggleUser(id))}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {t('userSelector.clearAll')}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserSelector;
