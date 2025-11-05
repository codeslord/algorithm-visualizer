import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          50: 'rgba(255, 255, 255, 0.05)',
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.2)',
          300: 'rgba(255, 255, 255, 0.3)',
        },
        primary: {
          DEFAULT: '#2962ff',
          dark: '#0039cb',
          light: '#768fff',
        },
        secondary: {
          DEFAULT: '#c51162',
          dark: '#8e0038',
          light: '#fd558f',
        },
        accent: {
          DEFAULT: '#00e676',
          dark: '#00b248',
          light: '#66ffa6',
        },
        highlight: {
          DEFAULT: '#29d',
          dark: '#006db3',
          light: '#5ec8ff',
        },
        warning: {
          DEFAULT: '#f3bd58',
          dark: '#bb8d28',
          light: '#ffef8a',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'mesh-gradient': `
          radial-gradient(at 40% 20%, hsla(220, 100%, 50%, 0.3) 0px, transparent 50%),
          radial-gradient(at 80% 0%, hsla(270, 100%, 50%, 0.3) 0px, transparent 50%),
          radial-gradient(at 0% 50%, hsla(330, 100%, 50%, 0.3) 0px, transparent 50%),
          radial-gradient(at 80% 50%, hsla(180, 100%, 50%, 0.3) 0px, transparent 50%),
          radial-gradient(at 0% 100%, hsla(240, 100%, 50%, 0.3) 0px, transparent 50%),
          radial-gradient(at 80% 100%, hsla(290, 100%, 50%, 0.3) 0px, transparent 50%),
          radial-gradient(at 0% 0%, hsla(200, 100%, 50%, 0.3) 0px, transparent 50%)
        `,
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(41, 98, 255, 0.5), 0 0 10px rgba(41, 98, 255, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(41, 98, 255, 0.8), 0 0 30px rgba(41, 98, 255, 0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 12px 48px 0 rgba(31, 38, 135, 0.5)',
        'glow-primary': '0 0 20px rgba(41, 98, 255, 0.5)',
        'glow-secondary': '0 0 20px rgba(197, 17, 98, 0.5)',
        'glow-accent': '0 0 20px rgba(0, 230, 118, 0.5)',
      },
    },
  },
  plugins: [],
}

export default config
