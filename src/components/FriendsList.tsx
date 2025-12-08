import React from 'react';
import { useTranslation } from 'react-i18next';

interface Friend {
  id: number;
  username: string;
}

interface FriendsListProps {
  friends: Friend[];
  isLoading: boolean;
}

const FriendsList: React.FC<FriendsListProps> = ({ friends, isLoading }) => {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">{t('friends.list.loading')}</span>
        </div>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="mt-4 text-gray-600">{t('friends.list.emptyMessage')}</p>
        <p className="mt-2 text-sm text-gray-500">{t('friends.list.emptyHint')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{t('friends.myFriends')}</h3>
          <span className="bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full">
            {friends.length}
          </span>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {friends.map((friend) => {
            const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${friend.username}`;
            
            return (
              <div
                key={friend.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={avatarUrl}
                      alt={friend.username}
                      className="h-12 w-12 rounded-full ring-2 ring-indigo-100"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-gray-900 truncate">
                      {friend.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t('friends.friend')}
                    </p>
                  </div>
                  <div>
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
