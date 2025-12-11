import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthenticatedApp } from './components/AuthenticatedApp';
import { User } from './types';

export default function App() {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('fp_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    localStorage.setItem('fp_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Auth State
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('fp_current_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('fp_current_session', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fp_current_session');
  };

  // If user is logged in, show the App
  if (user) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <AuthenticatedApp 
          user={user} 
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      </div>
    );
  }

  // Otherwise show Landing Page
  return (
    <LandingPage 
      onLogin={handleLogin}
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
    />
  );
}