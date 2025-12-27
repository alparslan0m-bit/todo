export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Lock dark mode to manual class control only
  theme: {
    extend: {
      colors: {
        primary: '#1A4D2E', // Deep Emerald
        secondary: '#4F6F52', // Sage
        accent: '#FF9F29', // Golden warmth
        sand: '#F5EFE6', // Light Sand
        light: '#FAF9F6', // Off-white
        surface: '#FFFFFF',
        success: '#1A4D2E',
        danger: '#CF5C5C',
        text: {
          main: '#1A1A1A',
          muted: '#666666',
          light: '#999999'
        }
      },
      fontFamily: {
        arabic: ['Cairo', 'Segoe UI', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'premium': '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(26, 77, 46, 0.3)',
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #FAF9F6 0%, #F5EFE6 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
      }
    },
  },
  plugins: [],
};
