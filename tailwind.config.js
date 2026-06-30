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
        'allos-navy': '#1e2d4a',
        'allos-olive': '#6b7c5e',
        'allos-gold': '#c9a84c',
        'allos-clay': '#b56b45',
        'allos-sky': '#a8c4d4',
        'allos-cream': '#f7f4ef',
        'allos-warm': '#e8e0d4',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
};