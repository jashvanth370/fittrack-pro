import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import TopBar from '../components/layout/TopBar';
import { addWorkoutLog, getWorkoutsByDate, today } from '../db/indexedDB';
import { useStopwatch } from '../hooks/useStopwatch';
import { useCountdown } from '../hooks/useCountdown';
import './WorkoutTracker.css';

const EXERCISES = ['Running', 'Cycling', 'Swimming', 'Weight Training', 'HIIT', 'Yoga', 'Jump Rope', 'Push-ups'];

export default function WorkoutTracker() {
  const [logs, setLogs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [timerTab, setTimerTab] = useState('stopwatch'); // 'stopwatch' | 'countdown'
  const [countMin, setCountMin] = useState(5);

  const sw = useStopwatch();
  const cd = useCountdown(countMin * 60);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const reload = useCallback(async () => {
    const data = await getWorkoutsByDate(today());
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setLogs(data);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const onSubmit = async ({ exerciseName, duration, caloriesBurned }) => {
    setSaving(true);
    try {
      await addWorkoutLog(exerciseName, duration, caloriesBurned);
      await reload();
      reset();
      showToast(`💪 ${exerciseName} logged!`);
    } catch {
      showToast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const useStopwatchTime = () => {
    const mins = Math.max(1, Math.round(sw.seconds / 60));
    setValue('duration', mins);
    showToast(`Stopwatch time (${sw.display}) filled in!`);
  };

  const totalWorkoutMins = logs.reduce((s, l) => s + l.duration, 0);
  const totalCalBurned = logs.reduce((s, l) => s + l.caloriesBurned, 0);

  return (
    <div className="page">
      <TopBar title="Workout Tracker" subtitle="Push your limits 💪" />

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      {/* Summary */}
      <div className="grid-2 anim-fade-up" style={{ margin: '1rem 0 0.75rem' }}>
        <div className="card wk-stat-card">
          <span className="wk-stat-icon">⏱️</span>
          <span className="wk-stat-val">{totalWorkoutMins}</span>
          <span className="wk-stat-lbl">Total mins</span>
        </div>
        <div className="card wk-stat-card">
          <span className="wk-stat-icon">🔥</span>
          <span className="wk-stat-val" style={{ color: 'var(--accent3)' }}>{totalCalBurned}</span>
          <span className="wk-stat-lbl">kcal burned</span>
        </div>
      </div>

      {/* Timer Tabs */}
      <div className="card anim-fade-up delay-1" style={{ marginBottom: '0.75rem' }}>
        <div className="timer-tabs">
          <button className={`timer-tab ${timerTab === 'stopwatch' ? 'active' : ''}`}
            onClick={() => setTimerTab('stopwatch')}>⏱ Stopwatch</button>
          <button className={`timer-tab ${timerTab === 'countdown' ? 'active' : ''}`}
            onClick={() => setTimerTab('countdown')}>⏳ Countdown</button>
        </div>

        {timerTab === 'stopwatch' ? (
          <div className="timer-body">
            <div className="timer-display sw-display" style={{ animation: sw.running ? 'countPulse 1s infinite' : 'none' }}>
              {sw.display}
            </div>
            <div className="timer-btns">
              {!sw.running
                ? <button className="btn btn-primary" onClick={sw.start}>▶ Start</button>
                : <button className="btn btn-ghost" onClick={sw.pause}>⏸ Pause</button>
              }
              <button className="btn btn-outline" onClick={sw.reset}>↺ Reset</button>
              {sw.elapsed > 0 && (
                <button className="btn btn-purple btn-sm" onClick={useStopwatchTime}>
                  Use Time ↓
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="timer-body">
            <div className="cd-duration-row">
              <label className="input-label">Duration (minutes)</label>
              <div className="flex-row gap-sm" style={{
                marginTop: '0.4rem', display: 'flex',
                gap: '0.25rem',
              }}>
                {[1, 5, 10, 20, 30, 45].map((m) => (
                  <button key={m} className={`btn btn-sm ${countMin === m ? 'btn-primary' : 'btn-ghost'}`}
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                    onClick={() => { setCountMin(m); cd.setDuration(m * 60); }}>
                    {m}m
                  </button>
                ))}
              </div>
            </div>
            <div className="timer-display" style={{
              color: cd.finished ? 'var(--danger)' : cd.remaining < 10 ? 'var(--accent4)' : 'var(--accent2)',
              animation: cd.running ? 'countPulse 1s infinite' : 'none'
            }}>
              {cd.finished ? '🎉 Done!' : cd.display}
            </div>
            <div className="cd-progress">
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${cd.progress}%`, background: 'var(--accent2)' }} />
              </div>
            </div>
            <div className="timer-btns">
              {!cd.running
                ? <button className="btn btn-purple" onClick={cd.start} disabled={cd.remaining === 0}>▶ Start</button>
                : <button className="btn btn-ghost" onClick={cd.pause}>⏸ Pause</button>
              }
              <button className="btn btn-outline" onClick={() => cd.reset()}>↺ Reset</button>
            </div>
            {cd.finished && (
              <p className="cd-done-msg">🎉 Great work! Time to log your workout below.</p>
            )}
          </div>
        )}
      </div>

      {/* Log Workout Form */}
      <div className="card anim-fade-up delay-2" style={{ marginBottom: '0.75rem' }}>
        <p className="section-title">Log Workout</p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="wk-form">
          <div className="form-group">
            <label className="input-label" htmlFor="exerciseName">Exercise</label>
            <select id="exerciseName" className="input-field"
              {...register('exerciseName', { required: 'Please select an exercise' })}>
              <option value="">Select exercise…</option>
              {EXERCISES.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
            {errors.exerciseName && <p className="input-error">⚠️ {errors.exerciseName.message}</p>}
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="input-label" htmlFor="duration">Duration (min)</label>
              <input id="duration" type="number" className="input-field" placeholder="30"
                {...register('duration', {
                  required: 'Required',
                  min: { value: 1, message: 'Min 1 min' },
                  max: { value: 600, message: 'Max 600 min' },
                  valueAsNumber: true,
                })}
              />
              {errors.duration && <p className="input-error">⚠️ {errors.duration.message}</p>}
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="caloriesBurned">Kcal Burned</label>
              <input id="caloriesBurned" type="number" className="input-field" placeholder="200"
                {...register('caloriesBurned', {
                  required: 'Required',
                  min: { value: 0, message: 'Min 0' },
                  max: { value: 3000, message: 'Too high' },
                  valueAsNumber: true,
                })}
              />
              {errors.caloriesBurned && <p className="input-error">⚠️ {errors.caloriesBurned.message}</p>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
            {saving ? 'Saving…' : '💪 Log Workout'}
          </button>
        </form>
      </div>

      {/* Workout Log */}
      <div className="card anim-fade-up delay-3">
        <p className="section-title">Today's Sessions ({logs.length})</p>
        {logs.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🏋️</div>
            <p>No workouts yet. Start moving!</p>
          </div>
        ) : (
          <div className="log-list">
            {logs.map((l) => (
              <div key={l.id} className="wk-log-row">
                <div className="wk-log-icon">🏋️</div>
                <div style={{ flex: 1 }}>
                  <p className="wk-log-name">{l.exerciseName}</p>
                  <p className="log-time">
                    {l.duration} min · {l.caloriesBurned} kcal · {new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className="badge badge-purple">{l.duration}m</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
