/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        editorial: {
          bg: '#0A0B0D',
          surface: '#111317',
          card: '#16181E',
          cardElevated: '#1D2028',
          subtle: '#252932',
          border: 'rgba(255, 255, 255, 0.08)',
          borderLight: 'rgba(255, 255, 255, 0.15)',
          lime: {
            DEFAULT: '#D4F83C',
            hover: '#C0E228',
            dark: '#87A412',
            subtle: 'rgba(212, 248, 60, 0.12)',
            glow: 'rgba(212, 248, 60, 0.28)',
          },
          text: {
            primary: '#F6F7F9',
            secondary: '#A1A7B2',
            muted: '#666C77',
          },
          accent: {
            green: '#10B981',
            amber: '#F59E0B',
            red: '#EF4444',
            blue: '#38BDF8',
            purple: '#C084FC',
            rose: '#FB7185',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Syne', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.9rem' }],
      },
      boxShadow: {
        'subtle-glow': '0 0 25px -5px rgba(212, 248, 60, 0.15)',
        'lime-glow': '0 0 35px -5px rgba(212, 248, 60, 0.3)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.6)',
        'modal-dark': '0 20px 50px -10px rgba(0, 0, 0, 0.85)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'subtle-grid': 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2.5s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(95%)' },
        }
      }
    },
  },
  plugins: [],
}
