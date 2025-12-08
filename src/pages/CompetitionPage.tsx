import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';
import competitionService, { CompetitionDto, ParticipantDto } from '../services/competitionService';
import matchService, { MatchDto } from '../services/matchService';
import CreateMatchModal from '../components/CreateMatchModal';
import MatchDetailsModal from '../components/MatchDetailsModal';
import AddFriendsModal from '../components/AddFriendsModal';
import ConfirmationModal from '../components/ConfirmationModal';

type TabType = 'info' | 'matches';

const CompetitionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [competition, setCompetition] = useState<CompetitionDto | null>(null);
  const [participants, setParticipants] = useState<ParticipantDto[]>([]);
  const [matches, setMatches] = useState<MatchDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [isCreateMatchModalOpen, setIsCreateMatchModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchDto | null>(null);
  const [isMatchDetailsOpen, setIsMatchDetailsOpen] = useState(false);
  const [matchFilter, setMatchFilter] = useState<'all' | 'ongoing' | 'completed'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddFriendsModalOpen, setIsAddFriendsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

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
      setError(t('competition.errors.loadFailed'));
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
    
    // Reload matches
    const matchesData = await matchService.getMatchesByCompetition(Number(id));
    setMatches(matchesData);
    
    // Reload participants to update scores/rankings
    const participantsData = await competitionService.getParticipants(Number(id));
    setParticipants(participantsData);
    
    // Reload the selected match to show updated data
    const updatedMatch = await matchService.getMatch(selectedMatch.id);
    setSelectedMatch(updatedMatch);
  };

  const handleAddFriends = async (friendIds: number[]) => {
    if (!id) return;
    
    try {
      await competitionService.addParticipants(Number(id), friendIds);
      setIsAddFriendsModalOpen(false);
      loadCompetition();
    } catch (err: any) {
      console.error('Failed to add friends:', err);
      setError(t('competition.errors.addFriendsFailed'));
    }
  };

  const handleLeaveCompetition = async () => {
    if (!id) return;
    
    setIsLeaving(true);
    try {
      await competitionService.leaveCompetition(Number(id));
      navigate('/home');
    } catch (err: any) {
      console.error('Failed to leave competition:', err);
      setError(t('competition.errors.leaveFailed'));
      setIsLeaving(false);
      setIsLeaveModalOpen(false);
    }
  };

  const handleDeleteCompetition = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      await competitionService.deleteCompetition(Number(id));
      navigate('/home');
    } catch (err: any) {
      console.error('Failed to delete competition:', err);
      setError(t('competition.errors.deleteFailed'));
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const getAvatarUrl = (username: string) => {
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`;
  };

  const getFilteredAndSortedMatches = () => {
    let filtered = matches;

    // Filter by status
    if (matchFilter === 'ongoing') {
      filtered = matches.filter(m => m.status === 'IN_PROGRESS');
    } else if (matchFilter === 'completed') {
      filtered = matches.filter(m => m.status === 'COMPLETED');
    }

    // Sort by date
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  };

  const filteredMatches = getFilteredAndSortedMatches();
  const ongoingMatchesCount = matches.filter(m => m.status === 'IN_PROGRESS').length;
  const completedMatchesCount = matches.filter(m => m.status === 'COMPLETED').length;

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">{t('competition.loadingCompetitions')}</div>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || t('competition.errors.loadFailed')}
          </h2>
          <button
            onClick={() => navigate('/home')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {t('common.back')} Home
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
              {t('common.back')}
            </button>

            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {isSettingsOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsSettingsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 border border-gray-200 py-1">
                    <button
                      onClick={() => {
                        setIsSettingsOpen(false);
                        setIsAddFriendsModalOpen(true);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span>{t('competition.addFriends')}</span>
                    </button>
                    
                    {/* Show Delete button for creator, Leave button for participants */}
                    {isCreator ? (
                      <button
                        onClick={() => {
                          setIsSettingsOpen(false);
                          setIsDeleteModalOpen(true);
                        }}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>{t('common.delete')}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsSettingsOpen(false);
                          setIsLeaveModalOpen(true);
                        }}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>{t('competition.leave')}</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-6xl">{competition.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{competition.title}</h1>
              <p className="text-gray-500 mt-1">
                {t('competition.createdByOn', { creator: competition.creator.username, date: new Date(competition.createdAt).toLocaleDateString() })}
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
              {t('competition.info')}
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
              {t('competition.matches')}
              {activeTab === 'matches' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
              )}
            </button>
          </div>
        </div>

        {/* Info Tab Content */}
        {activeTab === 'info' && (
          <>
            {/* Create Match Button - Available for all participants */}
            {competition && authService.getCurrentUser() && 
             competition.participants.some(p => p.id === authService.getCurrentUser()?.id) && (
              <button
                onClick={() => setIsCreateMatchModalOpen(true)}
                className="w-full mb-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">{t('match.createButton')}</span>
              </button>
            )}

            {/* Participants */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t('competition.participants')} ({participants.length})
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
                    <span className="text-2xl font-bold text-indigo-600">{participant.wins}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('leaderboard.title')}</h2>
              {participants.length === 0 || participants.every(p => p.matchesPlayed === 0) ? (
                <div className="text-center py-8 text-gray-500">
                  <p>{t('leaderboard.noMatches')}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">{t('leaderboard.columns.rank')}</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">{t('leaderboard.columns.player')}</th>
                        <th className="text-center py-3 px-3 text-sm font-semibold text-gray-600">{t('leaderboard.columns.matchesPlayed')}</th>
                        <th className="text-center py-3 px-3 text-sm font-semibold text-indigo-600">{t('leaderboard.columns.wins')}</th>
                        <th className="text-center py-3 px-3 text-sm font-semibold text-gray-600">{t('leaderboard.columns.draws')}</th>
                        <th className="text-center py-3 px-3 text-sm font-semibold text-gray-600">{t('leaderboard.columns.losses')}</th>
                        <th className="text-center py-3 px-3 text-sm font-semibold text-gray-600">{t('leaderboard.columns.pointsScored')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((participant, index) => (
                        <tr 
                          key={participant.id}
                          className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            index < 3 ? 'bg-yellow-50' : ''
                          }`}
                        >
                          <td className="py-3 px-2">
                            <div className="flex items-center">
                              {index < 3 ? (
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                                }`}>
                                  {index + 1}
                                </div>
                              ) : (
                                <span className="text-gray-500 font-medium">{index + 1}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={getAvatarUrl(participant.username)}
                                alt={participant.username}
                                className="w-8 h-8 rounded-full"
                              />
                              <span className="font-medium text-gray-900">{participant.username}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center text-gray-700">{participant.matchesPlayed}</td>
                          <td className="py-3 px-3 text-center">
                            <span className="font-bold text-indigo-600 text-lg">{participant.wins}</span>
                          </td>
                          <td className="py-3 px-3 text-center text-gray-700">{participant.draws}</td>
                          <td className="py-3 px-3 text-center text-gray-700">{participant.losses}</td>
                          <td className="py-3 px-3 text-center text-gray-700">{participant.pointsScored}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                    <span><strong>{t('leaderboard.columns.matchesPlayed')}:</strong> {t('leaderboard.legend.matchesPlayed')}</span>
                    <span><strong>{t('leaderboard.columns.wins')}:</strong> {t('leaderboard.legend.wins')}</span>
                    <span><strong>{t('leaderboard.columns.draws')}:</strong> {t('leaderboard.legend.draws')}</span>
                    <span><strong>{t('leaderboard.columns.losses')}:</strong> {t('leaderboard.legend.losses')}</span>
                    <span><strong>{t('leaderboard.columns.pointsScored')}:</strong> {t('leaderboard.legend.pointsScored')}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Matches Tab Content */}
        {activeTab === 'matches' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t('competition.matches')} ({matches.length})</h2>
            </div>

            {/* Filter and Sort Controls */}
            {matches.length > 0 && (
              <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-gray-200">
                {/* Status Filter */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setMatchFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      matchFilter === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('match.filter.all')} ({matches.length})
                  </button>
                  <button
                    onClick={() => setMatchFilter('ongoing')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      matchFilter === 'ongoing'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('match.filter.ongoing')} ({ongoingMatchesCount})
                  </button>
                  <button
                    onClick={() => setMatchFilter('completed')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      matchFilter === 'completed'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('match.filter.completed')} ({completedMatchesCount})
                  </button>
                </div>

                {/* Date Sort - Only show for completed matches */}
                {matchFilter === 'completed' && completedMatchesCount > 0 && (
                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={() => setSortOrder('newest')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        sortOrder === 'newest'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t('match.sort.newest')}
                    </button>
                    <button
                      onClick={() => setSortOrder('oldest')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        sortOrder === 'oldest'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t('match.sort.oldest')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {matches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>{t('match.noMatches')}</p>
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>{t('match.noMatchesFiltered', { filter: t(`match.filter.${matchFilter}`) })}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMatches.map((match) => (
                  <div
                    key={match.id}
                    onClick={() => handleMatchClick(match)}
                    className={`p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-2 ${
                      match.status === 'COMPLETED' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{match.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            match.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {match.status === 'COMPLETED' ? t('match.status.completed') : t('match.status.ongoing')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {t('competition.participantsCount', { count: match.participants.length })}
                        </p>
                        {match.status === 'COMPLETED' && (
                          <p className="text-xs text-gray-400 mt-1">
                            {t('match.completedOn', { 
                              date: new Date(match.updatedAt).toLocaleDateString(), 
                              time: new Date(match.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            })}
                          </p>
                        )}
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

      {/* Add Friends Modal */}
      <AddFriendsModal
        isOpen={isAddFriendsModalOpen}
        onClose={() => setIsAddFriendsModalOpen(false)}
        onAddFriends={handleAddFriends}
        existingParticipantIds={participants.map(p => p.id)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCompetition}
        title={t('competition.confirmDelete')}
        message={t('competition.confirmDeleteMessage')}
        confirmText={t('common.delete')}
        isLoading={isDeleting}
      />

      {/* Leave Confirmation Modal */}
      <ConfirmationModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={handleLeaveCompetition}
        title={t('competition.confirmLeave')}
        message={t('competition.confirmLeaveMessage')}
        confirmText={t('competition.leave')}
        isLoading={isLeaving}
      />
    </div>
  );
};

export default CompetitionPage;
