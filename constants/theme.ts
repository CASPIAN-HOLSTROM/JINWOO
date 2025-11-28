export const COLORS = {
  background: {
    primary: '#0a0e1a',
    secondary: '#111827',
    card: '#1a1f2e',
    elevated: '#1f2937',
  },
  system: {
    blue: '#3b82f6',
    cyan: '#06b6d4',
    purple: '#8b5cf6',
    accent: '#60a5fa',
    glow: '#38bdf8',
  },
  rank: {
    E: '#6b7280',
    D: '#84cc16',
    C: '#3b82f6',
    B: '#a855f7',
    A: '#f59e0b',
    S: '#ef4444',
    SS: '#ec4899',
    SSS: '#fbbf24',
  },
  text: {
    primary: '#f9fafb',
    secondary: '#9ca3af',
    accent: '#60a5fa',
    dim: '#6b7280',
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  shadow: 'rgba(59, 130, 246, 0.3)',
};

export const SHADOWS = {
  glow: {
    shadowColor: COLORS.system.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
};

export const FONTS = {
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};
