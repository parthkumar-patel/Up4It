import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ThemeProvider, useTheme } from '../../src/components/common/theme/ThemeProvider';

/**
 * Layout for authentication screens
 * Applies shared navigation options and theme
 */
export default function AuthLayout() {
  return (
    <ThemeProvider>
      <AuthLayoutContent />
    </ThemeProvider>
  );
}

function AuthLayoutContent() {
  const { theme, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0B0D12',
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontFamily: theme.typography.h4.fontFamily,
            fontSize: theme.typography.h4.fontSize,
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Welcome',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: 'Sign In',
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: 'Create Account',
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            title: 'Reset Password',
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="verify-email"
          options={{
            title: 'Verify Email',
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </>
  );
}