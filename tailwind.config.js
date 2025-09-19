/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"], // Updated to support Angular files
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A2647',  // Deep navy (.gov / military blue)
          light: '#26466d',
          dark: '#06172d',
        },
        accent: {
          DEFAULT: '#B91C1C',  // Muted patriotic red
          light: '#DC2626',
          dark: '#7F1D1D',
        },
        gold: '#D4AF37',        // Classic gold for highlights
        surface: '#F5F5F4',     // Light off-white surface
        onSurface: '#1F2937',   // Dark slate text on surface
        onPrimary: '#FFFFFF',   // White text on primary/navy
        blueLight: '#1D4ED8',   // For links and hover states
        success: '#22C55E',
        error: '#EF4444',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
