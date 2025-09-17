import { Illustrations } from '@/constants/illustrations';
import { Colors, Fonts, PrimaryColor, SecondaryColor } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

// Onboarding data
const onboardingData = [
  {
    key: '1',
    title: 'Welcome to Fit Buddy',
    description: 'Find your perfect sports partner and never play alone again',
    image: Illustrations.wave,
    color: PrimaryColor,
  },
  {
    key: '2',
    title: 'Tired of Playing Alone?',
    description: 'Finding people with similar sports interests can be challenging',
    image: Illustrations.bored,
    color: '#555',
  },
  {
    key: '3',
    title: 'Find Sports Partners Nearby',
    description: 'Connect with people who share your passion and schedule',
    image: Illustrations.solution,
    color: PrimaryColor,
  },
  {
    key: '4',
    title: 'Enjoy New Sports Friendships',
    description: 'Build lasting connections while staying active and healthy',
    image: Illustrations.enjoy,
    color: SecondaryColor,
  },
];

export default function OnBoarding({ onComplete }: { onComplete: () => void }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = onboardingData[currentIndex];
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const animateTransition = (newIndex: number) => {
    // Smooth fade out current content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex(newIndex);
      
      // Smooth progress bar animation
      Animated.timing(progressAnim, {
        toValue: newIndex / (onboardingData.length - 1),
        duration: 600,
        useNativeDriver: false,
      }).start();
      
      // Smooth fade in new content with spring animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const goNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      animateTransition(currentIndex + 1);
    } else {
      // Navigate to login page and complete onboarding
      router.replace('/login');
      onComplete();
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      animateTransition(currentIndex - 1);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffset / width);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < onboardingData.length) {
      animateTransition(newIndex);
    }
  };

  const skipOnboarding = () => {
    router.replace('/login');
    onComplete();
  };

  return (
    <View 
      style={[
        styles.container,
        {
          backgroundColor: colorScheme === 'dark' 
            ? '#1a1a2e' 
            : '#f8f9ff'
        }
      ]}
    >
      {/* Floating decorative elements */}
      <View style={styles.decorativeElements}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      {/* Skip button */}
      {currentIndex < onboardingData.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
          <Text style={[styles.skipText, { color: colors.icon }]}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Enhanced Progress Bar - MOVED TO BOTTOM */}

      {/* Swipeable Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="center"
      >
        {onboardingData.map((slide, index) => (
          <View key={slide.key} style={[styles.slide, { width }]}>
            {/* Illustration with enhanced smooth animation */}
            <Animated.View 
              style={[
                styles.imageContainer,
                {
                  opacity: index === currentIndex 
                    ? fadeAnim 
                    : fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.2, 0.4],
                      }),
                  transform: [
                    { 
                      scale: index === currentIndex 
                        ? scaleAnim 
                        : scaleAnim.interpolate({
                            inputRange: [0.85, 1],
                            outputRange: [0.7, 0.85],
                          })
                    },
                    {
                      rotateY: index === currentIndex 
                        ? scaleAnim.interpolate({
                            inputRange: [0.85, 1],
                            outputRange: ['20deg', '0deg'],
                          })
                        : '20deg'
                    },
                    {
                      translateY: index === currentIndex 
                        ? scaleAnim.interpolate({
                            inputRange: [0.85, 1],
                            outputRange: [30, 0],
                          })
                        : 30
                    }
                  ],
                }
              ]}
            >
              <View style={[styles.imageBackground, { backgroundColor: slide.color + '10' }]}>
                <Image 
                  source={slide.image} 
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            </Animated.View>

            {/* Content with smooth animation */}
            <Animated.View 
              style={[
                styles.content,
                {
                  opacity: index === currentIndex 
                    ? fadeAnim 
                    : fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 0.6],
                      }),
                  transform: [
                    {
                      translateY: index === currentIndex 
                        ? fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [40, 0],
                          })
                        : 40
                    },
                    {
                      scale: index === currentIndex 
                        ? fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.9, 1],
                          })
                        : 0.9
                    }
                  ],
                }
              ]}
            >
              <Text style={[styles.subtitle, { color: slide.color }]}>
                Step {index + 1}
              </Text>
              <Text style={[styles.title, { color: colors.text }]}>
                {slide.title}
              </Text>
              <Text style={[styles.description, { color: colors.text + 'CC' }]}>
                {slide.description}
              </Text>
            </Animated.View>
          </View>
        ))}
      </ScrollView>

      {/* Enhanced Progress Bar - NOW AT BOTTOM */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: colors.icon + '20' }]}>
          <Animated.View 
            style={[
              styles.progressFill,
              {
                backgroundColor: currentSlide.color,
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['8%', '100%'],
                }),
                shadowColor: currentSlide.color,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: colors.text }]}>
          {currentIndex + 1} of {onboardingData.length}
        </Text>
      </View>

      {/* Final Get Started Button (only on last slide) */}
      {currentIndex === onboardingData.length - 1 && (
        <View style={styles.finalButtonContainer}>
          <TouchableOpacity 
            style={[
              styles.getStartedButton, 
              { 
                backgroundColor: currentSlide.color,
                shadowColor: currentSlide.color,
              }
            ]}
            onPress={() => {
              router.replace('/login');
              onComplete();
            }}
            activeOpacity={0.8}
          >
            <View style={styles.buttonGradient}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Swipe indicator */}
      {currentIndex < onboardingData.length - 1 && (
        <View style={styles.swipeIndicator}>
          <Text style={[styles.swipeText, { color: colors.icon }]}>Swipe to continue</Text>
          <Text style={styles.swipeArrow}>→</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },
  circle1: {
    width: 120,
    height: 120,
    backgroundColor: PrimaryColor,
    top: 100,
    right: 30,
  },
  circle2: {
    width: 80,
    height: 80,
    backgroundColor: SecondaryColor,
    top: 300,
    left: 20,
  },
  circle3: {
    width: 60,
    height: 60,
    backgroundColor: PrimaryColor,
    bottom: 200,
    right: 50,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: 15,
    marginTop: 50,
    marginRight: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 1,
  },
  skipText: {
    fontSize: 14,
    fontFamily: Fonts.sans,
    fontWeight: '500',
  },
  progressContainer: {
    paddingHorizontal: 30,
    marginBottom: 20,
    zIndex: 1,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: Fonts.sans,
    textAlign: 'center',
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  imageBackground: {
    borderRadius: 120,
    padding: 40,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.sans,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: Fonts.rounded,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 40,
  },
  description: {
    fontSize: 17,
    fontFamily: Fonts.sans,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  pagination: {
    // Removed - using only top progress bar
  },
  paginationDot: {
    // Removed - using only top progress bar
  },
  finalButtonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    zIndex: 1,
  },
  getStartedButton: {
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
  },
  getStartedText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Fonts.sans,
  },
  swipeIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
    zIndex: 1,
  },
  swipeText: {
    fontSize: 12,
    fontFamily: Fonts.sans,
    marginRight: 8,
  },
  swipeArrow: {
    fontSize: 16,
    color: PrimaryColor,
    fontWeight: 'bold',
  },
});