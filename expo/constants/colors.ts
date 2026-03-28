// Theme-aware color system for Esc app
const baseColors = {
  // Primary palette
  primary: {
    50: '#EBF5FF',
    100: '#D6EBFF',
    200: '#ADD6FF',
    300: '#85C0FF',
    400: '#5CA9FF',
    500: '#3392FF',
    600: '#0A7AFF',
    700: '#0062DB',
    800: '#004FB3',
    900: '#003C8A',
  },
  
  // Secondary palette (teal/green)
  secondary: {
    50: '#E6F7F4',
    100: '#CCEEE9',
    200: '#99DDD3',
    300: '#66CCBD',
    400: '#33BBA7',
    500: '#00AA91',
    600: '#008875',
    700: '#006659',
    800: '#00443C',
    900: '#00221E',
  },
  
  // Accent palette (purple)
  accent: {
    50: '#F2EAFF',
    100: '#E5D6FF',
    200: '#CCADFF',
    300: '#B285FF',
    400: '#995CFF',
    500: '#7F33FF',
    600: '#660AFF',
    700: '#5200DB',
    800: '#4200B3',
    900: '#33008A',
  },
  
  // Semantic colors
  success: {
    50: '#E6F9F1',
    100: '#CCF3E3',
    200: '#99E7C7',
    300: '#66DBAB',
    400: '#33CF8F',
    500: '#00C373',
    600: '#009C5C',
    700: '#007545',
    800: '#004E2E',
    900: '#002717',
  },
  
  warning: {
    50: '#FFF8E6',
    100: '#FFF1CC',
    200: '#FFE399',
    300: '#FFD566',
    400: '#FFC733',
    500: '#FFB900',
    600: '#CC9400',
    700: '#996F00',
    800: '#664A00',
    900: '#332500',
  },
  
  danger: {
    50: '#FEEAEF',
    100: '#FDD6DF',
    200: '#FBADBF',
    300: '#F9859F',
    400: '#F75C7F',
    500: '#F5335F',
    600: '#E00A3C',
    700: '#B30830',
    800: '#860620',
    900: '#590310',
  },
  
  // Grayscale
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#0A0F1A',
  },
};

// Light theme colors
const lightTheme = {
  // Brand colors
  primary: baseColors.primary[600],
  primaryLight: baseColors.primary[400],
  primaryDark: baseColors.primary[800],
  primaryBackground: baseColors.primary[50],
  
  secondary: baseColors.secondary[600],
  secondaryLight: baseColors.secondary[400],
  secondaryDark: baseColors.secondary[800],
  secondaryBackground: baseColors.secondary[50],
  
  accent: baseColors.accent[600],
  accentLight: baseColors.accent[400],
  accentDark: baseColors.accent[800],
  accentBackground: baseColors.accent[50],
  
  // Status colors
  success: baseColors.success[600],
  successLight: baseColors.success[400],
  successBackground: baseColors.success[50],
  
  warning: baseColors.warning[600],
  warningLight: baseColors.warning[400],
  warningBackground: baseColors.warning[50],
  
  danger: baseColors.danger[600],
  dangerLight: baseColors.danger[400],
  dangerBackground: baseColors.danger[50],
  
  // Background and surface colors
  background: baseColors.gray[50],
  card: '#FFFFFF',
  cardAlt: baseColors.gray[50],
  highlight: baseColors.gray[100],
  
  // Text colors
  text: baseColors.gray[900],
  textSecondary: baseColors.gray[600],
  textTertiary: baseColors.gray[400],
  textInverse: '#FFFFFF',
  
  // Border and divider colors
  border: baseColors.gray[200],
  divider: baseColors.gray[100],
  
  // Interactive states
  disabled: baseColors.gray[300],
  hover: baseColors.primary[50],
  
  // Level colors (for progression system)
  level1: baseColors.warning[500],
  level2: baseColors.primary[500],
  level3: baseColors.success[500],
  level4: baseColors.accent[500],
  level5: baseColors.danger[500],
  level6: baseColors.danger[600],
  level7: baseColors.secondary[500],
  level8: baseColors.primary[700],
  level9: baseColors.warning[600],
  level10: baseColors.accent[700],
};

// Dark theme colors
const darkTheme = {
  // Brand colors
  primary: baseColors.primary[400],
  primaryLight: baseColors.primary[300],
  primaryDark: baseColors.primary[600],
  primaryBackground: baseColors.primary[900],
  
  secondary: baseColors.secondary[400],
  secondaryLight: baseColors.secondary[300],
  secondaryDark: baseColors.secondary[600],
  secondaryBackground: baseColors.secondary[900],
  
  accent: baseColors.accent[400],
  accentLight: baseColors.accent[300],
  accentDark: baseColors.accent[600],
  accentBackground: baseColors.accent[900],
  
  // Status colors
  success: baseColors.success[400],
  successLight: baseColors.success[300],
  successBackground: baseColors.success[900],
  
  warning: baseColors.warning[400],
  warningLight: baseColors.warning[300],
  warningBackground: baseColors.warning[900],
  
  danger: baseColors.danger[400],
  dangerLight: baseColors.danger[300],
  dangerBackground: baseColors.danger[900],
  
  // Background and surface colors
  background: baseColors.gray[950],
  card: baseColors.gray[900],
  cardAlt: baseColors.gray[800],
  highlight: baseColors.gray[800],
  
  // Text colors
  text: baseColors.gray[100],
  textSecondary: baseColors.gray[300],
  textTertiary: baseColors.gray[500],
  textInverse: baseColors.gray[900],
  
  // Border and divider colors
  border: baseColors.gray[700],
  divider: baseColors.gray[800],
  
  // Interactive states
  disabled: baseColors.gray[700],
  hover: baseColors.primary[900],
  
  // Level colors (for progression system)
  level1: baseColors.warning[400],
  level2: baseColors.primary[400],
  level3: baseColors.success[400],
  level4: baseColors.accent[400],
  level5: baseColors.danger[400],
  level6: baseColors.danger[500],
  level7: baseColors.secondary[400],
  level8: baseColors.primary[500],
  level9: baseColors.warning[500],
  level10: baseColors.accent[500],
};

export { lightTheme, darkTheme, baseColors };

// Default export is the active theme (will be determined by ThemeProvider)
export default {
  ...lightTheme,
};