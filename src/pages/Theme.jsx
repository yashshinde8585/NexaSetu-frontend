import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Monitor,
  Check,
  ShieldCheck,
  Sun,
  Moon,
  ChevronRight,
  Activity,
} from 'lucide-react';
import Button from '../components/atoms/Button';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

/**
 * Theme customization page — renders correctly in all three themes:
 * Obsidian (deep dark), Command Amber (dark warm), High Contrast Light (Ghost).
 * Uses CSS variable inline styles for any element that cannot be covered
 * by the global ghost/amber class-override rules in index.css.
 */
const Theme = () => {
  const { theme, accent, saveTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [accentColor, setAccentColor] = useState(accent);

  const themes = [
    {
      id: 'obsidian',
      name: 'Strategic Dark',
      desc: 'Optimized dark interface for technical operations.',
      colors: ['#000000', '#3b82f6', '#10b981'],
    },
    {
      id: 'amber',
      name: 'Command Amber',
      desc: 'Focused professional display with warm tactical tones.',
      colors: ['#121212', '#f59e0b', '#ef4444'],
    },
    {
      id: 'ghost',
      name: 'High Contrast Light',
      desc: 'Maximized readability for bright environment productivity.',
      colors: ['#F8FAFC', '#64748b', '#0369a1'],
      light: true,
    },
  ];

  const accents = [
    { id: 'blue', color: 'bg-blue-500', hex: '#3b82f6' },
    { id: 'emerald', color: 'bg-emerald-500', hex: '#10b981' },
    { id: 'amber', color: 'bg-amber-500', hex: '#f59e0b' },
    { id: 'purple', color: 'bg-purple-500', hex: '#a855f7' },
    { id: 'rose', color: 'bg-rose-500', hex: '#f43f5e' },
  ];

  return (
    <div className="px-3 sm:px-4 lg:px-6 py-4">
      <div className="max-w-screen-xl mx-auto space-y-6 animate-in fade-in duration-700">
        {/* Header */}
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <div className="space-y-1">
            <h1
              className="text-[14px] font-black tracking-widest uppercase"
              style={{ color: 'var(--color-text)' }}
            >
              CONSOLE_APPEARANCE
            </h1>
            <p
              className="text-[9px] font-black uppercase tracking-[0.2em] max-w-xl"
              style={{ color: 'var(--color-text-subtle)' }}
            >
              DEFINE VISUAL PARAMETERS FOR OPTIMAL TECHNICAL CLARITY.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              saveTheme(selectedTheme, accentColor);
              toast.success('Appearance configuration saved successfully.');
              setTimeout(() => window.location.reload(), 800);
            }}
            className="h-9 px-4 text-[9px] font-black uppercase tracking-widest rounded w-full md:w-auto"
          >
            SAVE_THEME_PROTOCOL
          </Button>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Theme & Accent Selection */}
          <div className="xl:col-span-8 space-y-6">
            {/* Theme Grid */}
            <section className="space-y-4">
              <h2
                className="text-[9px] font-black uppercase tracking-[0.2em]"
                style={{ color: 'var(--color-text-subtle)' }}
              >
                THEME_INFRASTRUCTURE
              </h2>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-px rounded overflow-hidden"
                style={{
                  backgroundColor: 'var(--color-border-subtle)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id)}
                    className="p-4 text-left transition-all relative group"
                    style={{
                      backgroundColor:
                        selectedTheme === t.id
                          ? 'var(--color-background-elevated)'
                          : 'var(--color-background)',
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className="flex gap-1.5 p-1 rounded"
                        style={{
                          backgroundColor: 'var(--color-background-elevated)',
                          border: '1px solid var(--color-border-subtle)',
                        }}
                      >
                        {t.colors.map((c, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      {selectedTheme === t.id && (
                        <div className="px-1.5 py-0.5 bg-primary/10 border border-primary/20 rounded text-[7px] font-black text-primary uppercase tracking-widest">
                          ACTIVE
                        </div>
                      )}
                    </div>
                    <h3
                      className="text-[12px] font-black uppercase mb-1"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {t.name}
                    </h3>
                    <p
                      className="text-[8px] font-black uppercase tracking-[0.2em] max-w-[240px] whitespace-normal leading-relaxed"
                      style={{ color: 'var(--color-text-subtle)' }}
                    >
                      {t.desc}
                    </p>

                    {selectedTheme === t.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Accent Selection */}
            <section className="space-y-4">
              <h2
                className="text-[9px] font-black uppercase tracking-[0.2em]"
                style={{ color: 'var(--color-text-subtle)' }}
              >
                TACTICAL_ACCENTS
              </h2>
              <div
                className="p-4 rounded flex flex-wrap gap-4 items-center"
                style={{
                  backgroundColor: 'var(--color-background-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                {accents.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setAccentColor(acc.id)}
                    className="w-10 h-10 rounded flex items-center justify-center transition-all"
                    style={{
                      backgroundColor:
                        accentColor === acc.id
                          ? 'var(--color-background-light)'
                          : 'var(--color-background)',
                      border:
                        accentColor === acc.id
                          ? '2px solid var(--color-text-muted)'
                          : '1px solid var(--color-border-subtle)',
                    }}
                  >
                    <div
                      className={`w-6 h-6 rounded-sm ${acc.color} flex items-center justify-center text-white`}
                    >
                      {accentColor === acc.id && (
                        <Check size={12} strokeWidth={3} />
                      )}
                    </div>
                  </button>
                ))}

                <div
                  className="h-8 w-[1px] hidden sm:block mx-2"
                  style={{ backgroundColor: 'var(--color-border-subtle)' }}
                />

                <div className="flex-1 min-w-[150px] flex items-center gap-3">
                  <div
                    className={`h-8 px-3 rounded bg-${accentColor}-500/10 border border-${accentColor}-500/20 text-${accentColor}-500 text-[8px] font-black uppercase tracking-[0.2em] flex items-center`}
                  >
                    PREVIEW
                  </div>
                  <div
                    className="flex-1 h-1 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--color-border-subtle)' }}
                  >
                    <div className={`h-full bg-${accentColor}-500 w-3/4`} />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sync & Readiness Sidebar */}
          <div className="xl:col-span-4 space-y-6">
            {/* System Sync */}
            <section className="space-y-4">
              <h2
                className="text-[9px] font-black uppercase tracking-[0.2em]"
                style={{ color: 'var(--color-text-subtle)' }}
              >
                SYSTEM_SYNCHRONIZATION
              </h2>
              <div
                className="rounded overflow-hidden"
                style={{
                  backgroundColor: 'var(--color-background-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <SyncItem
                  icon={<Monitor size={12} />}
                  title="FOLLOW_SYSTEM_OS"
                  active={false}
                  onClick={() => {
                    const isDark = window.matchMedia(
                      '(prefers-color-scheme: dark)'
                    ).matches;
                    const targetTheme = isDark ? 'obsidian' : 'ghost';
                    setSelectedTheme(targetTheme);
                    saveTheme(targetTheme, accentColor);
                    toast.success(
                      'Appearance synchronized with OS preferences.'
                    );
                  }}
                />
                <SyncItem
                  icon={<Sun size={12} />}
                  title="FORCE_DAY_MODE"
                  active={selectedTheme === 'ghost'}
                  onClick={() => {
                    setSelectedTheme('ghost');
                    saveTheme('ghost', accentColor);
                    toast.success(
                      'Forced Day Mode (High Contrast Light) activated.'
                    );
                  }}
                />
                <SyncItem
                  icon={<Moon size={12} />}
                  title="FORCE_OPERATIONS_DARK"
                  active={selectedTheme === 'obsidian'}
                  onClick={() => {
                    setSelectedTheme('obsidian');
                    saveTheme('obsidian', accentColor);
                    toast.success(
                      'Forced Dark Mode (Strategic Obsidian) activated.'
                    );
                  }}
                />
              </div>
            </section>

            {/* Console Readiness */}
            <section
              className="p-4 rounded space-y-4"
              style={{
                backgroundColor: 'var(--color-background-elevated)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-primary-light" />
                <h3
                  className="text-[10px] font-black uppercase tracking-[0.2em]"
                  style={{ color: 'var(--color-text)' }}
                >
                  CONSOLE_READINESS
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                  <span style={{ color: 'var(--color-text-subtle)' }}>
                    INTERFACE_STATUS
                  </span>
                  <span className="text-status-success">OPTIMIZED</span>
                </div>
                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                  <span style={{ color: 'var(--color-text-subtle)' }}>
                    ACCENT_BINDING
                  </span>
                  <span style={{ color: 'var(--color-text)' }}>ACTIVE</span>
                </div>
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--color-background-dark)' }}
                >
                  <div className="h-full bg-primary w-full animate-pulse" />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer
          className="pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-[8px] font-black uppercase tracking-[0.2em]"
          style={{
            borderColor: 'var(--color-border-subtle)',
            color: 'var(--color-text-subtle)',
          }}
        >
          <div className="flex items-center gap-4">
            <span>NEXA_SETU_INTERFACE_v3.4</span>
            <span>ENCRYPTION_ACTIVE</span>
          </div>
          <div className="flex gap-2">
            <button
              className="h-9 px-4 rounded transition-all"
              style={{
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-subtle)',
              }}
            >
              DISCARD
            </button>
            <button
              className="h-9 px-4 rounded transition-all"
              style={{
                backgroundColor: 'var(--color-background-elevated)',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-muted)',
              }}
            >
              RESTORE_DEFAULTS
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

const SyncItem = ({ icon, title, active, onClick }) => (
  <button
    onClick={onClick}
    className="w-full h-9 px-4 flex items-center justify-between group transition-all"
    style={{
      backgroundColor: active
        ? 'var(--color-primary, rgba(96,165,250,0.1))'
        : 'transparent',
    }}
  >
    <div className="flex items-center gap-3">
      <div
        className="w-5 h-5 rounded-sm flex items-center justify-center transition-colors"
        style={{
          color: active ? 'var(--color-primary)' : 'var(--color-text-subtler)',
        }}
      >
        {icon}
      </div>
      <span
        className="text-[9px] font-black uppercase tracking-[0.2em] transition-colors"
        style={{
          color: active ? 'var(--color-text)' : 'var(--color-text-subtle)',
        }}
      >
        {title}
      </span>
    </div>
    {active ? (
      <ShieldCheck size={14} className="text-primary" />
    ) : (
      <ChevronRight
        size={14}
        className="transition-transform transform group-hover:translate-x-1"
        style={{ color: 'var(--color-text-subtler)' }}
      />
    )}
  </button>
);

SyncItem.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Theme;
