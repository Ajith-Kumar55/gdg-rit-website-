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
        gdg: {
          bg: '#080B14',
          secondary: '#101625',
          card: '#151E30',
          blue: '#4285F4',
          cyan: '#00D4FF',
          orange: '#FF7043',
          lime: '#A8FF60',
          red: '#EA4335',
          yellow: '#FBBC04',
          green: '#34A853',
          text: '#F5F7FF',
          muted: '#A6B0C3',
          dark: '#080B14',
          surface: '#101625',
          border: 'rgba(66, 133, 244, 0.16)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        '3d-card':
          '0 18px 38px -14px rgba(0, 0, 0, 0.78), 0 6px 16px -6px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(245, 247, 255, 0.12)',
        '3d-card-hover':
          '0 26px 52px -14px rgba(0, 0, 0, 0.85), 0 0 32px -8px rgba(66, 133, 244, 0.28), inset 0 1px 0 rgba(0, 212, 255, 0.28)',
        '3d-btn':
          '0 10px 24px -6px rgba(66, 133, 244, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 -2px 0 rgba(0, 0, 0, 0.28)',
        '3d-cyan':
          '0 12px 30px -8px rgba(0, 212, 255, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
      },
      animation: {
        'spin-slow': 'spin 24s linear infinite',
        'spin-reverse-slower': 'spinReverse 34s linear infinite',
        'float': 'float3d 6s ease-in-out infinite',
        'float-delayed': 'float3d 7.5s ease-in-out 1.5s infinite',
        'pulse-glow': 'pulseGlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ambient-drift': 'ambientDrift 14s ease-in-out infinite',
      },
      keyframes: {
        float3d: {
          '0%, 100%': { transform: 'translate3d(0, 0px, 0)' },
          '50%': { transform: 'translate3d(0, -10px, 0)' },
        },
        spinReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        ambientDrift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(18px, -14px, 0) scale(1.06)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 16px rgba(0, 212, 255, 0.55))' },
          '50%': { opacity: 0.72, filter: 'drop-shadow(0 0 6px rgba(66, 133, 244, 0.22))' },
        },
      },
    },
  },
  plugins: [],
};
