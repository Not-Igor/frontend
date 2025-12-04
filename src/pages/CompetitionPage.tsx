import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import competitionService, { CompetitionDto, ParticipantDto } from '../services/competitionService';

const CompetitionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState<CompetitionDto | null>(null);
  const [participants, setParticipants] = useState<ParticipantDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    loadCompetition();
  }, [id, navigate]);

  const loadCompetition = async () => {
    try {
      if (!id) return;
      
      const competitionData = await competitionService.getCompetition(Number(id));
      setCompetition(competitionData);
      
      const participantsData = await competitionService.getParticipants(Number(id));
      setParticipants(participantsData);
    } catch (err: any) {
      console.error('Failed to load competition:', err);
      setError('Failed to load competition');
    } finally {
      setLoading(false);
    }
  };

  const getAvatarUrl = (username: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading competition...</div>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Competition not found'}
          </h2>
          <button
            onClick={() => navigate('/home')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/home')}
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-6xl">{competition.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{competition.title}</h1>
              <p className="text-gray-500 mt-1">
                Created by {competition.creator.username} on {new Date(competition.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Participants ({participants.length})
          </h2>
          <div className="space-y-2">
            {participants.map((participant, index) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={getAvatarUrl(participant.username)}
                      alt={participant.username}
                      className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm"
                    />
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-gray-900">{participant.username}</span>
                </div>
                <span className="text-2xl font-bold text-indigo-600">{participant.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard/Stats - Placeholder */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Leaderboard</h2>
          <div className="text-center py-8 text-gray-500">
            <p>No scores yet. Start competing!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionPage;
