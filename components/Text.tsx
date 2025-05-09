import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { ReactNode } from 'react';

interface CustomTextProps extends TextProps {
  children: ReactNode;
  type?: 'display' | 'heading' | 'body' | 'secondary' | 'caption';
  weight?: 'regular' | 'medium' | 'bold' | 'semibold';
}

const fontMap = {
  regular: 'Satoshi-Regular',
  medium: 'Satoshi-Medium',
  bold: 'Satoshi-Bold',
  semibold: 'Satoshi-Bold', // Satoshi does not have a separate semibold
};

const sizeMap = {
  display: 48,
  heading: 36,
  body: 18,
  secondary: 16,
  caption: 14,
};

export function Text({ style, type = 'body', weight = 'medium', ...props }: CustomTextProps) {
  return (
    <RNText
      style={[
        {
          fontFamily: fontMap[weight],
          fontSize: sizeMap[type],
          color: '#FFFFFF',
        },
        style,
      ]}
      {...props}
    />
  );
}