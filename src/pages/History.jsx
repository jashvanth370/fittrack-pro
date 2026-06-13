import { useState, useEffect } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, LineElement, PointElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import TopBar from '../components/layout/TopBar';
import { getWaterHistory, getCalorieHistory, getWorkoutHistory } from '../db/indexedDB';
import './History.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const chartOpts = (label, color) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(14,22,40,0.95)',
      titleColor: '#f0f4ff',
      bodyColor: color,
      borderColor: color,
      borderWidth: 1,
      padding: 10,
      callbacks: { label: (ctx) => `${ctx.parsed.y} ${label}` },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: '#4a5878', font: { size: 11 } },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: '#4a5878', font: { size: 11 } },
    },
  },
});

const buildDayMap = (items, valueKey, days = 7) => {
  const map = {};
  const labels = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    map[key] = 0;
    labels.push(d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }));
  }
  items.forEach((item) => {
    if (map[item.date] !== undefined) {
      map[item.date] += Number(item[valueKey]) || 0;
    }
  });
  return { labels, values: Object.values(map) };
};

export default function History() {
  const [tab, setTab]     = useState('water');
  const [data, setData]   = useState({ water: [], calories: [], workouts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [water, calories, workouts] = await Promise.all([
        getWaterHistory(7),
        getCalorieHistory(7),
        getWorkoutHistory(7),
      ]);
      setData({ water, calories, workouts });
      setLoading(false);
    };
    load();
  }, []);

  const waterMap    = buildDayMap(data.water,    'amount');
  const calMap      = buildDayMap(data.calories, 'calories');
  const workoutMap  = buildDayMap(data.workouts, 'duration');
  const burnedMap   = buildDayMap(data.workouts, 'caloriesBurned');

  const makeDataset = (values, color, fillColor) => ({
    data: values,
    backgroundColor: fillColor || color,
    borderColor: color,
    borderWidth: 2,
    borderRadius: 8,
    tension: 0.4,
    fill: true,
    pointBackgroundColor: color,
    pointRadius: 4,
    pointHoverRadius: 6,
  });

  const charts = {
    water: {
      title: 'Water Intake (ml)',
      color: 'rgba(0,229,176,1)',
      fill: 'rgba(0,229,176,0.15)',
      label: 'ml',
      data: waterMap,
      type: 'Line',
    },
    calories: {
      title: 'Calorie Intake (kcal)',
      color: 'rgba(255,107,157,1)',
      fill: 'rgba(255,107,157,0.12)',
      label: 'kcal',
      data: calMap,
      type: 'Bar',
    },
    workouts: {
      title: 'Workout Duration (min)',
      color: 'rgba(124,106,255,1)',
      fill: 'rgba(124,106,255,0.12)',
      label: 'min',
      data: workoutMap,
      type: 'Bar',
    },
    burned: {
      title: 'Calories Burned (kcal)',
      color: 'rgba(255,160,64,1)',
      fill: 'rgba(255,160,64,0.12)',
      label: 'kcal',
      data: burnedMap,
      type: 'Line',
    },
  };

  const cur = charts[tab];

  // Totals
  const totalWater    = data.water.reduce((s, r) => s + r.amount, 0);
  const totalCal      = data.calories.reduce((s, r) => s + r.calories, 0);
  const totalWk       = data.workouts.length;
  const totalBurned   = data.workouts.reduce((s, r) => s + r.caloriesBurned, 0);

  return (
    <div className="page">
      <TopBar title="History" subtitle="Last 7 days 📊" />

      {/* Summary cards */}
      <div className="hist-summary anim-fade-up">
        <div className="hist-sum-card" style={{ borderColor: 'rgba(0,229,176,0.3)' }}>
          <span className="hist-sum-icon">💧</span>
          <span className="hist-sum-val green">{(totalWater / 1000).toFixed(1)}L</span>
          <span className="hist-sum-lbl">Total Water</span>
        </div>
        <div className="hist-sum-card" style={{ borderColor: 'rgba(255,107,157,0.3)' }}>
          <span className="hist-sum-icon">🔥</span>
          <span className="hist-sum-val pink">{totalCal.toLocaleString()}</span>
          <span className="hist-sum-lbl">Total kcal</span>
        </div>
        <div className="hist-sum-card" style={{ borderColor: 'rgba(124,106,255,0.3)' }}>
          <span className="hist-sum-icon">💪</span>
          <span className="hist-sum-val purple">{totalWk}</span>
          <span className="hist-sum-lbl">Workouts</span>
        </div>
        <div className="hist-sum-card" style={{ borderColor: 'rgba(255,160,64,0.3)' }}>
          <span className="hist-sum-icon">⚡</span>
          <span className="hist-sum-val orange">{totalBurned}</span>
          <span className="hist-sum-lbl">kcal Burned</span>
        </div>
      </div>

      {/* Chart Tabs */}
      <div className="hist-tabs anim-fade-up delay-1">
        {Object.keys(charts).map((k) => (
          <button key={k} className={`hist-tab ${tab === k ? 'active' : ''}`}
            onClick={() => setTab(k)} style={{ '--tc': charts[k].color }}>
            {k === 'water' ? '💧' : k === 'calories' ? '🔥' : k === 'workouts' ? '💪' : '⚡'}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="card chart-card anim-fade-up delay-2">
        <p className="section-title">{cur.title}</p>
        {loading ? (
          <div className="chart-loading"><div className="spinner" /></div>
        ) : (
          <div className="chart-wrap">
            {cur.type === 'Line' ? (
              <Line
                data={{ labels: cur.data.labels, datasets: [makeDataset(cur.data.values, cur.color, cur.fill)] }}
                options={chartOpts(cur.label, cur.color)}
              />
            ) : (
              <Bar
                data={{ labels: cur.data.labels, datasets: [makeDataset(cur.data.values, cur.color, cur.fill)] }}
                options={chartOpts(cur.label, cur.color)}
              />
            )}
          </div>
        )}
      </div>

      {/* Recent Workouts list */}
      <div className="card anim-fade-up delay-3">
        <p className="section-title">Recent Workouts</p>
        {data.workouts.length === 0 ? (
          <div className="empty-state"><div className="icon">🏋️</div><p>No workouts in last 7 days</p></div>
        ) : (
          <div>
            {data.workouts.slice(0, 8).map((w) => (
              <div key={w.id} className="hist-wk-row">
                <span className="hist-wk-date">{new Date(w.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span className="hist-wk-name">{w.exerciseName}</span>
                <span className="badge badge-purple">{w.duration}m</span>
                <span className="badge badge-orange">{w.caloriesBurned}kcal</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
