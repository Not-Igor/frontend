import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService, { AuthenticationResponse } from '../services/authService';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState<AuthenticationResponse | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const userData = authService.getUser();
    setUser(userData);
  }, [navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('home.welcome', { username: user.username })}
        </h1>
        <p className="text-xl text-gray-500 mt-2">
          {t('home.greeting')}
        </p>
      </div>
    </div>
  );
};

export default HomePage;
