import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Text, TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Text
      style={[
        { color: colors.text, fontFamily: Fonts.sans },
        type === 'default' ? { fontSize: 16, lineHeight: 24 } : undefined,
        type === 'title' ? { fontSize: 32, fontWeight: 'bold', lineHeight: 32 } : undefined,
        type === 'defaultSemiBold' ? { fontSize: 16, lineHeight: 24, fontWeight: '600' } : undefined,
        type === 'subtitle' ? { fontSize: 20, fontWeight: 'bold' } : undefined,
        type === 'link' ? { fontSize: 16, lineHeight: 30, color: colors.tint } : undefined,
        style,
      ]}
      {...rest}
    />
  );
}