import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';
import apiService from '../services/apiService';
import LanguageSelector from '../components/LanguageSelector';
import EditProfileModal from '../components/EditProfileModal';
import AvatarUploadButton from '../components/AvatarUpload';
import userService from '../services/userService';

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

  const handleAvatarUpload = async (url: string) => {
    // The AvatarUploadButton already handled the upload to the backend.
    // We just need to refetch the profile to update the displayed avatar.
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">{t('common.loading')}</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error || t('common.error')}</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center">
          <AvatarUploadButton onUploadSuccess={handleAvatarUpload}>
            <div className="relative group">
              <img
                src={profile.avatarUrl}
                alt={`${profile.username} avatar`}
                className="w-32 h-32 rounded-full border-4 border-indigo-500 mb-4 transition-opacity group-hover:opacity-70"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </AvatarUploadButton>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {profile.username}
          </h2>
          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full mb-6">
            {profile.role}
          </span>
        </div>

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
