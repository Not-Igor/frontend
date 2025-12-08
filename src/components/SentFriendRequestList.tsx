import React from 'react';
import { FriendRequest } from '../services/friendService';

interface SentFriendRequestListProps {
  requests: FriendRequest[];
  onCancel: (requestId: number) => void;
  isCancelling: boolean;
}

const SentFriendRequestList: React.FC<SentFriendRequestListProps> = ({
  requests,
  onCancel,
  isCancelling,
}) => {
  const getAvatarUrl = (username: string) => {
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`;
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No pending friend requests sent</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div
          key={request.requestId}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <img
              src={getAvatarUrl(request.senderUsername)}
              alt={request.senderUsername}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900">{request.senderUsername}</p>
              <p className="text-sm text-gray-500">Pending...</p>
            </div>
          </div>
          <button
            onClick={() => onCancel(request.requestId)}
            disabled={isCancelling}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCancelling ? 'Cancelling...' : 'Cancel'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SentFriendRequestList;
