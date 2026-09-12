/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Official FáGlè palette, exposed both as named tokens (fagle-*)
        // and as overrides of the emerald/amber scales already used
        // throughout the component library, so every existing
        // bg-emerald-*/text-emerald-*/amber-* utility renders on-brand
        // without having to touch every component file individually.
        fagle: {
          primary: '#143A12',
          leaf: '#2E521C',
          olive: '#526E2B',
          gold: '#A57718',
          sun: '#E1A733',
          cream: '#FEFDF6',
        },
        emerald: {
          950: '#143A12',
          900: '#1B4416',
          800: '#234D1B',
          700: '#2E521C',
          600: '#45651F',
          500: '#526E2B',
          400: '#7C9155',
          300: '#A3B584',
          200: '#C7D3A9',
          100: '#E3EAD1',
          50: '#FEFDF6',
        },
        amber: {
          900: '#4E3A0D',
          800: '#6E4E10',
          700: '#8A6314',
          600: '#A57718',
          500: '#E1A733',
          200: '#F0D9A0',
          100: '#F6E7C4',
          50: '#FCF4E3',
        },
        risk: {
          low: '#2E521C',
          moderate: '#A57718',
          high: '#B3261E',
        },
      },
      backgroundImage: {
        'fagle-hero': 'linear-gradient(135deg, #143A12 0%, #2E521C 55%, #526E2B 100%)',
        'fagle-card': 'linear-gradient(135deg, #143A12 0%, #526E2B 100%)',
      },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(20, 58, 18, 0.15)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
