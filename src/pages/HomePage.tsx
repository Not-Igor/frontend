import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { AuthenticationResponse } from '../services/authService';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
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
          Welkom
        </h1>
        <p className="text-2xl text-gray-600">
          {user.username}
        </p>
      </div>
    </div>
  );
};

export default HomePage;
