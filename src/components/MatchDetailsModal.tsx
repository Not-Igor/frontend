import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MatchDto, MatchStatus } from '../services/matchService';
import authService from '../services/authService';

interface MatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchDto | null;
  onSubmitScores: (scores: Record<number, number>) => Promise<void>;
}

const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({
  isOpen,
  onClose,
  match,
  onSubmitScores,
}) => {
  const { t } = useTranslation();
  const [scores, setScores] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (match && isOpen) {
      // Initialize scores from existing data or defaults
      const initialScores: Record<number, number> = {};
      
      if (match.scores && match.scores.length > 0) {
        match.scores.forEach(score => {
          initialScores[score.userId] = score.score;
        });
      } else {
        match.participants.forEach(participant => {
          initialScores[participant.id] = 0;
        });
      }
      
      setScores(initialScores);
      setIsEditing(false); // Reset editing state when modal opens
    }
  }, [match, isOpen]);

  const handleScoreChange = (userId: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setScores(prev => ({ ...prev, [userId]: numValue }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitScores(scores);
      setIsEditing(false);
      // Don't close modal, just refresh
    } catch (error) {
      console.error('Failed to submit scores:', error);
      alert(t('match.errors.submitFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvatarUrl = (username: string) => {
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`;
  };

  const currentUser = authService.getCurrentUser();
  const isParticipant = match?.participants.some(p => p.id === currentUser?.id);
  const canEditScores = isParticipant && (match?.status === MatchStatus.IN_PROGRESS || (match?.status === MatchStatus.COMPLETED && isEditing));

  if (!isOpen || !match) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{match.title}</h2>
              <p className="text-sm text-gray-500">
                {t('common.status')}: <span className={`font-medium ${
                  match.status === MatchStatus.COMPLETED ? 'text-green-600' :
                  match.status === MatchStatus.IN_PROGRESS ? 'text-blue-600' :
                  'text-gray-600'
                }`}>{match.status === MatchStatus.COMPLETED ? t('match.status.completed') : t('match.status.ongoing')}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scores Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('match.participantsScores')}</h3>
            <div className="space-y-3">
              {match.participants.map((participant) => {
                const participantScore = match.scores?.find(s => s.userId === participant.id);
                const isConfirmed = participantScore?.confirmed || false;

                return (
                  <div
                    key={participant.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                      isConfirmed ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={getAvatarUrl(participant.username)}
                        alt={participant.username}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{participant.username}</p>
                        {isConfirmed && (
                          <p className="text-xs text-green-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {t('common.confirmed')}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Score input/display */}
                    {canEditScores ? (
                      <input
                        type="number"
                        min="0"
                        value={scores[participant.id] || 0}
                        onChange={(e) => handleScoreChange(participant.id, e.target.value)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-bold text-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-indigo-600">
                        {participantScore?.score ?? scores[participant.id] ?? 0}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {t('common.close')}
            </button>

            {/* Participant can submit scores when match is IN_PROGRESS */}
            {isParticipant && match.status === MatchStatus.IN_PROGRESS && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? t('match.submitting') : t('match.submitScores')}
              </button>
            )}

            {/* Edit button when match is COMPLETED */}
            {isParticipant && match.status === MatchStatus.COMPLETED && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                {t('match.editScores')}
              </button>
            )}

            {/* Save edited scores */}
            {isParticipant && match.status === MatchStatus.COMPLETED && isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? t('match.saving') : t('match.saveChanges')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsModal;
