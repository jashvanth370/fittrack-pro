import { createContext, useContext, useState, useEffect } from 'react';
import { getTheme, setTheme, getGoals, setGoals, getProfile, setProfile } from '../services/storage';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getTheme);
  const [goals, setGoalsState] = useState(getGoals);
  const [profile, setProfileState] = useState(getProfile);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const up = () => setIsOnline(true);
    const down = () => setIsOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down); };
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setThemeState(next);
  };

  const updateGoals = (g) => {
    setGoals(g);
    setGoalsState(g);
  };

  const updateProfile = (p) => {
    setProfile(p);
    setProfileState(p);
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, goals, updateGoals, profile, updateProfile, isOnline }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
