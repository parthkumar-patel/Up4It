# Up4It Design System

## 1. Introduction

This design system defines the visual language and UI components for the Up4It app, incorporating modern design trends including glassmorphism, neumorphism, and bento grid layouts. It establishes consistency across the application while providing a visually distinctive and engaging user experience.

## 2. Design Philosophy

Up4It's design is built around four core principles:

- **Playful Discovery**: The UI facilitates spontaneous connections through intuitive, game-like interactions
- **Trustworthy Security**: Visual elements convey safety and privacy without feeling restrictive
- **Campus Community**: Design reflects university culture and student life
- **Effortless Interaction**: Smooth animations and micro-interactions create a polished, engaging experience

## 3. Color Palette

### 3.1 Primary Colors

| Name         | Hex     | RGB                | Purpose               |
| ------------ | ------- | ------------------ | --------------------- |
| Up4It Blue   | #4F46E5 | rgb(79, 70, 229)   | Primary brand color   |
| Up4It Purple | #9F7AEA | rgb(159, 122, 234) | Secondary brand color |
| Up4It Teal   | #38B2AC | rgb(56, 178, 172)  | Accent color          |

### 3.2 Neutral Colors

| Name        | Hex     | RGB                | Purpose                           |
| ----------- | ------- | ------------------ | --------------------------------- |
| White       | #FFFFFF | rgb(255, 255, 255) | Background (light mode)           |
| Off-White   | #F7FAFC | rgb(247, 250, 252) | Secondary background (light mode) |
| Light Gray  | #E2E8F0 | rgb(226, 232, 240) | Dividers, borders (light mode)    |
| Medium Gray | #718096 | rgb(113, 128, 150) | Secondary text (light mode)       |
| Dark Gray   | #2D3748 | rgb(45, 55, 72)    | Primary text (light mode)         |
| Charcoal    | #1A202C | rgb(26, 32, 44)    | Secondary background (dark mode)  |
| Black       | #171923 | rgb(23, 25, 35)    | Background (dark mode)            |

### 3.3 Semantic Colors

| Name    | Hex     | RGB                | Purpose                         |
| ------- | ------- | ------------------ | ------------------------------- |
| Success | #48BB78 | rgb(72, 187, 120)  | Positive actions, confirmations |
| Warning | #ECC94B | rgb(236, 201, 75)  | Cautions, alerts                |
| Error   | #F56565 | rgb(245, 101, 101) | Errors, destructive actions     |
| Info    | #4299E1 | rgb(66, 153, 225)  | Informational elements          |

### 3.4 Gradient Palettes

| Name            | Colors                                  | Usage                               |
| --------------- | --------------------------------------- | ----------------------------------- |
| Blue Gradient   | Linear gradient from #4F46E5 to #38B2AC | Primary CTAs, important UI elements |
| Purple Gradient | Linear gradient from #9F7AEA to #F687B3 | Secondary UI elements, highlights   |
| Dark Gradient   | Linear gradient from #1A202C to #2D3748 | Dark mode backgrounds               |

## 4. Typography

### 4.1 Font Families

- **Primary Font**: Inter (Sans-serif)
- **Secondary Font**: Montserrat (Headers and emphasis)
- **Monospace Font**: JetBrains Mono (Code snippets, verification codes)

### 4.2 Type Scale

| Name      | Size (rem)      | Weight | Line Height | Usage                         |
| --------- | --------------- | ------ | ----------- | ----------------------------- |
| Display   | 3rem (48px)     | 700    | 1.2         | Hero sections, splash screens |
| Heading 1 | 2.25rem (36px)  | 700    | 1.2         | Main section headers          |
| Heading 2 | 1.75rem (28px)  | 600    | 1.25        | Section headers               |
| Heading 3 | 1.5rem (24px)   | 600    | 1.3         | Subsection headers            |
| Heading 4 | 1.25rem (20px)  | 600    | 1.4         | Card headers                  |
| Body      | 1rem (16px)     | 400    | 1.5         | Primary body text             |
| Small     | 0.875rem (14px) | 400    | 1.5         | Secondary text, captions      |
| Tiny      | 0.75rem (12px)  | 400    | 1.5         | Legal text, footnotes         |

## 5. Design Elements

### 5.1 Glassmorphism

Glassmorphism creates a frosted glass effect with these characteristics:

- **Background Blur**: 10-20px blur radius
- **Transparency**: 70-90% opacity
- **Subtle Border**: 1px white/light border (top and left edges)
- **Light Shadow**: Subtle drop shadow for depth
- **Color Tinting**: Slight color overlay matching brand colors

Usage: Navigation bars, cards, modals, and overlays

```css
/* Example Glassmorphism Effect */
.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Dark Mode Variant */
.dark .glass-card {
  background: rgba(26, 32, 44, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

### 5.2 Neumorphism

Neumorphic elements have a soft, extruded appearance:

- **Base Color**: Same or very similar to background
- **Shadows**: Subtle inner and outer shadows creating raised effect
- **Rounded Corners**: Consistent border radius (10-15px)
- **Minimal Color**: Limited use of accent colors, focus on shape
- **Subtle Transitions**: Gentle state changes on interaction

Usage: Buttons, input fields, toggles, and select elements

```css
/* Example Neumorphic Button */
.neumorphic-button {
  background: #f0f0f3;
  border-radius: 12px;
  box-shadow: 5px 5px 10px rgba(174, 174, 192, 0.4), -5px -5px 10px rgba(255, 255, 255, 1);
  padding: 12px 24px;
  border: none;
  transition: all 0.3s ease;
}

.neumorphic-button:active {
  box-shadow: inset 5px 5px 10px rgba(174, 174, 192, 0.4), inset -5px -5px 10px
      rgba(255, 255, 255, 1);
}

/* Dark Mode Variant */
.dark .neumorphic-button {
  background: #1a202c;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5), -5px -5px 10px rgba(60, 60, 70, 0.3);
}
```

### 5.3 Bento Grid Layout

Bento grid creates a modular, visually interesting layout:

- **Asymmetric Grid**: Mixture of rectangle sizes and orientations
- **Consistent Gutters**: 16px spacing between grid items
- **Varying Heights**: Elements with varied heights based on content
- **Nested Grids**: Grid patterns can be nested within larger grids
- **Responsive Adaptation**: Grid collapses gracefully on smaller screens

Usage: Dashboard, activity discovery, profile galleries

```css
/* Example Bento Grid Layout */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(100px, auto);
  gap: 16px;
}

.grid-item-large {
  grid-column: span 2;
  grid-row: span 2;
}

.grid-item-wide {
  grid-column: span 2;
}

.grid-item-tall {
  grid-row: span 2;
}

/* Mobile Adaptation */
@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## 6. Component Library

### 6.1 Navigation

#### Tab Bar

- Glassmorphic background with subtle blur
- Active state: Soft glow effect
- Animation: Smooth sliding transitions

#### Header

- Fixed position with glassmorphism effect
- Integrated with status bar on mobile
- Subtle shadow on scroll

### 6.2 Cards

#### Profile Card

- Glassmorphic container with image prominence
- Neumorphic inner elements for information sections
- Smooth animations on interaction

#### Activity Card

- Bento-style layouts within cards
- Time-remaining indicator with animation
- Prominent location and category visuals

### 6.3 Forms

#### Text Inputs

- Neumorphic styling with inset effect when focused
- Animated label movement on focus
- Integrated validation indicators

#### Buttons

- Primary: Gradient background with glassmorphic overlay
- Secondary: Neumorphic styling with subtle shadows
- States: Hover, active, disabled with animation

#### Toggles & Selectors

- Neumorphic styling with satisfying movement
- Clear color indicators for selected state
- Haptic feedback on mobile

### 6.4 Messaging

#### Message Bubbles

- Asymmetric bubble design with different colors for sender/receiver
- Glassmorphic effect for enhanced readability
- Time indicators and read status with subtle styling

#### Input Area

- Expandable text area with attachments
- Expression selector with grid layout
- Send button with animation feedback

### 6.5 Modals & Overlays

#### Action Sheets

- Glassmorphic background
- Neumorphic action buttons
- Animated entry/exit

#### Dialogs

- Critical information presented with appropriate semantic colors
- Clear action buttons with proper emphasis
- Backdrop blur effect

### 6.6 Lists

#### User Lists

- Clear hierarchy with bento grid for featured users
- Smooth scrolling with optimized rendering
- Pull-to-refresh with custom animation

#### Activity Timeline

- Chronological display with visual grouping
- Status indicators with semantic colors
- Progressive loading with placeholders

## 7. Animation & Micro-interactions

### 7.1 Motion Principles

- **Purposeful**: All animations serve functional purposes
- **Fluid**: Smooth, natural-feeling movements
- **Brief**: Quick enough not to impede usage (150-300ms)
- **Consistent**: Similar elements animate in similar ways

### 7.2 Transition Styles

- Page transitions: Subtle fade + slide (150ms)
- Modal transitions: Scale + fade (200ms)
- Element transitions: Fade + transform (150ms)
- List transitions: Staggered fade (50ms delay between items)

### 7.3 Feedback Animations

- Button press: Scale down to 95% + subtle color shift
- Swipe actions: Follow finger with elastic limits
- Success: Gentle bounce or checkmark animation
- Error: Subtle shake animation

### 7.4 Timing Functions

- Standard: cubic-bezier(0.4, 0.0, 0.2, 1)
- Enter: cubic-bezier(0.0, 0.0, 0.2, 1)
- Exit: cubic-bezier(0.4, 0.0, 1, 1)
- Emphasis: cubic-bezier(0.4, 0.0, 0.6, 1)

## 8. Iconography

### 8.1 Style Guidelines

- Line weight: 1.5-2px consistent stroke
- Corner radius: 2px minimum
- Grid: Based on 24x24px with 1px padding
- Style: Rounded ends, consistent visual weight

### 8.2 Icon Categories

- Navigation icons: Simplified, recognition-focused
- Action icons: Clear visual metaphors
- Status icons: Leverage semantic colors
- Category icons: Distinctive silhouettes

## 9. Imagery

### 9.1 Photography

- User photos: Square aspect ratio with rounded corners
- Activity photos: 16:9 aspect ratio for locations
- Background images: Subtle patterns or blurred landscapes

### 9.2 Illustrations

- Style: Clean, simple line illustrations
- Color usage: Limited palette matching brand colors
- Character design: Abstract, inclusive human representations
- Usage: Empty states, onboarding, achievements

## 10. Accessibility

### 10.1 Color Contrast

- Text meets WCAG AA standards minimum
- Interactive elements have clear focus states
- Critical information never conveyed by color alone

### 10.2 Touch Targets

- Minimum touch target size: 44x44px
- Adequate spacing between interactive elements
- Clear hit states with appropriate feedback

### 10.3 Text Legibility

- Minimum text size: 14px for critical information
- Adequate line height and letter spacing
- Text remains legible on colored backgrounds

## 11. Implementation

### 11.1 Component Structure

Each component will be implemented as a React Native component with:

- PropTypes or TypeScript for type safety
- Theme awareness (light/dark mode support)
- Responsive layout considerations
- Accessibility props

### 11.2 Theme Provider

A ThemeProvider context will supply:

- Current theme (light/dark)
- Color palette
- Typography settings
- Animation constants

### 11.3 Style System

Styles will be implemented using:

- StyleSheet for static styles
- Animated API for dynamic styles/animations
- Theme-aware hooks for consuming design tokens

### 11.4 Example Implementation

```jsx
// Example component using the design system
import React from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { BlurView } from "expo-blur";

export const GlassCard = ({ title, children, onPress }) => {
  const { colors, borderRadius, spacing } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const animateScale = (targetValue) => {
    Animated.spring(scale, {
      toValue: targetValue,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPressIn={() => animateScale(0.98)}
      onPressOut={() => animateScale(1)}
      onPress={onPress}
    >
      <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
        <BlurView
          intensity={80}
          tint={colors.isDark ? "dark" : "light"}
          style={[styles.blurView, { borderRadius: borderRadius.card }]}
        >
          {title && (
            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                  marginBottom: spacing.md,
                },
              ]}
            >
              {title}
            </Text>
          )}
          {children}
        </BlurView>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    margin: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  blurView: {
    padding: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
});
```

## 12. Usage Guidelines

### 12.1 Page Templates

- Authentication screens: Focus on trust and simplicity
- Profile screens: Showcase visual content, bento layout for info
- Discovery screens: Card-based layouts with swipe interactions
- Activity screens: Time prominence, location mapping
- Chat screens: Clean, focus on conversation flow

### 12.2 Dark Mode Adaptation

- Reduce brightness and saturation of colors
- Maintain adequate contrast ratios
- Adjust blur and transparency for legibility
- Reduce shadow intensity

### 12.3 Responsive Design

- Mobile-first approach
- Breakpoints:
  - Small: 0-375px (smaller phones)
  - Medium: 376-768px (tablets/larger phones)
  - Large: 769px+ (web/tablet landscape)
- Maintain touch target sizes across devices

## 13. Resources

- Design tokens are available as JSON exports
- Component documentation in Storybook
- Design files in Figma

---

This design system will be continuously refined as the application evolves. All team members should refer to this documentation when implementing UI components to ensure consistency and quality throughout the Up4It application.
