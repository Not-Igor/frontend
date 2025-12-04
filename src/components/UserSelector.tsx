import React, { useEffect, useState } from 'react';
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
}

const UserSelector: React.FC<UserSelectorProps> = ({ selectedUserIds, onToggleUser }) => {
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

      const friendsList = await apiService.get<any[]>(`/friends/${user.id}`);
      
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
      setError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500">
        Loading friends...
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
        You don't have any friends yet. Add some friends first!
      </div>
    );
  }

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Participants
      </label>
      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center p-3 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer"
            onClick={() => onToggleUser(friend.id)}
          >
            <input
              type="checkbox"
              checked={selectedUserIds.includes(friend.id)}
              onChange={() => onToggleUser(friend.id)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
            <label className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer flex-grow">
              {friend.username}
            </label>
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-500">
        {selectedUserIds.length} participant{selectedUserIds.length !== 1 ? 's' : ''} selected
      </p>
    </div>
  );
};

export default UserSelector;
