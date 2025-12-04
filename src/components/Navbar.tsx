import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import friendService from '../services/friendService';
import { friendRequestEvents, FRIEND_REQUEST_UPDATED } from '../utils/events';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const [friendRequestCount, setFriendRequestCount] = useState<number>(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadFriendRequestCount();
      
      // Listen for friend request updates
      friendRequestEvents.on(FRIEND_REQUEST_UPDATED, loadFriendRequestCount);
      
      // Poll every 30 seconds for new requests
      const interval = setInterval(loadFriendRequestCount, 30000);
      
      return () => {
        friendRequestEvents.off(FRIEND_REQUEST_UPDATED, loadFriendRequestCount);
        clearInterval(interval);
      };
    }
  }, [isAuthenticated]);

  const loadFriendRequestCount = async () => {
    try {
      const user = authService.getUser();
      if (user) {
        const requests = await friendService.getReceivedRequests(user.id);
        setFriendRequestCount(requests.length);
      }
    } catch (err) {
      console.error('Failed to load friend request count:', err);
    }
  };

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
                  className={`px-3 py-2 rounded-md text-sm font-medium relative ${
                    location.pathname === '/friends'
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Vrienden
                  {friendRequestCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {friendRequestCount}
                    </span>
                  )}
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
