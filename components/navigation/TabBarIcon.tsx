import { Ionicons } from '@expo/vector-icons'; // Use Ionicons
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import React, { type ComponentProps } from 'react';

// Define the props for the TabBarIcon component
interface TabBarIconProps extends IconProps<ComponentProps<typeof Ionicons>['name']> { // Use Ionicons name type
  // You can add any additional custom props here if needed
}

export function TabBarIcon({ style, name, color, ...rest }: TabBarIconProps) {
  return <Ionicons size={28} style={[{ marginBottom: -3 }, style]} name={name} color={color} {...rest} />;
} 