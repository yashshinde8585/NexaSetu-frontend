export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#1E3A8A',
          light: '#60A5FA',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
        },
        background: {
          DEFAULT: '#1E293B',
          dark: '#0F172A',
          light: '#334155',
        },
        text: {
          DEFAULT: '#F1F5F9',
          muted: '#94A3B8',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#38BDF8',
        },
      },
      spacing: {
        'brand-xs': '0.5rem',
        'brand-sm': '1rem',
        'brand-md': '1.5rem',
        'brand-lg': '2rem',
        'brand-xl': '3rem',
      },
    },
  },
  plugins: [],
};
