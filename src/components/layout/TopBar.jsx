import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import './TopBar.css';

export default function TopBar({ title, subtitle }) {
  const { theme, toggleTheme, isOnline } = useApp();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
        {subtitle && <p className="topbar-sub">{subtitle}</p>}
      </div>
      <div className="topbar-right">
        {!isOnline && <span className="dot-offline" title="Offline" />}
        <button className="topbar-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <Link to="/settings" className="topbar-btn" aria-label="Settings">⚙️</Link>
      </div>
    </header>
  );
}
