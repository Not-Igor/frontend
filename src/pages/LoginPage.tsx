import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginForm from '../components/LoginForm';
import authService from '../services/authService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');

  const handleLogin = async (username: string, password: string) => {
    try {
      setError('');
      const data = await authService.login(username, password);
      console.log(t('auth.login.success'), data);
      navigate('/home');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || t('auth.login.error'));
      alert(error.message || t('auth.login.error'));
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} />
      {error && (
        <div className="max-w-md mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
