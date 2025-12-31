export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#059669', // Rich Emerald
        secondary: '#0D9488', // Deep Teal
        accent: '#D97706', // Amber/Gold
        system: '#F2F4F3', // Warm Sage Tint
        success: '#15803D',
        danger: '#DC2626',
        text: {
          main: '#062C24', // Deepest Pine Green
          secondary: '#4A635D', // Slate Sage
          tertiary: '#9CA3AF'
        }
      },
      fontFamily: {
        arabic: ['Cairo', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'apple': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        'premium': '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'ios': '12px',
        'squircle': '22px',
      }
    },
  },
  plugins: [],
};
