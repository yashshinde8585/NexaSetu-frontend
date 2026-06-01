import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const Theme = () => {
  const { theme, accent, saveTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [accentColor, setAccentColor] = useState(accent);

  const themes = [
    {
      id: 'obsidian',
      name: 'Dark Mode',
      desc: 'Optimized dark interface for low-light environments.',
      colors: ['#000000', '#3b82f6', '#10b981'],
    },
    {
      id: 'amber',
      name: 'Amber Mode',
      desc: 'Focused professional display with warm amber tones.',
      colors: ['#121212', '#f59e0b', '#ef4444'],
    },
    {
      id: 'ghost',
      name: 'Light Mode',
      desc: 'Clean, light layout with high contrast for bright environments.',
      colors: ['#F8FAFC', '#64748b', '#0369a1'],
      light: true,
    },
  ];

  return (
    <div className="px-3 sm:px-4 lg:px-6 py-4">
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-700">
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
              Appearance Settings
            </h1>
            <p
              className="text-[9px] font-black uppercase tracking-[0.2em] max-w-xl"
              style={{ color: 'var(--color-text-subtle)' }}
            >
              Customize the visual settings of your workspace dashboard.
            </p>
          </div>
        </div>

        {/* Configuration Grid */}
        <div className="space-y-6">
          {/* Theme & Accent Selection */}
          <div className="space-y-6">
            {/* Theme Grid */}
            <section className="space-y-4">
              <h2
                className="text-[9px] font-black uppercase tracking-[0.2em]"
                style={{ color: 'var(--color-text-subtle)' }}
              >
                Available Themes
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
          </div>
        </div>

        {/* Footer */}
        <footer
          className="pt-6 border-t flex flex-col sm:flex-row justify-end items-center gap-4 text-[8px] font-black uppercase tracking-[0.2em]"
          style={{
            borderColor: 'var(--color-border-subtle)',
            color: 'var(--color-text-subtle)',
          }}
        >
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedTheme(theme);
                setAccentColor(accent);
                toast.success('Appearance changes discarded.');
              }}
              className="h-9 px-4 rounded transition-all cursor-pointer"
              style={{
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-subtle)',
              }}
            >
              Discard
            </button>
            <button
              onClick={() => {
                setSelectedTheme('obsidian');
                setAccentColor('blue');
                toast.success(
                  'Default configuration selected. Click save to apply.'
                );
              }}
              className="h-9 px-4 rounded transition-all cursor-pointer mr-1"
              style={{
                backgroundColor: 'var(--color-background-elevated)',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-muted)',
              }}
            >
              Restore Defaults
            </button>
            <button
              onClick={() => {
                saveTheme(selectedTheme, accentColor);
                toast.success('Appearance configuration saved successfully.');
                setTimeout(() => window.location.reload(), 800);
              }}
              className="h-9 px-4 rounded transition-all cursor-pointer"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-background)',
                border: '1px solid var(--color-primary)',
              }}
            >
              Save Theme
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Theme;
