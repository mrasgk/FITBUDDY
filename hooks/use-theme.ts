import { settingsService } from '@/service';
import { useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export function useTheme() {
  const systemColorScheme = useSystemColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const settings = await settingsService.loadSettings();
      // Use the app's dark mode setting directly
      // The app should respect user's explicit choice over system preference
      setThemeMode(settings.darkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error loading theme preference:', error);
      // Fallback to system preference only if settings can't be loaded
      setThemeMode(systemColorScheme === 'dark' ? 'dark' : 'light');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTheme = async (darkMode: boolean) => {
    try {
      await settingsService.updateSetting('darkMode', darkMode);
      setThemeMode(darkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  return {
    themeMode,
    isDark: themeMode === 'dark',
    isLoading,
    updateTheme,
    refreshTheme: loadThemePreference,
  };
}