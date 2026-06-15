import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Dashboard     = lazy(() => import('../pages/Dashboard'));
const WaterTracker  = lazy(() => import('../pages/WaterTracker'));
const CalorieTracker = lazy(() => import('../pages/CalorieTracker'));
const WorkoutTracker = lazy(() => import('../pages/WorkoutTracker'));
const History       = lazy(() => import('../pages/History'));
const Settings      = lazy(() => import('../pages/Settings'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div className="spinner" />
    </div>
  );
}

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"         element={<Dashboard />} />
        <Route path="/water"    element={<WaterTracker />} />
        <Route path="/calories" element={<CalorieTracker />} />
        <Route path="/workout"  element={<WorkoutTracker />} />
        <Route path="/history"  element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*"         element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
