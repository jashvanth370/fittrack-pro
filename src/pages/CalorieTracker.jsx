import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import TopBar from '../components/layout/TopBar';
import CircularProgress from '../components/common/CircularProgress';
import { addCalorieLog, getCaloriesByDate, today } from '../db/indexedDB';
import { useApp } from '../context/AppContext';
import './CalorieTracker.css';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const PRESETS = [
  { name: 'Breakfast', cal: 400, icon: '🍳' },
  { name: 'Lunch', cal: 650, icon: '🍱' },
  { name: 'Dinner', cal: 700, icon: '🍽️' },
  { name: 'Snack', cal: 180, icon: '🍎' },
];

export default function CalorieTracker() {
  const { goals } = useApp();
  const [logs, setLogs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const totalCal = logs.reduce((s, l) => s + l.calories, 0);
  const pct = Math.min(Math.round((totalCal / goals.calories) * 100), 100);
  const remaining = Math.max(goals.calories - totalCal, 0);

  const reload = useCallback(async () => {
    const data = await getCaloriesByDate(today());
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setLogs(data);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  };

  const onSubmit = async ({ mealName, calories }) => {
    setSaving(true);
    try {
      await addCalorieLog(mealName, Number(calories));
      await reload();
      reset();
      showToast(`${mealName} logged ✔️`);
    } catch {
      showToast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addPreset = async (preset) => {
    setSaving(true);
    try {
      await addCalorieLog(preset.name, preset.cal);
      await reload();
      showToast(`${preset.icon} ${preset.name} added!`);
    } catch {
      showToast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const statusColor = pct >= 100 ? 'var(--danger)' : pct >= 80 ? 'var(--accent4)' : 'var(--accent3)';

  return (
    <div className="page">
      <TopBar title="Calorie Tracker" subtitle="Fuel your body right 🔥" />

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      {/* Summary Ring */}
      <div className="cal-hero card anim-fade-up">
        <CircularProgress value={pct} size={140} stroke={12} color={statusColor}>
          <div style={{ textAlign: 'center' }}>
            <span className="num-big pink" style={{ color: statusColor }}>{totalCal}</span>
            <p style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>kcal eaten</p>
          </div>
        </CircularProgress>
        <div className="cal-stats">
          <div className="cal-stat">
            <span className="cal-stat-val" style={{ color: statusColor }}>{pct}%</span>
            <span className="cal-stat-lbl">of goal</span>
          </div>
          <div className="cal-stat">
            <span className="cal-stat-val">{goals.calories}</span>
            <span className="cal-stat-lbl">goal kcal</span>
          </div>
          <div className="cal-stat">
            <span className="cal-stat-val" style={{ color: remaining === 0 ? 'var(--danger)' : 'var(--accent)' }}>
              {remaining}
            </span>
            <span className="cal-stat-lbl">remaining</span>
          </div>
        </div>
      </div>

      {/* Macro Progress Bar */}
      <div className="card anim-fade-up delay-1" style={{ marginBottom: '0.75rem' }}>
        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
          <p className="section-title" style={{ margin: 0 }}>Daily Progress</p>
          <span className="badge" style={{ background: pct >= 100 ? 'rgba(255,77,109,0.15)' : 'rgba(0,229,176,0.1)', color: pct >= 100 ? 'var(--danger)' : 'var(--accent)' }}>
            {
              pct >= 100
                ? <><FaExclamationTriangle /> Over goal</>
                : <><FaCheckCircle /> On track</>
            }
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: `${pct}%`, background: statusColor }} />
        </div>
        <div className="flex-between" style={{ marginTop: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>0</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{goals.calories} kcal</span>
        </div>
      </div>

      {/* Presets */}
      <div className="card anim-fade-up delay-2" style={{ marginBottom: '0.75rem' }}>
        <p className="section-title">Quick Add Meal</p>
        <div className="presets-grid">
          {PRESETS.map((p) => (
            <button key={p.name} className="preset-btn" onClick={() => addPreset(p)} disabled={saving}>
              <span className="preset-icon">{p.icon}</span>
              <span className="preset-name">{p.name}</span>
              <span className="preset-cal">{p.cal} kcal</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Form */}
      <div className="card anim-fade-up delay-3" style={{ marginBottom: '0.75rem' }}>
        <p className="section-title">Add Custom Meal</p>
        <form onSubmit={handleSubmit(onSubmit)} className="cal-form" noValidate>
          <div className="form-group">
            <label className="input-label" htmlFor="mealName">Meal Name</label>
            <input id="mealName" className="input-field" placeholder="e.g. Grilled Chicken"
              {...register('mealName', {
                required: 'Meal name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
              })}
            />
            {errors.mealName && <p className="input-error">⚠️ {errors.mealName.message}</p>}
          </div>
          <div className="form-group">
            <label className="input-label" htmlFor="calories">Calories (kcal)</label>
            <input id="calories" type="number" className="input-field" placeholder="e.g. 350"
              {...register('calories', {
                required: 'Calories are required',
                min: { value: 1, message: 'Must be greater than 0' },
                max: { value: 5000, message: 'Seems too high!' },
                valueAsNumber: true,
              })}
            />
            {errors.calories && <p className="input-error">⚠️ {errors.calories.message}</p>}
          </div>
          <button type="submit" className="btn btn-pink btn-full" disabled={saving}>
            {saving ? 'Saving…' : '🔥 Log Meal'}
          </button>
        </form>
      </div>

      {/* Meal Log */}
      <div className="card anim-fade-up delay-4">
        <p className="section-title">Today's Meals ({logs.length})</p>
        {logs.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🍽️</div>
            <p>No meals logged yet. Start eating!</p>
          </div>
        ) : (
          <div className="log-list">
            {logs.map((l) => (
              <div key={l.id} className="cal-log-row">
                <div className="cal-log-icon">🍽️</div>
                <div style={{ flex: 1 }}>
                  <p className="cal-log-name">{l.mealName}</p>
                  <p className="log-time">{new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <span className="cal-log-kcal">{l.calories} kcal</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
