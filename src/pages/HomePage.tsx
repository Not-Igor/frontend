import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService, { AuthenticationResponse } from '../services/authService';
import CreateCompetitionModal from '../components/CreateCompetitionModal';
import CompetitionCard from '../components/CompetitionCard';
import competitionService, { CompetitionDto } from '../services/competitionService';
import CompetitionFilter, { SortOption, SortDirection } from '../components/CompetitionFilter';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState<AuthenticationResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter and sort state
  const [userFilter, setUserFilter] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const userData = authService.getUser();
    setUser(userData);
    
    if (userData) {
      loadCompetitions(userData.id);
    }
  }, [navigate]);

  const loadCompetitions = async (userId: number) => {
    try {
      const userCompetitions = await competitionService.getUserCompetitions(userId);
      setCompetitions(userCompetitions);
    } catch (error) {
      console.error('Failed to load competitions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredAndSortedCompetitions = useMemo(() => {
    let filtered = competitions.filter(comp =>
      comp.participants.some(p => p.username.toLowerCase().includes(userFilter.toLowerCase()))
    );

    filtered.sort((a, b) => {
      const aValue = a[sortOption];
      const bValue = b[sortOption];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [competitions, userFilter, sortOption, sortDirection]);


  const handleCreateCompetition = async (title: string, icon: string, participantIds: number[]) => {
    try {
      const competition = await competitionService.createCompetition({
        title,
        icon,
        participantIds
      });
      
      setIsModalOpen(false);
      
      // Refresh competitions list
      if (user) {
        await loadCompetitions(user.id);
      }
      
      // Navigate to the new competition
      navigate(`/competition/${competition.id}`);
    } catch (error) {
      console.error('Failed to create competition:', error);
      alert(t('competition.errors.createFailed'));
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('competition.readyToCompete')}
          </h1>
          <p className="text-lg text-gray-500">
            {t('competition.challengeFriends')}
          </p>
        </div>
        
        {/* Create Competition Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl mb-8"
        >
          <span className="flex items-center justify-center">
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('competition.create')}
          </span>
        </button>

        {/* Competitions Section */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">{t('competition.loadingCompetitions')}</p>
          </div>
        ) : competitions.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('competition.yourCompetitions', { count: filteredAndSortedCompetitions.length })}
            </h2>
            <CompetitionFilter
              userFilter={userFilter}
              onUserFilterChange={setUserFilter}
              sortOption={sortOption}
              onSortOptionChange={setSortOption}
              sortDirection={sortDirection}
              onSortDirectionChange={setSortDirection}
            />
            {filteredAndSortedCompetitions.length > 0 ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {filteredAndSortedCompetitions.map((competition) => (
                  <CompetitionCard key={competition.id} competition={competition} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('competition.noResults')}
                </h3>
                <p className="text-gray-500">
                  {t('competition.noResultsMessage')}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('competition.noCompetitions')}
            </h3>
            <p className="text-gray-500">
              {t('competition.noCompetitionsMessage')}
            </p>
          </div>
        )}
      </div>

      <CreateCompetitionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateCompetition}
      />
    </div>
  );
};

export default HomePage;
