import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

interface Competition {
  id: number;
  title: string;
  icon: string;
  participants: string[];
  createdAt: string;
}

const CompetitionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // TODO: Fetch competition from API
    // For now, using mock data
    setTimeout(() => {
      setCompetition({
        id: Number(id),
        title: 'Weekend Football Challenge',
        icon: '⚽',
        participants: ['Alice', 'Bob', 'Charlie'],
        createdAt: new Date().toISOString(),
      });
      setLoading(false);
    }, 500);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading competition...</div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Competition not found</h2>
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
                Created {new Date(competition.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Participants</h2>
          <div className="space-y-2">
            {competition.participants.map((participant, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">
                      {participant.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">{participant}</span>
                </div>
                <span className="text-2xl font-bold text-gray-400">0</span>
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
