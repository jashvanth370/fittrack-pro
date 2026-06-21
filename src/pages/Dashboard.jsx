import { useState, useEffect, lazy, Suspense } from 'react';
import TopBar from '../components/layout/TopBar';
import CircularProgress from '../components/common/CircularProgress';
import { useApp } from '../context/AppContext';
import { getWaterByDate, getCaloriesByDate, getWorkoutsByDate, today } from '../db/indexedDB';
import { fetchWellnessTips, fetchWithRetry } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const { goals, profile, isOnline } = useApp();
  const [todayData, setTodayData] = useState({ water: 0, calories: 0, workouts: 0, workoutCalories: 0 });
  const [tips, setTips] = useState([]);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [tipsError, setTipsError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const [water, cals, works] = await Promise.all([
        getWaterByDate(today()),
        getCaloriesByDate(today()),
        getWorkoutsByDate(today()),
      ]);

      setTodayData({
        water: water.reduce((s, r) => s + r.amount, 0),
        calories: cals.reduce((s, r) => s + r.calories, 0),
        workouts: works.length,
        workoutCalories: works.reduce(
          (sum, workout) => sum + workout.caloriesBurned,
          0
        ),
      });
      console.log(works);
    };
    loadData();
  }, []);

  const loadTips = async () => {
    setTipsLoading(true);
    setTipsError(null);
    try {
      const data = await fetchWithRetry(fetchWellnessTips);
      setTips(data);
    } catch {
      setTipsError('Could not load tips. Check connection.');
    } finally {
      setTipsLoading(false);
    }
  };

  useEffect(() => {
    if (isOnline) loadTips();
  }, [isOnline]);

  const waterPct = Math.round((todayData.water / goals.water) * 100);
  const calPct = Math.round((todayData.calories / goals.calories) * 100);
  const greetHour = new Date().getHours();
  const greeting = greetHour < 12 ? 'Good morning' : greetHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page dash-page">
      <TopBar title="FitTrack Pro" subtitle={`${greeting}, ${profile.name} 👋`} />

      {/* Hero Stats */}
      <section className="dash-rings anim-fade-up">
        <div className="ring-card card delay-1 anim-fade-up">
          <CircularProgress value={waterPct} size={90} color="var(--accent)">
            <span className="ring-pct">{Math.min(waterPct, 100)}%</span>
          </CircularProgress>
          <div>
            <p className="ring-val">{(todayData.water / 1000).toFixed(2)}L</p>
            <p className="ring-lbl">Water</p>
            <span className="badge badge-green">Goal {(goals.water / 1000).toFixed(1)}L</span>
          </div>
        </div>

        <div className="ring-card card delay-2 anim-fade-up">
          <CircularProgress value={Math.min(calPct, 100)} size={90} color="var(--accent3)">
            <span className="ring-pct">{Math.min(calPct, 100)}%</span>
          </CircularProgress>
          <div>
            <p className="ring-val">{todayData.calories}</p>
            <p className="ring-lbl">Calories</p>
            <span className="badge badge-pink">Goal {goals.calories}</span>
          </div>
        </div>
      </section>

      {/* Workout summary */}
      <div className="card anim-fade-up delay-3" style={{ marginBottom: '0.75rem' }}>
        <div className="workout-summary">
          <div className="workout-stats">
            <p className="section-title">Today's Workouts</p>

            <div>
              <span className="num-big purple">{todayData.workouts}</span>
              <span
                style={{
                  color: 'var(--text3)',
                  fontSize: '0.85rem',
                  marginLeft: '0.5rem'
                }}
              >
                sessions
              </span>
            </div>

            <div className="burned-calories">
              🔥 <span className="burned-value">{todayData.workoutCalories}</span> kcal burned
            </div>
          </div>

          <div className="wk-icon">💪</div>
        </div>
      </div>

      {/* Wellness Tips */}
      <div className="card tips-card anim-fade-up delay-4">
        <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
          <p className="section-title">Wellness Tips</p>
          {!isOnline ? (
            <span className="badge badge-pink">Offline</span>
          ) : (
            <button className="btn btn-ghost btn-sm" onClick={loadTips} disabled={tipsLoading}>
              {tipsLoading ? '⟳' : '↻ Refresh'}
            </button>
          )}
        </div>

        {tipsLoading && <div className="spinner" />}
        {tipsError && (
          <div className="tips-error">
            <p>{tipsError}</p>
            <button className="btn btn-outline btn-sm" onClick={loadTips}>Retry</button>
          </div>
        )}
        {!tipsLoading && !tipsError && tips.map((tip, i) => (
          <div key={tip.id} className="tip-row anim-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
            <span className="badge badge-green">{tip.category}</span>
            <p className="tip-text">{tip.tip}</p>
          </div>
        ))}
        {!tipsLoading && !tipsError && tips.length === 0 && !isOnline && (
          <p style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Connect to internet to load tips.</p>
        )}
      </div>
    </div>
  );
}
