import { createContext, useContext, useState, useEffect } from 'react';
import { getTheme, setTheme, resolveTheme, getGoals, setGoals, getProfile, setProfile } from '../services/storage';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getTheme);           // 'light' | 'dark' | 'system'
  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(getTheme()));
  const [goals, setGoalsState] = useState(getGoals);
  const [profile, setProfileState] = useState(getProfile);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Apply resolved theme to <html data-theme="...">
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  // Re-resolve whenever the theme setting changes
  useEffect(() => {
    setResolvedTheme(resolveTheme(theme));
  }, [theme]);

  // Listen live to phone/OS theme changes ONLY when in 'system' mode
  useEffect(() => {
    if (theme !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
    };

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    const up = () => setIsOnline(true);
    const down = () => setIsOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down); };
  }, []);

  // Cycles Light -> Dark -> System -> Light ...
  const toggleTheme = () => {
    const order = ['light', 'dark', 'system'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    setThemeState(next);
  };

  // Direct setter for the 3-way Settings page control
  const setThemeMode = (mode) => {
    setTheme(mode);
    setThemeState(mode);
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
    <AppContext.Provider value={{
      theme,            // raw setting: 'light' | 'dark' | 'system'
      resolvedTheme,     // actual applied theme: 'light' | 'dark'
      toggleTheme,
      setThemeMode,
      goals, updateGoals,
      profile, updateProfile,
      isOnline,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};