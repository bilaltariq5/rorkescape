import { StyleSheet } from 'react-native';
import Colors from './colors';

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 40,
  },
  letterSpacings: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
    widest: 1.6,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 64,
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: spacing.lg,
    marginVertical: spacing.md,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  cardAlt: {
    backgroundColor: Colors.cardAlt,
    borderRadius: 20,
    padding: spacing.lg,
    marginVertical: spacing.md,
  },
  title: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: "700",
    color: Colors.text,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: spacing.md,
  },
  text: {
    fontSize: typography.fontSizes.md,
    color: Colors.text,
    lineHeight: typography.lineHeights.md,
  },
  textSecondary: {
    fontSize: typography.fontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: typography.lineHeights.sm,
  },
  textSmall: {
    fontSize: typography.fontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: typography.lineHeights.xs,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: typography.fontSizes.md,
    fontWeight: "600",
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutlineText: {
    color: Colors.primary,
    fontSize: typography.fontSizes.md,
    fontWeight: "600",
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDanger: {
    backgroundColor: Colors.danger,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: typography.fontSizes.md,
    color: Colors.text,
  },
  inputLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: spacing.xs,
  },
  shadow: {
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  shadowLarge: {
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    backgroundColor: Colors.highlight,
  },
  badgeText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: "500",
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: spacing.lg,
  },
});