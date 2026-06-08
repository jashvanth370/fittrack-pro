import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const NAV = [
  { to: '/',         icon: '⚡', label: 'Dashboard' },
  { to: '/water',    icon: '💧', label: 'Water'     },
  { to: '/calories', icon: '🔥', label: 'Calories'  },
  { to: '/workout',  icon: '💪', label: 'Workout'   },
  { to: '/history',  icon: '📊', label: 'History'   },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {NAV.map(({ to, icon, label }) => (
        <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon">{icon}</span>
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
