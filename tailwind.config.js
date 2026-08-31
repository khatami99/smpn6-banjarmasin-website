/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        yellow: '#FFF90F',
        'yellow-dk': '#E6E00A',
        'yellow-bg': '#FFFDE6',
        ink: '#111111',
        'ink-2': '#2A2A2A',
        'ink-3': '#555555',
        'ink-4': '#888888',
        'off-white': '#F7F7F5',
        surface: '#F2F2F0',
        border: '#E0E0DC',
        'border-dk': '#CCCCCC',
        green: '#1F6B3A',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
