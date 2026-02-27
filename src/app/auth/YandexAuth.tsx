import { useState, useEffect } from 'react';
import { authService, type YandexUser } from './authService';
import { UserProfile } from './UserProfile';

export function YandexAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<YandexUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-white">
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span className="text-sm hidden md:inline">Загрузка...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <UserProfile user={user} onLogout={handleLogout} />;
  }

  return (
    <>
      {/* Desktop button */}
      <button
        onClick={handleLogin}
        className="hidden md:flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-[#6C3ED9] text-black hover:text-white rounded-full transition-colors duration-200 font-medium whitespace-nowrap"
        aria-label="Войти"
      >
        <span>Войти</span>
      </button>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="flex md:hidden items-center justify-center w-10 h-10 text-white"
        aria-label="Открыть меню"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Mobile side menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Side menu */}
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 md:hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="text-xl font-bold text-[#191E28]">Меню</div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-[#191E28] hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Закрыть меню"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Menu content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Add menu items here if needed */}
            </div>

            {/* Login button at bottom */}
            <div className="p-6 border-t">
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-[#6C3ED9] text-black hover:text-white border-2 border-black hover:border-[#6C3ED9] rounded-full transition-colors duration-200 font-medium"
              >
                <span>Войти</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
