import { useState, useRef, useCallback } from 'react';

export const useStopwatch = () => {
  const [elapsed, setElapsed] = useState(0);   // ms
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const start = useCallback(() => {
    if (running) return;
    startTimeRef.current = Date.now() - elapsed;
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 100);
    setRunning(true);
  }, [running, elapsed]);

  const pause = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setElapsed(0);
  }, []);

  const fmt = (ms) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    return [
      String(h).padStart(2, '0'),
      String(m % 60).padStart(2, '0'),
      String(s % 60).padStart(2, '0'),
    ].join(':');
  };

  return { elapsed, running, start, pause, reset, display: fmt(elapsed), seconds: Math.floor(elapsed / 1000) };
};
