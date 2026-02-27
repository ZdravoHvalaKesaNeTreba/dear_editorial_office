import { useState, useEffect } from 'react';
import { authService, type YandexUser } from './authService';
import { UserProfile } from './UserProfile';

export function YandexAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<YandexUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    
    if (authService.isAuthenticated()) {
      const userInfo = await authService.getUserInfo();
      if (userInfo) {
        setUser(userInfo);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  };

  const handleLogin = () => {
    authService.login();
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        <span className="text-sm">Загрузка...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <UserProfile user={user} onLogout={handleLogout} />;
  }

  return (
    <button
      onClick={handleLogin}
      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium"
      aria-label="Войти через Яндекс ID"
    >
      <svg 
        className="w-5 h-5" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
      <span>Войти через Яндекс</span>
    </button>
  );
}
