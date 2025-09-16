// Theme Configuration and Design System
// Comprehensive theming system with color palette, typography, and design tokens

export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  success: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  warning: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  error: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  info: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}

export interface ThemeConfig {
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  typography: {
    fontFamily: {
      sans: string[];
      serif: string[];
      mono: string[];
    };
    fontSize: Record<string, [string, { lineHeight: string; letterSpacing?: string }]>;
    fontWeight: Record<string, string>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  boxShadow: Record<string, string>;
  animation: Record<string, string>;
  breakpoints: Record<string, string>;
}

// VitaPulse Color Palette - Medical/Health Focused
export const vitaPulseTheme: ThemeConfig = {
  colors: {
    light: {
      // Primary - Medical Blue (Trust, Professionalism)
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6', // Main primary
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554'
      },
      // Secondary - Health Green (Wellness, Growth)
      secondary: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e', // Main secondary
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16'
      },
      // Accent - Warm Orange (Energy, Vitality)
      accent: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316', // Main accent
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
        950: '#431407'
      },
      // Neutral - Clean Grays
      neutral: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0a0a0a'
      },
      // Success - Medical Green
      success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d'
      },
      // Warning - Medical Amber
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f'
      },
      // Error - Medical Red
      error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d'
      },
      // Info - Medical Cyan
      info: {
        50: '#ecfeff',
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
        400: '#22d3ee',
        500: '#06b6d4',
        600: '#0891b2',
        700: '#0e7490',
        800: '#155e75',
        900: '#164e63'
      }
    },
    dark: {
      // Primary - Darker Medical Blue
      primary: {
        50: '#172554',
        100: '#1e3a8a',
        200: '#1e40af',
        300: '#1d4ed8',
        400: '#2563eb',
        500: '#3b82f6', // Main primary
        600: '#60a5fa',
        700: '#93c5fd',
        800: '#bfdbfe',
        900: '#dbeafe',
        950: '#eff6ff'
      },
      // Secondary - Darker Health Green
      secondary: {
        50: '#052e16',
        100: '#14532d',
        200: '#166534',
        300: '#15803d',
        400: '#16a34a',
        500: '#22c55e', // Main secondary
        600: '#4ade80',
        700: '#86efac',
        800: '#bbf7d0',
        900: '#dcfce7',
        950: '#f0fdf4'
      },
      // Accent - Darker Warm Orange
      accent: {
        50: '#431407',
        100: '#7c2d12',
        200: '#9a3412',
        300: '#c2410c',
        400: '#ea580c',
        500: '#f97316', // Main accent
        600: '#fb923c',
        700: '#fdba74',
        800: '#fed7aa',
        900: '#ffedd5',
        950: '#fff7ed'
      },
      // Neutral - Dark Mode Grays
      neutral: {
        50: '#0a0a0a',
        100: '#171717',
        200: '#262626',
        300: '#404040',
        400: '#525252',
        500: '#737373',
        600: '#a3a3a3',
        700: '#d4d4d4',
        800: '#e5e5e5',
        900: '#f5f5f5',
        950: '#fafafa'
      },
      // Success - Dark Mode Green
      success: {
        50: '#14532d',
        100: '#166534',
        200: '#15803d',
        300: '#16a34a',
        400: '#22c55e',
        500: '#4ade80',
        600: '#86efac',
        700: '#bbf7d0',
        800: '#dcfce7',
        900: '#f0fdf4'
      },
      // Warning - Dark Mode Amber
      warning: {
        50: '#78350f',
        100: '#92400e',
        200: '#b45309',
        300: '#d97706',
        400: '#f59e0b',
        500: '#fbbf24',
        600: '#fcd34d',
        700: '#fde68a',
        800: '#fef3c7',
        900: '#fffbeb'
      },
      // Error - Dark Mode Red
      error: {
        50: '#7f1d1d',
        100: '#991b1b',
        200: '#b91c1c',
        300: '#dc2626',
        400: '#ef4444',
        500: '#f87171',
        600: '#fca5a5',
        700: '#fecaca',
        800: '#fee2e2',
        900: '#fef2f2'
      },
      // Info - Dark Mode Cyan
      info: {
        50: '#164e63',
        100: '#155e75',
        200: '#0e7490',
        300: '#0891b2',
        400: '#06b6d4',
        500: '#22d3ee',
        600: '#67e8f9',
        700: '#a5f3fc',
        800: '#cffafe',
        900: '#ecfeff'
      }
    }
  },
  typography: {
    fontFamily: {
      sans: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'sans-serif'
      ],
      serif: [
        'Georgia',
        'Cambria',
        'Times New Roman',
        'Times',
        'serif'
      ],
      mono: [
        'JetBrains Mono',
        'Fira Code',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace'
      ]
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }]
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    }
  },
  spacing: {
    px: '1px',
    0: '0px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem'
  },
  borderRadius: {
    none: '0px',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000'
  },
  animation: {
    none: 'none',
    spin: 'spin 1s linear infinite',
    ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
    fadeIn: 'fadeIn 0.5s ease-in-out',
    fadeOut: 'fadeOut 0.5s ease-in-out',
    slideIn: 'slideIn 0.3s ease-out',
    slideOut: 'slideOut 0.3s ease-in',
    scaleIn: 'scaleIn 0.2s ease-out',
    scaleOut: 'scaleOut 0.2s ease-in'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

// Theme Context Types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colors: ThemeColors;
  isDark: boolean;
}

// Utility functions for theme management
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getThemeColors(mode: ThemeMode): ThemeColors {
  const actualMode = mode === 'system' ? getSystemTheme() : mode;
  return vitaPulseTheme.colors[actualMode];
}

// CSS Custom Properties Generator
export function generateCSSVariables(colors: ThemeColors): Record<string, string> {
  const variables: Record<string, string> = {};
  
  Object.entries(colors).forEach(([colorName, colorShades]) => {
    if (typeof colorShades === 'object') {
      Object.entries(colorShades).forEach(([shade, value]) => {
        variables[`--color-${colorName}-${shade}`] = value;
      });
    }
  });
  
  return variables;
}

// Tailwind CSS Configuration Helper
export function getTailwindThemeConfig() {
  return {
    colors: {
      primary: {
        50: 'rgb(var(--color-primary-50) / <alpha-value>)',
        100: 'rgb(var(--color-primary-100) / <alpha-value>)',
        200: 'rgb(var(--color-primary-200) / <alpha-value>)',
        300: 'rgb(var(--color-primary-300) / <alpha-value>)',
        400: 'rgb(var(--color-primary-400) / <alpha-value>)',
        500: 'rgb(var(--color-primary-500) / <alpha-value>)',
        600: 'rgb(var(--color-primary-600) / <alpha-value>)',
        700: 'rgb(var(--color-primary-700) / <alpha-value>)',
        800: 'rgb(var(--color-primary-800) / <alpha-value>)',
        900: 'rgb(var(--color-primary-900) / <alpha-value>)',
        950: 'rgb(var(--color-primary-950) / <alpha-value>)',
        DEFAULT: 'rgb(var(--color-primary-500) / <alpha-value>)'
      },
      secondary: {
        50: 'rgb(var(--color-secondary-50) / <alpha-value>)',
        100: 'rgb(var(--color-secondary-100) / <alpha-value>)',
        200: 'rgb(var(--color-secondary-200) / <alpha-value>)',
        300: 'rgb(var(--color-secondary-300) / <alpha-value>)',
        400: 'rgb(var(--color-secondary-400) / <alpha-value>)',
        500: 'rgb(var(--color-secondary-500) / <alpha-value>)',
        600: 'rgb(var(--color-secondary-600) / <alpha-value>)',
        700: 'rgb(var(--color-secondary-700) / <alpha-value>)',
        800: 'rgb(var(--color-secondary-800) / <alpha-value>)',
        900: 'rgb(var(--color-secondary-900) / <alpha-value>)',
        950: 'rgb(var(--color-secondary-950) / <alpha-value>)',
        DEFAULT: 'rgb(var(--color-secondary-500) / <alpha-value>)'
      },
      accent: {
        50: 'rgb(var(--color-accent-50) / <alpha-value>)',
        100: 'rgb(var(--color-accent-100) / <alpha-value>)',
        200: 'rgb(var(--color-accent-200) / <alpha-value>)',
        300: 'rgb(var(--color-accent-300) / <alpha-value>)',
        400: 'rgb(var(--color-accent-400) / <alpha-value>)',
        500: 'rgb(var(--color-accent-500) / <alpha-value>)',
        600: 'rgb(var(--color-accent-600) / <alpha-value>)',
        700: 'rgb(var(--color-accent-700) / <alpha-value>)',
        800: 'rgb(var(--color-accent-800) / <alpha-value>)',
        900: 'rgb(var(--color-accent-900) / <alpha-value>)',
        950: 'rgb(var(--color-accent-950) / <alpha-value>)',
        DEFAULT: 'rgb(var(--color-accent-500) / <alpha-value>)'
      }
    },
    fontFamily: vitaPulseTheme.typography.fontFamily,
    fontSize: vitaPulseTheme.typography.fontSize,
    fontWeight: vitaPulseTheme.typography.fontWeight,
    spacing: vitaPulseTheme.spacing,
    borderRadius: vitaPulseTheme.borderRadius,
    boxShadow: vitaPulseTheme.boxShadow,
    animation: vitaPulseTheme.animation,
    screens: vitaPulseTheme.breakpoints
  };
}

// Component-specific theme utilities
export const componentThemes = {
  button: {
    primary: {
      light: {
        bg: 'bg-primary-500 hover:bg-primary-600',
        text: 'text-white',
        border: 'border-primary-500 hover:border-primary-600'
      },
      dark: {
        bg: 'bg-primary-600 hover:bg-primary-700',
        text: 'text-white',
        border: 'border-primary-600 hover:border-primary-700'
      }
    },
    secondary: {
      light: {
        bg: 'bg-secondary-500 hover:bg-secondary-600',
        text: 'text-white',
        border: 'border-secondary-500 hover:border-secondary-600'
      },
      dark: {
        bg: 'bg-secondary-600 hover:bg-secondary-700',
        text: 'text-white',
        border: 'border-secondary-600 hover:border-secondary-700'
      }
    },
    outline: {
      light: {
        bg: 'bg-transparent hover:bg-primary-50',
        text: 'text-primary-600 hover:text-primary-700',
        border: 'border-primary-300 hover:border-primary-400'
      },
      dark: {
        bg: 'bg-transparent hover:bg-primary-950',
        text: 'text-primary-400 hover:text-primary-300',
        border: 'border-primary-700 hover:border-primary-600'
      }
    }
  },
  card: {
    light: {
      bg: 'bg-white',
      border: 'border-neutral-200',
      shadow: 'shadow-sm hover:shadow-md',
      text: 'text-neutral-900'
    },
    dark: {
      bg: 'bg-neutral-900',
      border: 'border-neutral-800',
      shadow: 'shadow-sm hover:shadow-md',
      text: 'text-neutral-100'
    }
  },
  input: {
    light: {
      bg: 'bg-white',
      border: 'border-neutral-300 focus:border-primary-500',
      text: 'text-neutral-900',
      placeholder: 'placeholder-neutral-500'
    },
    dark: {
      bg: 'bg-neutral-900',
      border: 'border-neutral-700 focus:border-primary-400',
      text: 'text-neutral-100',
      placeholder: 'placeholder-neutral-400'
    }
  }
};

// Health-specific color mappings
export const healthColors = {
  vitals: {
    normal: 'text-secondary-600',
    warning: 'text-warning-600',
    critical: 'text-error-600'
  },
  bmi: {
    underweight: 'text-info-600',
    normal: 'text-secondary-600',
    overweight: 'text-warning-600',
    obese: 'text-error-600'
  },
  bloodPressure: {
    low: 'text-info-600',
    normal: 'text-secondary-600',
    elevated: 'text-warning-500',
    high: 'text-error-600'
  },
  heartRate: {
    low: 'text-info-600',
    normal: 'text-secondary-600',
    high: 'text-warning-600',
    dangerous: 'text-error-600'
  }
};

// Accessibility helpers
export function getContrastColor(backgroundColor: string): 'light' | 'dark' {
  // Simple contrast calculation - in production, use a proper contrast ratio calculator
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? 'dark' : 'light';
}

// Animation presets for health-related components
export const healthAnimations = {
  heartbeat: 'animate-pulse',
  loading: 'animate-spin',
  success: 'animate-bounce',
  slideIn: 'animate-slideIn',
  fadeIn: 'animate-fadeIn',
  scaleIn: 'animate-scaleIn'
};

// Export default theme
export default vitaPulseTheme;