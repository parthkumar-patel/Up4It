import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { ReactNode } from 'react';

interface CustomTextProps extends TextProps {
  children: ReactNode;
}

export function Text({ style, ...props }: CustomTextProps) {
  return (
    <RNText
      style={[styles.text, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
});