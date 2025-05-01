/**
 * Main theme module for Up4It
 * Exports all theme constants and utilities
 */

// Import theme elements
import * as Animations from './animations';
import * as Colors from './colors';
import * as Spacing from './spacing';
import * as Typography from './typography';

// Color themes
export const LIGHT_THEME = Colors.LIGHT_THEME;
export const DARK_THEME = Colors.DARK_THEME;

// Export individual theme elements
export const colors = Colors;
export const typography = Typography;
export const spacing = Spacing;
export const animations = Animations;

// Define theme structure
export interface ThemeMode {
  colors: typeof LIGHT_THEME;
  typography: typeof Typography.TEXT_STYLES;
  fonts: typeof Typography.FONTS;
  fontSizes: typeof Typography.FONT_SIZES;
  fontWeights: typeof Typography.FONT_WEIGHTS;
  lineHeights: typeof Typography.LINE_HEIGHTS;
  spacing: typeof Spacing.SPACING;
  borderRadius: typeof Spacing.BORDER_RADIUS;
  shadows: typeof Spacing.SHADOWS;
  blur: typeof Spacing.BLUR;
  grid: typeof Spacing.GRID;
  breakpoints: typeof Spacing.BREAKPOINTS;
  animations: typeof Animations.ANIMATION_PRESETS;
  duration: typeof Animations.DURATION;
  easing: typeof Animations.EASING;
  isDark: boolean;
}

export interface Theme {
  light: ThemeMode;
  dark: ThemeMode;
}

// Export an integrated theme object
const theme: Theme = {
  light: {
    colors: LIGHT_THEME,
    typography: Typography.TEXT_STYLES,
    fonts: Typography.FONTS,
    fontSizes: Typography.FONT_SIZES,
    fontWeights: Typography.FONT_WEIGHTS,
    lineHeights: Typography.LINE_HEIGHTS,
    spacing: Spacing.SPACING,
    borderRadius: Spacing.BORDER_RADIUS,
    shadows: Spacing.SHADOWS,
    blur: Spacing.BLUR,
    grid: Spacing.GRID,
    breakpoints: Spacing.BREAKPOINTS,
    animations: Animations.ANIMATION_PRESETS,
    duration: Animations.DURATION,
    easing: Animations.EASING,
    isDark: false,
  },
  dark: {
    colors: DARK_THEME,
    typography: Typography.TEXT_STYLES,
    fonts: Typography.FONTS,
    fontSizes: Typography.FONT_SIZES,
    fontWeights: Typography.FONT_WEIGHTS,
    lineHeights: Typography.LINE_HEIGHTS,
    spacing: Spacing.SPACING,
    borderRadius: Spacing.BORDER_RADIUS,
    shadows: Spacing.SHADOWS,
    blur: Spacing.BLUR,
    grid: Spacing.GRID,
    breakpoints: Spacing.BREAKPOINTS,
    animations: Animations.ANIMATION_PRESETS,
    duration: Animations.DURATION,
    easing: Animations.EASING,
    isDark: true,
  }
};

export default theme; 