/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Health-specific colors
        health: {
          success: 'hsl(var(--health-success))',
          warning: 'hsl(var(--health-warning))',
          danger: 'hsl(var(--health-danger))',
          info: 'hsl(var(--health-info))',
        },
        // Cultural theme colors
        cultural: {
          primary: 'hsl(var(--cultural-primary))',
          secondary: 'hsl(var(--cultural-secondary))',
          accent: 'hsl(var(--cultural-accent))',
        },
        // VitaPulse brand colors
        vitapulse: {
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554',
          },
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
            950: '#052e16',
          },
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
            950: '#431407',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
        // Arabic font support
        arabic: [
          'Noto Sans Arabic',
          'Amiri',
          'Scheherazade New',
          'sans-serif',
        ],
        // Chinese font support
        chinese: [
          'Noto Sans SC',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'sans-serif',
        ],
        // Japanese font support
        japanese: [
          'Noto Sans JP',
          'Hiragino Kaku Gothic ProN',
          'Yu Gothic',
          'Meiryo',
          'sans-serif',
        ],
        // Hindi font support
        hindi: [
          'Noto Sans Devanagari',
          'Mangal',
          'sans-serif',
        ],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        bounceGentle: {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        heartbeat: {
          '0%': {
            transform: 'scale(1)',
          },
          '14%': {
            transform: 'scale(1.1)',
          },
          '28%': {
            transform: 'scale(1)',
          },
          '42%': {
            transform: 'scale(1.1)',
          },
          '70%': {
            transform: 'scale(1)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        glow: {
          '0%': {
            boxShadow: '0 0 5px hsl(var(--primary))',
          },
          '100%': {
            boxShadow: '0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary))',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'health-gradient': 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--cultural-secondary)) 100%)',
        'vitapulse-gradient': 'linear-gradient(135deg, #3b82f6 0%, #22c55e 50%, #f97316 100%)',
        'hero-gradient': 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(34, 197, 94, 0.1) 50%, rgba(249, 115, 22, 0.1) 100%)',
      },
      boxShadow: {
        'health': '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)',
        'health-lg': '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '9/16': '9 / 16',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
      rotate: {
        '1': '1deg',
        '2': '2deg',
        '3': '3deg',
      },
      blur: {
        xs: '2px',
      },
      brightness: {
        25: '.25',
        175: '1.75',
      },
      contrast: {
        25: '.25',
        175: '1.75',
      },
      grayscale: {
        50: '.5',
      },
      hueRotate: {
        15: '15deg',
        30: '30deg',
        60: '60deg',
        90: '90deg',
      },
      invert: {
        25: '.25',
        50: '.5',
        75: '.75',
      },
      saturate: {
        25: '.25',
        75: '.75',
        125: '1.25',
        175: '1.75',
        200: '2',
      },
      sepia: {
        25: '.25',
        75: '.75',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    // Custom plugin for health-specific utilities
    function({ addUtilities, theme }) {
      const healthUtilities = {
        '.text-health-excellent': {
          color: theme('colors.green.600'),
        },
        '.text-health-good': {
          color: theme('colors.blue.600'),
        },
        '.text-health-fair': {
          color: theme('colors.yellow.600'),
        },
        '.text-health-poor': {
          color: theme('colors.red.600'),
        },
        '.bg-health-excellent': {
          backgroundColor: theme('colors.green.100'),
          color: theme('colors.green.800'),
        },
        '.bg-health-good': {
          backgroundColor: theme('colors.blue.100'),
          color: theme('colors.blue.800'),
        },
        '.bg-health-fair': {
          backgroundColor: theme('colors.yellow.100'),
          color: theme('colors.yellow.800'),
        },
        '.bg-health-poor': {
          backgroundColor: theme('colors.red.100'),
          color: theme('colors.red.800'),
        },
        '.health-card-hover': {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.health-lg'),
          },
        },
        '.glass-effect': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.dark .glass-effect': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      };
      
      addUtilities(healthUtilities);
    },
    // Custom plugin for RTL support
    function({ addUtilities }) {
      const rtlUtilities = {
        '.rtl\\:text-right': {
          '[dir="rtl"] &': {
            textAlign: 'right',
          },
        },
        '.rtl\\:text-left': {
          '[dir="rtl"] &': {
            textAlign: 'left',
          },
        },
        '.rtl\\:ml-auto': {
          '[dir="rtl"] &': {
            marginLeft: 'auto',
          },
        },
        '.rtl\\:mr-auto': {
          '[dir="rtl"] &': {
            marginRight: 'auto',
          },
        },
        '.rtl\\:flex-row-reverse': {
          '[dir="rtl"] &': {
            flexDirection: 'row-reverse',
          },
        },
      };
      
      addUtilities(rtlUtilities);
    },
  ],
};