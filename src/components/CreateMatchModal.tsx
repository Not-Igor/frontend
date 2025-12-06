import React, { useState, useEffect } from 'react';
import { ParticipantDto } from '../services/competitionService';

interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMatch: (title: string, participantIds: number[]) => Promise<void>;
  participants: ParticipantDto[];
  matchNumber: number;
}

const CreateMatchModal: React.FC<CreateMatchModalProps> = ({
  isOpen,
  onClose,
  onCreateMatch,
  participants,
  matchNumber,
}) => {
  const [title, setTitle] = useState(`Match ${matchNumber}`);
  const [selectedParticipants, setSelectedParticipants] = useState<Set<number>>(new Set());
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(`Match ${matchNumber}`);
      setSelectedParticipants(new Set(participants.map(p => p.id)));
    }
  }, [isOpen, matchNumber, participants]);

  const handleToggleParticipant = (participantId: number) => {
    const newSelected = new Set(selectedParticipants);
    if (newSelected.has(participantId)) {
      newSelected.delete(participantId);
    } else {
      newSelected.add(participantId);
    }
    setSelectedParticipants(newSelected);
  };

  const handleCreate = async () => {
    // For 2-player competitions, auto-select both participants
    const participantsToUse = participants.length === 2 
      ? participants.map(p => p.id)
      : Array.from(selectedParticipants);

    if (participantsToUse.length < 2) {
      alert('Please select at least 2 participants');
      return;
    }

    setIsCreating(true);
    try {
      await onCreateMatch(title, participantsToUse);
      onClose();
    } catch (error) {
      console.error('Failed to create match:', error);
      alert('Failed to create match');
    } finally {
      setIsCreating(false);
    }
  };

  const getAvatarUrl = (username: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Match</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Match Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Match title"
            />
          </div>

          {/* Participants Selection - Only show if more than 2 participants */}
          {participants.length > 2 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Participants ({selectedParticipants.size} selected)
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {participants.map((participant) => (
                <div
                  key={participant.id}
                  onClick={() => handleToggleParticipant(participant.id)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    selectedParticipants.has(participant.id)
                      ? 'bg-indigo-50 border-2 border-indigo-500'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={getAvatarUrl(participant.username)}
                      alt={participant.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="font-medium text-gray-900">{participant.username}</span>
                  </div>
                  <div className="flex items-center">
                    {selectedParticipants.has(participant.id) && (
                      <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}

          {/* Info message for 2-player competitions */}
          {participants.length === 2 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                All participants will automatically play in this match.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isCreating}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={isCreating || (participants.length > 2 && selectedParticipants.size < 2)}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Start Match'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMatchModal;
