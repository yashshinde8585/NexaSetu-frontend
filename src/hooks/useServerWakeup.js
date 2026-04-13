import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

export function useServerWakeup() {
  const [status, setStatus] = useState('idle');
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const ping = async () => {
      setStatus('waking');
      startRef.current = Date.now();

      timerRef.current = setInterval(() => {
        if (!cancelled) {
          setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
        }
      }, 1000);

      try {
        await api.get('/health', { timeout: 90_000 });
        if (!cancelled) {
          clearInterval(timerRef.current);
          setStatus('awake');
          setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
        }
      } catch (err) {
        if (!cancelled) {
          clearInterval(timerRef.current);
          setStatus('failed');
        }
      }
    };

    ping();

    return () => {
      cancelled = true;
      clearInterval(timerRef.current);
    };
  }, []);

  return { status, elapsed };
}
