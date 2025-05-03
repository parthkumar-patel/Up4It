import React, { useState } from "react";
import { Animated, Pressable, StyleSheet, Text, TextInput } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

/**
 * Neumorphic TextField component
 * Provides an elegant input field with animation and validation
 */
const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
  error,
  style,
  inputStyle,
  labelStyle,
  maxLength,
  onBlur,
  onFocus,
  disabled = false,
  showHideBelow = false,
  showHideStyle,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(!secureTextEntry);

  // Animation values
  const animatedScale = useState(new Animated.Value(1))[0];
  const animatedLabelPosition = useState(new Animated.Value(value ? 1 : 0))[0];

  // Animate label position
  const animateLabel = (toValue) => {
    Animated.timing(animatedLabelPosition, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  // Animate press effect
  const animatePress = (toValue) => {
    Animated.spring(animatedScale, {
      toValue,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Handle focus
  const handleFocus = (event) => {
    setIsFocused(true);
    animateLabel(1);
    animatePress(0.98);
    onFocus && onFocus(event);
  };

  // Handle blur
  const handleBlur = (event) => {
    setIsFocused(false);
    if (!value) {
      animateLabel(0);
    }
    animatePress(1);
    onBlur && onBlur(event);
  };

  // Toggle password visibility
  const toggleSecureEntry = () => {
    setIsSecureVisible(!isSecureVisible);
  };

  // Calculate label position and size
  const labelTranslateY = animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -24],
  });

  const labelFontSize = animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  // Create styles based on theme and state
  const containerStyle = {
    backgroundColor: theme.colors.neumorphicBackground,
    borderColor: isFocused
      ? theme.colors.primary
      : error
      ? theme.colors.error
      : "transparent",
    shadowColor: theme.colors.neumorphicShadowDark,
    opacity: disabled ? 0.7 : 1,
  };

  const textColor = {
    color: disabled
      ? theme.colors.secondaryText
      : error
      ? theme.colors.error
      : theme.colors.text,
  };

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        { transform: [{ scale: animatedScale }] },
        style,
      ]}
    >
      <Animated.Text
        style={[
          styles.label,
          {
            color: error
              ? theme.colors.error
              : isFocused
              ? theme.colors.primary
              : theme.colors.secondaryText,
            transform: [{ translateY: labelTranslateY }],
            fontSize: labelFontSize,
          },
          labelStyle,
        ]}
      >
        {label}
      </Animated.Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={isFocused ? placeholder : ""}
        placeholderTextColor={theme.colors.secondaryText}
        secureTextEntry={secureTextEntry && !isSecureVisible}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[styles.input, textColor, inputStyle]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        maxLength={maxLength}
        editable={!disabled}
        {...props}
      />

      {secureTextEntry && !showHideBelow && (
        <Pressable
          onPress={toggleSecureEntry}
          style={styles.secureToggle}
          hitSlop={{ top: 10, right: 10, bottom: 5, left: 10 }}
        >
          <Text style={{ color: theme.colors.secondaryText }}>
            {isSecureVisible ? "Hide" : "Show"}
          </Text>
        </Pressable>
      )}

      {secureTextEntry && showHideBelow && (
        <Pressable
          onPress={toggleSecureEntry}
          style={[{ alignSelf: "center", marginTop: 8 }, showHideStyle]}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Text style={{ color: theme.colors.secondaryText }}>
            {isSecureVisible ? "Hide" : "Show"}
          </Text>
        </Pressable>
      )}

      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
    position: "relative",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  label: {
    position: "absolute",
    left: 16,
    top: 18,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    height: 24,
    padding: 0,
    margin: 0,
    fontSize: 16,
  },
  secureToggle: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -10,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default TextField;
