/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF4500',
        secondary: '#1A1A1B',
        accent: '#0079D3',
        surface: '#FFFFFF',
        background: '#F6F7F8',
        success: '#46D160',
        warning: '#FFB000',
        error: '#FF4500',
        info: '#0079D3',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-score': 'bounce 0.3s ease-in-out',
        'scale-vote': 'scale 0.1s ease-in-out',
      },
      keyframes: {
        'bounce': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
        'scale': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1.1)' },
        }
      }
    },
  },
  plugins: [],
}