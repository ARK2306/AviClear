/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#070b18',
          900: '#0a0f1e',
          850: '#0c1226',
          800: '#0f172a',
          750: '#131b30',
          700: '#1a2440',
          600: '#243153',
          500: '#334466',
          400: '#5b6a8a',
          300: '#8492b3',
          200: '#b3bdd6',
          100: '#dde3ef',
        },
        flight: {
          vfr:  '#22c55e',
          mvfr: '#3b82f6',
          ifr:  '#ef4444',
          lifr: '#d946ef',
        },
        sev: {
          critical:    '#ef4444',
          significant: '#f97316',
          routine:     '#6b7280',
        },
        accent: '#3b82f6',
      },
      boxShadow: {
        'glow-blue':   '0 0 0 1px rgba(59,130,246,.35), 0 8px 32px -8px rgba(59,130,246,.4)',
        'glow-green':  '0 0 0 1px rgba(34,197,94,.30), 0 8px 32px -10px rgba(34,197,94,.25)',
        'glow-red':    '0 0 0 1px rgba(239,68,68,.35), 0 8px 32px -10px rgba(239,68,68,.30)',
        'glow-orange': '0 0 0 1px rgba(249,115,22,.30), 0 8px 32px -10px rgba(249,115,22,.25)',
        'card':        '0 1px 0 0 rgba(255,255,255,.02) inset, 0 24px 48px -24px rgba(0,0,0,.6)',
      },
      animation: {
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'sweep':     'sweep 2s linear infinite',
        'fadeUp':    'fadeUp .4s ease both',
        'shimmer':   'shimmerMove 1.6s linear infinite',
      },
      keyframes: {
        pulseDot:    { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '.4', transform: 'scale(.85)' } },
        sweep:       { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        fadeUp:      { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmerMove: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
      },
    },
  },
  plugins: [],
}
