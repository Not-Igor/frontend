import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserSelector from './UserSelector';

interface AddFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFriends: (friendIds: number[]) => void;
  existingParticipantIds: number[];
}

const AddFriendsModal: React.FC<AddFriendsModalProps> = ({
  isOpen,
  onClose,
  onAddFriends,
  existingParticipantIds,
}) => {
  const { t } = useTranslation();
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const handleToggleUser = (userId: number) => {
    if (existingParticipantIds.includes(userId)) {
      return;
    }
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = () => {
    if (selectedUserIds.length === 0) return;
    onAddFriends(selectedUserIds);
    setSelectedUserIds([]);
  };

  const handleClose = () => {
    setSelectedUserIds([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{t('competition.addFriends')}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <UserSelector 
            selectedUserIds={selectedUserIds} 
            onToggleUser={handleToggleUser}
            existingParticipantIds={existingParticipantIds}
          />

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedUserIds.length === 0}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('competition.addButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFriendsModal;
