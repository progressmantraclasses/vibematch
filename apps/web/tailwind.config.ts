import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        velvetNight: '#0b0714',
        roseNeon: '#ff3366',
        electricViolet: '#a855f7',
        warmAmber: '#fbbf24',
        mintGlow: '#34d399',
        deepPlum: '#1a0a2e',
        cardGlass: 'rgba(255,255,255,0.05)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-inter)', 'ui-sans-serif', 'sans-serif'],
      },
      spacing: {
        13: '3.25rem',
        18: '4.5rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 51, 102, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 51, 102, 0.8)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'card-flip': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          to: { transform: 'rotate(-360deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'ping-soft': {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s ease-in-out infinite',
        'card-flip': 'card-flip 0.6s ease-in-out forwards',
        'spin-slow': 'spin-slow 40s linear infinite',
        'spin-slower': 'spin-slow 70s linear infinite',
        'spin-reverse': 'spin-reverse 55s linear infinite',
        marquee: 'marquee 38s linear infinite',
        'gradient-pan': 'gradient-pan 6s ease-in-out infinite',
        'ping-soft': 'ping-soft 2.4s cubic-bezier(0,0,0.2,1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
