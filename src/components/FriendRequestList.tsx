import React from 'react';
import { useTranslation } from 'react-i18next';
import { FriendRequest } from '../services/friendService';

interface FriendRequestListProps {
  requests: FriendRequest[];
  onRespond: (requestId: number, accepted: boolean) => void;
  isResponding: boolean;
}

const FriendRequestList: React.FC<FriendRequestListProps> = ({ requests, onRespond, isResponding }) => {
  const { t } = useTranslation();
  if (requests.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">{t('friends.requests.noPendingRequests')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => {
        const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${request.senderUsername}`;
        
        return (
          <div key={request.requestId} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={avatarUrl}
                  alt={request.senderUsername}
                  className="w-12 h-12 rounded-full flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-800 truncate">{request.senderUsername}</p>
                  <p className="text-sm text-gray-500">{t('friends.wantsToBeFriends')}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {/* Accept button */}
                <button
                  onClick={() => onRespond(request.requestId, true)}
                  disabled={isResponding}
                  className="p-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  title={t('friends.requests.accept')}
                >
                  {/* Mobile: Icon only */}
                  <span className="sm:hidden">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {/* Desktop: Full text */}
                  <span className="hidden sm:inline">{t('friends.requests.accept')}</span>
                </button>
                
                {/* Reject button */}
                <button
                  onClick={() => onRespond(request.requestId, false)}
                  disabled={isResponding}
                  className="p-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  title={t('friends.requests.reject')}
                >
                  {/* Mobile: Icon only */}
                  <span className="sm:hidden">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  {/* Desktop: Full text */}
                  <span className="hidden sm:inline">{t('friends.requests.reject')}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FriendRequestList;
