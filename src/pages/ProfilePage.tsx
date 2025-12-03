import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import apiService from '../services/apiService';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  avatarUrl: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authService.isAuthenticated()) {
        navigate('/login');
        return;
      }

      try {
        const user = authService.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const profileData = await apiService.get<UserProfile>(`/users/profile/${user.id}`);
        setProfile(profileData);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        setError('Kon profiel niet laden');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Laden...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error || 'Profiel niet gevonden'}</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center">
          <img
            src={profile.avatarUrl}
            alt={`${profile.username} avatar`}
            className="w-32 h-32 rounded-full border-4 border-indigo-500 mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {profile.username}
          </h2>
          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full mb-6">
            {profile.role}
          </span>
        </div>

        <div className="space-y-4">
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between py-3">
              <span className="text-gray-600 font-medium">Gebruikersnaam:</span>
              <span className="text-gray-900">{profile.username}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="text-gray-900">{profile.email}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600 font-medium">Gebruiker ID:</span>
              <span className="text-gray-900">{profile.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
