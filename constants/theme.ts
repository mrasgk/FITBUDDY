import { Platform } from 'react-native';

export const PrimaryColor = '#6366f1'; // Modern indigo
export const SecondaryColor = '#f59e0b'; // Vibrant amber
export const AccentColor = '#ec4899'; // Pink accent
export const tintColorLight = '#1f2937'; // Dark gray
export const tintColorDark = '#f9fafb'; // Light gray

export const Colors = {
  light: {
    text: '#1f2937',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#6b7280',
    tabIconDefault: '#9ca3af',
    tabIconSelected: tintColorLight,
    surface: '#f8fafc',
    border: '#e5e7eb',
    primary: PrimaryColor,
    secondary: SecondaryColor,
    accent: AccentColor,
  },
  dark: {
    text: '#f9fafb',
    background: '#111827',
    tint: tintColorDark,
    icon: '#9ca3af',
    tabIconDefault: '#6b7280',
    tabIconSelected: tintColorDark,
    surface: '#1f2937',
    border: '#374151',
    primary: PrimaryColor,
    secondary: SecondaryColor,
    accent: AccentColor,
  },
}; 

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});