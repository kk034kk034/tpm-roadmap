/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#17201c',
        paper: '#f7f4ec',
        moss: '#2f6f5e',
        citron: '#d8d86a',
        coral: '#d96c57',
        sky: '#7aa7b7'
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        panel: '0 18px 50px rgba(23, 32, 28, 0.12)'
      }
    }
  },
  plugins: []
};
