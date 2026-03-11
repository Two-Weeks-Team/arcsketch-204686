import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#f0f0f0',
        card: '#1a1a1a',
        muted: '#1e1e1e',
        border: '#2a2a2a',
        primary: '#00ffcc',
        accent: '#00b39c',
        success: '#00cc99',
        warning: '#ffcc00',
      },
      borderRadius: {
        lg: '0.5rem',
        xl: '1rem',
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;