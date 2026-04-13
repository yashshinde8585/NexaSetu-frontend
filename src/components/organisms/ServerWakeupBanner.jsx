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
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        fontSize: '10px',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 800,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        transition: 'background 0.4s ease',
        background: isAwake
          ? 'rgba(0, 200, 100, 0.15)'
          : isFailed
          ? 'rgba(220, 40, 40, 0.18)'
          : 'rgba(10, 10, 10, 0.88)',
        animation: 'nexaBannerSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
      }}
    >
      <style>{`
        @keyframes nexaBannerSlideIn {
          from { opacity: 0; transform: translateY(-100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nexaPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .nexa-dot-pulse {
          animation: nexaPulse 1.1s ease-in-out infinite;
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          className={isWaking ? 'nexa-dot-pulse' : ''}
          style={{
            display: 'inline-block',
            width: 7,
            height: 7,
            borderRadius: '50%',
            flexShrink: 0,
            background: isAwake ? '#00e87a' : isFailed ? '#ff4444' : '#f5a623',
            boxShadow: isAwake
              ? '0 0 8px #00e87a'
              : isFailed
              ? '0 0 8px #ff4444'
              : '0 0 8px #f5a623',
          }}
        />

        <span
          style={{
            color: isAwake ? '#00e87a' : isFailed ? '#ff6b6b' : '#c8c8c8',
          }}
        >
          {isWaking && (
            <>
              Waking intel server&nbsp;—&nbsp;
              <span style={{ color: '#f5a623' }}>{elapsed}s</span>
              &nbsp;elapsed. Stand by.
            </>
          )}
          {isAwake && (
            <span style={{ color: '#00e87a' }}>
              Central Intelligence Online — Link Established
            </span>
          )}
          {isFailed && (
            <span style={{ color: '#ff6b6b' }}>
              Connection Failed — Server Unreachable. Retry your action.
            </span>
          )}
        </span>
      </div>

      {!isAwake && (
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss server wakeup notice"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '14px',
            lineHeight: 1,
            padding: '0 4px',
            flexShrink: 0,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')
          }
        >
          ✕
        </button>
      )}
    </div>
  );
}
