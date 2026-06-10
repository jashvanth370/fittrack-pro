import { useState, useEffect, useCallback } from 'react';
import TopBar from '../components/layout/TopBar';
import CircularProgress from '../components/common/CircularProgress';
import { addWaterLog, getWaterByDate, today } from '../db/indexedDB';
import { queueOfflineAction } from '../db/indexedDB';
import { useApp } from '../context/AppContext';
import './WaterTracker.css';
import { FaCheckCircle, FaTrophy } from 'react-icons/fa';

const QUICK = [250, 500, 750, 1000];

export default function WaterTracker() {
  const { goals, isOnline } = useApp();
  const [logs, setLogs] = useState([]);
  const [sliderVal, setSliderVal] = useState(250);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const totalMl  = logs.reduce((s, l) => s + l.amount, 0);
  const pct      = Math.min(Math.round((totalMl / goals.water) * 100), 100);

  const reload = useCallback(async () => {
    const data = await getWaterByDate(today());
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setLogs(data);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  };

  const addWater = async (ml) => {
    setSaving(true);
    try {
      await addWaterLog(ml);
      if (!isOnline) await queueOfflineAction('addWater', { ml, date: today() });
      await reload();
      showToast(`+${ml} ml added 💧`);
    } catch (e) {
      showToast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const glassCount = Math.floor(totalMl / 250);

  return (
    <div className="page">
      <TopBar title="Water Tracker" subtitle="Stay hydrated 💧" />

      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
      )}

      {/* Big ring */}
      <div className="water-hero card anim-fade-up">
        <CircularProgress value={pct} size={140} stroke={12} color="var(--accent)">
          <div style={{ textAlign: 'center' }}>
            <span className="num-big green">{(totalMl / 1000).toFixed(2)}</span>
            <p style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>/ {(goals.water / 1000).toFixed(1)} L</p>
          </div>
        </CircularProgress>
        <div className="water-stats">
          <div className="water-stat">
            <span className="water-stat-val">{pct}%</span>
            <span className="water-stat-lbl">of goal</span>
          </div>
          <div className="water-stat">
            <span className="water-stat-val">{glassCount}</span>
            <span className="water-stat-lbl">glasses</span>
          </div>
          <div className="water-stat">
            <span className="water-stat-val">{Math.max(goals.water - totalMl, 0)}</span>
            <span className="water-stat-lbl">ml left</span>
          </div>
        </div>
      </div>

      {/* Glasses visual */}
      <div className="card anim-fade-up delay-1" style={{ marginBottom: '0.75rem' }}>
        <p className="section-title">Glasses (250ml each)</p>
        <div className="glasses-grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`glass ${i < glassCount ? 'filled' : ''}`}>🥛</div>
          ))}
        </div>
      </div>

      {/* Quick Add */}
      <div className="card anim-fade-up delay-2" style={{ marginBottom: '0.75rem' }}>
        <p className="section-title">Quick Add</p>
        <div className="quick-btns">
          {QUICK.map((ml) => (
            <button key={ml} className="btn btn-outline btn-quick" onClick={() => addWater(ml)} disabled={saving}>
              +{ml}ml
            </button>
          ))}
        </div>
      </div>

      {/* Slider */}
      <div className="card anim-fade-up delay-3" style={{ marginBottom: '0.75rem' }}>
        <p className="section-title">Custom Amount</p>
        <div className="slider-row">
          <input type="range" min="50" max="1500" step="50"
            value={sliderVal} onChange={(e) => setSliderVal(Number(e.target.value))}
          />
          <span className="slider-val">{sliderVal} ml</span>
        </div>
        <button className="btn btn-primary btn-full" onClick={() => addWater(sliderVal)} disabled={saving}>
          {saving ? 'Saving…' : `Add ${sliderVal} ml 💧`}
        </button>
      </div>

      {/* Log */}
      <div className="card anim-fade-up delay-4">
        <p className="section-title">Today's Log</p>
        {logs.length === 0 ? (
          <div className="empty-state">
            <div className="icon">💧</div>
            <p>No water logged yet. Start hydrating!</p>
          </div>
        ) : (
          <div className="log-list">
            {logs.map((l) => (
              <div key={l.id} className="log-row">
                <span className="log-icon">💧</span>
                <div>
                  <p className="log-val">+{l.amount} ml</p>
                  <p className="log-time">{new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <span className="badge badge-green" style={{ marginLeft: 'auto' }}>{l.amount >= 500 ? '🏆 Big' : <FaCheckCircle />}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
