import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmojiPicker from './EmojiPicker';
import UserSelector from './UserSelector';

interface CreateCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, icon: string, participantIds: number[]) => void;
}

const CreateCompetitionModal: React.FC<CreateCompetitionModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🏆');
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [error, setError] = useState('');

  const handleToggleUser = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError(t('competition.errors.selectTitle'));
      return;
    }

    // Allow solo competitions - no participants required
    onCreate(title.trim(), selectedEmoji, selectedUserIds);
    
    // Reset form
    setTitle('');
    setSelectedEmoji('🏆');
    setSelectedUserIds([]);
    setError('');
  };

  const handleClose = () => {
    setTitle('');
    setSelectedEmoji('🏆');
    setSelectedUserIds([]);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('competition.createNew')}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              {t('competition.competitionTitle')}
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('competition.placeholder.title')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              maxLength={50}
            />
            <p className="mt-1 text-sm text-gray-500">{t('competition.characterCount', { count: title.length })}</p>
          </div>

          {/* Emoji Picker */}
          <EmojiPicker selectedEmoji={selectedEmoji} onSelectEmoji={setSelectedEmoji} />

          {/* User Selector */}
          <UserSelector selectedUserIds={selectedUserIds} onToggleUser={handleToggleUser} />

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              {t('competition.createButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCompetitionModal;
