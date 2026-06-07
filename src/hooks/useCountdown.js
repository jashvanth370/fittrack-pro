import { useState, useRef, useCallback, useEffect } from 'react';

export const useCountdown = (initialSeconds = 60) => {
  const [total, setTotal] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const start = useCallback(() => {
    if (running || remaining <= 0) return;
    setFinished(false);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setRunning(true);
  }, [running, remaining]);

  const pause = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
  }, []);

  const reset = useCallback((newDuration) => {
    clearInterval(intervalRef.current);
    const d = newDuration ?? total;
    setTotal(d);
    setRemaining(d);
    setRunning(false);
    setFinished(false);
  }, [total]);

  const setDuration = useCallback((seconds) => {
    clearInterval(intervalRef.current);
    setTotal(seconds);
    setRemaining(seconds);
    setRunning(false);
    setFinished(false);
  }, []);

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const progress = total > 0 ? ((total - remaining) / total) * 100 : 0;

  return { remaining, running, finished, start, pause, reset, setDuration, display: fmt(remaining), progress };
};
