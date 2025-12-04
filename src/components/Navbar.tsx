import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 
              className="text-xl font-bold text-gray-800 cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={() => navigate('/home')}
            >
              KompApp
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/home')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/home'
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/profile'
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Profiel
                </button>
                <button
                  onClick={() => navigate('/friends')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/friends'
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Vrienden
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Uitloggen
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/login'
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Inloggen
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/register'
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Registreren
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
