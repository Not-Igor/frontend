import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CompetitionDto } from '../services/competitionService';

interface CompetitionCardProps {
  competition: CompetitionDto;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition }) => {
  const navigate = useNavigate();

  const getAvatarUrl = (username: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={() => navigate(`/competition/${competition.id}`)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border-2 border-transparent hover:border-indigo-500 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4 flex-1">
          <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
            {competition.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
              {competition.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Created by {competition.creator.username} • {formatDate(competition.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-gray-400 group-hover:text-indigo-600 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {competition.participants.slice(0, 3).map((participant) => (
              <img
                key={participant.id}
                src={getAvatarUrl(participant.username)}
                alt={participant.username}
                className="w-8 h-8 rounded-full ring-2 ring-white"
                title={participant.username}
              />
            ))}
            {competition.participants.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-indigo-100 ring-2 ring-white flex items-center justify-center">
                <span className="text-xs font-semibold text-indigo-600">
                  +{competition.participants.length - 3}
                </span>
              </div>
            )}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {competition.participants.length} participant{competition.participants.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm font-semibold">View</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CompetitionCard;
