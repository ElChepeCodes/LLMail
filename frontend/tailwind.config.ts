import type { Config } from "tailwindcss";

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#e6f0ff',
          200: '#b3d4ff',
          300: '#80b8ff',
          400: '#4d9cff',
          500: '#1a80ff', // Main primary color
          600: '#0066cc',
          700: '#004d99',
        },
        secondary: {
          100: '#fae6e6',
          200: '#f5b3b3',
          300: '#f08080',
          400: '#eb4d4d',
          500: '#e61a1a', // Main secondary color
          600: '#b30000',
          700: '#800000',
        },
        accent: '#2dd4bf',
        surface: '#f8fafc',
        onSurface: '#0f172a',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
