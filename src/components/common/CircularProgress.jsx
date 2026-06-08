import React from 'react';

const CircularProgress = React.memo(function CircularProgress({
  value = 0,      // 0-100
  size = 100,
  stroke = 8,
  color = 'var(--accent)',
  trackColor = 'var(--bg3)',
  children,
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct  = Math.min(Math.max(value, 0), 100);
  const dash  = (pct / 100) * circ;

  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - dash}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
      </svg>
      {children && <div className="ring-center">{children}</div>}
    </div>
  );
});

export default CircularProgress;

// Performance note: React.memo prevents re-render when parent
// updates unrelated state (e.g. toast notifications)
