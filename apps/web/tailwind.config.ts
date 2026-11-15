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
        deepPlum: '#1a0a2e',
        cardGlass: 'rgba(255,255,255,0.05)',
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
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s ease-in-out infinite',
        'card-flip': 'card-flip 0.6s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
