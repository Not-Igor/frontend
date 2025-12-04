import React from 'react';
import { FriendRequest } from '../services/friendService';

interface FriendRequestListProps {
  requests: FriendRequest[];
  onRespond: (requestId: number, accepted: boolean) => void;
  isResponding: boolean;
}

const FriendRequestList: React.FC<FriendRequestListProps> = ({ requests, onRespond, isResponding }) => {
  if (requests.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">Geen openstaande vriendschapsverzoeken</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => {
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.senderUsername}`;
        
        return (
          <div key={request.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={avatarUrl}
                  alt={request.senderUsername}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-800">{request.senderUsername}</p>
                  <p className="text-sm text-gray-500">wil vrienden worden</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onRespond(request.id, true)}
                  disabled={isResponding}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Accepteren
                </button>
                <button
                  onClick={() => onRespond(request.id, false)}
                  disabled={isResponding}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Weigeren
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
