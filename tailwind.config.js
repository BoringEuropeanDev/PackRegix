/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#334155',
        accent: '#8B7E74',
        success: '#4B5E40',
        warning: '#B89778',
        error: '#9B4C3A'
      }
    }
  },
  darkMode: 'class',
  plugins: []
};
