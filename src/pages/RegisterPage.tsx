import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import authService from '../services/authService';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleRegister = async (username: string, password: string, email: string) => {
    try {
      setError('');
      // Register the user
      await authService.register(username, password, email);
      console.log('Registratie succesvol!');
      
      // Automatically login after successful registration
      await authService.login(username, password);
      console.log('Automatisch ingelogd!');
      
      // Navigate to home page
      navigate('/home');
    } catch (error: any) {
      console.error('Register error:', error);
      setError(error.message || 'Er is een fout opgetreden bij het registreren.');
      alert(error.message || 'Registratie mislukt. Probeer het opnieuw.');
    }
  };

  return (
    <div>
      <RegisterForm onSubmit={handleRegister} />
      {error && (
        <div className="max-w-md mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
