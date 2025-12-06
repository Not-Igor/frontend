import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import competitionService, { CompetitionDto, ParticipantDto } from '../services/competitionService';
import matchService, { MatchDto } from '../services/matchService';
import CreateMatchModal from '../components/CreateMatchModal';
import MatchDetailsModal from '../components/MatchDetailsModal';

type TabType = 'info' | 'matches';

const CompetitionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState<CompetitionDto | null>(null);
  const [participants, setParticipants] = useState<ParticipantDto[]>([]);
  const [matches, setMatches] = useState<MatchDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [isCreateMatchModalOpen, setIsCreateMatchModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchDto | null>(null);
  const [isMatchDetailsOpen, setIsMatchDetailsOpen] = useState(false);

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

      const matchesData = await matchService.getMatchesByCompetition(Number(id));
      setMatches(matchesData);
    } catch (err: any) {
      console.error('Failed to load competition:', err);
      setError('Failed to load competition');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatch = async (title: string, participantIds: number[]) => {
    if (!id) return;
    
    await matchService.createMatch({
      competitionId: Number(id),
      title,
      participantIds,
    });
    
    const matchesData = await matchService.getMatchesByCompetition(Number(id));
    setMatches(matchesData);
  };

  const handleMatchClick = async (match: MatchDto) => {
    // Reload match data to get latest scores
    const updatedMatch = await matchService.getMatch(match.id);
    setSelectedMatch(updatedMatch);
    setIsMatchDetailsOpen(true);
  };

  const handleSubmitScores = async (scores: Record<number, number>) => {
    if (!selectedMatch) return;
    
    await matchService.submitScores(selectedMatch.id, scores);
    
    if (!id) return;
    const matchesData = await matchService.getMatchesByCompetition(Number(id));
    setMatches(matchesData);
    
    // Reload the selected match to show updated data
    const updatedMatch = await matchService.getMatch(selectedMatch.id);
    setSelectedMatch(updatedMatch);
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

  const isCreator = competition && authService.getCurrentUser()?.id === competition.creator.id;

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

          {/* Tabs */}
          <div className="flex space-x-1 mt-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'info'
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Info
              {activeTab === 'info' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === 'matches'
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Matches
              {activeTab === 'matches' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
              )}
            </button>
          </div>
        </div>

        {/* Info Tab Content */}
        {activeTab === 'info' && (
          <>
            {/* Create Match Button */}
            {isCreator && (
              <button
                onClick={() => setIsCreateMatchModalOpen(true)}
                className="w-full mb-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">Create a Match</span>
              </button>
            )}

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

            {/* Leaderboard */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Leaderboard</h2>
              <div className="text-center py-8 text-gray-500">
                <p>No scores yet. Start competing!</p>
              </div>
            </div>
          </>
        )}

        {/* Matches Tab Content */}
        {activeTab === 'matches' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Matches ({matches.length})</h2>
            {matches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No matches yet. Create your first match!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    onClick={() => handleMatchClick(match)}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">{match.title}</h3>
                        <p className="text-sm text-gray-500">
                          {match.participants.length} participants • {match.status}
                          {match.scoresSubmitted && match.status !== 'COMPLETED' && (
                            <span className="ml-2 text-blue-600">• Scores pending</span>
                          )}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {match.participants.slice(0, 3).map((participant) => (
                          <img
                            key={participant.id}
                            src={getAvatarUrl(participant.username)}
                            alt={participant.username}
                            className="w-8 h-8 rounded-full ring-2 ring-white"
                          />
                        ))}
                        {match.participants.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                            +{match.participants.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Match Modal */}
      <CreateMatchModal
        isOpen={isCreateMatchModalOpen}
        onClose={() => setIsCreateMatchModalOpen(false)}
        onCreateMatch={handleCreateMatch}
        participants={participants}
        matchNumber={matches.length + 1}
      />

      {/* Match Details Modal */}
      <MatchDetailsModal
        isOpen={isMatchDetailsOpen}
        onClose={() => {
          setIsMatchDetailsOpen(false);
          setSelectedMatch(null);
        }}
        match={selectedMatch}
        onSubmitScores={handleSubmitScores}
      />
    </div>
  );
};

export default CompetitionPage;
