/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        deep:    '#1B3A57',
        deep900: '#122A40',
        slate:   '#2C5573',
        sky:     '#6E9CC4',
        mist:    '#CFE0EE',
        powder:  '#E8F0F7',
        white:   '#F6F9FB',
        gold:    '#C8943F',
        text:    '#54677A',
        border:  '#DBE5EE',
      },
      fontFamily: {
        serif: ['Spectral', 'Georgia', 'serif'],
        sans:  ['Hanken Grotesk', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '100px',
      },
    },
  },
  plugins: [],
};
