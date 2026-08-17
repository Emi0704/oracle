export const DarkColors = {
  background: '#1a0a2e',
  backgroundDark: '#0f0620',
  midnightBlue: '#16213e',
  silver: '#b9c6e8',
  silverLight: '#e4eaf9',
  lavender: '#e6d5f3',
  bloodRed: '#8b0000',
  crimson: '#a0153e',
  plum: '#4a1942',
  deepPurple: '#2d1854',
  mysticTeal: '#1a4040',
  starWhite: '#f8f0ff',
  cardBorder: '#b9c6e880',
  textPrimary: '#f8f0ff',
  textSecondary: '#c4b0d6',
  textMuted: '#8a7099',
};

export const LightColors = {
  background: '#f4effa',
  backgroundDark: '#e6d9f3',
  midnightBlue: '#dce3f5',
  silver: '#5a4a8a',
  silverLight: '#8672c2',
  lavender: '#6f4f96',
  bloodRed: '#8b0000',
  crimson: '#a0153e',
  plum: '#ecdcf5',
  deepPurple: '#ffffff',
  mysticTeal: '#1f6e63',
  starWhite: '#2a1b42',
  cardBorder: '#5a4a8a50',
  textPrimary: '#2a1b42',
  textSecondary: '#5c4a78',
  textMuted: '#8f7ba8',
};

export type ThemeColors = typeof DarkColors;

export function getColors(mode: 'light' | 'dark'): ThemeColors {
  return mode === 'light' ? LightColors : DarkColors;
}

export const Fonts = {
  header: 'Cinzel-Bold',
  subheader: 'Cinzel',
  body: 'System',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  card: 20,
};
