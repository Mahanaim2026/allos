/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        allos: {
          // Core blues — peace, trust, depth
          navy:    '#1A2E4A',   // deep authority
          blue:    '#2E6DA4',   // primary brand blue
          sky:     '#5B9FD4',   // lighter, breath
          mist:    '#C8DFF0',   // soft backgrounds
          // Warm accents — kept minimal
          gold:    '#C9A84C',   // Scripture warmth
          olive:   '#6B7E4A',   // life, growth
          clay:    '#C4714A',   // human warmth
          // Neutrals
          sand:    '#F7F4EF',   // warm off-white bg
          fog:     '#EEF2F7',   // cool off-white bg
        },
      },
      fontFamily: {
        serif: ['"Palatino Linotype"', 'Palatino', '"Book Antiqua"', 'Georgia', 'serif'],
        sans:  ['"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
