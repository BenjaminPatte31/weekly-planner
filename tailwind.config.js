/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'San Francisco',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        bg: {
          base:    '#111113',
          surface: '#1C1C1E',
          card:    '#242426',
          hover:   '#2C2C2E',
          border:  '#3A3A3C',
        },
        accent: {
          blue:   '#0A84FF',
          green:  '#30D158',
          orange: '#FF9F0A',
          red:    '#FF453A',
          purple: '#BF5AF2',
          pink:   '#FF375F',
          teal:   '#5AC8FA',
          indigo: '#5E5CE6',
        },
        text: {
          primary:   '#F5F5F7',
          secondary: '#8E8E93',
          tertiary:  '#48484A',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'ring-fill': 'ringFill 1s ease-out forwards',
        'fade-in':   'fadeIn 0.2s ease-out',
        'slide-up':  'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-dot': 'pulseDot 2s infinite',
      },
      keyframes: {
        ringFill: {
          from: { 'stroke-dashoffset': '283' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(20px) scale(0.96)' },
          to:   { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: 1 },
          '50%':       { opacity: 0.4 },
        },
      },
    },
  },
  plugins: [],
}
