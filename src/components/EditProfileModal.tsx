import React, { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import userService, { UserUpdateDto } from '../services/userService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onUpdateSuccess }) => {
  const { t } = useTranslation();
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  if (!isOpen) {
    return null;
  }
  
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword && newPassword !== confirmNewPassword) {
      setError(t('auth.register.passwordMismatch'));
      return;
    }
    
    setLoading(true);

    try {
      const dto: UserUpdateDto = {};
      if (newUsername) dto.newUsername = newUsername;
      if (newPassword) {
        dto.currentPassword = currentPassword;
        dto.newPassword = newPassword;
      }
      
      if (Object.keys(dto).length === 0) {
        handleClose();
        return;
      }
      
      await userService.updateUserProfile(dto);
      alert(t('profile.edit.success'));
      onUpdateSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message || t('profile.edit.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state on close
    setNewUsername('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setError('');
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('profile.edit.title')}</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('profile.edit.username')}</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={t('profile.edit.username')}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-2">{t('profile.edit.passwordSection')}</p>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('profile.edit.currentPassword')}</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required={!!newPassword}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">{t('profile.edit.newPassword')}</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
             <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">{t('profile.edit.confirmNewPassword')}</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? t('common.loading') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
