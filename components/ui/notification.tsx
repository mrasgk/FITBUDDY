import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts, PrimaryColor } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  Vibration,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';
export type NotificationPosition = 'top' | 'bottom' | 'center';
export type NotificationTheme = 'default' | 'minimal' | 'bold';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
  position?: NotificationPosition;
  theme?: NotificationTheme;
  haptic?: boolean;
  swipeToDismiss?: boolean;
  actions?: Array<{
    text: string;
    onPress: () => void;
    style?: 'default' | 'destructive' | 'primary';
  }>;
  progress?: number; // For loading notifications
  autoHide?: boolean;
}

const getNotificationConfig = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return {
        icon: 'checkmark.circle.fill' as const,
        backgroundColor: '#10b981',
        lightBackgroundColor: '#d1fae5',
        darkBackgroundColor: '#064e3b',
      };
    case 'error':
      return {
        icon: 'exclamationmark.triangle.fill' as const,
        backgroundColor: '#ef4444',
        lightBackgroundColor: '#fee2e2',
        darkBackgroundColor: '#7f1d1d',
      };
    case 'warning':
      return {
        icon: 'exclamationmark.triangle.fill' as const,
        backgroundColor: '#f59e0b',
        lightBackgroundColor: '#fef3c7',
        darkBackgroundColor: '#78350f',
      };
    case 'loading':
      return {
        icon: 'clock.fill' as const,
        backgroundColor: '#6b7280',
        lightBackgroundColor: '#f3f4f6',
        darkBackgroundColor: '#374151',
      };
    case 'info':
    default:
      return {
        icon: 'info.circle.fill' as const,
        backgroundColor: PrimaryColor,
        lightBackgroundColor: '#e0e7ff',
        darkBackgroundColor: '#312e81',
      };
  }
};

export function CustomNotification({
  type,
  title,
  message,
  visible,
  onHide,
  duration = 4000,
  position = 'top',
  theme = 'default',
  haptic = true,
  swipeToDismiss = true,
  actions = [],
  progress,
  autoHide = true
}: NotificationProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const config = getNotificationConfig(type);
  
  const slideAnim = useRef(new Animated.Value(position === 'bottom' ? 100 : -100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Haptic feedback
      if (haptic && Platform.OS === 'ios') {
        if (type === 'success') {
          Vibration.vibrate([0, 100]);
        } else if (type === 'error') {
          Vibration.vibrate([0, 100, 50, 100]);
        } else {
          Vibration.vibrate(50);
        }
      }

      // Show animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide if no actions and autoHide is true
      if (actions.length === 0 && autoHide && type !== 'loading') {
        const timer = setTimeout(() => {
          hideNotification();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      hideNotification();
    }
  }, [visible]);

  // Update progress animation
  useEffect(() => {
    if (progress !== undefined) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [progress]);

  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) {
    return null;
  }

  const backgroundColor = colorScheme === 'dark' 
    ? config.darkBackgroundColor 
    : config.lightBackgroundColor;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
          opacity: fadeAnim,
        }
      ]}
    >
      <View style={[
        styles.notification,
        {
          backgroundColor,
          borderLeftColor: config.backgroundColor,
          shadowColor: colorScheme === 'dark' ? '#000' : config.backgroundColor,
        }
      ]}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: config.backgroundColor }]}>
          <IconSymbol
            name={config.icon}
            size={24}
            color="white"
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: colors.icon }]}>
            {message}
          </Text>

          {/* Actions */}
          {actions.length > 0 && (
            <View style={styles.actions}>
              {actions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: action.style === 'primary' 
                        ? config.backgroundColor 
                        : action.style === 'destructive'
                        ? '#ef4444'
                        : 'transparent',
                      borderColor: action.style === 'primary' 
                        ? config.backgroundColor 
                        : action.style === 'destructive'
                        ? '#ef4444'
                        : colors.border,
                    }
                  ]}
                  onPress={() => {
                    action.onPress();
                    if (action.style !== 'primary') {
                      hideNotification();
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.actionText,
                    {
                      color: action.style === 'primary' || action.style === 'destructive'
                        ? 'white'
                        : colors.text,
                      fontWeight: action.style === 'primary' ? '700' : '600',
                    }
                  ]}>
                    {action.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Close button for auto-hiding notifications */}
        {actions.length === 0 && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={hideNotification}
            activeOpacity={0.7}
          >
            <IconSymbol
              name="xmark"
              size={18}
              color={colors.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  notification: {
    borderRadius: 16,
    borderLeftWidth: 4,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Fonts.rounded,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 16,
    fontFamily: Fonts.sans,
    lineHeight: 22,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontFamily: Fonts.sans,
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});