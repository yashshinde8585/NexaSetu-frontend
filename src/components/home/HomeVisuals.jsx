import React, { memo, useMemo } from 'react';
import { HOME_CONFIG } from '../../data/home-data.jsx';

// Scroll progress bar.
export const ScrollProgressBar = memo(({ progress }) => (
  <div className="fixed top-0 left-0 right-0 h-[2px] z-[200] pointer-events-none bg-white/5">
    <div
      className="h-full rounded-r-full bg-linear-to-r from-primary to-secondary shadow-[0_0_12px_rgba(59,130,246,0.8)]"
      style={{ width: `${progress * 100}%`, transition: 'width 100ms linear' }}
    />
  </div>
));

// Background glow.
export const BackgroundGlow = memo(() => {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none -z-50"
      aria-hidden="true"
    >
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[140px]" />
    </div>
  );
});
