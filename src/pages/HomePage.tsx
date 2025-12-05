import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService, { AuthenticationResponse } from '../services/authService';
import CreateCompetitionModal from '../components/CreateCompetitionModal';
import CompetitionCard from '../components/CompetitionCard';
import competitionService, { CompetitionDto } from '../services/competitionService';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState<AuthenticationResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [competitions, setCompetitions] = useState<CompetitionDto[]>([]);
  const [loading, setLoading] = useState(true);

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
      alert('Failed to create competition. Please try again.');
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
            Ready to compete?
          </h1>
          <p className="text-lg text-gray-500">
            Create a new competition and challenge your friends!
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
            Create Competition
          </span>
        </button>

        {/* Competitions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading competitions...</p>
          </div>
        ) : competitions.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Competitions ({competitions.length})
            </h2>
            {competitions.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No competitions yet
            </h3>
            <p className="text-gray-500">
              Create your first competition to get started!
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
