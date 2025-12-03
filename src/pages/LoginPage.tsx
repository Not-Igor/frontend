import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import authService from '../services/authService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleLogin = async (username: string, password: string) => {
    try {
      setError('');
      const data = await authService.login(username, password);
      console.log('Login succesvol!', data);
      navigate('/home');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Er is een fout opgetreden bij het inloggen.');
      alert(error.message || 'Login mislukt. Controleer je gegevens.');
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
