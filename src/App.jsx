import { BrowserRouter } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import AppRouter from './router/AppRouter';
import BottomNav from './components/layout/BottomNav';
import './styles/global.css';

function AppShell() {
  const { isOnline } = useApp();
  return (
    <>
      {!isOnline && (
        <div className="offline-banner">📡 You are currently offline</div>
      )}
      <AppRouter />
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  );
}
