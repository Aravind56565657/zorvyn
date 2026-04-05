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
        base: '#F7F8FC',
        surface: '#FFFFFF',
        border1: '#E8EAF0',
        border2: '#D4D8E8',
        text1: '#1A1D2E',
        text2: '#6B7280',
        text3: '#9CA3AF',
        accent: '#5B6AF0',
        'accent-l': '#EEF0FE',
        green: '#16A34A',
        'green-l': '#DCFCE7',
        red: '#DC2626',
        'red-l': '#FEE2E2',
        amber: '#D97706',
        'amber-l': '#FEF3C7',
        purple: '#7C3AED',
        'purple-l': '#EDE9FE',
        cyan: '#0891B2',
        'cyan-l': '#CFFAFE'
      },
      fontFamily: {
        bricolage: ['"Bricolage Grotesque"', 'sans-serif'],
        outfit: ['"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
