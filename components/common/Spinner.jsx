import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

/**
 * Spinner component
 * A simple wrapper around React Native's ActivityIndicator
 * with consistent styling
 */
const Spinner = ({ size = "small", color = "#007AFF", style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Spinner;
