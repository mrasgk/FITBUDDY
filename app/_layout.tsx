import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import 'react-native-reanimated';
import SplashScreen from './spalshscreen'; // Note: Fix the typo in your filename if possible

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  // Hide splash screen after it completes
  const handleSplashFinish = () => {
    setIsSplashVisible(false);
  };

  // Show splash screen first
  if (isSplashVisible) {
    return <SplashScreen onAnimationFinish={handleSplashFinish} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Add other screens here */}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}