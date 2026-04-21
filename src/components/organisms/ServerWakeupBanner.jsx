import React, { useState, useEffect } from 'react';
import { useServerWakeup } from '../../hooks/useServerWakeup';

export default function ServerWakeupBanner() {
  const { status, elapsed } = useServerWakeup();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === 'waking' && elapsed >= 1) setVisible(true);
  }, [status, elapsed]);

  useEffect(() => {
    if (status === 'awake' && visible) {
      const t = setTimeout(() => setDismissed(true), 2000);
      return () => clearTimeout(t);
    }
  }, [status, visible]);

  if (dismissed || !visible) return null;

  const isWaking = status === 'waking';
  const isAwake = status === 'awake';
  const isFailed = status === 'failed';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`sticky top-0 z-[9999] flex items-center justify-center px-4 py-2 text-[10px] font-extrabold tracking-[0.25em] uppercase backdrop-blur-md border-b border-white/10 transition-colors duration-500 animate-banner-slide-in ${
        isAwake
          ? 'bg-[rgba(0,200,100,0.15)]'
          : isFailed
          ? 'bg-[rgba(220,40,40,0.18)]'
          : 'bg-[#0a0a0a]/88'
      }`}
    >
      <div className="flex items-center gap-2.5 text-center">
        <span
          className={`${
            isWaking ? 'animate-dot-pulse' : ''
          } inline-block w-[7px] h-[7px] rounded-full shrink-0 transition-all duration-500 ${
            isAwake
              ? 'bg-[#00e87a] shadow-[0_0_8px_#00e87a]'
              : isFailed
              ? 'bg-[#ff4444] shadow-[0_0_8px_#ff4444]'
              : 'bg-[#f5a623] shadow-[0_0_8px_#f5a623]'
          }`}
        />

        <span
          className={
            isAwake ? 'text-[#00e87a]' : isFailed ? 'text-[#ff6b6b]' : 'text-[#c8c8c8]'
          }
        >
          {isWaking && (
            <>
              Waking intel server&nbsp;—&nbsp;
              <span className="text-[#f5a623]">{elapsed}s</span>
              &nbsp;elapsed. Stand by.
            </>
          )}
          {isAwake && (
            <span className="text-[#00e87a]">
              Central Intelligence Online — Link Established
            </span>
          )}
          {isFailed && (
            <span className="text-[#ff6b6b]">
              Connection Failed — Server Unreachable. Retry your action.
            </span>
          )}
        </span>
      </div>

      {!isAwake && (
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss server wakeup notice"
          className="bg-transparent border-none cursor-pointer text-white/40 text-[14px] leading-none px-1 shrink-0 absolute right-4 transition-colors duration-200 hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  );
}
