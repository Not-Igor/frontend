import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';
import apiService from '../services/apiService';
import LanguageSelector from '../components/LanguageSelector';
import EditProfileModal from '../components/EditProfileModal';
import UserInfoCard from '../components/UserInfoCard';

interface UserProfile {
  id: number;
  username: string;
  email: string | null;
  role: string;
  avatarUrl: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
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
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [navigate, t]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  const handleUpdateSuccess = () => {
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">{t('common.loading')}</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error || t('common.error')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto w-full bg-white rounded-lg shadow-lg p-8">
        <UserInfoCard
          avatarUrl={profile.avatarUrl}
          username={profile.username}
          role={profile.role}
        />

        <div className="space-y-6">
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between py-3">
              <span className="text-gray-600 font-medium">{t('profile.username')}:</span>
              <span className="text-gray-900">{profile.username}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600 font-medium">{t('profile.role')}:</span>
              <span className="text-gray-900">{profile.role}</span>
            </div>
          </div>

          {/* Language Selector Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('profile.language.title')}
            </h3>
            <LanguageSelector />
          </div>

          {/* Edit Profile Section */}
          <div className="border-t border-gray-200 pt-6">
             <button
                onClick={() => setIsEditModalOpen(true)}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
              >
                {t('profile.edit.button')}
              </button>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default ProfilePage;
