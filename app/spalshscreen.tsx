import { Images } from '@/constants/images';
import { Colors, Fonts, PrimaryColor } from '@/constants/theme';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, useColorScheme, View } from 'react-native';

export default function SplashScreen({ onAnimationFinish }: { onAnimationFinish: () => void }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationFinish();
    }, 3000); // Show splash screen for 2.5 seconds

    return () => clearTimeout(timer);
  }, [onAnimationFinish]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        <Image 
          source={Images.logo} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.footer}>
        <View style={styles.loadingBar}>
          <View style={[styles.progress, { backgroundColor: PrimaryColor }]} />
        </View>
        <Text style={[styles.tagline, { color: colors.icon }]}>Your Sports, Your People</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: Fonts.sans,
    marginTop: 16,
  },
  footer: {
    marginBottom: 60,
    alignItems: 'center',
    width: '100%',
  },
  loadingBar: {
    width: '60%',
    height: 4,
    backgroundColor: Colors.background,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progress: {
    height: '100%',
    width: '30%',
    borderRadius: 2,
  },
  tagline: {
    fontSize: 14,
    fontFamily: Fonts.sans,
  },
});