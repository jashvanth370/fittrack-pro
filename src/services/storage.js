const KEYS = {
  THEME: 'fittrack_theme',
  GOALS: 'fittrack_goals',
  PROFILE: 'fittrack_profile',
};

const DEFAULT_GOALS = {
  water: 2500,       // ml
  calories: 2000,    // kcal
  workouts: 3,       // per week
};

export const getTheme = () => localStorage.getItem(KEYS.THEME) || 'dark';
export const setTheme = (t) => localStorage.setItem(KEYS.THEME, t);

export const getGoals = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.GOALS)) || DEFAULT_GOALS;
  } catch {
    return DEFAULT_GOALS;
  }
};
export const setGoals = (goals) =>
  localStorage.setItem(KEYS.GOALS, JSON.stringify({ ...DEFAULT_GOALS, ...goals }));

export const getProfile = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.PROFILE)) || { name: 'Athlete', weight: 70, height: 175 };
  } catch {
    return { name: 'Athlete', weight: 70, height: 175 };
  }
};
export const setProfile = (p) =>
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(p));
