/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Shared neutrals
        'cyber-bg': '#0B0F17',
        'cyber-surface': '#0F1420',
        'cyber-border': '#1E2638',
        'cyber-text': '#E6EAF2',
        'cyber-muted': '#A7B0C0',
        
        // Evil/Blocker theme
        'evil-primary': '#FF2E63',
        'evil-primary-hover': '#E22657',
        'evil-accent': '#F72585',
        'evil-glow': '#FF2E63',
        
        // Good/Guardian theme
        'good-primary': '#28F7D1',
        'good-primary-hover': '#1ED8B7',
        'good-accent': '#14FFEC',
        'good-glow': '#28F7D1',
        
        // CSS Variables (fallback)
        'primary': 'var(--primary, #FF2E63)',
        'primary-hover': 'var(--primary-hover, #E22657)',
        'accent': 'var(--accent, #F72585)',
        'glow': 'var(--glow, #FF2E63)',
        
        // Status colors
        'cyber-success': '#22C55E',
        'cyber-warning': '#F59E0B',
        'cyber-danger': '#EF4444',
        'cyber-info': '#38BDF8',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'grid-move': 'grid-move 20s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { boxShadow: '0 0 20px var(--glow, #FF2E63)' },
          '100%': { boxShadow: '0 0 40px var(--glow, #FF2E63), 0 0 60px var(--glow, #FF2E63)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'grid-move': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
