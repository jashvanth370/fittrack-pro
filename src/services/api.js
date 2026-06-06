const BASE = 'https://jsonplaceholder.typicode.com';

const WELLNESS_TIPS = [
  "💧 Drink water first thing in the morning to kickstart metabolism.",
  "🏃 Even 20 minutes of brisk walking burns ~100 kcal.",
  "🥗 Fill half your plate with vegetables at every meal.",
  "😴 7-9 hours of sleep is critical for muscle recovery.",
  "🧘 5 minutes of deep breathing lowers cortisol significantly.",
  "🍎 Eating slowly reduces total calorie intake by up to 20%.",
  "💪 Progressive overload is the key to strength gains.",
  "🚶 Take a 5-minute walk every hour to reduce sedentary risk.",
  "🥦 Protein at every meal keeps you fuller for longer.",
  "🧠 Exercise boosts BDNF — the brain's growth hormone.",
];

export const fetchWellnessTips = async () => {
  const res = await fetch(`${BASE}/posts?_limit=5`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const posts = await res.json();
  // Map placeholder posts to wellness tips
  return posts.map((post, i) => ({
    id: post.id,
    tip: WELLNESS_TIPS[i % WELLNESS_TIPS.length],
    category: ['Hydration', 'Cardio', 'Nutrition', 'Recovery', 'Mindfulness'][i % 5],
  }));
};

export const fetchWithRetry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delay * (i + 1)));
    }
  }
};
