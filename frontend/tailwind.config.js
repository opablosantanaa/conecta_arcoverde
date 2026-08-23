/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#FFF3ED', 100: '#FFE2D1', 200: '#FFC2A3', 300: '#FF9A6B',
          400: '#FF7A3D', 500: '#FF6B2B', 600: '#E85A1E', 700: '#C14716',
          800: '#8F3412', 900: '#5E2310',
        },
        surface: {
          DEFAULT: '#FFFFFF', secondary: '#FAFAFA', tertiary: '#F4F4F5',
          dark: { DEFAULT: '#0D0D0D', secondary: '#1A1A1A', tertiary: '#262626', }
        },
        content: {
          DEFAULT: '#1A1A1A', secondary: '#6B7280', muted: '#9CA3AF',
          dark: { DEFAULT: '#FFFFFF', secondary: '#A3A3A3', muted: '#737373', }
        },
        border: { DEFAULT: '#E5E7EB', dark: '#333333' },
        success: '#10B981', error: '#EF4444', warning: '#F59E0B', info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px', 'btn': '12px',
        'organic': '30% 70% 70% 30% / 30% 30% 70% 70%',
        'organic-sm': '40% 60% 60% 40% / 60% 30% 70% 40%',
        'organic-lg': '25% 75% 65% 35% / 35% 45% 55% 65%',
      },
      boxShadow: {
        'sm-soft': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 24px -4px rgba(255, 107, 43, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.06)',
        'modal': '0 20px 50px -12px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 40px -10px rgba(255, 107, 43, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:   { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp:  { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideIn:  { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(0)' } },
        float:    { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
      },
    },
  },
  plugins: [],
}