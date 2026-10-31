/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beauty: {
          ivory: '#F8F6F0',
          cream: '#EFECE3',
          surface: '#FFFFFF',
          forest: {
            DEFAULT: '#243C32',
            hover: '#1B2E26',
            light: '#2E4E41',
            subtle: 'rgba(36, 60, 50, 0.06)',
            soft: 'rgba(36, 60, 50, 0.12)',
          },
          sage: {
            DEFAULT: '#A6B39A',
            light: '#DCE2D6',
            subtle: 'rgba(166, 179, 154, 0.2)',
          },
          charcoal: {
            DEFAULT: '#252923',
            heading: '#1A1E18',
            body: '#383D35',
          },
          muted: {
            DEFAULT: '#85877F',
            light: '#B6B8AF',
            border: '#E3DFD5',
            soft: '#EDE9E0',
          },
          lime: {
            DEFAULT: '#B4D836',
            subtle: 'rgba(180, 216, 54, 0.15)',
          },
          terracotta: {
            DEFAULT: '#C76D54',
            subtle: 'rgba(199, 109, 84, 0.12)',
          }
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.95rem' }],
      },
      boxShadow: {
        'beauty-sm': '0 2px 8px -2px rgba(36, 60, 50, 0.05), 0 1px 3px rgba(36, 60, 50, 0.03)',
        'beauty-md': '0 6px 18px -4px rgba(36, 60, 50, 0.08), 0 2px 6px rgba(36, 60, 50, 0.04)',
        'beauty-card': '0 2px 12px -2px rgba(36, 60, 50, 0.05), 0 1px 3px rgba(36, 60, 50, 0.03)',
        'beauty-card-hover': '0 12px 28px -6px rgba(36, 60, 50, 0.08), 0 4px 10px rgba(36, 60, 50, 0.04)',
        'beauty-modal': '0 25px 60px -15px rgba(36, 60, 50, 0.25)',
      },
    },
  },
  plugins: [],
}
