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
      screens: {
        'sm': '640px',  // Small devices (phones)
        'md': '768px',  // Medium devices (tablets)
        'lg': '1024px', // Large devices (laptops/desktops)
        'xl': '1280px', // Extra large devices (large desktops)
        '2xl': '1536px' // Very large screens (large desktop monitors)
      },

    },
  },
  plugins: [],
};

export default config;
