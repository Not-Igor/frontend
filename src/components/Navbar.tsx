import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';
import friendService from '../services/friendService';
import { friendRequestEvents, FRIEND_REQUEST_UPDATED } from '../utils/events';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const isAuthenticated = authService.isAuthenticated();
  const [friendRequestCount, setFriendRequestCount] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 
              className="text-xl font-bold text-gray-800 cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={() => handleNavigate('/home')}
            >
              {t('app.name')}
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications Icon - Desktop */}
                <button
                  onClick={() => navigate('/notifications')}
                  className={`p-2 rounded-md relative ${
                    location.pathname === '/notifications'
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                  aria-label="Notifications"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {/* Notification badge - you can add count here later */}
                  {/* {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )} */}
                </button>
                
                <button
                  onClick={() => navigate('/home')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/home'
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  {t('nav.home')}
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/profile'
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  {t('nav.profile')}
                </button>
                <button
                  onClick={() => navigate('/friends')}
                  className={`px-3 py-2 rounded-md text-sm font-medium relative ${
                    location.pathname === '/friends'
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  {t('nav.friends')}
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
                  {t('nav.logout')}
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
                  {t('auth.login.title')}
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/register'
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  {t('auth.register.title')}
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button + Notifications Icon */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={() => {
                  navigate('/notifications');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2 rounded-md relative ${
                  location.pathname === '/notifications'
                    ? 'text-indigo-600'
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
                aria-label="Notifications"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Notification badge - you can add count here later */}
                {/* {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )} */}
              </button>
            )}
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavigate('/home')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/home'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                >
                  {t('nav.home')}
                </button>
                <button
                  onClick={() => handleNavigate('/profile')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/profile'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                >
                  {t('nav.profile')}
                </button>
                <button
                  onClick={() => handleNavigate('/friends')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium relative ${
                    location.pathname === '/friends'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {t('nav.friends')}
                    {friendRequestCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {friendRequestCount}
                      </span>
                    )}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigate('/login')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/login'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                >
                  {t('auth.login.title')}
                </button>
                <button
                  onClick={() => handleNavigate('/register')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/register'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                >
                  {t('auth.register.title')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
