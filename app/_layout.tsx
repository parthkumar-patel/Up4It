import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Add declaration for Expo Router's global config
declare global {
  // eslint-disable-next-line no-var
  var __EXPO_ROUTER_SHOW_SYSTEM_NAVIGATION: boolean;
}

// Configure router to hide development headers
if (process.env.NODE_ENV === 'development') {
  // This will hide the Expo Router developer UI in development
  global.__EXPO_ROUTER_SHOW_SYSTEM_NAVIGATION = false;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    // Load Satoshi fonts
    'Satoshi-Black': require('../assets/fonts/Satoshi-Black.ttf'),
    'Satoshi-Bold': require('../assets/fonts/Satoshi-Bold.ttf'),
    'Satoshi-Medium': require('../assets/fonts/Satoshi-Medium.ttf'),
    'Satoshi-Regular': require('../assets/fonts/Satoshi-Regular.ttf'),
    'Satoshi-Light': require('../assets/fonts/Satoshi-Light.ttf'),
    // Keep Space Mono for compatibility
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#07080A' },
        animation: Platform.OS === 'android' ? 'fade_from_bottom' : undefined,
      }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="create-event" />
        <Stack.Screen name="event-details" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </NavigationThemeProvider>
  );
}
