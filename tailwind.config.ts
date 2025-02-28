import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{html,ts}', // Add your file extensions and paths here
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Example: adding a custom color
        secondary: '#9333EA',
      },
      spacing: {
        '128': '32rem', // Example: adding a custom spacing value
      },
      fontFamily: {
        custom: ['Inter', 'sans-serif'], // Example: adding a custom font
      },
    },
  },
  plugins: [],
};

export default config;
