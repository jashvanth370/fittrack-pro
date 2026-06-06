import Dexie from 'dexie';

export const db = new Dexie('FitTrackProDB');

db.version(1).stores({
  waterLogs:    '++id, date, amount, createdAt',
  calorieLogs:  '++id, date, mealName, calories, createdAt',
  workoutLogs:  '++id, date, exerciseName, duration, caloriesBurned, createdAt',
  offlineQueue: '++id, action, payload, createdAt',
});

// ── Water ──────────────────────────────────────────────────
export const addWaterLog = (amount) =>
  db.waterLogs.add({ date: today(), amount, createdAt: new Date() });

export const getWaterByDate = (date) =>
  db.waterLogs.where('date').equals(date).toArray();

export const getWaterHistory = (days = 7) => {
  const since = new Date();
  since.setDate(since.getDate() - days);
  return db.waterLogs.where('createdAt').above(since).toArray();
};

// ── Calories ───────────────────────────────────────────────
export const addCalorieLog = (mealName, calories) =>
  db.calorieLogs.add({ date: today(), mealName, calories: Number(calories), createdAt: new Date() });

export const getCaloriesByDate = (date) =>
  db.calorieLogs.where('date').equals(date).toArray();

export const getCalorieHistory = (days = 7) => {
  const since = new Date();
  since.setDate(since.getDate() - days);
  return db.calorieLogs.where('createdAt').above(since).toArray();
};

// ── Workouts ───────────────────────────────────────────────
export const addWorkoutLog = (exerciseName, duration, caloriesBurned) =>
  db.workoutLogs.add({ date: today(), exerciseName, duration: Number(duration), caloriesBurned: Number(caloriesBurned), createdAt: new Date() });

export const getWorkoutsByDate = (date) =>
  db.workoutLogs.where('date').equals(date).toArray();

export const getWorkoutHistory = (days = 7) => {
  const since = new Date();
  since.setDate(since.getDate() - days);
  return db.workoutLogs.where('createdAt').above(since).toArray();
};

// ── Offline Queue ──────────────────────────────────────────
export const queueOfflineAction = (action, payload) =>
  db.offlineQueue.add({ action, payload, createdAt: new Date() });

export const flushOfflineQueue = async () => {
  const items = await db.offlineQueue.toArray();
  await db.offlineQueue.clear();
  return items;
};

// ── Helpers ────────────────────────────────────────────────
export const today = () => new Date().toISOString().split('T')[0];
