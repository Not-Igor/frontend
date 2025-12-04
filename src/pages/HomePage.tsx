import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService, { AuthenticationResponse } from '../services/authService';
import CreateCompetitionModal from '../components/CreateCompetitionModal';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState<AuthenticationResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const userData = authService.getUser();
    setUser(userData);
  }, [navigate]);

  const handleCreateCompetition = async (title: string, icon: string, participantIds: number[]) => {
    try {
      const competitionService = (await import('../services/competitionService')).default;
      
      const competition = await competitionService.createCompetition({
        title,
        icon,
        participantIds
      });
      
      setIsModalOpen(false);
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
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ready to compete?
          </h1>
          <p className="text-lg text-gray-500">
            Create a new competition and challenge your friends!
          </p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <span className="flex items-center justify-center">
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Competition
          </span>
        </button>

        {/* Optional: Show recent competitions list here later */}
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
