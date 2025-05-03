/**
 * Typography settings for the Up4It app
 * Based on the design system documentation
 */

import { Platform } from 'react-native';

// Font families
export const FONTS = {
  primary: Platform.select({
    ios: 'Satoshi-Regular',
    android: 'Satoshi-Regular',
    web: 'Satoshi-Regular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }),
  secondary: Platform.select({
    ios: 'Satoshi-Bold',
    android: 'Satoshi-Bold',
    web: 'Satoshi-Bold, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }),
  monospace: Platform.select({
    ios: 'JetBrains Mono',
    android: 'JetBrains Mono',
    web: '"JetBrains Mono", "Courier New", monospace',
  }),
};

// Specific Satoshi variants
export const SATOSHI = {
  black: 'Satoshi-Black',
  bold: 'Satoshi-Bold',
  medium: 'Satoshi-Medium',
  regular: 'Satoshi-Regular',
  light: 'Satoshi-Light',
};

// Font sizes
export const FONT_SIZES = {
  display: 48,  // 3rem
  h1: 36,       // 2.25rem
  h2: 28,       // 1.75rem
  h3: 24,       // 1.5rem
  h4: 20,       // 1.25rem
  body: 16,     // 1rem (base)
  small: 14,    // 0.875rem
  tiny: 12,     // 0.75rem
};

// Font weights - kept for backwards compatibility
// but with Satoshi we should prefer using the specific font variants
export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Line heights
export const LINE_HEIGHTS = {
  display: 1.2,
  h1: 1.2,
  h2: 1.25,
  h3: 1.3,
  h4: 1.4,
  body: 1.5,
  small: 1.5,
  tiny: 1.5,
};

// Ready-to-use text styles with all properties
export const TEXT_STYLES = {
  display: {
    fontFamily: SATOSHI.bold,
    fontSize: FONT_SIZES.display,
    lineHeight: FONT_SIZES.display * LINE_HEIGHTS.display,
  },
  h1: {
    fontFamily: SATOSHI.bold,
    fontSize: FONT_SIZES.h1,
    lineHeight: FONT_SIZES.h1 * LINE_HEIGHTS.h1,
  },
  h2: {
    fontFamily: SATOSHI.bold,
    fontSize: FONT_SIZES.h2,
    lineHeight: FONT_SIZES.h2 * LINE_HEIGHTS.h2,
  },
  h3: {
    fontFamily: SATOSHI.medium,
    fontSize: FONT_SIZES.h3,
    lineHeight: FONT_SIZES.h3 * LINE_HEIGHTS.h3,
  },
  h4: {
    fontFamily: SATOSHI.medium,
    fontSize: FONT_SIZES.h4,
    lineHeight: FONT_SIZES.h4 * LINE_HEIGHTS.h4,
  },
  body: {
    fontFamily: SATOSHI.regular,
    fontSize: FONT_SIZES.body,
    lineHeight: FONT_SIZES.body * LINE_HEIGHTS.body,
  },
  small: {
    fontFamily: SATOSHI.regular,
    fontSize: FONT_SIZES.small,
    lineHeight: FONT_SIZES.small * LINE_HEIGHTS.small,
  },
  tiny: {
    fontFamily: SATOSHI.regular,
    fontSize: FONT_SIZES.tiny,
    lineHeight: FONT_SIZES.tiny * LINE_HEIGHTS.tiny,
  },
  monospace: {
    fontFamily: FONTS.monospace,
    fontSize: FONT_SIZES.body,
    lineHeight: FONT_SIZES.body * LINE_HEIGHTS.body,
  },
  button: {
    fontFamily: SATOSHI.medium,
    fontSize: FONT_SIZES.body,
    lineHeight: FONT_SIZES.body * LINE_HEIGHTS.body,
  },
}; 