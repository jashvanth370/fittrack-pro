import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import { useApp } from '../context/AppContext';
import './Settings.css';

export default function Settings() {
  const { goals, updateGoals, profile, updateProfile, theme, setThemeMode, resolvedTheme } = useApp();
  const navigate = useNavigate();

  const { register: rGoals, handleSubmit: hGoals, formState: { errors: eGoals } } = useForm({
    defaultValues: goals,
  });
  const { register: rProf, handleSubmit: hProf, formState: { errors: eProf } } = useForm({
    defaultValues: profile,
  });

  const [savedGoals, setSavedGoals] = useState(false);
  const [toast, setToast] = useState(null);



  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const onSaveGoals = (data) => {
    updateGoals({
      water: Number(data.water),
      calories: Number(data.calories),
      workouts: Number(data.workouts),
    });
    showToast('✔️ Goals saved!');
  };

  const onSaveProfile = (data) => {
    updateProfile({
      name: data.name,
      weight: Number(data.weight),
      height: Number(data.height),
    });
    showToast('✔️ Profile saved!');
  };

  return (
    <div className="page">
      <TopBar title="Settings" subtitle="Customize your experience ⚙️" />


      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.msg}
        </div>
      )}

      {/* Theme */}
      <div className="card anim-fade-up" style={{ margin: '1rem 0 0.75rem' }}>
        <p className="section-title">Appearance</p>
        <div className="theme-options">
          {['light', 'dark', 'system'].map((mode) => (
            <button
              key={mode}
              className={`theme-option ${theme === mode ? 'active' : ''}`}
              onClick={() => setThemeMode(mode)}
            >
              <span className="theme-icon">
                {mode === 'light' ? '☀️' : mode === 'dark' ? '🌙' : '📱'}
              </span>
              <span className="theme-label">
                {mode === 'light' ? 'Light' : mode === 'dark' ? 'Dark' : 'System'}
              </span>
            </button>
          ))}
        </div>
        {theme === 'system' && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: '0.6rem' }}>
            Currently showing {resolvedTheme} mode, matching your phone's setting
          </p>
        )}
      </div>

      {/* Goals */}
      <div className="card anim-fade-up delay-1" style={{ marginBottom: '0.75rem' }}>
        <p className="section-title">Daily Goals</p>
        <form onSubmit={hGoals(onSaveGoals)} noValidate className="settings-form">
          <div className="form-group">
            <label className="input-label">Daily Water Goal (ml)</label>
            <input type="number" className="input-field"
              {...rGoals('water', { required: 'Required', min: { value: 500, message: 'Min 500ml' }, max: { value: 10000, message: 'Max 10L' }, valueAsNumber: true })}
            />
            {eGoals.water && <p className="input-error">⚠️ {eGoals.water.message}</p>}
          </div>
          <div className="form-group">
            <label className="input-label">Daily Calorie Goal (kcal)</label>
            <input type="number" className="input-field"
              {...rGoals('calories', { required: 'Required', min: { value: 500, message: 'Min 500' }, max: { value: 10000, message: 'Max 10000' }, valueAsNumber: true })}
            />
            {eGoals.calories && <p className="input-error">⚠️ {eGoals.calories.message}</p>}
          </div>
          <div className="form-group">
            <label className="input-label">Weekly Workout Goal (sessions)</label>
            <input type="number" className="input-field"
              {...rGoals('workouts', { required: 'Required', min: { value: 1, message: 'Min 1' }, max: { value: 14, message: 'Max 14' }, valueAsNumber: true })}
            />
            {eGoals.workouts && <p className="input-error">⚠️ {eGoals.workouts.message}</p>}
          </div>
          <button type="submit" className="btn btn-primary btn-full">💾 Save Goals</button>
        </form>
      </div>

      {/* Profile */}
      <div className="card anim-fade-up delay-2" style={{ marginBottom: '0.75rem' }}>
        <p className="section-title">Profile</p>
        <form onSubmit={hProf(onSaveProfile)} noValidate className="settings-form">
          <div className="form-group">
            <label className="input-label">Your Name</label>
            <input type="text" className="input-field"
              {...rProf('name', { required: 'Required', minLength: { value: 2, message: 'Min 2 chars' } })}
            />
            {eProf.name && <p className="input-error">⚠️ {eProf.name.message}</p>}
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="input-label">Weight (kg)</label>
              <input type="number" className="input-field"
                {...rProf('weight', { required: 'Required', min: { value: 20, message: 'Too low' }, max: { value: 300, message: 'Too high' }, valueAsNumber: true })}
              />
              {eProf.weight && <p className="input-error">⚠️ {eProf.weight.message}</p>}
            </div>
            <div className="form-group">
              <label className="input-label">Height (cm)</label>
              <input type="number" className="input-field"
                {...rProf('height', { required: 'Required', min: { value: 50, message: 'Too low' }, max: { value: 250, message: 'Too high' }, valueAsNumber: true })}
              />
              {eProf.height && <p className="input-error">⚠️ {eProf.height.message}</p>}
            </div>
          </div>
          <button type="submit" className="btn btn-purple btn-full">💾 Save Profile</button>
        </form>
      </div>

      {/* App Info */}
      <div className="card anim-fade-up delay-3" style={{ marginBottom: '0.75rem' }}>
        <p className="section-title">About</p>
        <div className="about-list">
          <div className="about-row"><span>App</span><span className="badge badge-green">FitTrack Pro</span></div>
          <div className="about-row"><span>Version</span><span style={{ color: 'var(--text3)' }}>1.0.0</span></div>
          <div className="about-row"><span>PWA</span><span className="badge badge-purple">✔️ Enabled</span></div>
          <div className="about-row"><span>Offline Storage</span><span className="badge badge-orange">IndexedDB</span></div>
          <div className="about-row"><span>Framework</span><span style={{ color: 'var(--text3)' }}>React 19 + Vite</span></div>
        </div>
      </div>

      <button className="btn btn-outline btn-full anim-fade-up delay-4"
        onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
}
