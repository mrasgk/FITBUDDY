import { useTheme } from '@/hooks/use-theme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import OnBoarding from './onboarding';
import SplashScreen from './spalshscreen';

// Remove this setting to allow proper navigation
// export const unstable_settings = {
//   anchor: '(tabs)',
// };

// Persistent storage key for onboarding completion
const ONBOARDING_COMPLETED_KEY = 'hasCompletedOnboarding';

export default function RootLayout() {
  const { themeMode, isLoading: themeLoading } = useTheme();
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has completed onboarding before
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        // Check if onboarding was completed using SecureStore
        const hasCompleted = await SecureStore.getItemAsync(ONBOARDING_COMPLETED_KEY);
        
        if (!hasCompleted || hasCompleted !== 'true') {
          setShowOnboarding(true);
        }
        // If onboarding is completed, we'll show the login page instead of going to tabs
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // On error, assume first time and show onboarding
        setShowOnboarding(true);
        setIsLoading(false);
      }
    };

    // Only check onboarding status after splash screen is done
    if (!isSplashVisible) {
      checkOnboardingStatus();
    }
  }, [isSplashVisible]);

  // Hide splash screen after it completes
  const handleSplashFinish = () => {
    setIsSplashVisible(false);
  };

  // Handle onboarding completion and save to storage
  const handleOnboardingComplete = async () => {
    try {
      // Mark onboarding as completed in SecureStore
      await SecureStore.setItemAsync(ONBOARDING_COMPLETED_KEY, 'true');
      setShowOnboarding(false);
      // The onboarding component will handle navigation to login
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
      // Even if saving fails, still proceed
      setShowOnboarding(false);
    }
  };

  // Don't render anything until theme is loaded
  if (themeLoading) {
    return null;
  }

  // Show splash screen first
  if (isSplashVisible) {
    return <SplashScreen onAnimationFinish={handleSplashFinish} />;
  }

  // Show loading state while checking onboarding status
  if (isLoading) {
    return null; // Or a simple loading indicator
  }

  // Show onboarding if user hasn't completed it
  if (showOnboarding) {
    return <OnBoarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <ThemeProvider value={themeMode === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="login">
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="spalshscreen" options={{ headerShown: false }} />
        <Stack.Screen name="email-confirmation" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} />
        {/* Profile-related pages */}
        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
        <Stack.Screen name="sport-preferences" options={{ headerShown: false }} />
        <Stack.Screen name="activity-history" options={{ headerShown: false }} />
        <Stack.Screen name="friends-connections" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        {/* New Settings Pages */}
        <Stack.Screen name="account-info" options={{ headerShown: false }} />
        <Stack.Screen name="privacy-security" options={{ headerShown: false }} />
        <Stack.Screen name="notification-preferences" options={{ headerShown: false }} />
        <Stack.Screen name="help-support" options={{ headerShown: false }} />
        <Stack.Screen name="user-profile" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}