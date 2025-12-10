import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import botService, { BotDto } from '../services/botService';

interface ManageBotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  competitionId: number;
  onBotsUpdated: () => void;
}

const ManageBotsModal: React.FC<ManageBotsModalProps> = ({
  isOpen,
  onClose,
  competitionId,
  onBotsUpdated
}) => {
  const { t } = useTranslation();
  const [botCount, setBotCount] = useState(0);
  const [botNames, setBotNames] = useState<string[]>(['', '', '']);
  const [existingBots, setExistingBots] = useState<BotDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadExistingBots();
    }
  }, [isOpen, competitionId]);

  const loadExistingBots = async () => {
    try {
      const bots = await botService.getBots(competitionId);
      setExistingBots(bots);
      setBotCount(bots.length);
      const names = ['', '', ''];
      bots.forEach((bot, index) => {
        if (index < 3) {
          names[index] = bot.username;
        }
      });
      setBotNames(names);
    } catch (err) {
      console.error('Failed to load bots:', err);
    }
  };

  const getAvatarUrl = (username: string) => {
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username || 'default'}`;
  };

  const handleBotCountChange = (direction: 'up' | 'down') => {
    setBotCount(prev => {
      if (direction === 'up' && prev < 3) return prev + 1;
      if (direction === 'down' && prev > 0) return prev - 1;
      return prev;
    });
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...botNames];
    newNames[index] = value;
    setBotNames(newNames);
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      // Validate that all names are filled for the selected count
      const selectedNames = botNames.slice(0, botCount);
      if (selectedNames.some(name => !name.trim())) {
        setError(t('bots.errors.emptyNames'));
        setLoading(false);
        return;
      }

      await botService.createBots(competitionId, {
        count: botCount,
        usernames: selectedNames
      });

      onBotsUpdated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || t('bots.errors.saveFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">{t('bots.title')}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-white text-opacity-90 mt-2">{t('bots.description')}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Bot Count Selector */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {t('bots.countLabel')}
            </label>
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={() => handleBotCountChange('down')}
                disabled={botCount === 0}
                className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-110 flex items-center justify-center text-purple-600 font-bold text-xl"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {botCount}
                </span>
              </div>

              <button
                onClick={() => handleBotCountChange('up')}
                disabled={botCount === 3}
                className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-110 flex items-center justify-center text-purple-600 font-bold text-xl"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
            <p className="text-center text-sm text-gray-600 mt-3">
              {t('bots.maxBots', { max: 3 })}
            </p>
          </div>

          {/* Bot Name Fields */}
          {botCount > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">{t('bots.namesBots')}</h3>
              {Array.from({ length: botCount }).map((_, index) => (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors">
                  <div className="flex items-center space-x-4">
                    {/* Avatar Preview */}
                    <div className="flex-shrink-0">
                      <img
                        src={getAvatarUrl(botNames[index])}
                        alt={`Bot ${index + 1}`}
                        className="w-16 h-16 rounded-full ring-4 ring-purple-100"
                      />
                    </div>

                    {/* Input Field */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('bots.botNumber', { number: index + 1 })}
                      </label>
                      <input
                        type="text"
                        value={botNames[index]}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        placeholder={t('bots.namePlaceholder')}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        maxLength={20}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Info Box */}
          {botCount === 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-700">{t('bots.noBotsInfo')}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-xl border-t-2 border-gray-200 flex justify-end space-x-3 z-10">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t('common.saving')}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('common.save')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageBotsModal;
